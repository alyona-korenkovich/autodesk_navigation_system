import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Properties, PropertiesSchema } from './shemas/properties.schema';

@Module({
  providers: [PropertiesService],
  controllers: [PropertiesController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Properties.name,
        schema: PropertiesSchema,
      },
    ]),
  ],
  exports: [PropertiesService],
})
export class PropertiesModule {}
