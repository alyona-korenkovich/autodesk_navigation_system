//@ts-nocheck

import { baseSearchArgs, entranceDoorIds, filterArgs, topSearchArgs, uniqueWalls } from './filters';

import ObjectTree from './ObjectTree';
import Projection from './Projection';
import Room = Autodesk.DataVisualization.Core.Room;
import {
  detectNumberDisplayValue,
  filterProps,
  getBulkPropsPromise,
  searchPromise,
} from './helpers';
import PropertyResult = Autodesk.Viewing.PropertyResult;

type TNeighbors = {
  lower: string[];
  higher: string[];
};

class Floor {
  viewer: Autodesk.Viewing.Viewer3D;

  name: string;

  floorNumber: string;

  neighborNames: TNeighbors;

  boundingBox: THREE.Box3 = new THREE.Box3();

  rooms: Room[];

  projection: Projection;

  objectTree: ObjectTree;

  objectsIds: number[];

  doorsIds: number[];

  constructor(
    viewer: Autodesk.Viewing.Viewer3D,
    name: string,
    neighbors: TNeighbors,
    rooms: Room[],
    objectTree: Autodesk.Viewing.InstanceTree,
  ) {
    this.viewer = viewer;
    this.name = name;
    this.floorNumber = detectNumberDisplayValue(name);
    this.neighborNames = neighbors;
    this.rooms = rooms;
    this.objectTree = objectTree;
  }

  init = async () => {
    await this.#parseObjects(this.name, baseSearchArgs).then((res) => {
      this.objectsIds = res;
    });
    await this.#filterObjectsByCategory(this.objectsIds, filterArgs).then((res) => {
      this.objectsIds = res;
    });
    this.#calculateBBox();
  };

  #calculateBBox = () => {
    for (let room of this.rooms) {
      this.boundingBox.union(room.bounds);
    }
  };

  getProjection = async () => {
    this.projection = new Projection();
    this.projection.initialize(this.boundingBox);
    this.projection.projectObjects(this.objectTree, this.objectsIds);
    await this.#getDoorsOnLevel().then(() => {
      this.projection.projectObjects(this.objectTree, this.doorsIds, 2);
    });
    if (this.floorNumber === 2) {
      this.projection.projectObjects(this.objectTree, entranceDoorIds, 3);
    }

    return this.projection;
  };

  #parseObjects = async (floorName: string, searchParams: string[]) => {
    let floorObjects: number[] = [];

    const adjustElementsArray = (adjustment: number[]) => {
      floorObjects = floorObjects.concat(adjustment);
    };

    // Получаем список dbId объектов, которые тянутся снизу вверх и которые нужно спроецировать на текущий этаж тоже
    let neighboursIds;
    await this.#processNeighbors().then((res: Number[]) => (neighboursIds = res));
    adjustElementsArray(neighboursIds);

    // search for any level-related objects by searchParams
    for (let searchParam of searchParams) {
      await searchPromise(this.viewer, floorName, [searchParam]).then((res) => {
        adjustElementsArray(res);
      });
    }

    return floorObjects;
  };

  #processNeighbors = async () => {
    let dbIds = [];
    for (let baseConstraint of baseSearchArgs) {
      for (let neighbor of this.neighborNames.lower) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        await searchPromise(this.viewer, neighbor, [baseConstraint]).then(async (res) => {
          await getBulkPropsPromise(this.viewer, res, topSearchArgs).then(
            (res2: PropertyResult[]) => {
              let filteredDbIds = [];
              for (let neighborHigh of this.neighborNames.higher) {
                let tmp = filterProps(res2, neighborHigh);
                filteredDbIds = filteredDbIds.concat(tmp);

                tmp = filterProps(res2, 'Up to level: ' + neighborHigh);
                filteredDbIds = filteredDbIds.concat(tmp);
              }

              dbIds = dbIds.concat(filteredDbIds);
            },
          );
        });
      }
    }
    return dbIds;
  };

  #filterObjectsByCategory = async (objectIds: number[], filterParams: string[]) => {
    let filteredObjects: number[];

    // filter unwanted objects
    await searchPromise(this.viewer, 'Pendant Light', ['name']).then((res) => {
      const unwantedObjects = res.concat(uniqueWalls);
      filteredObjects = objectIds.filter((objId) => !unwantedObjects.includes(objId));
    });

    /**
     * Исключить некоторое подмножество dbId из исходного
     * @param intersectedArray - Подмножество исключаемых dbId
     */
    const performIntersection = (intersectedArray: number[]) => {
      filteredObjects = filteredObjects.filter(
        (objId) => !!!intersectedArray.find((dbId) => dbId == objId),
      );
    };

    for (let filterParam of filterParams) {
      await getBulkPropsPromise(this.viewer, filteredObjects, ['Category']).then((props) => {
        if (filterParam === 'Revit Doors') {
          this.doorsIds = filterProps(props, filterParam);
        }

        const filtered = filterProps(props, filterParam);
        filtered.forEach((f) => {
          if (this.objectTree.getNames([f]) !== undefined) {
            performIntersection([f]);
          }
        });
      });
    }

    return filteredObjects;
  };

  #getDoorsOnLevel = async () => {
    await getBulkPropsPromise(this.viewer, this.objectTree.getAllObjectIds(), ['Level']).then(
      async (props) => {
        const filtered = filterProps(props, this.floorNumber);
        await getBulkPropsPromise(this.viewer, filtered, ['Category']).then((props2) => {
          this.doorsIds = filterProps(props2, 'Revit Doors');
        });
      },
    );
  };
}

export default Floor;
