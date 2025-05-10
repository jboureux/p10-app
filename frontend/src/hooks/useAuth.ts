import { LogInRequest, RegisterRequest } from "@/types/auth";
import { callAPI } from "../lib/api-client";

class AuthHelper {
  private apiService: typeof callAPI;

  constructor() {
    this.apiService = callAPI;
  }

  register = async (data: RegisterRequest) => {
    await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  logIn = async (data: LogInRequest) => {
    await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  logOut = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
}

export const useAuth = (): {
  register: (data: RegisterRequest) => void;
  logIn: (data: LogInRequest) => void;
  logOut: () => void;
} => {
  const authHelper = new AuthHelper();

  return {
    register: authHelper.register,
    logIn: authHelper.logIn,
    logOut: authHelper.logOut,
  };
};
