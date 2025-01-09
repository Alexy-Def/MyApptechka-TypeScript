import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { APM_KEY } from './apm.constant';

export const Apm = (): CustomDecorator<symbol> => SetMetadata<symbol>(APM_KEY, {});
