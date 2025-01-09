import { DynamicModule, Module, Provider } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { ClassValidationPipe } from './pipes';

@Module({})
export class ValidationModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: APP_PIPE,
        useClass: ClassValidationPipe,
      },
    ];

    return {
      module: ValidationModule,
      providers,
    };
  }
}
