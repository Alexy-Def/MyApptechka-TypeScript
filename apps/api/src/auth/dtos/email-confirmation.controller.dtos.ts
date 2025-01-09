import { ApiPropertyEmail, ApiPropertyString } from '@ppx-node/api-decorators';

import { EMAIL_CONFIRMATION_TOKEN } from '../constants';

class EmailConfirmationToken {
  @ApiPropertyString({ pattern: EMAIL_CONFIRMATION_TOKEN.PATTERN })
  public token: string;
}

export class ConfirmEmailBodyDTO extends EmailConfirmationToken {}

export class VerifyEmailConfirmationTokenBodyDTO extends EmailConfirmationToken {}

export class ResendLinkBodyDTO {
  @ApiPropertyEmail()
  public email: string;
}
