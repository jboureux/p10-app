import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { F1ApiDatesResponse, F1ApiResult } from './types/f1-api.types';

@Injectable()
export class F1ApiService {
  private readonly baseUrl = 'https://f1-api.demo.mds-paris.yt';
  private readonly bearerToken = '2025';

  constructor(private readonly http: HttpService) {}

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json',
    };
  }

  async getLatestResults(): Promise<F1ApiResult[]> {
    const url = `${this.baseUrl}/api/gp/latest`;
    try {
      const response = await firstValueFrom(
        this.http.get<F1ApiResult[]>(url, { headers: this.getHeaders() }),
      );
      return response.data || [];
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des derniers résultats:',
        error,
      );
      return [];
    }
  }

  async getResultsByDate(date: string): Promise<F1ApiResult[]> {
    // Format de date attendu : YYYY-MM-DD
    const url = `${this.baseUrl}/api/gp/date?date=${date}`;
    try {
      const response = await firstValueFrom(
        this.http.get<F1ApiResult[]>(url, { headers: this.getHeaders() }),
      );
      return response.data || [];
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des résultats pour ${date}:`,
        error,
      );
      return [];
    }
  }

  async getGrandPrixDates(): Promise<string[]> {
    const url = `${this.baseUrl}/api/gp/dates`;
    try {
      const response = await firstValueFrom(
        this.http.get<F1ApiDatesResponse>(url, { headers: this.getHeaders() }),
      );
      const data = response.data || [];

      // Normaliser les données - parfois c'est un tableau de strings, parfois d'objets
      return data.map((item) =>
        typeof item === 'string' ? item : (item as { date: string }).date,
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des dates de GP:', error);
      return [];
    }
  }
}
