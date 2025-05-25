// src/ergast/ergast-importer.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ErgastService } from './ergast.service';

@Injectable()
export class ErgastImporterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ergastService: ErgastService,
  ) {}

  async importRaceResults(season: string, round: string) {
    const { results, date } = await this.ergastService.getRaceResults(
      season,
      round,
    );

    if (!results.length || !date) {
      console.warn('❌ Aucun résultat ou date invalide');
      return;
    }

    const searchDate = new Date(date);
    const startOfPrevDay = new Date(searchDate);
    startOfPrevDay.setUTCDate(startOfPrevDay.getUTCDate() - 1);
    startOfPrevDay.setUTCHours(0, 0, 0, 0);

    const endOfNextDay = new Date(searchDate);
    endOfNextDay.setUTCDate(endOfNextDay.getUTCDate() + 1);
    endOfNextDay.setUTCHours(23, 59, 59, 999);

    const grandPrix = await this.prisma.grandPrix.findFirst({
      where: {
        season,
        date: {
          gte: startOfPrevDay,
          lte: endOfNextDay,
        },
      },
    });

    if (!grandPrix) {
      console.warn(`❌ Aucun GP trouvé pour la date ${date}`);
      return;
    }

    for (const result of results) {
      const acronym = result.Driver.code; // Exemple : "VER"
      console.log(`⏳ Traitement de ${acronym} (position: ${result.position})`);

      const pilote = await this.prisma.pilote.findFirst({
        where: { nameAcronym: acronym },
      });

      if (!pilote) {
        console.warn(`❌ Pilote non trouvé: ${acronym}`);
        continue;
      }

      const gpPilote = await this.prisma.grandPrixPilote.findFirst({
        where: {
          idGrandPrix: grandPrix.idApiRaces,
          idPilote: pilote.idApiPilote,
        },
      });

      if (!gpPilote) {
        console.warn(`❌ GrandPrixPilote non trouvé pour ${acronym}`);
        continue;
      }

      const classement = await this.prisma.grandPrixClassement.findFirst({
        where: {
          idGrandPrix: grandPrix.idApiRaces,
          idGrandPrixPilote: gpPilote.id,
        },
      });

      const position = parseInt(result.position, 10);

      if (classement) {
        await this.prisma.grandPrixClassement.update({
          where: { id: classement.id },
          data: { position },
        });
        console.log(
          `✅ Mis à jour de la position pour ${acronym}: ${position}`,
        );
      } else {
        await this.prisma.grandPrixClassement.create({
          data: {
            idGrandPrix: grandPrix.idApiRaces,
            idGrandPrixPilote: gpPilote.id,
            position,
          },
        });
        console.log(`✅ Création de classement pour ${acronym}: ${position}`);
      }
    }
  }
}
