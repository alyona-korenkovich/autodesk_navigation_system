import { Test } from '@nestjs/testing';
import { PathfinderService } from 'Pathfinder/pathfinder.service';
import { Level } from 'Pathfinder/types/types';

describe('PathfinderService', () => {
  let service: PathfinderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PathfinderService],
    }).compile();
    service = moduleRef.get<PathfinderService>(PathfinderService);
  });

  describe('cleanFloors', () => {
    it('should return an empty floor when given an empty floor', () => {
      const floor = [];
      const coord = [1, 1];
      const result = service.cleanFloors(floor, coord);
      expect(result).toEqual([]);
    });
    it('should return 2D-array when given 2D-array', () => {
      const floor = [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
      ];
      const coord = [1, 1];

      const result = service.cleanFloors(floor, coord);

      expect(Array.isArray(result)).toBe(true);
      expect(Array.isArray(result[0])).toBe(true);
      expect(Array.isArray(result[1])).toBe(true);
      expect(Array.isArray(result[2])).toBe(true);
    });
    it('should return the input level unchanged when given coordinates that are out of the grid', () => {
      const level: Level = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ];
      const cleanedLevel = service.cleanFloors(level, [3, 3]);
      expect(cleanedLevel).toEqual(level);
    });
    it('should clean a single tile properly', () => {
      const floor = [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
      ];
      const coord = [1, 1];

      const result = service.cleanFloors(floor, coord);

      expect(result[1][1]).toBe(0);
    });

    it('should clean multiple adjacent tiles properly', () => {
      const floor = [
        [1, 1, 1, 1, 1],
        [1, 3, 3, 3, 1],
        [1, 3, 3, 3, 1],
        [1, 3, 3, 3, 1],
        [1, 1, 1, 1, 1],
      ];
      const expected = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
      ];
      expect(service.cleanFloors(floor, [2, 2])).toEqual(expected);
    });

    it('should correctly handle cleaning at the edges of the floor', () => {
      const floor = [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
      ];
      const coord = [0, 0];

      const result = service.cleanFloors(floor, coord);

      expect(result[0][0]).toBe(0);
    });

    it('should correctly handle cleaning in the corners of the floor', () => {
      const floor = [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
      ];
      const coord = [0, 2];

      const result = service.cleanFloors(floor, coord);

      expect(result[0][2]).toBe(0);
    });
  });

  describe('findOnLevel', () => {
    it('should return correct path from (0, 0) to (2, 2)', () => {
      const grid = [
        [1, 1, 1, 1],
        [1, 0, 1, 1],
        [1, 0, 1, 1],
        [1, 1, 1, 1],
      ];
      const from = { x: 0, y: 0, levelNumber: 2, z: 0 };
      const to = { x: 2, y: 2, levelNumber: 2, z: 0 };
      const expected = [
        [0, 0],
        [2, 1],
        [2, 2],
      ];
      expect(service.findOnLevel(grid, from, to).path).toEqual(expected);
    });

    it('should return an empty path if destination is unreachable', () => {
      const mockGrid = [
        [1, 1, 1],
        [0, 0, 0],
        [1, 1, 1],
      ];
      const mockStartPoint = { x: 0, y: 0, z: 0, levelNumber: 1 };
      const mockEndPoint = { x: 2, y: 2, z: 0, levelNumber: 1 };
      const result = service.findOnLevel(
        mockGrid,
        mockStartPoint,
        mockEndPoint,
      );

      expect(result.path).toEqual([[]]);
      expect(result.length).toEqual(0);
    });
  });
});
