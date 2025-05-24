import { Injectable, Logger } from '@nestjs/common';
import { OpenF1Service } from './openf1.service';
import { TrackService } from './services/track.service';
import { GrandPrixService } from './services/grand-prix.service';
import { PiloteService } from './services/pilotes.service';
import { EcurieService } from './services/ecurie.service';
import { PiloteEcurieService } from './services/pilote-ecurie.service';
import { GrandPrixPiloteService } from './services/grand-prix-pilote.service';

@Injectable()
export class OpenF1SeederCronService {
  private readonly logger = new Logger(OpenF1SeederCronService.name);

  constructor(
    private readonly openF1Service: OpenF1Service,
    private readonly trackService: TrackService,
    private readonly grandPrixService: GrandPrixService,
    private readonly piloteService: PiloteService,
    private readonly ecurieService: EcurieService,
    private readonly piloteEcurieService: PiloteEcurieService,
    private readonly grandPrixPiloteService: GrandPrixPiloteService,
  ) {}

  async seedUpcomingGrandPrix() {
    console.log('🕛 Lancement du cron seedUpcomingGrandPrix');

    let meetings;
    try {
      meetings = await this.openF1Service.getCurrentMeetings();
      console.log(`📅 Meetings récupérés :`, meetings);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des meetings', error);
      return;
    }

    for (const meeting of meetings) {
      try {
        console.log(`🔄 Traitement GP : ${meeting.meeting_name}`);

        const alreadyExists = await this.grandPrixService.exists(meeting.meeting_key);
        console.log(`📌 GP existe déjà ?`, alreadyExists);
        if (alreadyExists) {
          console.log(`⏭️ GP déjà en base : ${meeting.meeting_name}`);
          continue;
        }

        const track = await this.trackService.upsertFromMeeting(meeting);
        console.log(`🛣️ Track inséré ou mis à jour :`, track);

        const grandPrix = await this.grandPrixService.createFromMeeting(meeting, track.idApiTrack);
        console.log(`🏁 Grand Prix inséré :`, grandPrix);

        const sessionKey = await this.openF1Service.getLatestRaceSession(meeting.meeting_key);
        console.log(`📌 Session key récupéré :`, sessionKey);

        const drivers = await this.openF1Service.getDrivers(sessionKey);
        console.log(`👥 Drivers récupérés :`, drivers);

        for (const driver of drivers) {
          const pilote = await this.piloteService.upsert(driver);
          if (!pilote) {
            console.warn(`❌ Pilote non inséré : ${driver.full_name} (${driver.driver_number})`);
            continue;
          }
        
          const ecurie = await this.ecurieService.upsert(driver);
          if (!ecurie) {
            console.warn(`❌ Écurie non insérée pour pilote : ${driver.full_name}`);
            continue;
          }
        
          console.log(`🚗 Pilote inséré : ${pilote.name} (${pilote.nameAcronym}), 🏎️ Écurie : ${ecurie.name}`);
        
          try {
            await this.piloteEcurieService.link(pilote.idApiPilote, ecurie.idApiEcurie, new Date(meeting.date_start));
          } catch (err) {
            console.warn(`⚠️ Erreur de lien pilote-écurie : ${pilote.name} - ${ecurie.name}`, err);
          }
        
          try {
            await this.grandPrixPiloteService.create(grandPrix.idApiRaces, pilote.idApiPilote, ecurie.idApiEcurie);
            console.log(`✅ Lien GP-Pilote créé : ${pilote.nameAcronym} → ${grandPrix.season}`);
          } catch (err) {
            console.warn(`⚠️ Erreur de lien GP-Pilote : ${pilote.nameAcronym}`, err);
          }
        }

        console.log(`🎉 GP traité avec succès : ${meeting.meeting_name}`);
      } catch (error) {
        console.error(`🚨 Erreur pendant le traitement du GP ${meeting.meeting_name}`, error);
      }
    }

    console.log('✅ Fin du cron seedUpcomingGrandPrix');
  }
}
