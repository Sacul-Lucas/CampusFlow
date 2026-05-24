/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL } from "../../Config";

export type AuthUserActionInput = {
  email: string;
  password: string;
};

export type AuthUserActionOutput = {
  status: AuthUserStatus;
  data: string;
  token: {
    access_token: string;
  };
};

export type AuthUserStatus = 'SUCCESS' | 'EMAIL_NOT_FOUND' | 'INVALID_PASSWORD' | 'UNKNOWN';

export class AuthUserAction {
  static async execute(input: AuthUserActionInput): Promise<AuthUserActionOutput> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: input.email,
        password: input.password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const { success, message, token } = response.data;

      if (success) {
        return { status: 'SUCCESS', data: message, token: token };
      } else {
        return { status: 'UNKNOWN', data: message || 'Erro desconhecido', token };
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, error: backendError } = error.response.data;
        
        if (message === 'Email não encontrado') {
          return { status: 'EMAIL_NOT_FOUND', data: message, token: {access_token: ''} };
        } else if (message === 'Senha incorreta') {
          return { status: 'INVALID_PASSWORD', data: message, token: {access_token: ''} };
        } else {
          return { status: 'UNKNOWN', data: message || backendError || 'Erro desconhecido', token: {access_token: ''} };
        }
      }

      return { status: 'UNKNOWN', data: error.message || 'Erro de conexão', token: {access_token: ''} };
    }
  }
}
