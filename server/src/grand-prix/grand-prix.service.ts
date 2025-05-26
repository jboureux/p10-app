import { Injectable } from '@nestjs/common';
import { GrandPrix } from '@prisma/client';
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
}
