import { Module } from '@nestjs/common';
import { JoinRequestService } from './join-request.service';
import { JoinRequestResolver } from './join-request.resolver';
import { PrismaService } from 'src/prisma.service';
import { PubSubModule } from 'src/public-subscription/public-subscription.module';

@Module({
  imports: [PubSubModule],
  providers: [JoinRequestService, JoinRequestResolver, PrismaService],
})
export class JoinRequestModule {}