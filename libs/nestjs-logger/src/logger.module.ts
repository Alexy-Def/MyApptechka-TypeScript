import { DynamicModule, Provider, Scope } from '@nestjs/common';

import { LOGGER_FACTORY_PROVIDER_INJECTION_TOKEN, LOGGER_PROVIDER_INJECTION_TOKEN } from './constants';
import { LoggerFactory } from './interfaces';
import { LoggerProvider } from './providers';

export class LoggerModule {
  public static forRoot(loggerFactory: LoggerFactory): DynamicModule {
    const loggerServiceProvider: Provider = {
      scope: Scope.TRANSIENT,
      provide: LOGGER_PROVIDER_INJECTION_TOKEN,
      useClass: LoggerProvider,
    };

    const loggerFactoryProvider: Provider = {
      provide: LOGGER_FACTORY_PROVIDER_INJECTION_TOKEN,
      useValue: loggerFactory,
    };

    return {
      global: true,
      module: LoggerModule,
      providers: [loggerServiceProvider, loggerFactoryProvider],
      exports: [loggerServiceProvider],
    };
  }
}
