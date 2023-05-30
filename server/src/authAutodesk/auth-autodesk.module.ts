import { Module } from '@nestjs/common';
import { AuthAutodeskController } from './auth-autodesk.controller';
import { AuthAutodeskService } from './auth-autodesk.service';

@Module({
  controllers: [AuthAutodeskController],
  providers: [AuthAutodeskService],
  exports: [AuthAutodeskService],
})
export class AuthAutodeskModule {}
