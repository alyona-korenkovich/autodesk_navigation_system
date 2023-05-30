import ObjectTree from './ObjectTree';

class Projection {
  surface: number[][];

  offsetX: number;

  offsetY: number;

  cnt: number;

  skippedDbIds: number[] = [];

  initialize = (levelBoundingBox: THREE.Box3) => {
    let minX = levelBoundingBox.min.x - 1;
    let minY = levelBoundingBox.min.y - 1;
    let maxX = levelBoundingBox.max.x + 1;
    let maxY = levelBoundingBox.max.y + 1;

    this.cnt = 0;

    this.offsetX = minX < 0 ? Math.abs(minX) : 0;
    this.offsetY = minY < 0 ? Math.abs(minY) : 0;

    [minX, maxX] = this.correctCoordinates([minX, maxX], this.offsetX);
    [minY, maxY] = this.correctCoordinates([minY, maxY], this.offsetY);

    let x = new Array(Math.ceil(maxX - minX + 1));
    for (let i = 0; i < x.length; i++) {
      x[i] = new Array(Math.ceil(maxY - minY + 1)).fill(1);
    }

    this.surface = x;
  };

  correctCoordinates = (coordinates: number[], offset: number, back?: boolean) => {
    return back
      ? coordinates.map((coordinate) => coordinate - offset)
      : coordinates.map((coordinate) => coordinate + offset);
  };

  projectObjects = (objectTree: ObjectTree, objIds: number[], type?: number) => {
    for (let objId of objIds) {
      const objBBox = objectTree.getBoundingBox(objId);
      this.#projectObject(objId, objBBox, type);
    }
  };

  // @ts-ignore
  #projectObject = (dbId: number, objBBox: THREE.Box3, type?: number = 0) => {
    let minX = objBBox.min.x;
    let minY = objBBox.min.y;
    let maxX = objBBox.max.x;
    let maxY = objBBox.max.y;

    [minX, maxX] = this.correctCoordinates([minX, maxX], this.offsetX);
    [minY, maxY] = this.correctCoordinates([minY, maxY], this.offsetY);

    minX = Math.floor(minX);
    minY = Math.floor(minY);
    maxX = Math.ceil(maxX);
    maxY = Math.ceil(maxY);

    if (type === 2 || type === 3) {
      const dx = maxX - minX;
      const width = Math.max(maxX - minX, maxY - minY);
      if (width === dx) {
        minX += 2;
        maxX -= 2;
        minY -= 1;
        maxY += 1;
      } else {
        minY += 2;
        maxY -= 2;
        minX -= 1;
        maxX += 1;
      }
    }

    if (minX < 0 || minY < 0) {
      this.skippedDbIds.push(dbId);
      return;
    } else {
      for (let X = minX; X <= maxX; X++) {
        for (let Y = minY; Y <= maxY; Y++) {
          try {
            switch (type) {
              case 0: {
                if (this.surface[X][Y] === type) {
                  this.surface[X][Y] = 6;
                } else {
                  if (this.surface[X][Y] !== 6) {
                    this.surface[X][Y] = 0;
                  }
                }

                break;
              }
              case 4: {
                if (this.surface[X][Y] === type) {
                  this.surface[X][Y] = 0;
                } else {
                  if (this.surface[X][Y] !== 0 && this.surface[X][Y] !== 6) {
                    this.surface[X][Y] = type;
                  }
                }
                break;
              }
              default: {
                if (this.surface[X][Y] === type) {
                  this.surface[X][Y] = 0;
                } else {
                  if (this.surface[X][Y] !== 6) {
                    this.surface[X][Y] = type;
                  }
                }
                break;
              }
            }
          } catch {
            this.skippedDbIds.push(dbId);
          }
        }
      }
    }
  };
}

export default Projection;
