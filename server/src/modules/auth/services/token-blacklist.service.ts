import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { TokenBlacklist } from '../entities';
import { JwtAuthService } from './jwt-auth.service';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  /**
   * Add a token to the blacklist
   * Stores the token with its expiration time
   */
  async addToBlacklist(token: string): Promise<void> {
    try {
      // Decode token to get expiration time
      const decoded = await this.jwtAuthService.decodeToken(token);

      if (!decoded || !decoded.exp) {
        // If we can't decode or no expiration, don't add to blacklist
        // Token will naturally expire based on its own exp claim
        return;
      }

      const expiresAt = new Date(decoded.exp * 1000);

      // Check if token is already blacklisted
      const existing = await this.tokenBlacklistRepository.findOne({
        where: { token },
      });

      if (existing) {
        return; // Already blacklisted
      }

      await this.tokenBlacklistRepository.save({
        token,
        expiresAt,
      });
    } catch (error) {
      // If token is invalid or expired, don't blacklist it
      // It will fail validation anyway
    }
  }

  /**
   * Check if a token is blacklisted
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.tokenBlacklistRepository.findOne({
      where: { token },
    });

    return !!blacklistedToken;
  }

  /**
   * Clean up expired tokens from blacklist
   * This should be run periodically (via cron job or scheduled task)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.tokenBlacklistRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    return result.affected || 0;
  }
}
