import { DynamicModule, Module, Provider } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { HttpExceptionFilter } from './filters';

@Module({})
export class ExceptionsModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: APP_FILTER,
        useClass: HttpExceptionFilter,
      },
    ];

    return {
      module: ExceptionsModule,
      providers,
    };
  }
}
