import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBetSelectionResultInput } from './dto/create-bet-selection-result';
import { UpdateBetSelectionResultInput } from './dto/update-bet-selection-result';

@Injectable()
export class BetsSelectionResultService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateBetSelectionResultInput) {
    try {
      const grandPrix = await this.prisma.grandPrix.findUnique({
        where: { idApiRaces: input.grandPrixId },
      });
      if (!grandPrix) {
        throw new NotFoundException('Grand Prix introuvable.');
      }

      const grandPrixPilote = await this.prisma.grandPrixPilote.findUnique({
        where: { id: input.grandPrixPiloteId },
      });
      if (!grandPrixPilote) {
        throw new NotFoundException('Grand Prix Pilote introuvable.');
      }

      return await this.prisma.betsSelectionResults.create({
        data: {
          pointP10: 0,
          user: { connect: { id: userId } },
          grandPrix: { connect: { idApiRaces: input.grandPrixId } },
          grandPrixPilote: { connect: { id: input.grandPrixPiloteId } },
        },
        include: {
          user: true,
          grandPrix: true,
          grandPrixPilote: true,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la création du pari:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Erreur inattendue lors de la création du pari.',
      );
    }
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
