import { Loggable } from '../types';

export interface Logger {
  log(message: Loggable): void;
  error(message: Loggable, trace?: string): void;
  warn(message: Loggable): void;
  debug(message: Loggable): void;
  verbose(message: Loggable): void;
}
