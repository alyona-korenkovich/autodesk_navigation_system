import { E_HTTP_METHODS, TTokenForge } from '../../../types';

import { getBulkPropsPromise, levelZ, searchPromise } from '../path-finder/helpers';
import Parser from '../path-finder/Parser';

import { Level, Mode, Point, TPath } from '../path-finder/types';
import {
  datalistSubscriber,
  pathfinderInitials,
  pathsSubscriber,
  selectionSubscriber,
  visualizePathIndex,
} from '../../../store/subscriberServices';
import { APIFetch } from '../../../api/utils/APIFetch/APIFetch';
import ObjectTree from '../path-finder/ObjectTree';
import Projection from '../path-finder/Projection';

const Autodesk = (window as any).Autodesk;
import PropertyResult = Autodesk.Viewing.PropertyResult;

type TViewable = {
  name: string;
  role: string;
  guid: string;
  isMasterView?: boolean;
};

type TViewerOptions = {
  document: string;
  env: string;
  api: string;
  getAccessToken: (onTokenReady: Function) => void;
  findPath: boolean;
};

class ViewerModel {
  viewer = {} as Autodesk.Viewing.GuiViewer3D;

  parser: Parser;

  masterView: TViewable | undefined;

  onSelectionBind: any;

  model: Autodesk.Viewing.Model;

  instanceTree: Autodesk.Viewing.InstanceTree;

  objectTree: ObjectTree;

  currSelection: number[];

  options: string[];

  viewerOptions: TViewerOptions;

  maps: Projection[] = [];

  launchViewer = (idDiv: string, urn: string, token: TTokenForge, findPath: boolean) => {
    this.viewerOptions = {
      document: urn,
      env: 'AutodeskProduction',
      api: 'derivativeV2',
      getAccessToken: function (onTokenReady: Function) {
        onTokenReady(token.access_token, token?.expires_in);
      },
      findPath: findPath,
    };

    const viewerElement = document.getElementById(idDiv);

    this.viewer = new Autodesk.Viewing.GuiViewer3D(viewerElement, {});

    Autodesk.Viewing.Initializer(this.viewerOptions, () => {
      this.viewer.initialize();
      this.viewer.start();
      this.viewer.loadExtension('Autodesk.DataVisualization');
      this.loadDocument(this.viewerOptions.document);
    });
  };

  loadDocument = (documentId: string) => {
    Autodesk.Viewing.Document.load(
      documentId,
      this.onDocumentLoadSuccess,
      this.onDocumentLoadFailure,
    );
  };

