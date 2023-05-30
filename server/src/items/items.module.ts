import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ModelDerivativeModule } from 'ModelDerivative/model-derivative.module';

import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Items, ItemsSchema } from './shemas/items.schema';

@Module({
  providers: [ItemsService],
  controllers: [ItemsController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Items.name,
        schema: ItemsSchema,
      },
    ]),
    ModelDerivativeModule,
  ],
  exports: [ItemsService],
})
export class ItemsModule {}
