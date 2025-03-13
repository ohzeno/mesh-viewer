import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { errorToStatusCode } from '../constants/constants';

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  handleError(error: Error): never {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Unexpected error occurred';

    if (error.message.startsWith('Invalid')) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = error.message;
    } else if (errorToStatusCode.hasOwnProperty(error.name)) {
      status = errorToStatusCode[error.name];
      message = error.message;
    }
    this.logger.error(`Error occurred: ${error.message}`, error.stack);
    throw new HttpException(message, status);
  }
}
