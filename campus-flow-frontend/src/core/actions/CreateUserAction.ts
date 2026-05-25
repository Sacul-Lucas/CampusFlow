/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "../lib/utils/tokenValidation";
import { API_BASE_URL } from "../../Config";
import axios from "axios";

export type CreateUserActionInput = {
  username?: string;
  email: string;
  password: string;
  role?: string;
};

export type CreateUserActionOutput = {
  status: CreateUserStatus;
  data: string;
};

export type CreateUserStatus = 
  | 'SUCCESS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'UNKNOWN';

export class CreateUserAction {
  static async execute(input: CreateUserActionInput): Promise<CreateUserActionOutput> {
    try {
      const token = getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await axios.post(`${API_BASE_URL}/users`, {
            username: input.username,
            email: input.email,
            password: input.password,
            role: input.role,
        }, {
            headers,
            withCredentials: true,
        });

        const { success, message } = response.data;

        if (success) {
            return { status: 'SUCCESS', data: message || 'Conta criada com sucesso!' };
        } else {
            return { status: 'UNKNOWN', data: message || 'Erro desconhecido' };
        }

    } catch (error: any) {
        if (error.response && error.response.data) {
            const { message, error: backendError } = error.response.data;

            if (message === 'Email já foi registrado') {
                return { status: 'EMAIL_ALREADY_EXISTS', data: message };
            } else {
                return { status: 'UNKNOWN', data: message || backendError || 'Erro desconhecido' };
            }
        }

        return { status: 'UNKNOWN', data: error.message || 'Erro de conexão' };
    }
  }
}
