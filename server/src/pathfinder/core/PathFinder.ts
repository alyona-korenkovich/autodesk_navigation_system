import Node from 'Pathfinder/core/Node';
import { TEndType, TNode } from 'Pathfinder/core/types';
import { chebyshev, matchesEndType } from 'Pathfinder/core/const';
import Graph from 'Pathfinder/core/Graph';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Heap = require('heap');

class PathFinder {
  private grid: Graph;
  private openListStart: Heap<TNode>;
  private readonly startNode: TNode;
  private readonly endNode?: TNode;
  private readonly endType?: TEndType;

  constructor(
    grid: Graph,
    startNode: Node,
    endNode?: Node,
    endType?: TEndType,
  ) {
    this.grid = grid;
    this.openListStart = new Heap(this.comparePoints);

    this.startNode = startNode;
    this.startNode.opened = true;

    if ((endNode || endType) && !(endNode && endType)) {
      if (endNode) {
        this.endNode = endNode;
      } else {
        this.endType = endType;
      }
    } else {
      throw new Error(
        'Pathfinder need to have either endNode or endType, not none or both of them.',
      );
    }

    this.openListStart.push(this.startNode);
  }

  /**
   * @return {number[][]} path
   */
  getPath = () => {
    while (!this.openListStart.empty()) {
      const node = this.openListStart.pop();
      node.closed = true;

      if (!this.endType) {
        if (node === this.endNode) {
          return this.backtrace(this.endNode);
        }
      } else {
        if (matchesEndType(node.type, this.endType)) {
          return this.backtrace(node);
        }
      }

      const neighbours = this.grid.getNeighbours(node);
      for (const neighbour of neighbours) {
        const isVisited = neighbour.closed;

        if (isVisited) {
          continue;
        }

        const gScore = this.calculateGScore(node, neighbour);
        const isNotInspected = !neighbour.opened;

        if (isNotInspected || gScore < neighbour.g) {
          if (this.endNode) {
            const dx = Math.abs(neighbour.x - this.endNode.x);
            const dy = Math.abs(neighbour.y - this.endNode.y);
            neighbour.h = neighbour.h || chebyshev(dx, dy);
          } else {
            neighbour.h = neighbour.h || 0;
          }

          neighbour.g = gScore;
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.parent = node;

          if (isNotInspected) {
            this.openListStart.push(neighbour);
            neighbour.opened = true;
          } else {
            this.openListStart.updateItem(neighbour);
          }
        }
      }
    }
  };

  private calculateGScore = (node: TNode, neighbour: TNode) => {
    return (
      node.g +
      (neighbour.x - node.x === 0 || neighbour.y - node.y === 0
        ? 1
        : Math.SQRT2)
    );
  };

  private comparePoints = (pathNodeA: TNode, pathNodeB: TNode) => {
    const fA = pathNodeA.f;
    const fB = pathNodeB.f;

    return fA - fB;
  };

  private backtrace = (node: TNode) => {
    const path = [[node.x, node.y]];

    while (node.parent) {
      node = node.parent;
      path.push([node.x, node.y]);
    }

    return path.reverse();
  };

  getPathLength = (path: number[][]) => {
    let totalLength = 0;
    for (let i = 1; i < path.length; i++) {
      const nodeA = {
        x: path[i - 1][0],
        y: path[i - 1][1],
      };
      const nodeB = {
        x: path[i][0],
        y: path[i][1],
      };

      const dx = Math.abs(nodeA.x - nodeB.x);
      const dy = Math.abs(nodeA.y - nodeB.y);

      totalLength += Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    return totalLength;
  };

  polishPath = (path: number[][]) => {
    if (!path || path[0].length == 0) {
      return path;
    }
    const pathLength = path.length;
    const [startX, startY] = path[0];
    const [endX, endY] = path[pathLength - 1];

    let [currStartX, currStartY] = [startX, startY];
    let [currEndX, currEndY] = [null, null];
    let [lastValidX, lastValidY] = [null, null];

    const polishedPath = [[currStartX, currStartY]];

    const interpolate = (x0: number, y0: number, x1: number, y1: number) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);

      const directionX = x0 < x1 ? 1 : -1;
      const directionY = y0 < y1 ? 1 : -1;

      let error = dx - dy;
      let error2;

      const interpolation = [];

      while (true) {
        interpolation.push([x0, y0]);

        if (x0 === x1 && y0 === y1) {
          break;
        }

        error2 = 2 * error;

        if (error2 > -dy) {
          error += -dy;
          x0 += directionX;
        }

        if (error2 < dx) {
          error += dx;
          y0 += directionY;
        }
      }

      return interpolation;
    };

    for (let i = 2; i < pathLength; i++) {
      [currEndX, currEndY] = path[i];
      const line = interpolate(currStartX, currStartY, currEndX, currEndY);

      let blocked = false;
      for (let j = 1; j < line.length; j++) {
        const [x, y] = line[j];
        if (!this.grid.isAvailable(x, y)) {
          blocked = true;
          break;
        }
      }

      if (blocked) {
        [lastValidX, lastValidY] = path[i - 1];
        polishedPath.push([lastValidX, lastValidY]);
        [currStartX, currStartY] = [lastValidX, lastValidY];
      }
    }

    polishedPath.push([endX, endY]);
    return polishedPath;
  };
}

export default PathFinder;
