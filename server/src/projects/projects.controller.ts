import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { TokenDto } from 'Dto/token.dto';

@Controller('api/project')
export class ProjectsController {
  constructor(private readonly ProjectService: ProjectsService) {}

  @Post('/create')
  createProject(@Req() req: TokenDto, @Body() body: ProjectDto) {
    return this.ProjectService.createProject(body);
  }

  @Get('/find/:id')
  findProject(@Param('id') id: string) {
    return this.ProjectService.findProject(id);
  }

  @Put('/update')
  updateProject(@Body() body: UpdateProjectDto) {
    return this.ProjectService.updateProject(body._id, body.update_project);
  }

  @Delete('/delete/:id')
  deleteProject(@Param('id') id: string) {
    return this.ProjectService.deleteProject(id);
  }
}
