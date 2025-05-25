import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PiloteEcurieService {
  constructor(private readonly prisma: PrismaService) {}

  async link(piloteId: string, ecurieId: string, date: Date) {
    const id = `${piloteId}-${ecurieId}-${date.getFullYear()}`;

    return this.prisma.piloteEcurie.upsert({
      where: { id },
      update: {},
      create: {
        id,
        piloteId,
        ecurieId,
        year: new Date(date),
      },
    });
  }
}
