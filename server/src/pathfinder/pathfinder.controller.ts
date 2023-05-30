import { Body, Controller, Param, Post } from '@nestjs/common';
import { Mode } from 'Pathfinder/types/types';
import { PathfinderService } from 'Pathfinder/pathfinder.service';
import { PathInitialsDto } from 'Pathfinder/dto/pathInitials.dto';

@Controller('api/pathfinder')
export class PathfinderController {
  constructor(private readonly PathfinderService: PathfinderService) {}

  /**
   * Find a path in a set of 2d projections from A-point to B-point
   * @param mode - general (A+B given) or emergency (only A)
   * @param body - fromId, toId [both for saving the path only], forDisabled option, and projectInfo - set of projections, centers of A and B points (x, y, levelNumber)
   */
  @Post(':mode')
  async findPath(@Param('mode') mode: Mode, @Body() body: PathInitialsDto) {
    if (mode === 'general') {
      return this.PathfinderService.findPath(
        body.forDisabled,
        body.projectInfo.floors,
        body.projectInfo.from,
        body.projectInfo.to,
      );
    } else {
      return this.PathfinderService.findPath(
        body.forDisabled,
        body.projectInfo.floors,
        body.projectInfo.from,
      );
    }
  }
}
