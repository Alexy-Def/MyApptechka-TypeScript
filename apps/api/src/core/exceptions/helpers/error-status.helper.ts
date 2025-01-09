import { HttpException, HttpStatus } from '@nestjs/common';

import {
  AbstractError,
  EntityConflictError,
  EntityNotFoundError,
  ForbiddenError,
  ServiceError,
  UnauthorizedError,
  ValidationError,
} from '../errors';

export const getErrorStatus = (exception: Error | AbstractError | HttpException): number => {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }

  if (exception instanceof EntityNotFoundError) {
    return HttpStatus.NOT_FOUND;
  }

  if (exception instanceof ForbiddenError) {
    return HttpStatus.NOT_FOUND;
  }

  if (exception instanceof ServiceError) {
    return HttpStatus.BAD_REQUEST;
  }

  if (exception instanceof ValidationError) {
    return HttpStatus.UNPROCESSABLE_ENTITY;
  }

  if (exception instanceof UnauthorizedError) {
    return HttpStatus.UNAUTHORIZED;
  }

  if (exception instanceof EntityConflictError) {
    return HttpStatus.CONFLICT;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
};
