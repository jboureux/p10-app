import { Ecurie } from "./ecurie";
import { Pilote } from "./pilote";
import { Track } from "./track";

export interface GrandPrix {
  id_api_races: string;
  season: string;
  date: string;
  time: string;
  track: Partial<Track>;
  grand_prix_classement?: Array<Partial<GrandPrixClassement>>;
}

export interface GrandPrixClassement {
  position: number;
  is_dnf: boolean;
  is_first_dnf: boolean;
  grand_prix_pilote: Partial<GrandPrixPilote>;
}

export interface GrandPrixPilote {
  id: string;
  ecurie: Partial<Ecurie>;
  pilote: Partial<Pilote>;
}

export interface AllGrandPrixResponse {
  data: {
    allGrandPrix: Array<Partial<GrandPrix>>;
  };
}

export interface NextGrandPrixResponse {
  data: {
    nextGrandPrix: Partial<GrandPrix>;
  };
}

export interface GrandPrixPilotesResponse {
  data: {
    grandPrixPilotes: Partial<GrandPrixPilote>[];
  };
}
