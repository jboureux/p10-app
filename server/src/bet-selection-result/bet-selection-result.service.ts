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
export class BetSelectionResultService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateBetSelectionResultInput) {
    const existingBet = await this.prisma.betSelectionResult.findFirst({
      where: {
        userId: userId,
        grandPrix: { idApiRaces: input.grandPrixId },
      },
    });

    if (existingBet) {
      throw new ConflictException('User has already bet on this Grand Prix.');
    }

    try {
      const grandPrix = await this.prisma.grandPrix.findUnique({
        where: { idApiRaces: input.grandPrixId },
      });
      if (!grandPrix) {
        throw new NotFoundException('Grand Prix introuvable.');
      }

      const grandPrixPiloteP10 = await this.prisma.grandPrixPilote.findUnique({
        where: { id: input.grandPrixPiloteIdP10 },
      });
      if (!grandPrixPiloteP10) {
        throw new NotFoundException('Grand Prix Pilote p10 introuvable.');
      }

      const grandPrixPiloteDNF = await this.prisma.grandPrixPilote.findUnique({
        where: { id: input.grandPrixPiloteIdDNF },
      });
      if (!grandPrixPiloteDNF) {
        throw new NotFoundException('Grand Prix Pilote DNF introuvable.');
      }

      return await this.prisma.betSelectionResult.create({
        data: {
          pointP10: 0,
          user: { connect: { id: userId } },
          grandPrix: { connect: { idApiRaces: input.grandPrixId } },
          grandPrixPiloteP10: { connect: { id: input.grandPrixPiloteIdP10 } },
          grandPrixPiloteDnf: { connect: { id: input.grandPrixPiloteIdDNF } },
        },
        include: {
          user: true,
          grandPrix: true,
          grandPrixPiloteP10: true,
          grandPrixPiloteDnf: true,
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
    const existingBet = await this.prisma.betSelectionResult.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!existingBet) {
      throw new NotFoundException('Pari introuvable.');
    }

    const grandPrixPiloteP10 = await this.prisma.grandPrixPilote.findUnique({
      where: { id: input.grandPrixPiloteIdP10 },
    });
    if (!grandPrixPiloteP10) {
      throw new NotFoundException('Grand Prix Pilote p10 introuvable.');
    }

    const grandPrixPiloteDNF = await this.prisma.grandPrixPilote.findUnique({
      where: { id: input.grandPrixPiloteIdDNF },
    });
    if (!grandPrixPiloteDNF) {
      throw new NotFoundException('Grand Prix Pilote DNF introuvable.');
    }

    const updatedBet = await this.prisma.betSelectionResult.update({
      where: { id: existingBet.id },
      data: {
        grandPrixPiloteP10: { connect: { id: input.grandPrixPiloteIdP10 } },
        grandPrixPiloteDnf: { connect: { id: input.grandPrixPiloteIdDNF } },
      },
      include: {
        grandPrixPiloteP10: true,
        grandPrixPiloteDnf: true,
      },
    });
    return updatedBet;
  }

  async hasUserBetOnGrandPrix(
    userId: string,
    grandPrixId: string,
  ): Promise<{ hasBet: boolean; betId?: string }> {
    const existingBet = await this.prisma.betSelectionResult.findFirst({
      where: {
        userId: userId,
        grandPrix: { idApiRaces: grandPrixId },
      },
      select: {
        id: true,
      },
    });

    return {
      hasBet: !!existingBet,
      betId: existingBet?.id,
    };
  }

  async getUserBetForGrandPrix(userId: string, grandPrixId: string) {
    const bet = await this.prisma.betSelectionResult.findFirst({
      where: {
        userId: userId,
        grandPrix: { idApiRaces: grandPrixId },
      },
      include: {
        user: true,
        grandPrix: {
          include: {
            track: true,
          },
        },
        grandPrixPiloteP10: {
          include: {
            pilote: true,
            ecurie: true,
          },
        },
        grandPrixPiloteDnf: {
          include: {
            pilote: true,
            ecurie: true,
          },
        },
      },
    });

    return bet;
  }
}
