export * from '../../types/auth';

export interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  companyName: string;
  password: string;
  acceptTerms: boolean;
}
