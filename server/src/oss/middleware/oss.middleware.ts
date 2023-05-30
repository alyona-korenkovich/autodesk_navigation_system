import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { AuthAutodeskService } from 'AuthAutodesk/auth-autodesk.service';
import { TokenDto } from 'Dto/token.dto';

@Injectable()
export class OssMiddleware implements NestMiddleware {
  constructor(private readonly authAutodesk: AuthAutodeskService) {}

  async use(req: TokenDto, res: Response, next: NextFunction) {
    req.oauth_token = await this.authAutodesk.getInternalToken();
    req.oauth_client = this.authAutodesk.getClient();
    next();
  }
}
