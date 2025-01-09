import { ApiPropertyBoolean, ApiPropertyString } from '@ppx-node/api-decorators';
import { Expose } from 'class-transformer';

import { TFA_CONSTANTS } from '../constants';

class TfaCodeDTO {
  @ApiPropertyString({ maxLength: TFA_CONSTANTS.CODE_LENGTH, minLength: TFA_CONSTANTS.CODE_LENGTH })
  code: string;
}

class TfaRequisitesDTO {
  @Expose()
  @ApiPropertyString()
  otpAuthUrl: string;

  @Expose()
  @ApiPropertyString()
  secret: string;
}

export class ChangeSecretBodyDTO extends TfaCodeDTO {}

export class VerifyCodeBodyDTO extends TfaCodeDTO {
  @ApiPropertyBoolean({ isOptional: true })
  useNewSecret?: boolean;
}

export class GenerateSecretResponseDTO extends TfaRequisitesDTO {}

export class ChangeSecretResponseDTO extends TfaRequisitesDTO {}
