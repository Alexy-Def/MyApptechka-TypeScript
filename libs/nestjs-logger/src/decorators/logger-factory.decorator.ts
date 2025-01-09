import { Inject } from '@nestjs/common';

import { LOGGER_FACTORY_PROVIDER_INJECTION_TOKEN } from '../constants';

export function InjectLoggerFactory(): PropertyDecorator & ParameterDecorator {
  return Inject(LOGGER_FACTORY_PROVIDER_INJECTION_TOKEN);
}
