// src/auth/token-blacklist.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TokenBlacklistCron {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredTokens() {
    const result = await this.prisma.blacklistedToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      console.log(
        `[CRON] 🧹 ${result.count} token(s) expiré(s) supprimé(s) de la blacklist.`,
      );
    } else {
      console.log('[CRON] Aucun token expiré à supprimer.');
    }
  }
}
