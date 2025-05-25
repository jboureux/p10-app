export interface F1ApiResult {
  position: string;
  driver: string;
  team: string;
  number: string;
  scraped_at: string;
}

export interface F1ApiDateResponse {
  date: string;
}

export type F1ApiDatesResponse = string[] | F1ApiDateResponse[];
