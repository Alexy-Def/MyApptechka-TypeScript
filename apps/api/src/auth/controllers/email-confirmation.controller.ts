import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseInfo } from '@modules/core/api-responses';

import { ConfirmEmailBodyDTO, ResendLinkBodyDTO, VerifyEmailConfirmationTokenBodyDTO } from '../dtos';
import { EmailConfirmationService } from '../services';

@Controller('auth/email-confirmation')
@ApiTags('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Post('confirm')
  @ResponseInfo({ status: HttpStatus.OK })
  public async confirmEmail(@Body() { token }: ConfirmEmailBodyDTO): Promise<void> {
    await this.emailConfirmationService.confirmEmail(token);
  }

  @Post('verify-token')
  @ResponseInfo({ status: HttpStatus.OK })
  public async verifyToken(@Body() { token }: VerifyEmailConfirmationTokenBodyDTO): Promise<void> {
    await this.emailConfirmationService.verifyToken(token);
  }

  @Post('resend')
  @ResponseInfo({ status: HttpStatus.OK })
  public async resendLink(@Body() { email }: ResendLinkBodyDTO): Promise<void> {
    await this.emailConfirmationService.resendLink(email);
  }
}
