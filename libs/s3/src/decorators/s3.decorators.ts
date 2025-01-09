import { Inject } from '@nestjs/common';

import { getS3ConnectionToken, getS3OptionsToken } from '../helpers';

export const InjectS3 = (connection?: string): ParameterDecorator => {
  return Inject(getS3ConnectionToken(connection));
};

export const InjectS3Options = (connection?: string): ParameterDecorator => {
  return Inject(getS3OptionsToken(connection));
};
