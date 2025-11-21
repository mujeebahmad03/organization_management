import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from 'src/modules/users/entities';
import { JwtAuthService } from './jwt-auth.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { RegisterInput, LoginInput, AuthResponse } from '../dto';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    // Hash password
    const hashedPassword = await argon2.hash(input.password);

    // Create user
    const user = await this.usersService.create(input.username, hashedPassword);

    // Generate tokens
    const tokens = await this.jwtAuthService.generateTokens(user);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      ...tokens,
      user: userWithoutPassword as User,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    // Find user by username
    const user = await this.usersService.findByUsername(input.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, input.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.jwtAuthService.generateTokens(user);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      ...tokens,
      user: userWithoutPassword as User,
    };
  }

  async logout(token: string): Promise<boolean> {
    // Add token to blacklist to prevent further use
    await this.tokenBlacklistService.addToBlacklist(token);
    return true;
  }
}
