import * as ClientS3 from '@aws-sdk/client-s3';

export type S3 = ClientS3.S3;

export type S3ModuleOptions = {
  config: ClientS3.S3ClientConfig;
  privateBucket: string;
  publicBucket: string;
};
