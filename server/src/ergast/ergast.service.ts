// src/ergast/ergast.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ErgastService {
  constructor(private readonly http: HttpService) {}

  async getRaceResults(season: string, round: string): Promise<{ results: any[], date: string }> {
    const url = `https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`;
    const response = await firstValueFrom(this.http.get(url));
    const race = response.data?.MRData?.RaceTable?.Races?.[0];
    return {
      results: race?.Results || [],
      date: race?.date, 
    };
  }
  async getLatestRoundForDate(season: string, targetDate: Date): Promise<string | null> {
    const url = `https://api.jolpi.ca/ergast/f1/${season}.json`;
    const response = await firstValueFrom(this.http.get(url));
    const races = response.data?.MRData?.RaceTable?.Races || [];

    const found = races.find((race: any) => {
      const raceDate = new Date(race.date);
      return (
        raceDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
        raceDate.getUTCMonth() === targetDate.getUTCMonth() &&
        raceDate.getUTCDate() === targetDate.getUTCDate()
      );
    });

    return found?.round ?? null;
  }
}
