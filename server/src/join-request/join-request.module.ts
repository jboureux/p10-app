import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PubSubModule } from 'src/public-subscription/public-subscription.module';
import { JoinRequestResolver } from './join-request.resolver';
import { JoinRequestService } from './join-request.service';

@Module({
  imports: [PubSubModule],
  providers: [JoinRequestService, JoinRequestResolver, PrismaService],
})
export class JoinRequestModule {}
