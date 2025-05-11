import { User } from "./users";

export interface MyLeaguesResponse {
  data: {
    myLeagues: League[];
  };
}

export interface League {
  id: string;
  name: string;
  isActive: boolean;
  isPrivate: boolean;
  sharedLink: string;
  user_league: Partial<UserLeague>[];
}

export interface UserLeague {
  id: string;
  is_admin: boolean;
  user: Partial<User>;
}

export interface CreateLeagueRequest {
  name: string;
  isPrivate: boolean;
  apiAvatarId: string;
}

export interface CreateLeagueResponse {
  data: {
    createLeague: Partial<League>;
  };
}

export interface LeagueResponse {
  data: {
    league: Partial<League>;
  };
}

export interface JoinPrivateLeagueResponse {
  data: {
    joinPrivateLeagueWithLink: boolean;
  };
}

export interface JoinLeagueRequest {
  sharedLink: string;
}
