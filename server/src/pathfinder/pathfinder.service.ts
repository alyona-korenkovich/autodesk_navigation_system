import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Level, Path, Point } from 'Pathfinder/types/types';
import { ERROR_FIND_PATH } from 'Const/errorMessages';
import Graph from 'Pathfinder/core/Graph';
import PathFinder from 'Pathfinder/core/PathFinder';
import { EndTypes, TEndType } from 'Pathfinder/core/types';
import { levelZ } from 'Pathfinder/utils/levelZ';

@Injectable()
export class PathfinderService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  cleanFloors(floor: Level, coord: number[]) {
    try {
      if (floor.length === 0) {
        return floor;
      }

      const res = floor;
      const notSeenYet = []; // Для клеток, которые мы ещё не выбирали в качестве point
      let left, right, top, bottom, topLeft, topRight, bottomLeft, bottomRight;

      function setCoordinates(point: number[]) {
        left = [point[0], point[1] - 1];
        right = [point[0], point[1] + 1];
        top = [point[0] - 1, point[1]];
        bottom = [point[0] + 1, point[1]];

        topLeft = [point[0] - 1, point[1] - 1];
        topRight = [point[0] - 1, point[1] + 1];
        bottomLeft = [point[0] + 1, point[1] - 1];
        bottomRight = [point[0] + 1, point[1] + 1];
      }

      function pushCoordinates() {
        notSeenYet.push(
          left,
          right,
          top,
          bottom,
          topLeft,
          topRight,
          bottomLeft,
          bottomRight,
        );
      }

      res[coord[1]][coord[0]] = 0;
      setCoordinates([coord[1], coord[0]]);
      pushCoordinates();

      while (notSeenYet.length !== 0) {
        const curr = notSeenYet.pop();
        if (
          res[curr[0]] &&
          res[curr[0]][curr[1]] &&
          res[curr[0]][curr[1]] === 3
        ) {
          res[curr[0]][curr[1]] = 0;
          setCoordinates(curr);
          pushCoordinates();
        }
      }
      return res;
    } catch (e) {
      return floor;
    }
  }

  /**
   * Main function for finding a path in a set of 2d projections from A-point to B-point
   * @param forDisabled -- whether to choose elevators instead of stairs if possible
   * @param floors -- set of projections
   * @param from -- Point A (x, y, levelNumber)
   * @param to? -- Point B (x, y, levelNumber) [is absent if mode == 'emergency']
   */
  findPath(forDisabled: boolean, floors: Level[], from: Point, to?: Point) {
    try {
      if (to) {
        if (from.levelNumber === to.levelNumber) {
          const levelNumber = from.levelNumber;
          const level = floors[levelNumber - 2];
          return this.findOnLevel(level, from, to);
        } else {
          return this.findBetweenLevels(floors, from, to);
        }
      } else {
        const paths: Path[] = [];
        const levelNumber = from.levelNumber;
        let level = floors[levelNumber - 2];
        let finishFlag = false;
        while (paths.length === 0 || !finishFlag) {
          if (levelNumber === 2) {
            const res = this.findOnLevel(
              level,
              from,
              null,
              EndTypes[EndTypes.ENTRANCES] as TEndType,
            );
            console.log(res);
            if (res.length === 0) {
              finishFlag = true;
            } else {
              paths.push(res);
              console.log(paths);
              level = this.cleanFloors(
                floors[levelNumber - 2],
                res.path[res.path.length - 1],
              );
            }
          } else {
            const res = this.findBetweenLevels(floors, from);
            if (res.length === 0) {
              finishFlag = true;
            } else {
              paths.push(res);
              level = this.cleanFloors(
                floors[levelNumber - 2],
                res.path[res.path.length - 1],
              );
            }
          }
        }

        return paths;
      }
    } catch (e) {
      console.log(e);
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: ERROR_FIND_PATH },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findOnLevel(grid: Level, from: Point, to?: Point, toType?: TEndType): Path {
    let finder, path, polishedPath, polishedPathLength;
    const gridCopy = JSON.parse(JSON.stringify(grid));
    const graph = new Graph(gridCopy);
    const startPoint = graph.getNode(from.y, from.x);
    if (to) {
      const endPoint = graph.getNode(to.y, to.x);
      finder = new PathFinder(graph, startPoint, endPoint);
      path = finder.getPath();
      if (path && path[0].length !== 0) {
        polishedPath = finder.polishPath(path);
        this.addZ(polishedPath, from.z);
        if (polishedPath && polishedPath[0].length !== 0) {
          polishedPathLength = finder.getPathLength(polishedPath);
        } else {
          polishedPath = [[]];
          polishedPathLength = 0;
        }
      } else {
        polishedPath = [[]];
        polishedPathLength = 0;
      } /*
      polishedPath = finder.polishPath(path);
      polishedPathLength = finder.getPathLength(polishedPath);*/
    } else {
      finder = new PathFinder(graph, startPoint, null, toType);
      path = finder.getPath();
      if (path && path[0].length !== 0) {
        polishedPath = finder.polishPath(path);
        this.addZ(polishedPath, from.z);
        if (polishedPath && polishedPath[0].length !== 0) {
          polishedPathLength = finder.getPathLength(polishedPath);
        } else {
          polishedPath = [[]];
          polishedPathLength = 0;
        }
      } else {
        polishedPath = [[]];
        polishedPathLength = 0;
      }
    }

    return {
      path: polishedPath,
      length: polishedPathLength,
    };
  }

  findBetweenLevels(floors: Level[], from: Point, to?: Point): Path {
    const fromLevel = from.levelNumber;
    const fromLevelIdx = fromLevel - 2;
    const toLevel = to ? to.levelNumber : 2;
    const toLevelIdx = toLevel - 2;
    const needToSwap = toLevelIdx < fromLevelIdx;

    const path: Path = {
      path: [[from.y, from.x, from.z]],
      length: 0,
    };

    if (needToSwap) {
      for (let floor = fromLevelIdx; floor >= toLevelIdx; floor--) {
        let startPoint: Point;
        if (path.path[path.path.length - 2]) {
          startPoint = {
            x: path.path[path.path.length - 1][1],
            y: path.path[path.path.length - 1][0],
            z: levelZ[floor + 2],
            levelNumber: floor + 2,
          };

          const prevPoint = {
            x: path.path[path.path.length - 2][1],
            y: path.path[path.path.length - 2][0],
            z: levelZ[floor + 2],
            levelNumber: floor + 2,
          };

          const directionY = prevPoint.y < startPoint.y ? 1 : -1;

          if (directionY === 1) {
            for (
              let y = startPoint.y + 1;
              y < floors[floor][startPoint.x].length;
              y++
            ) {
              if (floors[floor][startPoint.x][y] === 1) {
                startPoint.y = y;
                break;
              }
            }
          } else {
            for (let y = startPoint.y - 1; y > 0; y--) {
              if (floors[floor][startPoint.x][y] === 1) {
                startPoint.y = y;
                break;
              }
            }
          }
        } else {
          startPoint = {
            x: path.path[path.path.length - 1][1],
            y: path.path[path.path.length - 1][0],
            z: levelZ[floor + 2],
            levelNumber: floor + 2,
          };
        }

        const needMoveDown = floor != toLevelIdx;
        let localPath: Path;

        if (needMoveDown) {
          localPath = this.findOnLevel(
            floors[floor],
            startPoint,
            null,
            EndTypes[EndTypes.STAIRS] as TEndType,
          );
        } else {
          if (to) {
            localPath = this.findOnLevel(floors[floor], startPoint, to);
          } else {
            localPath = this.findOnLevel(
              floors[floor],
              startPoint,
              null,
              EndTypes[EndTypes.ENTRANCES] as TEndType,
            );
          }
        }

        path.path = path.path.concat(localPath.path);
        path.length += localPath.length;
      }
    } else {
      for (let floor = fromLevelIdx; floor <= toLevelIdx; floor++) {
        let startPoint: Point;
        if (path.path[path.path.length - 2]) {
          startPoint = {
            x: path.path[path.path.length - 1][1],
            y: path.path[path.path.length - 1][0],
            z: levelZ[floor + 2],
            levelNumber: floor + 2,
          };

          const prevPoint = {
            x: path.path[path.path.length - 2][1],
            y: path.path[path.path.length - 2][0],
            z: levelZ[floor + 2],
            levelNumber: floor + 2,
          };

          const directionY = prevPoint.y < startPoint.y ? 1 : -1;

          if (directionY === 1) {
            for (
              let y = startPoint.y + 1;
              y < floors[floor][startPoint.x].length;
              y++
            ) {
              if (floors[floor][startPoint.x][y] === 1) {
                startPoint.y = y;
                break;
              }
            }
          } else {
            for (let y = startPoint.y - 1; y > 0; y--) {
              if (floors[floor][startPoint.x][y] === 1) {
                startPoint.y = y;
                break;
              }
            }
          }
        } else {
          startPoint = {
            x: path.path[path.path.length - 1][1],
            y: path.path[path.path.length - 1][0],
            z: levelZ[floor + 2],
            levelNumber: floor + 2,
          };
        }

        const needMoveUp = floor != toLevelIdx;
        let localPath: Path;

        if (needMoveUp) {
          localPath = this.findOnLevel(
            floors[floor],
            startPoint,
            null,
            EndTypes[EndTypes.STAIRS] as TEndType,
          );
        } else {
          localPath = this.findOnLevel(floors[floor], startPoint, to);
        }

        path.path = path.path.concat(localPath.path);
        path.length += localPath.length;
      }
    }

    return path;
  }

  addZ = (path: number[][], z: number) => {
    for (const pair of path) {
      pair.push(z);
    }
  };
}
