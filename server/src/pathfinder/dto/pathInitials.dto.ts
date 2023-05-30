import { ProjectInfoDto } from 'Pathfinder/dto/projectInfo.dto';

export class PathInitialsDto {
  fromId: number;
  toId?: number;
  forDisabled: boolean;
  projectInfo: ProjectInfoDto;
}
