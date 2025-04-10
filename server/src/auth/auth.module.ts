import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenBlacklistCron } from '../auth/services/token-blacklist.cron';

@Module({
  imports: [
    JwtModule.register({
      global: true, // optionnel, utile si tu veux utiliser JwtService partout
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [AuthResolver, AuthService, PrismaService, JwtStrategy,TokenBlacklistService,TokenBlacklistCron],
})
export class AuthModule {}
