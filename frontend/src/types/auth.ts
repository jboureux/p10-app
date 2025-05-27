export interface RegisterRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface RegisterResponse {
  data: {
    register: {
      token: string;
      user: {
        id: string;
      };
    };
  };
}

export interface IsLoggedInResponse {
  data: {
    isLogged: boolean;
  };
}

export interface LogInRequest {
  email: string;
  password: string;
}

export interface LogInResponse {
  data: {
    login: {
      token: string;
      user: {
        id: string;
      };
    };
  };
}

export interface LogOutResponse {
  data: {
    logout: boolean;
  };
}
