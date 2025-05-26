// src/ergast/ergast.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ErgastService {
  constructor(private readonly http: HttpService) {}

  async getCurrentSeasonRaces(): Promise<any[]> {
    const url = 'https://api.jolpi.ca/ergast/f1/current.json';
    try {
      const response = await firstValueFrom(this.http.get(url));
      return response.data?.MRData?.RaceTable?.Races || [];
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des courses de la saison actuelle:',
        error,
      );
      return [];
    }
  }

  async getCurrentSeasonDrivers(): Promise<any[]> {
    const url = 'https://api.jolpi.ca/ergast/f1/current/drivers.json';
    try {
      const response = await firstValueFrom(this.http.get(url));
      return response.data?.MRData?.DriverTable?.Drivers || [];
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des pilotes de la saison actuelle:',
        error,
      );
      return [];
    }
  }

  async getCurrentSeasonConstructors(): Promise<any[]> {
    const url = 'https://api.jolpi.ca/ergast/f1/current/constructors.json';
    try {
      const response = await firstValueFrom(this.http.get(url));
      return response.data?.MRData?.ConstructorTable?.Constructors || [];
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des écuries de la saison actuelle:',
        error,
      );
      return [];
    }
  }

  async getCurrentSeasonDriverConstructorPairs(): Promise<any[]> {
    // Essayer d'abord les standings
    const standings = await this.getDriverStandings('current');
    if (standings.length > 0) {
      return standings;
    }

    // Si pas de standings, utiliser les résultats de la première course
    console.log(
      '🔄 Pas de standings disponibles, utilisation des résultats de course...',
    );
    const url = 'https://api.jolpi.ca/ergast/f1/current/1/results.json';
    try {
      const response = await firstValueFrom(this.http.get(url));
      const results =
        response.data?.MRData?.RaceTable?.Races?.[0]?.Results || [];

      // Transformer les résultats en format similaire aux standings
      return results.map((result: any) => ({
        Driver: result.Driver,
        Constructors: [result.Constructor],
      }));
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des paires pilote-écurie:',
        error,
      );
      return [];
    }
  }

  async getRaceResults(
    season: string,
    round: string,
  ): Promise<{ results: any[]; date: string; retiredDrivers: any[] }> {
    const url = `https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`;
    const response = await firstValueFrom(this.http.get(url));
    const race = response.data?.MRData?.RaceTable?.Races?.[0];

    const allResults = race?.Results || [];

    // Séparer les pilotes classés et retirés
    const finishedResults = allResults.filter(
      (result: any) => result.positionText !== 'R',
    );
    const retiredResults = allResults.filter(
      (result: any) => result.positionText === 'R',
    );

    return {
      results: finishedResults,
      date: race?.date,
      retiredDrivers: retiredResults,
    };
  }

  async getLatestRoundForDate(
    season: string,
    targetDate: Date,
  ): Promise<string | null> {
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

  private async getDriverStandings(season: string = 'current'): Promise<any[]> {
    const url = `https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`;
    try {
      const response = await firstValueFrom(this.http.get(url));
      return (
        response.data?.MRData?.StandingsTable?.StandingsLists?.[0]
          ?.DriverStandings || []
      );
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du classement des pilotes:',
        error,
      );
      return [];
    }
  }
}
