import { Test, TestingModule } from '@nestjs/testing';
import { ModelDerivativeController } from './model-derivative.controller';

describe('ModelderivativeController', () => {
  let controller: ModelDerivativeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelDerivativeController],
    }).compile();

    controller = module.get<ModelDerivativeController>(
      ModelDerivativeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
