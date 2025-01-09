import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ResponseInfo } from '@modules/core/api-responses';
import { USER_ROLE } from '@modules/users';

import { Auth, AuthUser } from '../decorators';
import { ChangeSecretBodyDTO, ChangeSecretResponseDTO, GenerateSecretResponseDTO, VerifyCodeBodyDTO } from '../dtos';
import { setAuthCookie } from '../helpers';
import { TFAService } from '../services';
import { AuthUserType } from '../types';

@Controller('auth/tfa')
@ApiTags('auth/tfa')
export class TfaController {
  constructor(private readonly tfaService: TFAService) {}

  @Auth()
  @Post('secret')
  @ResponseInfo({ type: GenerateSecretResponseDTO })
  async generateSecret(@AuthUser() authUser: AuthUserType): Promise<GenerateSecretResponseDTO> {
    const secret = await this.tfaService.generateSecret(authUser.id);

    return secret;
  }

  @Auth()
  @Post('change-secret')
  @ResponseInfo({ type: ChangeSecretResponseDTO })
  async changeSecret(
    @AuthUser() authUser: AuthUserType,
    @Body() { code }: ChangeSecretBodyDTO,
  ): Promise<ChangeSecretResponseDTO> {
    const secret = await this.tfaService.changeSecret(authUser.id, code);

    return secret;
  }

  @Auth(Object.values(USER_ROLE), false)
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async verifyCode(
    @AuthUser() authUser: AuthUserType,
    @Body() { code, useNewSecret }: VerifyCodeBodyDTO,
    @Res() response: Response,
  ): Promise<void> {
    const tokensPair = await this.tfaService.verifyCode(authUser.id, code, useNewSecret);
    setAuthCookie(response, tokensPair);
    response.send();
  }
}
