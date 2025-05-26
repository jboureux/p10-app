import { Injectable } from '@nestjs/common';
import { GrandPrix, GrandPrixPilote } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GrandPrixService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<GrandPrix[]> {
    const grandPrix = await this.prisma.grandPrix.findMany({
      include: {
        track: true,
        grandPrixClassement: {
          include: {
            grandPrixPilote: {
              include: {
                pilote: true,
                ecurie: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return grandPrix;
  }

  async findUpcoming(): Promise<GrandPrix[]> {
    const now = new Date();
    const grandPrix = await this.prisma.grandPrix.findMany({
      where: {
        date: {
          gt: now,
        },
      },
      include: {
        track: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return grandPrix;
  }

  async findPast(): Promise<GrandPrix[]> {
    const now = new Date();
    const grandPrix = await this.prisma.grandPrix.findMany({
      where: {
        date: {
          lt: now,
        },
      },
      include: {
        track: true,
        grandPrixClassement: {
          include: {
            grandPrixPilote: {
              include: {
                pilote: true,
                ecurie: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return grandPrix;
  }

  async findNext(): Promise<GrandPrix | null> {
    const now = new Date();
    const nextGrandPrix = await this.prisma.grandPrix.findFirst({
      where: {
        date: {
          gt: now,
        },
      },
      include: {
        track: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return nextGrandPrix;
  }

  async findPilotesByGrandPrix(
    grandPrixId: string,
  ): Promise<GrandPrixPilote[]> {
    const grandPrix = await this.prisma.grandPrix.findUnique({
      where: {
        idApiRaces: grandPrixId,
      },
      include: {
        track: true,
      },
    });

    if (!grandPrix) {
      throw new Error(`Grand Prix avec l'ID ${grandPrixId} non trouvé`);
    }

    const seasonYear = parseInt(grandPrix.season);

    const grandPrixPilotes = await this.prisma.grandPrixPilote.findMany({
      where: {
        idGrandPrix: grandPrixId,
      },
      include: {
        pilote: {
          include: {
            pilotesEcurie: {
              where: {
                AND: [
                  {
                    year: {
                      gte: new Date(`${seasonYear}-01-01`),
                    },
                  },
                  {
                    year: {
                      lt: new Date(`${seasonYear + 1}-01-01`),
                    },
                  },
                ],
              },
              include: {
                ecurie: true,
              },
            },
          },
        },
        ecurie: true,
        grandPrix: {
          include: {
            track: true,
          },
        },
      },
      orderBy: {
        ecurie: {
          name: 'asc',
        },
      },
    });

    return grandPrixPilotes;
  }
}
