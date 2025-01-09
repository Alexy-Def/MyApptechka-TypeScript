import { ApiPropertyBoolean, ApiPropertyEmail, ApiPropertyString } from '@ppx-node/api-decorators';
import { Expose } from 'class-transformer';

class CredentialsDTO {
  @ApiPropertyEmail()
  public email: string;

  @ApiPropertyString()
  public password: string;
}

export class SignUpBodyDTO extends CredentialsDTO {}
export class SignInBodyDTO extends CredentialsDTO {}

export class SignInResponseDTO {
  @Expose()
  @ApiPropertyBoolean()
  isTfaEnabled: boolean;
}
