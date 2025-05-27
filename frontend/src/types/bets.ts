import { GrandPrix, GrandPrixPilote } from "./grandprix";
import { User } from "./users";

export interface BetSelectionResult {
  id: string;

  point_p10: number | null;

  point_dnf: number | null;

  user: Partial<User>;

  grand_prix: Partial<GrandPrix>;

  grand_prix_pilote_p10: Partial<GrandPrixPilote>;

  grand_prix_pilote_dnf: Partial<GrandPrixPilote>;
}
export interface CreateBetSelectionResult {
  userId: string;

  grandPrixId: string;

  grandPrixPiloteId: string;
}

export interface UpdateBetSelectionResult {
  userId: string;

  pointP10: number;
}

export interface HasUserBetOnGrandPrixResponse {
  data: {
    hasUserBetOnGrandPrix: {
      has_bet: boolean;
      bet_id?: string;
    };
  };
}

export interface CreateBetSelectionResultResponse {
  data: {
    createBet: {
      id: string;
    };
  };
}

export interface UpdateBetSelectionResultResponse {
  data: {
    updateBet: {
      id: string;
    };
  };
}

export interface GetUserBetForGrandPrixResponse {
  data: {
    getUserBetForGrandPrix: {
      grand_prix_pilote_dnf: {
        id: string;
      };
      grand_prix_pilote_p10: {
        id: string;
      };
    };
  };
}
