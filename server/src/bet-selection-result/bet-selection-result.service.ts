import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBetSelectionResultInput } from './dto/create-bet-selection-result';
import { UpdateBetSelectionResultInput } from './dto/update-bet-selection-result';

@Injectable()
export class BetsSelectionResultService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateBetSelectionResultInput) {
    return this.prisma.betsSelectionResults.create({
      data: {
        pointP10: 0,
        user: {
          connect: { id: userId },
        },
        grandPrix: {
          connect: { idApiRaces: input.grandPrixId },
        },
        grandPrixPilote: {
          connect: { id: input.grandPrixPiloteId },
        },
      },
    });
  }

  async update(userId: string, input: UpdateBetSelectionResultInput) {
    return this.prisma.betsSelectionResults.update({
      where: { id: userId },
      data: {
        pointP10: input.pointP10,
      },
    });
  }
}
