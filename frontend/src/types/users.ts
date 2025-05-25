import { BetsSelectionResults } from "./bets";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  bets_selection_results: Partial<BetsSelectionResults>[];
}

export interface UserResponse {
  data: {
    user: User;
  };
}
