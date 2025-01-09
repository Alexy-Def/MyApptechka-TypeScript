import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ResponseInfo } from '@modules/core/api-responses';

import { COOKIE_KEY } from '../constants';
import { Auth, Cookies } from '../decorators';
import { SignInBodyDTO, SignInResponseDTO, SignUpBodyDTO } from '../dtos';
import { clearAuthCookie, setAuthCookie } from '../helpers';
import { AuthService } from '../services';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ResponseInfo()
  public async signUp(@Body() { email, password }: SignUpBodyDTO, @Res() response: Response): Promise<void> {
    const tokensPair = await this.authService.signUp(email, password);

    if (tokensPair) {
      setAuthCookie(response, tokensPair);
    }

    response.send();
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponseDTO })
  public async signIn(@Body() { email, password }: SignInBodyDTO, @Res() response: Response): Promise<void> {
    const { accessToken, isTfaEnabled } = await this.authService.signIn(email, password);
    clearAuthCookie(response);
    setAuthCookie(response, { accessToken });
    response.send({ isTfaEnabled });
  }

  @Post('renew-tokens')
  @ResponseInfo()
  public async renewTokens(@Cookies() cookies: Record<COOKIE_KEY, string>, @Res() response: Response): Promise<void> {
    const newTokensPair = await this.authService.renewTokens(cookies[COOKIE_KEY.REFRESH_TOKEN]);
    setAuthCookie(response, newTokensPair);
    response.send();
  }

  @Auth()
  @Post('sign-out')
  @ResponseInfo()
  public async logOut(@Cookies() cookies: Record<COOKIE_KEY, string>, @Res() response: Response): Promise<void> {
    await this.authService.logOut(cookies[COOKIE_KEY.REFRESH_TOKEN]);
    clearAuthCookie(response);
    response.send();
  }
}
