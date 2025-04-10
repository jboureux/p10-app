import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenBlacklistService {
  constructor(private readonly prisma: PrismaService) {}

  async blacklist(token: string) {
    
    const decoded = jwt.decode(token) as { exp: number };
  
    if (!decoded?.exp) {
      throw new Error('Impossible de lire la date d’expiration du token');
    }
  
    await this.prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt: new Date(decoded.exp * 1000),
      },
    });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.prisma.blacklistedToken.findUnique({ where: { token } });
    return !!blacklisted;
  }

  async cleanExpiredTokens() {
    await this.prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
