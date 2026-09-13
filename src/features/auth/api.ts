import { authService } from '../../services/authService';
import type { LoginFormInputs, RegisterFormInputs } from './types';

export const authApi = {
  login: (data: LoginFormInputs) => authService.login(data.email, data.password),
  register: (data: RegisterFormInputs) => authService.register(data.name, data.email, data.password),
  forgotPassword: async (email: string) => {
    await new Promise((res) => setTimeout(res, 500));
    return { success: true, message: `Password reset link sent to ${email}` };
  },
  resetPassword: async (_token: string, _pass: string) => {
    await new Promise((res) => setTimeout(res, 500));
    return { success: true, message: 'Password has been updated successfully' };
  },
};
