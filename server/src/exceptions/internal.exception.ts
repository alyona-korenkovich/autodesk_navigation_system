import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerException extends HttpException {
  constructor(messageError) {
    super(messageError, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
