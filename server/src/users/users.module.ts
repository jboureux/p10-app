import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { TokenBlacklistService } from 'src/auth/services/token-blacklist.service';
import { makeGaugeProvider } from '@willsoto/nestjs-prometheus';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    PrismaService,
    JwtStrategy,
    TokenBlacklistService,
    makeGaugeProvider({
      name: 'p10_total_users',
      help: 'Total number of users',
    }),
  ],
})
export class UsersModule {}
