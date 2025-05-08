import { Module } from '@nestjs/common';
import { JoinRequestService } from './join-request.service';
import { JoinRequestResolver } from './join-request.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [JoinRequestService, JoinRequestResolver, PrismaService],
})
export class JoinRequestModule {}