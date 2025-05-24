import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class GrandPrixPiloteService {
  constructor(private readonly prisma: PrismaService) {}

  
  async create(gpId: string, piloteId: string, ecurieId: string) {
    const id = `${gpId}-${piloteId}-${ecurieId}`;

    return this.prisma.grandPrixPilote.upsert({
      where: { id },
      update: {},
      create: {
        id,
        idGrandPrix: gpId,
        idPilote: piloteId,
        idEcurie: ecurieId,
      },
    });
  }
}