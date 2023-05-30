import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Projects, ProjectsDocuments } from './schemas/project.schema';
import { ProjectDto } from './dto/project.dto';
import {
  ERROR_UPDATE_PROJECT,
  ERROR_FIND_PROJECT,
  ERROR_DOWNLOAD_PROJECT,
  ERROR_DELETE_PROJECT,
} from 'Const/errorMessages';
import { ServerException } from '../exceptions/internal.exception';
import { RolesService } from '../roles/roles.service';
import { DEFAULT_ROLE } from '../roles/const';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Projects.name)
    private projectsModel: Model<ProjectsDocuments>,
    private readonly roles: RolesService,
  ) {}

  async createProject(project: ProjectDto) {
    try {
      const newProject = new this.projectsModel(project);
      await newProject.save();

      await this.roles.createRole({
        name: DEFAULT_ROLE,
        project_id: String(newProject._id),
      });
      return newProject;
    } catch (e) {
      throw new ServerException(ERROR_DOWNLOAD_PROJECT);
    }
  }

  async findProject(id: string) {
    try {
      return this.projectsModel.findOne({ _id: id });
    } catch (e) {
      throw new ServerException(ERROR_FIND_PROJECT);
    }
  }

  async updateProject(id, updateProject) {
    try {
      await this.projectsModel.findOneAndUpdate(id, updateProject);
      return HttpStatus.CREATED;
    } catch (e) {
      throw new ServerException(ERROR_UPDATE_PROJECT);
    }
  }

  async deleteProject(id: string) {
    try {
      return this.projectsModel.deleteOne({ _id: id });
    } catch (e) {
      throw new ServerException(ERROR_DELETE_PROJECT);
    }
  }
}
