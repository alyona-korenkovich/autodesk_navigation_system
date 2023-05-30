import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AuthAutodeskService } from './auth-autodesk.service';

@Controller('api/forge/oauth')
export class AuthAutodeskController {
  constructor(private readonly AuthAutodeskService: AuthAutodeskService) {}
  @Get('/token')
  async getToken() {
    try {
      const token = await this.AuthAutodeskService.getPublicToken();
      return {
        access_token: token.access_token,
        expires_in: token.expires_in,
      };
    } catch (err) {
      return HttpStatus.BAD_REQUEST;
    }
  }

  @Get('/workset/token')
  async getWorksetToken() {
    const token = await this.AuthAutodeskService.getInternalToken();
    return { access_token: token.access_token };
  }
}
