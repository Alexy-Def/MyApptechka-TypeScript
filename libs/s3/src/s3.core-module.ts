import { DynamicModule, Module, Provider } from '@nestjs/common';

import { createS3Connection, getS3ConnectionToken, getS3OptionsToken } from './helpers';
import { S3ModuleOptions } from './types';

@Module({})
export class S3CoreModule {
  public static forRoot(options: S3ModuleOptions, connection?: string): DynamicModule {
    const s3OptionsProvider: Provider = {
      provide: getS3OptionsToken(connection),
      useValue: options,
    };

    const s3ConnectionProvider: Provider = {
      provide: getS3ConnectionToken(connection),
      useValue: createS3Connection(options),
    };

    return {
      module: S3CoreModule,
      providers: [s3OptionsProvider, s3ConnectionProvider],
      exports: [s3OptionsProvider, s3ConnectionProvider],
    };
  }
}
