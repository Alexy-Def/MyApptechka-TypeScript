import { ERROR_TYPE } from '../constants';

import { AbstractError, ErrorOptions } from './abstract.error';

export class EntityNotFoundError extends AbstractError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_TYPE.ENTITY_NOT_FOUND_ERROR, message, options);
  }
}
