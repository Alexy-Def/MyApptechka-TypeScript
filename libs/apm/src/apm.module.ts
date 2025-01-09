import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { DynamicModule, Logger, Module } from '@nestjs/common';
import apm, { LogLevel } from 'elastic-apm-node';
import _ from 'lodash';

import { ApmManagerService } from './apm-manager.service';
import { ApmService } from './apm.service';

export interface ApmModuleOptions {
  active?: boolean;
  serviceName?: string;
  serverUrl?: string;
  secretToken?: string;
  apiKey?: string;
  disableInstrumentations?: string[];
  logLevel?: LogLevel;
}

const defaultOptions: Partial<ApmModuleOptions> = {
  active: false,
  serviceName: 'nestjs-template',
};

@Module({})
export class ApmModule {
  private static readonly logger = new Logger('ApmModule');

  /**
   * Configures the Elastic APM module.
   */

  static forRoot(options: ApmModuleOptions): DynamicModule {
    const finalOptions = {
      instrumentIncomingHTTPRequests: false, // do not gather information about all incoming http requests
      ...defaultOptions,
      ...options,
    };
    apm.start(finalOptions);

    ApmModule.logger.log(`Final apm startup options: ${JSON.stringify(_.omit(finalOptions, 'secretToken', 'apiKey'))}`);

    return {
      module: ApmModule,
      imports: [DiscoveryModule],
      providers: [ApmService, ApmManagerService],
      exports: [ApmService],
    };
  }
}
