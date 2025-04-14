export interface IAuthForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}