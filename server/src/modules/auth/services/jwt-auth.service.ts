import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities';
import { JwtPayload, Tokens } from '../interfaces';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessTokenExpiresIn =
      this.configService.get<string>('jwt.expiresIn');
    const refreshTokenExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('jwt.secret'),
        expiresIn: accessTokenExpiresIn as never,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: refreshTokenExpiresIn as never,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
