import { Injectable } from '@nestjs/common';
import { MailSenderService } from '@pixelplex/mail-service';
import moment from 'moment';
import randomString from 'randomstring';

import { EntityNotFoundError, ServiceError, TooManyRequestsError } from '@modules/core/exceptions';
import { getTemplatePath } from '@modules/core/utils';
import { USER_STATUS, UserEntity, UsersService, UsersValidationService } from '@modules/users';

import { AUTH_ERROR, EMAIL_CONFIRMATION_MAIL, EMAIL_CONFIRMATION_TOKEN } from '../constants';
import { EmailConfirmationTokenEntity } from '../entities';
import { EmailConfirmationTokensRepository } from '../repositories';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly emailConfirmationTokensRepository: EmailConfirmationTokensRepository,
    private readonly usersService: UsersService,
    private readonly userValidationService: UsersValidationService,
    private readonly mailSenderService: MailSenderService,
  ) {}

  public async sendLink(normalizedEmail: string, userId: number): Promise<void> {
    const { token } = await this.createNewConfirmationToken(userId);
    await this.mailSenderService.sendEmail(
      normalizedEmail,
      {
        htmlPath: getTemplatePath('auth', EMAIL_CONFIRMATION_MAIL.TEMPLATE_NAME),
        plainPath: getTemplatePath('auth', EMAIL_CONFIRMATION_MAIL.PLAIN_TEMPLATE_NAME),
        subject: EMAIL_CONFIRMATION_MAIL.SUBJECT,
      },
      { token },
    );
  }

  public async verifyToken(tokenString: string): Promise<EmailConfirmationTokenEntity> {
    const token = await this.emailConfirmationTokensRepository.findOneBy({ token: tokenString, isActive: true });

    if (!token) {
      throw new EntityNotFoundError(AUTH_ERROR.EMAIL_CONFIRMATION_TOKEN_NOT_FOUND);
    }

    this.checkTokenExpiration(token);

    return token;
  }

  public async confirmEmail(tokenString: string): Promise<void> {
    const token = await this.verifyToken(tokenString);

    await this.emailConfirmationTokensRepository.manager.transaction(async (entityManager): Promise<void> => {
      const emailConfirmationTokensRepository = entityManager.withRepository(this.emailConfirmationTokensRepository);
      await emailConfirmationTokensRepository.update({ id: token.id }, { isActive: false });
      await entityManager.update(UserEntity, { id: token.userId }, { status: USER_STATUS.ACTIVE });
    });
  }

  public async resendLink(email: string): Promise<void> {
    const normalizedEmail = this.userValidationService.normalizeEmailOrFail(email);
    const user = await this.usersService.findUserOrFail({ normalizedEmail });

    if (user.status !== USER_STATUS.PENDING) {
      throw new ServiceError(AUTH_ERROR.EMAIL_IS_ALREADY_CONFIRMED);
    }

    const { canResend, resendDate } = await this.canResend(user.id);

    if (!canResend) {
      throw new TooManyRequestsError([
        { message: AUTH_ERROR.TOO_MANY_EMAIL_CONFIRMATION_REQUESTS, details: [{ nextAttemptDate: resendDate }] },
      ]);
    }

    await this.sendLink(normalizedEmail, user.id);
  }

  private async createNewConfirmationToken(userId: number): Promise<EmailConfirmationTokenEntity> {
    const tokenString = randomString.generate(EMAIL_CONFIRMATION_TOKEN.LENGTH);
    const existedToken = await this.emailConfirmationTokensRepository.findOneBy({ userId, isActive: true });
    const token = this.emailConfirmationTokensRepository.create({
      ...(existedToken ? existedToken : {}),
      userId,
      timesSent: existedToken ? existedToken.timesSent + 1 : 1,
      token: tokenString,
      createdAt: new Date(),
    });

    return this.emailConfirmationTokensRepository.save(token);
  }

  private checkTokenExpiration(token: EmailConfirmationTokenEntity): void {
    const expirationDate = moment(token.createdAt).add(
      EMAIL_CONFIRMATION_TOKEN.LIFETIME_IN_MILLISECONDS,
      'milliseconds',
    );

    if (moment().isAfter(expirationDate)) {
      throw new ServiceError(AUTH_ERROR.EMAIL_CONFIRMATION_TOKEN_EXPIRED);
    }
  }

  private async canResend(userId: number): Promise<{ canResend: boolean; resendDate?: Date }> {
    const activeToken = await this.emailConfirmationTokensRepository.findOneBy({ userId, isActive: true });

    if (!activeToken || activeToken.timesSent < EMAIL_CONFIRMATION_TOKEN.RESEND_ATTEMPTS_BEFORE_BLOCKING) {
      return { canResend: true };
    }

    const resendDate = this.getResendDate(activeToken);
    const canResend = moment().isAfter(resendDate);

    return { canResend, resendDate };
  }

  private getResendDate(activeToken: EmailConfirmationTokenEntity): Date {
    return moment(activeToken.createdAt)
      .add(EMAIL_CONFIRMATION_TOKEN.RESEND_INTERVAL_IN_MILLISECONDS, 'milliseconds')
      .toDate();
  }
}
