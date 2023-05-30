import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Projects, ProjectsSchema } from './schemas/project.schema';
import { ItemsModule } from '../items/items.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  providers: [ProjectsService],
  controllers: [ProjectsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Projects.name,
        schema: ProjectsSchema,
      },
    ]),
    ItemsModule,
    RolesModule,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
