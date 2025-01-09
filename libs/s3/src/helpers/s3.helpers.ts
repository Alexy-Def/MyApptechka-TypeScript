import { S3 } from '@aws-sdk/client-s3';

import { S3_MODULE_CONSTANT } from '../constants';
import { S3ModuleOptions } from '../types';

export function getS3OptionsToken(connection?: string): string {
  return `${connection || S3_MODULE_CONSTANT.CONNECTION}_${S3_MODULE_CONSTANT.OPTIONS_TOKEN}`;
}

export function getS3ConnectionToken(connection?: string): string {
  return `${connection || S3_MODULE_CONSTANT.CONNECTION}_${S3_MODULE_CONSTANT.CONNECTION_TOKEN}`;
}

export function createS3Connection(options: S3ModuleOptions): S3 {
  const { config } = options;

  return new S3(config);
}
