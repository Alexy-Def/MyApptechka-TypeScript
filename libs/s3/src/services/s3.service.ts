import path from 'path';

import {
  AbortMultipartUploadCommand,
  GetObjectCommandOutput,
  CompleteMultipartUploadCommandOutput,
  AbortMultipartUploadCommandOutput,
} from '@aws-sdk/client-s3';
import { Hash } from '@aws-sdk/hash-node';
import { Upload } from '@aws-sdk/lib-storage';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { parseUrl } from '@aws-sdk/url-parser';
import { formatUrl } from '@aws-sdk/util-format-url';
import { Injectable } from '@nestjs/common';

import { ServiceError } from '@modules/core/exceptions';

import { S3_ERROR_CONSTANT } from '../constants';
import { InjectS3, InjectS3Options } from '../decorators';
import { S3, S3ModuleOptions } from '../types';

@Injectable()
export class S3Service {
  constructor(@InjectS3() private readonly s3: S3, @InjectS3Options() private readonly options: S3ModuleOptions) {}

  public async getObject(bucket: string, key: string): Promise<GetObjectCommandOutput> {
    return this.s3.getObject({ Bucket: bucket, Key: key });
  }

  public async uploadObject(
    filename: string,
    key: string,
    body: string | ReadableStream | Blob | Uint8Array | Buffer,
    bucket: string,
  ): Promise<CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput> {
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: bucket,
        Body: body,
        Key: key,
        ContentDisposition: `attachment; filename*= UTF-8''${encodeURIComponent(filename)}`,
      },
    });

    return upload.done();
  }

  public async uploadWithRandomKey(
    filename: string,
    body: string | ReadableStream | Blob | Uint8Array | Buffer,
    bucket: string,
  ): Promise<CompleteMultipartUploadCommandOutput> {
    const key = this.generateKey(filename);
    const uploadResult = this.uploadObject(filename, key, body, bucket);

    if (uploadResult instanceof AbortMultipartUploadCommand) {
      throw new ServiceError(S3_ERROR_CONSTANT.UPLOAD_FAILED);
    }

    return uploadResult;
  }

  public async uploadToPrivateBucket(
    filename: string,
    body: string | ReadableStream<any> | Blob | Uint8Array | Buffer,
  ): Promise<CompleteMultipartUploadCommandOutput> {
    return this.uploadWithRandomKey(filename, body, this.options.privateBucket);
  }

  public async getSignedUrl(url: string): Promise<string> {
    const s3ObjectUrl = parseUrl(url);

    const presigner = new S3RequestPresigner({
      credentials: this.options.config.credentials!,
      region: this.options.config.region!,
      sha256: Hash.bind(null, 'sha256'),
    });

    const request = await presigner.presign(new HttpRequest(s3ObjectUrl));

    return formatUrl(request);
  }

  private generateKey(filename: string): string {
    const uuid = crypto.randomUUID();
    const { name, ext } = path.parse(filename);

    return `${name}_${uuid}${ext}`;
  }
}
