import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Projects } from '../../projects/schemas/project.schema';

export type ItemsDocument = Items & Document;

@Schema()
export class Items {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projects',
  })
  project_id: Projects;

  @Prop(String)
  id_in_project: string;

  @Prop(String)
  name: string;

  @Prop(String)
  type: string;

  @Prop(String)
  value: string;
}

export const ItemsSchema = SchemaFactory.createForClass(Items);
