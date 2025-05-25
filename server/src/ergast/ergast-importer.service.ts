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

  async importCurrentSeasonData() {
    console.log("🏁 Début de l'importation complète de la saison actuelle");

    // 1. Importer les Grands Prix
    await this.importCurrentSeasonGrandPrix();

    // 2. Importer les pilotes et écuries
    await this.importCurrentSeasonDriversAndConstructors();

    console.log("🎉 Fin de l'importation complète de la saison actuelle");
  }

  async importCurrentSeasonDriversAndConstructors() {
    console.log("👥 Début de l'importation des pilotes et écuries");

    // Récupérer les données depuis Ergast
    const drivers = await this.ergastService.getCurrentSeasonDrivers();
    const constructors =
      await this.ergastService.getCurrentSeasonConstructors();
    const driverConstructorPairs =
      await this.ergastService.getCurrentSeasonDriverConstructorPairs();

    if (!drivers.length) {
      console.warn('❌ Aucun pilote trouvé pour la saison actuelle');
      return;
    }

    console.log(`👥 ${drivers.length} pilotes trouvés`);
    console.log(`🏎️ ${constructors.length} écuries trouvées`);
    console.log(
      `📊 ${driverConstructorPairs.length} paires pilote-écurie trouvées`,
    );

    // Debug: afficher quelques exemples de données
    if (driverConstructorPairs.length > 0) {
      console.log(
        '🔍 Exemple de paire:',
        JSON.stringify(driverConstructorPairs[0], null, 2),
      );
    }

    // Importer les écuries d'abord
    for (const constructor of constructors) {
      try {
        await this.prisma.ecurie.upsert({
          where: { idApiEcurie: constructor.constructorId },
          update: {
            name: constructor.name,
            // Garder les valeurs existantes pour logo et color
          },
          create: {
            idApiEcurie: constructor.constructorId,
            name: constructor.name,
            logo: '', // Valeur par défaut
            color: '#000000', // Valeur par défaut
          },
        });
        console.log(`🏎️ Écurie créée/mise à jour: ${constructor.name}`);
      } catch (error) {
        console.error(
          `🚨 Erreur lors de l'importation de l'écurie ${constructor.name}:`,
          error,
        );
      }
    }

    // Importer les pilotes et créer les liens
    for (const driver of drivers) {
      try {
        console.log(
          `🔍 Traitement du pilote: ${driver.givenName} ${driver.familyName} (${driver.driverId})`,
        );

        // Créer/mettre à jour le pilote avec driverId comme identifiant
        const pilote = await this.prisma.pilote.upsert({
          where: { idApiPilote: driver.driverId },
          update: {
            name: `${driver.givenName} ${driver.familyName}`,
            nameAcronym:
              driver.code || driver.driverId.substring(0, 3).toUpperCase(),
          },
          create: {
            idApiPilote: driver.driverId,
            name: `${driver.givenName} ${driver.familyName}`,
            picture: '', // Valeur par défaut
            nameAcronym:
              driver.code || driver.driverId.substring(0, 3).toUpperCase(),
          },
        });

        console.log(
          `👤 Pilote créé/mis à jour: ${pilote.name} (${pilote.nameAcronym})`,
        );

        // Trouver l'écurie du pilote dans les paires
        const driverPair = driverConstructorPairs.find(
          (pair: any) => pair.Driver.driverId === driver.driverId,
        );

        if (!driverPair) {
          console.warn(
            `⚠️ Aucune écurie trouvée pour le pilote ${driver.givenName} ${driver.familyName} (${driver.driverId})`,
          );
          continue;
        }

        console.log(
          `🔍 Paire trouvée pour ${driver.driverId}:`,
          JSON.stringify(driverPair, null, 2),
        );

        const constructorId = driverPair.Constructors[0]?.constructorId;
        if (!constructorId) {
          console.warn(
            `⚠️ Aucune écurie valide pour le pilote ${driver.givenName} ${driver.familyName}`,
          );
          continue;
        }

        console.log(
          `🏎️ Écurie trouvée: ${constructorId} pour ${driver.driverId}`,
        );

        // Créer le lien pilote-écurie pour l'année actuelle
        const currentYear = new Date();
        const linkId = `${pilote.idApiPilote}-${constructorId}-${currentYear.getFullYear()}`;

        try {
          await this.prisma.piloteEcurie.upsert({
            where: { id: linkId },
            update: {},
            create: {
              id: linkId,
              piloteId: pilote.idApiPilote,
              ecurieId: constructorId,
              year: currentYear,
            },
          });

          console.log(
            `🔗 Lien pilote-écurie créé: ${pilote.nameAcronym} → ${constructorId}`,
          );
        } catch (linkError) {
          console.error(
            `🚨 Erreur lors de la création du lien pilote-écurie:`,
            linkError,
          );
        }

        // Créer les liens GP-Pilote pour tous les GP de la saison actuelle
        const currentSeasonGPs = await this.prisma.grandPrix.findMany({
          where: { season: currentYear.getFullYear().toString() },
        });

        console.log(
          `📅 ${currentSeasonGPs.length} GP trouvés pour la saison ${currentYear.getFullYear()}`,
        );

        for (const gp of currentSeasonGPs) {
          try {
            const gpPiloteId = `${gp.idApiRaces}-${pilote.idApiPilote}-${constructorId}`;

            await this.prisma.grandPrixPilote.upsert({
              where: { id: gpPiloteId },
              update: {},
              create: {
                id: gpPiloteId,
                idGrandPrix: gp.idApiRaces,
                idPilote: pilote.idApiPilote,
                idEcurie: constructorId,
              },
            });
            console.log(
              `✅ Lien GP-Pilote créé: ${gp.idApiRaces} - ${pilote.nameAcronym}`,
            );
          } catch (error) {
            console.warn(
              `⚠️ Erreur lors de la création du lien GP-Pilote pour ${gp.idApiRaces}:`,
              error,
            );
          }
        }
      } catch (error) {
        console.error(
          `🚨 Erreur lors de l'importation du pilote ${driver.givenName} ${driver.familyName}:`,
          error,
        );
      }
    }

    console.log("✅ Fin de l'importation des pilotes et écuries");
  }

  async importCurrentSeasonGrandPrix() {
    console.log(
      "🏁 Début de l'importation des Grands Prix de la saison actuelle",
    );

    const races = await this.ergastService.getCurrentSeasonRaces();

    if (!races.length) {
      console.warn('❌ Aucun Grand Prix trouvé pour la saison actuelle');
      return;
    }

    console.log(
      `📅 ${races.length} Grands Prix trouvés pour la saison ${races[0]?.season}`,
    );

    for (const race of races) {
      try {
        console.log(`🔄 Traitement du GP: ${race.raceName} (${race.date})`);

        // Vérifier si le Grand Prix existe déjà
        const existingGP = await this.prisma.grandPrix.findFirst({
          where: {
            season: race.season,
            idApiRaces: race.round,
          },
        });

        if (existingGP) {
          console.log(`⏭️ GP déjà existant: ${race.raceName}`);
          continue;
        }

        // Vérifier si le circuit existe
        let track = await this.prisma.track.findFirst({
          where: { idApiTrack: race.Circuit.circuitId },
        });

        // Créer le circuit s'il n'existe pas
        if (!track) {
          track = await this.prisma.track.create({
            data: {
              idApiTrack: race.Circuit.circuitId,
              trackName: race.Circuit.circuitName,
              countryName: race.Circuit.Location.country,
              pictureCountry: '', // Valeur par défaut
              pictureTrack: '', // Valeur par défaut
            },
          });
          console.log(`🛣️ Circuit créé: ${track.trackName}`);
        }

        // Créer le Grand Prix
        await this.prisma.grandPrix.create({
          data: {
            idApiRaces: race.round,
            season: race.season,
            date: new Date(race.date),
            time: race.time
              ? new Date(`${race.date}T${race.time}`)
              : new Date(race.date),
            idApiTrack: track.idApiTrack,
          },
        });

        console.log(`✅ Grand Prix créé: ${race.raceName} (${race.date})`);
      } catch (error) {
        console.error(
          `🚨 Erreur lors du traitement du GP ${race.raceName}:`,
          error,
        );
      }
    }

    console.log(
      "🎉 Fin de l'importation des Grands Prix de la saison actuelle",
    );
  }

  /**
   * @deprecated Utilisez F1ApiImporterService à la place
   * Cette méthode est conservée pour compatibilité mais ne devrait plus être utilisée
   */
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
