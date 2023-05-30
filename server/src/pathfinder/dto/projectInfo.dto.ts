import { Level, Point } from 'Pathfinder/types/types';

export class ProjectInfoDto {
  readonly floors: Level[];
  readonly from: Point;
  readonly to?: Point;
}
