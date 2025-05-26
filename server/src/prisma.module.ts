import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // rend le service globalement accessible (optionnel)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
