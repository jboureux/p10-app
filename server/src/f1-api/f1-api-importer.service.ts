import { Injectable } from '@nestjs/common';
import { Pilote } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { F1ApiService } from './f1-api.service';

@Injectable()
export class F1ApiImporterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly f1ApiService: F1ApiService,
  ) {}

  async importAllAvailableResults() {
    console.log(
      "🏁 Début de l'importation des résultats depuis l'API F1 MDS (avec DNF)",
    );

    // Récupérer toutes les dates disponibles
    const dates = await this.f1ApiService.getGrandPrixDates();

    if (!dates.length) {
      console.warn('❌ Aucune date de GP trouvée');
      return;
    }

    console.log(`📅 ${dates.length} dates de GP trouvées`);

    let totalImported = 0;

    for (const date of dates) {
      try {
        const imported = await this.importResultsForDate(date);
        totalImported += imported;
      } catch (error) {
        console.error(`🚨 Erreur lors de l'importation pour ${date}:`, error);
      }
    }

    console.log(
      `🎉 Fin de l'importation - ${totalImported} résultats importés au total`,
    );
  }

  async importResultsForDate(date: string): Promise<number> {
    console.log(`🔄 Importation des résultats pour ${date}`);

    // Récupérer les résultats depuis l'API
    const results = await this.f1ApiService.getResultsByDate(date);

    if (!results.length) {
      console.warn(`⚠️ Aucun résultat trouvé pour ${date}`);
      return 0;
    }

    // Trouver le Grand Prix correspondant à cette date
    // Les résultats sont scrapés le lendemain du GP, donc on cherche le GP de la veille
    const scrapingDate = new Date(date);
    const gpDate = new Date(scrapingDate);
    gpDate.setDate(gpDate.getDate() - 1); // GP = date de scraping - 1 jour

    const startOfDay = new Date(gpDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(gpDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const grandPrix = await this.prisma.grandPrix.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (!grandPrix) {
      console.warn(
        `❌ Aucun GP trouvé pour la date ${gpDate.toISOString().split('T')[0]} (scraping: ${date})`,
      );
      return 0;
    }

    console.log(
      `🏁 GP trouvé: ${grandPrix.idApiRaces} pour ${gpDate.toISOString().split('T')[0]} (scraping: ${date})`,
    );

    let importedCount = 0;

    for (const result of results) {
      try {
        // Mapper le nom du pilote vers notre base de données
        const pilote = await this.findPiloteByName(result.driver);

        if (!pilote) {
          console.warn(`❌ Pilote non trouvé: ${result.driver}`);
          continue;
        }

        // Trouver le lien GP-Pilote
        const gpPilote = await this.prisma.grandPrixPilote.findFirst({
          where: {
            idGrandPrix: grandPrix.idApiRaces,
            idPilote: pilote.idApiPilote,
          },
        });

        if (!gpPilote) {
          console.warn(
            `❌ Lien GP-Pilote non trouvé pour ${pilote.nameAcronym} au GP ${grandPrix.idApiRaces}`,
          );
          continue;
        }

        // Convertir la position (gérer "NC" pour non classé et valeurs invalides)
        const positionStr = result.position.trim();
        let position: number | null = null;
        let isDnf = false;

        if (positionStr === 'NC' || positionStr === '') {
          // Pilote non classé (Did Not Finish)
          isDnf = true;
          position = null;
        } else {
          const parsedPosition = parseInt(positionStr, 10);
          if (!isNaN(parsedPosition) && parsedPosition > 0) {
            position = parsedPosition;
            isDnf = false;
          } else {
            // Position invalide, considérer comme DNF
            isDnf = true;
            position = null;
          }
        }

        // Créer ou mettre à jour le classement (pour tous les pilotes, classés ou non)
        await this.prisma.$executeRaw`
          INSERT INTO "GrandPrixClassement" (
            "id", 
            "id_grand_prix", 
            "id_grand_prix_pilote", 
            "position", 
            "is_dnf"
          ) VALUES (
            ${`${grandPrix.idApiRaces}-${gpPilote.id}`},
            ${grandPrix.idApiRaces},
            ${gpPilote.id},
            ${position},
            ${isDnf}
          )
          ON CONFLICT ("id") DO UPDATE SET
            "position" = EXCLUDED."position",
            "is_dnf" = EXCLUDED."is_dnf"
        `;

        if (isDnf) {
          console.log(
            `⚠️ Pilote DNF: ${pilote.nameAcronym} - ${result.position}`,
          );
        } else {
          console.log(
            `✅ Classement mis à jour: ${pilote.nameAcronym} - Position ${result.position}`,
          );
        }
        importedCount++;
      } catch (error) {
        console.error(
          `🚨 Erreur lors du traitement de ${result.driver}:`,
          error,
        );
      }
    }

    console.log(
      `✅ ${importedCount}/${results.length} résultats importés pour ${date}`,
    );
    return importedCount;
  }

  private async findPiloteByName(driverName: string): Promise<Pilote | null> {
    // Essayer d'abord une correspondance exacte
    let pilote = await this.prisma.pilote.findFirst({
      where: { name: driverName },
    });

    if (pilote) return pilote;

    // Essayer avec des variations de nom
    const variations = [
      driverName.replace(' Jnr', ''),
      driverName.replace(' Jr', ''),
      driverName.replace('Kimi Antonelli', 'Andrea Kimi Antonelli'),
      // Ajouter le mapping pour Nico Hulkenberg
      driverName.replace('Nico Hulkenberg', 'Nico Hülkenberg'),
    ];

    for (const variation of variations) {
      pilote = await this.prisma.pilote.findFirst({
        where: { name: variation },
      });
      if (pilote) return pilote;
    }

    // Essayer de chercher par parties du nom
    const nameParts = driverName.split(' ');
    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];

      pilote = await this.prisma.pilote.findFirst({
        where: {
          name: {
            contains: lastName,
          },
        },
      });

      if (pilote && pilote.name.includes(firstName)) {
        return pilote;
      }
    }

    return null;
  }
}
