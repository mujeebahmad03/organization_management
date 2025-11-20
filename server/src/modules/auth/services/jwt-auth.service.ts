import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities';
import { JwtPayload, Token } from '../interfaces';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(user: User): Promise<Token> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessTokenExpiresIn =
      this.configService.get<string>('jwt.expiresIn');

    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('jwt.secret'),
        expiresIn: accessTokenExpiresIn as never,
      }),
    ]);

    return {
      accessToken,
    };
  }
}
