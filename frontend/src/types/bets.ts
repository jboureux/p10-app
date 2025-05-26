export interface BetSelectionResult {
  id: string;

  pointP10: number;

  user: string;

  grand_prix: string;

  grand_prix_pilote: string;
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
