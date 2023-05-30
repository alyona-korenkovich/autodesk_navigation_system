import { Module } from '@nestjs/common';
import { ModelDerivativeController } from './model-derivative.controller';
import { ModelDerivativeService } from './model-derivative.service';

@Module({
  controllers: [ModelDerivativeController],
  providers: [ModelDerivativeService],
  exports: [ModelDerivativeService],
})
export class ModelDerivativeModule {}
