import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services';
import { AuthResolver } from './auth.resolver';
import { JwtAuthService } from './services';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { JwtStrategy } from './strategies';
import { User } from 'src/modules/users/entities';
import { TokenBlacklist } from './entities/token-blacklist.entity';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtAuthService,
    TokenBlacklistService,
    JwtStrategy,
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: Number(configService.get<string>('jwt.expiresIn')),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, TokenBlacklist]),
    UsersModule,
  ],
  controllers: [AuthController],
  exports: [TokenBlacklistService],
})
export class AuthModule {}
