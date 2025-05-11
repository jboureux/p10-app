import { BetsSelectionResults } from "./bets";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  bets_selection_results: Partial<BetsSelectionResults>[];
}
