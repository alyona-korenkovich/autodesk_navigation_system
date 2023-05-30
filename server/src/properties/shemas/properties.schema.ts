import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertiesDocument = Properties & Document;

@Schema()
export class Properties {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  value: string;
  @Prop(String)
  unit_id: string; // todo change, then create schema unit
  @Prop(String)
  file_id: string; // todo change, then create schema file
  @Prop(String)
  is_save_history: boolean; // todo discuss
}

export const PropertiesSchema = SchemaFactory.createForClass(Properties);
