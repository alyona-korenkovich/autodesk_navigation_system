import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(messageError) {
    super(messageError, HttpStatus.UNAUTHORIZED);
  }
}
