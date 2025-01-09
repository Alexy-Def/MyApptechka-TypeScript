import { ERROR_TYPE } from '../constants';

import { AbstractError, ErrorOptions } from './abstract.error';

export class EntityConflictError extends AbstractError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_TYPE.ENTITY_CONFLICT_ERROR, message, options);
  }
}
