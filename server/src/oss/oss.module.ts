import { Module } from '@nestjs/common';

import { ModelDerivativeModule } from 'ModelDerivative/model-derivative.module';
import { AuthAutodeskModule } from 'AuthAutodesk/auth-autodesk.module';

import { OssController } from './oss.controller';
import { OssService } from './oss.service';

@Module({
  imports: [ModelDerivativeModule, AuthAutodeskModule],
  controllers: [OssController],
  providers: [OssService],
})
export class OssModule {}
