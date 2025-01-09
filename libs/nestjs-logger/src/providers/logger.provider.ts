import { Inject, Injectable, LoggerService, Scope, Type } from '@nestjs/common';
import { INQUIRER, Reflector } from '@nestjs/core';

import { InjectLoggerFactory, SetLoggingCtx } from '../decorators';
import { Logger, LoggerFactory } from '../interfaces';
import { Loggable } from '../types';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerProvider implements LoggerService {
  private readonly logger: Logger;

  constructor(
    @Inject(INQUIRER) parentClass: Type,
    @InjectLoggerFactory() loggerFactory: LoggerFactory,
    reflector: Reflector,
  ) {
    const reflectedCtx = reflector.get<string | undefined>(SetLoggingCtx, parentClass);
    const ctx = typeof reflectedCtx === 'string' ? reflectedCtx : parentClass?.constructor?.name;

    this.logger = loggerFactory.createLogger(ctx);
  }

  log(message: Loggable): void {
    this.logger.log(message);
  }

  error(message: Loggable, trace?: string): void {
    this.logger.error(message, trace);
  }

  warn(message: Loggable): void {
    this.logger.warn(message);
  }

  debug(message: Loggable): void {
    this.logger.debug(message);
  }

  verbose(message: Loggable): void {
    this.logger.verbose(message);
  }
}
