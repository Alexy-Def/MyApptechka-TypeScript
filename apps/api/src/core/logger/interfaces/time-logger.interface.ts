import { Loggable } from '@libs/nestjs-logger';

export interface TimeLogger {
  timer(message: Loggable): (additional?: object) => void;
}
