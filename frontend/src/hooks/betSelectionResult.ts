import { callAPI } from "../lib/api-client";
import {
  CreateBetSelectionResults,
  UpdateBetSelectionResult,
} from "@/types/bets";

class BetSelectionResultHelper {
  private apiService: typeof callAPI;

  constructor() {
    this.apiService = callAPI;
  }

  create = async (data: CreateBetSelectionResults) => {
    await fetch("/api/bet-selection-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  update = async (data: UpdateBetSelectionResult) => {
    await fetch("/api/bet-selection-result", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
}