  onDocumentLoadSuccess = (doc: Autodesk.Viewing.Document) => {
    const defaultModel = this.selectView(doc);

    this.viewer.loadDocumentNode(doc, defaultModel).then(async () => {
      this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionEvent);
      const view = this.viewer;
      this.viewer.canvas.addEventListener('mousedown', function (event) {
        // Get the X and Y coordinates of the click relative to the client viewport
        const x = event.clientX;
        const y = event.clientY;

        // Use the viewer.clientToWorld() method to convert the X and Y coordinates of the click to a 3D point in the Forge Viewer world coordinate system
        const worldPoint = view.clientToWorld(x, y);
      });
      this.onSelectionBind = this.onSelectionEvent.bind(this);

      await this.viewer.waitForLoadDone().then(async () => {
        await this.onModelLoaded();
      });
      return true;
    });
  };

  onDocumentLoadFailure = (viewerErrorCode: string) => {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
  };

  onModelLoaded = async () => {
    this.model = this.viewer.getAllModels()[0];
    this.model.getObjectTree((res) => {
      this.instanceTree = res;
    });
    this.objectTree = new ObjectTree(this.instanceTree);

    this.parser = new Parser(this.viewer, this.model);
    await this.parser.parse();

    this.options = this.parser.getDatalistForController();
    datalistSubscriber.next(this.options);

    await this.parser.get2DMaps().then((res) => {
      this.maps = res;
    });

    if (this.viewerOptions.findPath) {
      this.findPath();
    }
  };

  onSelectionEvent = async () => {
    this.currSelection = this.viewer.getSelection();

    await getBulkPropsPromise(this.viewer, this.currSelection).then((res: PropertyResult[]) => {
      selectionSubscriber.next(res[0].name);
    });
  };

  findPath = async () => {
    let start: string;
    let startId: number;
    const startPoint: Point = {
      x: 0,
      y: 0,
      z: 0,
      levelNumber: 0,
    };

    let end: string;
    let endId: number;
    const endPoint: Point = {
      x: 0,
      y: 0,
      z: 0,
      levelNumber: 0,
    };

    let mode: Mode;

    let startBBox: THREE.Box3;
    let endBBox: THREE.Box3;

    pathfinderInitials.subscribe((v) => {
      mode = v.mode;
      start = v.start;
      if (v.end) {
        end = v.end;
      }
    });

    await this.detectIdByName(start).then((dbId) => (startId = dbId));
    if (end) {
      await this.detectIdByName(end).then((dbId) => (endId = dbId));
    }

    await this.detectLevelById(startId).then((level) => {
      if (level) {
        startPoint.levelNumber = level;
        startPoint.z = levelZ[level];
      } else {
        alert('no level exception');
      }
    });

    if (end) {
      await this.detectIdByName(end).then((dbId) => (endId = dbId));
      await this.detectLevelById(endId).then((level) => {
        if (level) {
          endPoint.levelNumber = level;
          endPoint.z = levelZ[level];
        } else {
          alert('no level exception');
        }
      });
    }

    /* ------ Имеем айди нодов и номера этажей ------- */

    startBBox = this.objectTree.getBoundingBox(startId);
    if (end) {
      endBBox = this.objectTree.getBoundingBox(endId);
    }

    /* ------ Имеем Bounding Boxes нодов ------- */

    // Подготовим мув Projection -> Level
    const levels: Array<Level> = [];
    for (let map of this.maps) {
      levels.push(map.surface);
    }

    if (!this.checkPoint(startBBox, this.maps[startPoint.levelNumber - 2])) {
      alert('start point is not inside the building, choose another point');
    } else {
      [startPoint.x, startPoint.y] = this.processPoints(
        startId,
        this.maps[startPoint.levelNumber - 2],
        startBBox,
      );

      /**
       * Если это режим ЧС, то энд-поинты выбираются из массива дверей-выходов
       * Все пути сохраняются
       * Если не на одном этаже, то появляются комбинации с лестницами, оставляются те пути, длина которых меньше или равна средней длине путей (чтобы исключить походы змейками)
       */
      if (mode === 'emergency') {
        const res = await APIFetch(
          `/api/pathfinder/${mode}`,
          E_HTTP_METHODS.POST,
          {},
          {
            body: {
              startId,
              projectInfo: {
                floors: levels,
                from: startPoint,
              },
            },
          },
        );

        let index = 0;
        visualizePathIndex.subscribe((v) => {
          index = v;
          if (res[0]) {
            this.visualize(res[index]);
            pathsSubscriber.next(res);
          } else {
            this.visualize(res);
            pathsSubscriber.next([res]);
          }
        });
      } else {
        if (!this.checkPoint(endBBox, this.maps[endPoint.levelNumber - 2])) {
          alert('end point is not inside the building, choose another point');
        } else {
          [endPoint.x, endPoint.y] = this.processPoints(
            endId,
            this.maps[endPoint.levelNumber - 2],
            endBBox,
          );

          const res = await APIFetch(
            `/api/pathfinder/${mode}`,
            E_HTTP_METHODS.POST,
            {},
            {
              body: {
                startId,
                endId,
                projectInfo: {
                  floors: levels,
                  from: startPoint,
                  to: endPoint,
                },
              },
            },
          );
          if (res[0]) {
            this.visualize(res[0]);
          } else {
            this.visualize(res);
          }
        }
      }
    }
  };

  detectIdByName = async (name: string) => {
    let dbId;
    await searchPromise(this.viewer, name, ['name']).then(async (r: number[]) => {
      dbId = r[0];
    });
    return dbId;
  };

  detectLevelById = async (dbId: number) => {
    let level;
    await getBulkPropsPromise(this.viewer, [dbId], ['Level']).then(
      (res: PropertyResult[]) => (level = res[0].properties[0].displayValue),
    );
    return level;
  };

  searchForMasterView(viewables: TViewable[]) {
    this.masterView = viewables.find((viewable: TViewable) => {
      return viewable.isMasterView === true;
    });
  }

  selectView(doc: Autodesk.Viewing.Document) {
    let viewable;
    const viewables = doc.getRoot().search({ type: 'geometry' });

    if (this.masterView) {
      viewable = viewables.find((view) => view.data.name === this.masterView.name);
      if (!viewable) {
        viewable = viewables[0];
      }
    } else {
      viewable = viewables[0];
    }
    return viewable;
  }

  getCorrectedCoordinates = (box: THREE.Box3, projection: Projection) => {
    let minX = box.min.x;
    let minY = box.min.y;
    let maxY = box.max.y;
    let maxX = box.max.x;

    [minX, maxX] = projection.correctCoordinates([minX, maxX], projection.offsetX);
    [minY, maxY] = projection.correctCoordinates([minY, maxY], projection.offsetY);

    return [minX, maxX, minY, maxY];
  };

  checkPoint = (box: THREE.Box3, projection: Projection) => {
    let minX, maxX, minY, maxY;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [minX, maxX, minY, maxY] = this.getCorrectedCoordinates(box, projection);

    return !(minX < 0 || minY < 0);
  };

  processPoints = (dbId: number, projection: Projection, box: THREE.Box3) => {
    let minX, maxX, minY, maxY;
    [minX, maxX, minY, maxY] = this.getCorrectedCoordinates(box, projection);

    let [centerX, centerY] = [
      Math.floor(minX + (maxX - minX) / 2),
      Math.floor(minY + (maxY - minY) / 2),
    ];
    const centerCandidates = [
      [centerX - 1, centerY + 1],
      [centerX, centerY + 1],
      [centerX + 1, centerY + 1],
      [centerX - 1, centerY],
      [centerX + 1, centerY],
      [centerX - 1, centerY - 1],
      [centerX, centerY - 1],
      [centerX + 1, centerY + 1],
    ];
    let centerIsNotIntersection = projection.surface[centerX][centerY] !== 6;

    while (!centerIsNotIntersection) {
      [centerX, centerY] = centerCandidates.pop();
      centerIsNotIntersection = projection.surface[centerX][centerY] !== 6;
    }

    projection.projectObjects(this.objectTree, [dbId], 1);
    projection.surface[centerX][centerY] = 1;

    return [centerX, centerY];
  };

  getCoordinatesBack = (x: number, y: number, projection: Projection) => {
    let modX, modY;
    modX = projection.correctCoordinates([y], projection.offsetX, true);
    modY = projection.correctCoordinates([x], projection.offsetY, true);
    return [modX, modY];
  };

  createTriangle = (A: THREE.Vector3, B: THREE.Vector3) => {
    const Z = A.z;
    let v1, v2, v3;
    let middle = new THREE.Vector3((A.x + B.x) / 2, (A.y + B.y) / 2, Z);

    let N = 1;

    let dx = B.x - middle.x;
    let dy = B.y - middle.y;
    let distance = this.calculateDistance(middle, B);
    let ratio = N / distance;
    const v1X = middle.x + ratio * dx;
    const v1Y = middle.y + ratio * dy;
    v1 = new THREE.Vector3(v1X, v1Y, Z);

    dx = A.x - middle.x;
    dy = A.y - middle.y;
    distance = this.calculateDistance(middle, A);
    ratio = N / distance;
    const v23X = middle.x + ratio * dx;
    const v23Y = middle.y + ratio * dy;

    const k = (B.y - A.y) / (B.x - A.x);
    const x1P = 1000;
    const y1P = -(1 / k) * (x1P - v23X) + v23Y;
    const x2P = -1000;
    const y2P = -(1 / k) * (x2P - v23X) + v23Y;

    N = 0.5;
    dx = x1P - v23X;
    dy = y1P - v23Y;
    distance = Math.sqrt(dx ** 2 + dy ** 2);
    ratio = N / distance;
    const v2X = middle.x + ratio * dx;
    const v2Y = middle.y + ratio * dy;
    v2 = new THREE.Vector3(v2X, v2Y, Z);

    dx = x2P - v23X;
    dy = y2P - v23Y;
    distance = Math.sqrt(dx ** 2 + dy ** 2);
    ratio = N / distance;
    const v3X = middle.x + ratio * dx;
    const v3Y = middle.y + ratio * dy;
    v3 = new THREE.Vector3(v3X, v3Y, Z);

    // Создаем материал и геометрию для треугольника
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const geometry = new THREE.Geometry();

    // Добавляем вершины в геометрию
    geometry.vertices.push(v1, v2, v3);

    // Добавляем грань в геометрию
    geometry.faces.push(new THREE.Face3(0, 1, 2));

    return new THREE.Mesh(geometry, material);
  };

  createOverlay = (path: THREE.Line, triangles: THREE.Mesh[]) => {
    const overlayName = 'myOverlayScene';
    if (!this.viewer.overlays.hasScene(overlayName)) {
      this.viewer.overlays.addScene(overlayName);
    } else {
      this.viewer.overlays.clearScene(overlayName);
    }

    this.viewer.overlays.addMesh(path as THREE.Mesh, overlayName);
    for (const triangle of triangles) {
      this.viewer.overlays.addMesh(triangle, overlayName);
    }
    this.viewer.impl.invalidate(true);
  };

  calculateDistance = (A: THREE.Vector3, B: THREE.Vector3) => {
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  };

  visualize = (res: TPath) => {
    const triangles: THREE.Mesh[] = [];
    const geometry = new THREE.Geometry();
    const material = new THREE.LineBasicMaterial({
      color: 0xff0000,
    });

    for (let c = 1; c < res.path.length; c++) {
      let [xA, yA, zA] = [res.path[c - 1][0], res.path[c - 1][1], res.path[c - 1][2]];
      let [xB, yB, zB] = [res.path[c][0], res.path[c][1], res.path[c][2]];
      let [modXA, modYA] = this.getCoordinatesBack(xA, yA, this.maps[0]);
      let [modXB, modYB] = this.getCoordinatesBack(xB, yB, this.maps[0]);

      const pointA = new THREE.Vector3(modXA[0], modYA[0], zA);
      const pointB = new THREE.Vector3(modXB[0], modYB[0], zB);
      geometry.vertices.push(pointA, pointB);

      if (this.calculateDistance(pointA, pointB) > 4) {
        triangles.push(this.createTriangle(pointA, pointB));
      }
    }

    const lines = new THREE.Line(geometry, material);
    this.createOverlay(lines, triangles);
  };
}

export default ViewerModel;
