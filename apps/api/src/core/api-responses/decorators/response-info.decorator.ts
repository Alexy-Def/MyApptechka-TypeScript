import { applyDecorators, HttpCode, HttpStatus, SetMetadata, Type, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

import { RETURN_TYPE_METADATA_KEY } from '../constants';
import { ApiResponseInterceptor } from '../interceptors';

/**
 * Validates api response body by type
 * @param type Class validator constrains type, with Allow decorators
 * @param [status=200] Http response status
 * @param options additional options
 */
export function ResponseInfo<T>({
  type,
  status = HttpStatus.OK,
  ...options
}: {
  type?: Type<T>;
  status?: HttpStatus;
} & ApiResponseOptions = {}): ClassDecorator & MethodDecorator & PropertyDecorator {
  const decorators = [HttpCode(status)];

  if (type) {
    decorators.push(
      ApiResponse({ type, status, ...options }),
      SetMetadata(RETURN_TYPE_METADATA_KEY, type),
      UseInterceptors(ApiResponseInterceptor),
    );
  }

  return applyDecorators(...decorators);
}
