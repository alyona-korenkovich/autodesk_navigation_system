import PathFinder from 'Pathfinder/core/PathFinder';
import Graph from 'Pathfinder/core/Graph';
import { EndTypes, TEndType } from 'Pathfinder/core/types';

describe('Pathfinder tests', () => {
  describe('PathFinder w/o blocked blocks', () => {
    let pathFinder: PathFinder;
    let grid: Graph;

    beforeEach(() => {
      const matrix = [
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ];

      grid = new Graph(matrix);
      pathFinder = new PathFinder(grid, grid.getNode(0, 0), grid.getNode(4, 4));
    });

    describe('getPath', () => {
      it('should return the correct path', () => {
        const path = pathFinder.getPath().reverse();
        expect(path).toEqual([
          [4, 4],
          [3, 3],
          [2, 2],
          [1, 1],
          [0, 0],
        ]);
      });

      it('should throw an error if there is no end node or end type', () => {
        expect(() => new PathFinder(grid, grid.getNode(0, 0))).toThrow();
      });

      it('should throw an error if there are both end node and end type', () => {
        expect(
          () =>
            new PathFinder(
              grid,
              grid.getNode(0, 0),
              grid.getNode(1, 1),
              EndTypes[EndTypes.ENTRANCES] as TEndType,
            ),
        ).toThrow();
      });
    });

    describe('getPathLength', () => {
      it('should return the correct path length', () => {
        const path = [
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
        ];
        const length = pathFinder.getPathLength(path);
        expect(length).toBeCloseTo(5.65, 1);
      });
    });

    describe('polishPath', () => {
      it('should return the correct polished path', () => {
        const path = [
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
        ];
        const polishedPath = pathFinder.polishPath(path);
        expect(polishedPath).toEqual([
          [0, 0],
          [4, 4],
        ]);
      });
    });
  });

  describe('PathFinder w/ blocked blocks', () => {
    let pathFinder: PathFinder;
    let grid: Graph;

    beforeEach(() => {
      const matrix = [
        [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
        [1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
      ];

      grid = new Graph(matrix);
      pathFinder = new PathFinder(
        grid,
        grid.getNode(1, 2),
        grid.getNode(10, 2),
      );
    });

    describe('getPath', () => {
      it('should return the correct path', () => {
        const path = pathFinder.getPath().reverse();
        expect(path).toEqual([
          [10, 2],
          [11, 3],
          [10, 4],
          [9, 5],
          [10, 6],
          [11, 7],
          [11, 8],
          [10, 9],
          [9, 9],
          [8, 9],
          [7, 9],
          [6, 9],
          [5, 8],
          [5, 7],
          [4, 6],
          [3, 5],
          [2, 4],
          [1, 3],
          [1, 2],
        ]);
      });

      it('should return the correct polished path', () => {
        const path = pathFinder.getPath().reverse();
        const polishedPath = pathFinder.polishPath(path);
        expect(polishedPath).toEqual([
          [10, 2],
          [11, 3],
          [9, 5],
          [11, 8],
          [10, 9],
          [6, 9],
          [5, 8],
          [2, 4],
          [1, 3],
          [1, 2],
        ]);
      });

      it('should return the correct path length', () => {
        const path = pathFinder.getPath().reverse();
        const pathLength = pathFinder.getPathLength(path);
        expect(pathLength).toBeCloseTo(22.56, 1);
      });
    });
  });
});
