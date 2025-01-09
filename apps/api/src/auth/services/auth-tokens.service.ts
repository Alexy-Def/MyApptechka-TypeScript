import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EntityNotFoundError, ServiceError } from '@modules/core/exceptions';
import { UsersService } from '@modules/users';
import { UserEntity } from '@modules/users/entities';
import { AUTH } from 'config';

import { AUTH_ERROR } from '../constants';
import { RefreshTokenEntity } from '../entities';
import { RefreshTokensRepository } from '../repositories';
import { AuthUserType, RefreshTokenPayloadType, TokensPair } from '../types';

@Injectable()
export class AuthTokensService {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async createTokensPair(user: Pick<UserEntity, 'id' | 'role'>): Promise<TokensPair> {
    const userPayload = this.prepareUserPayload(user);
    const accessToken = this.createAccessToken(userPayload);
    const refreshToken = await this.createRefreshToken(userPayload);

    return { accessToken, refreshToken };
  }

  public async renewTokensPair(refreshToken: string): Promise<TokensPair> {
    const refreshTokenPayload = this.decodeRefreshToken(refreshToken);
    const [user, oldRefreshToken] = await Promise.all([
      this.usersService.findUserOrFail({ id: refreshTokenPayload.user.id }),
      this.findActiveRefreshTokenOrFail(refreshTokenPayload.user.id, refreshTokenPayload.id),
    ]);

    await this.deactivateRefreshToken(oldRefreshToken.id, oldRefreshToken.userId);

    return this.createTokensPair(user);
  }

  public decodeRefreshToken(token: string): RefreshTokenPayloadType {
    let payload: RefreshTokenPayloadType;
    try {
      payload = this.jwtService.verify<RefreshTokenPayloadType>(token, { secret: AUTH.REFRESH_JWT_SECRET });
    } catch (e) {
      throw new ServiceError(AUTH_ERROR.INVALID_REFRESH_TOKEN);
    }

    if (!payload || !payload.id) {
      throw new ServiceError(AUTH_ERROR.INVALID_REFRESH_TOKEN);
    }

    return payload;
  }

  public async deactivateRefreshToken(tokenId: number, userId: number): Promise<void> {
    await this.refreshTokensRepository.update({ id: tokenId, userId }, { isActive: false });
  }

  public createAccessToken(user: UserEntity): string;
  public createAccessToken(userPayload: AuthUserType): string;
  public createAccessToken(userOrPayload: UserEntity | AuthUserType): string {
    return this.jwtService.sign({
      user: userOrPayload instanceof UserEntity ? this.prepareUserPayload(userOrPayload) : userOrPayload,
    });
  }

  private async createRefreshToken(userPayload: AuthUserType): Promise<string> {
    const { id } = await this.refreshTokensRepository.save({ userId: userPayload.id });

    return this.jwtService.sign(
      { id, user: userPayload },
      { expiresIn: AUTH.REFRESH_TOKEN_EXPIRES_IN, secret: AUTH.REFRESH_JWT_SECRET },
    );
  }

  private prepareUserPayload(user: Pick<UserEntity, 'id' | 'role'>): AuthUserType {
    return { id: user.id, role: user.role };
  }

  private async findActiveRefreshTokenOrFail(userId: number, refreshTokenId: number): Promise<RefreshTokenEntity> {
    const activeRefreshToken = await this.refreshTokensRepository.findOneBy({
      id: refreshTokenId,
      userId,
      isActive: true,
    });

    if (!activeRefreshToken) {
      throw new EntityNotFoundError(AUTH_ERROR.REFRESH_TOKEN_NOT_FOUND);
    }

    return activeRefreshToken;
  }
}
