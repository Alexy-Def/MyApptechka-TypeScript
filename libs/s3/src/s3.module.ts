import { DynamicModule, Module } from '@nestjs/common';

import { S3CoreModule } from './s3.core-module';
import { S3Service } from './services';
import { S3ModuleOptions } from './types';

@Module({})
export class S3Module {
  public static forRoot(options: S3ModuleOptions, connection?: string): DynamicModule {
    return {
      module: S3Module,
      imports: [S3CoreModule.forRoot(options, connection)],
      providers: [S3Service],
      exports: [S3Service],
    };
  }
}
