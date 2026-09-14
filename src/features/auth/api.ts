import { authService } from '../../services/authService';
import type { LoginFormInputs, RegisterFormInputs } from './types';

export const authApi = {
  login: (data: LoginFormInputs) => authService.login(data.email, data.password),
  register: (data: RegisterFormInputs) =>
    authService.register({
      name: data.name,
      email: data.email,
      password: data.password,
      companyName: data.companyName,
    }),
  forgotPassword: (email: string) => authService.forgotPassword(email),
  resetPassword: (token: string, pass: string) => authService.resetPassword(token, pass),
};
