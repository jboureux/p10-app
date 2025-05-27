import { Ecurie } from "./ecurie";

export interface Pilote {
  id_api_pilote: string;
  name: string;
  name_acronym: string;
  picture: string;
  pilote_ecurie: Partial<PiloteEcurie>[];
}

export interface PiloteEcurie {
  ecurie: Partial<Ecurie>;
  pilote: Partial<Pilote>;
  season: string;
}
