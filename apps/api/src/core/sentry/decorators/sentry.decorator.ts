import { Severity } from '@sentry/types';

import { AppLoggerFactory } from '@modules/core/logger';

import { sentryService } from '../services';
import { SentryOptions } from '../types';

export function sentry({ level = Severity.Error, shallowException = false }: SentryOptions = {}): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> => {
    const logger = AppLoggerFactory.createLogger(`${target.constructor.name}.${propertyKey.toString()}`);
    const originalMethod = descriptor.value;

    switch (level) {
      case Severity.Error:
        descriptor.value = async function (...args: any[]): Promise<Error | any> {
          let result = null;
          try {
            result = await originalMethod.apply(this, args);

            return result;
          } catch (error) {
            if (error instanceof Error) {
              sentryService.error(error);
              logger.error(error);

              if (!shallowException) {
                throw error;
              }
            }
          }
        };

        return descriptor;
      default:
        return descriptor;
    }
  };
}
