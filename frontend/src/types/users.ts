import { BetSelectionResult } from "./bets";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  bet_selection_result: Partial<BetSelectionResult>[];
  email: string;
}

export interface UserResponse {
  data: {
    user: User;
  };
}
