import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { InjectLogger, Logger } from '@libs/nestjs-logger';
import { AbstractError } from '@modules/core/exceptions';
import { sentry, sentryService } from '@modules/core/sentry';

import { getErrorStatus } from '../helpers';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  @InjectLogger(HttpExceptionFilter.name)
  private readonly logger: Logger;

  @sentry()
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    if (exception instanceof AbstractError || exception instanceof HttpException) {
      const status = getErrorStatus(exception);
      const details = 'details' in exception ? exception.details : [];
      response.status(status).json({
        status,
        name: exception.name,
        message: exception.message,
        details,
      });

      return;
    }

    if (exception instanceof Error) {
      this.logger.error(exception, exception.stack);
      sentryService.error(exception);
    } else {
      // case if not error was thrown, example: throw 'string_not_error'
      sentryService.error(new Error(exception?.toString() ?? 'UNKNOWN_ERROR'));
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });

    return;
  }
}
