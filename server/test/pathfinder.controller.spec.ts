import { Test, TestingModule } from '@nestjs/testing';
import { PathfinderController } from 'Pathfinder/pathfinder.controller';
import { PathfinderService } from 'Pathfinder/pathfinder.service';
import { PathInitialsDto } from 'Pathfinder/dto/pathInitials.dto';

describe('PathfinderController definition', () => {
  let controller: PathfinderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PathfinderController],
      providers: [PathfinderService],
    }).compile();

    controller = module.get<PathfinderController>(PathfinderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('PathfinderController functionality', () => {
  let controller: PathfinderController;
  let service: PathfinderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PathfinderController],
      providers: [PathfinderService],
    }).compile();

    controller = module.get<PathfinderController>(PathfinderController);
    service = module.get<PathfinderService>(PathfinderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findPath', () => {
    it('should return the path and pathLength for general mode', async () => {
      const body: PathInitialsDto = {
        fromId: 1298,
        toId: 1948,
        forDisabled: false,
        projectInfo: {
          floors: [],
          from: { x: 0, y: 0, levelNumber: 0 },
          to: { x: 10, y: 10, levelNumber: 1 },
        },
      };
      const path = [
        { x: 0, y: 0, levelNumber: 0 },
        { x: 10, y: 10, levelNumber: 1 },
      ];
      const pathLength = 14.142135623730951;
      jest
        .spyOn(service, 'findPath')
        .mockImplementation(() => [path, pathLength]);

      const result = await controller.findPath('general', body);

      expect(result).toEqual({ path, pathLength });
      expect(service.findPath).toHaveBeenCalledWith(
        false,
        [],
        { x: 0, y: 0, levelNumber: 0 },
        { x: 10, y: 10, levelNumber: 1 },
      );
    });

    it('should return the path and pathLength for emergency mode', async () => {
      const body: PathInitialsDto = {
        fromId: 2209,
        forDisabled: false,
        projectInfo: {
          floors: [[]],
          from: { x: 0, y: 0, levelNumber: 0 },
        },
      };
      const path = [{ x: 0, y: 0, levelNumber: 0 }];
      const pathLength = 0;
      jest
        .spyOn(service, 'findPath')
        .mockImplementation(() => [path, pathLength]);

      const result = await controller.findPath('emergency', body);

      expect(result).toEqual({ path, pathLength });
      expect(service.findPath).toHaveBeenCalledWith(false, [], {
        x: 0,
        y: 0,
        levelNumber: 0,
      });
    });
  });
});
