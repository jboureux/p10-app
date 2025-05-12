export interface BetSelectionResult {
  id: string;

  pointP10: number;

  user: string;

  grand_prix: string;

  grand_prix_pilote: string;
}
export interface CreateBetsSelectionResults {
  userId: string;

  grandPrixId: string;

  grandPrixPiloteId: string;
}

export interface UpdateBetSelectionResult {
  userId: string;

  pointP10: number;
}
