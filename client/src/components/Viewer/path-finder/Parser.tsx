// @ts-nocheck

import Floor from './Floor';
import ObjectTree from './ObjectTree';
import Projection from './Projection';
import { entranceDoorIds } from './filters';

import { filterProps, getBulkPropsPromise, searchPromise } from './helpers';

class Parser {
  viewer: Autodesk.Viewing.Viewer3D;

  model: Autodesk.Viewing.Model;

  info: Autodesk.DataVisualization.Core.ModelStructureInfo;

  objectTree: ObjectTree;

  objects: number[];

  map: Autodesk.DataVisualization.Core.LevelRoomsMap;

  stairIds: number[];

  supportsIds: number[];

  entranceIds: number[];

  doorsIds: number[];

  floors: Floor[] = [];

  constructor(viewer: Autodesk.Viewing.Viewer3D, model: Autodesk.Viewing.Model) {
    this.viewer = viewer;
    this.model = model;
  }

  parse = async () => {
    this.#getModelInfo();
    this.#getObjectTree();
    this.#getAllObjects();
    this.#getEntrances();
    await this.#getStairs();
    await this.#processStairs();
    await this.#getDoors();
  };

  #getModelInfo = () => {
    this.info = new Autodesk.DataVisualization.Core.ModelStructureInfo(this.model);
  };

  #getObjectTree = () => this.model.getObjectTree((res) => (this.objectTree = new ObjectTree(res)));

  #getLevelRoomsMap = async () => {
    await this.info.getLevelRoomsMap(true).then((res) => {
      this.map = res;
    });
  };

  get2DMaps = async () => {
    await this.#getLevelRoomsMap();

    let levels2DMaps: Projection[] = [];
    const levelCount = Object.keys(this.map).length;

    if (levelCount !== 0) {
      for (let level = 0; level < levelCount; level++) {
        const floorName = Object.keys(this.map)[level];
        const lowerNeighbours: string[] = Array.from(Object.keys(this.map)).slice(0, level);
        let higherNeighbours: string[] = Array.from(Object.keys(this.map)).slice(
          level + 1,
          levelCount + 1,
        );

        higherNeighbours = higherNeighbours.concat(['Roof']);

        const floor = new Floor(
          this.viewer,
          floorName,
          { lower: lowerNeighbours, higher: higherNeighbours },
          this.#getLevelRooms(floorName),
          this.objectTree,
        );

        await floor.init();
        await floor.getProjection().then((r) => {
          r.projectObjects(this.objectTree, this.stairIds, 4);
          const xStart = Math.floor(-133 + r.offsetX);
          const xEnd = Math.floor(-128 + r.offsetX);
          let yLeft;
          let yRight;
          if (level == 0) {
            yLeft = Math.floor(-42.11 + r.offsetY);
            yRight = Math.floor(25.1602 + r.offsetY);
          } else {
            yLeft = Math.floor(-11.678 + r.offsetY);
            yRight = Math.floor(-5.456 + r.offsetY);
          }

          r.surface[xStart - 1][yLeft] = 0;
          r.surface[xEnd + 1][yLeft] = 0;
          r.surface[xStart - 1][yRight] = 0;
          r.surface[xEnd + 1][yRight] = 0;

          console.log(level, yLeft, yRight);

          for (let X = xStart; X < xEnd; X++) {
            for (let Y = yLeft; Y <= yRight; Y++) {
              if (Y === yLeft || Y === yRight) {
                r.surface[X][Y] = 4;
              } else {
                r.surface[X][Y] = 1;
              }
            }
          }
          r.projectObjects(this.objectTree, this.supportsIds, 0);
          levels2DMaps.push(r);
          this.floors.push(floor);
        });
      }
    }

    return levels2DMaps;
  };

  getDatalistForController() {
    const objectIds = this.objectTree.getAllObjectIds();
    const objectNames = this.objectTree.getNames(objectIds);
    return objectNames;
  }

  #getLevelRooms = (levelName: string) => {
    return this.map.getRoomsOnLevel(levelName, false);
  };

  #getAllObjects = () => {
    this.objects = this.objectTree.getAllObjectIds();
  };

  #getStairs = async () => {
    await searchPromise(this.viewer, 'Assembled Stair', ['name']).then((res) => {
      const tmp = res.slice(1);
      tmp.splice(1, 2);
      this.stairIds = tmp;
    });

    return this.stairIds;
  };

  #getEntrances = () => {
    this.entranceIds = entranceDoorIds;
  };

  #getDoors = async () => {
    await getBulkPropsPromise(this.viewer, this.objects, ['Category']).then((props) => {
      this.doorsIds = filterProps(props, 'Revit Doors');
    });
  };

  #processStairs = async () => {
    await getBulkPropsPromise(this.viewer, this.objects, ['Category']).then((props) => {
      const tmp = filterProps(props, 'Revit Railings');
      const nonStairs = 3890;
      tmp.splice(tmp.indexOf(nonStairs), 1);
      this.supportsIds = tmp;
    });
  };
}

export default Parser;
