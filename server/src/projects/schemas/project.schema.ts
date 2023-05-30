import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProjectsDocuments = Projects & Document;

@Schema()
export class Projects {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  urn: string;

  @Prop({ required: true })
  bucket_key: string;

  @Prop(Number)
  version: number;

  @Prop(Date)
  date: Date;
  image: Buffer;
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
