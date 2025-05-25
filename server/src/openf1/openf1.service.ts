import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenF1Service {
  private readonly BASE_URL = 'https://api.openf1.org/v1';

  constructor(private readonly http: HttpService) {}

  // 🔍 Récupère les meetings dans une plage de +/- 7 jours autour de maintenant
  async getCurrentMeetings(): Promise<any[]> {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const oneWeekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const url = `${this.BASE_URL}/meetings?date_start>=${oneWeekAgo}&date_start<=${oneWeekAhead}`;
    const res = await firstValueFrom(this.http.get(url)) as { data: any };
    return res.data;
  }

  // 🏁 Récupère la session "Race" d’un GP
  async getLatestRaceSession(meetingKey: number): Promise<number> {
    const url = `${this.BASE_URL}/sessions?meeting_key=${meetingKey}&session_name=Race`;
    const res = await firstValueFrom(this.http.get(url)) as { data: any[] };;
    return res.data?.[0]?.session_key;
  }

  // 👥 Récupère les pilotes pour une session
  async getDrivers(sessionKey: number): Promise<any[]> {
    const url = `${this.BASE_URL}/drivers?session_key=${sessionKey}`;
    const res = await firstValueFrom(this.http.get(url)) as { data: any[] };
    return res.data;
  }
}
