import { BetSelectionResult } from "./bets";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  bets_selection_results: Partial<BetSelectionResult>[];
  email: string;
}

export interface UserResponse {
  data: {
    user: User;
  };
}
