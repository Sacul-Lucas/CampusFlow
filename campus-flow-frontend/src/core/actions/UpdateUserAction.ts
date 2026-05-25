/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "../lib/utils/tokenValidation";
import { API_BASE_URL } from "../../Config";
import axios from "axios";

export type UpdateUserActionInput = {
  username?: string;
  email: string;
  role?: string;
};

export type UpdateUserActionOutput = {
  status: UpdateUserStatus;
  data: string;
};

export type UpdateUserStatus = 
  | 'SUCCESS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'UNKNOWN';

export class UpdateUserAction {
  static async execute(input: UpdateUserActionInput, id: string): Promise<UpdateUserActionOutput> {
    try {
      const token = getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await axios.put(`${API_BASE_URL}/users/${id}`, {
            username: input.username,
            email: input.email,
            role: input.role,
        }, {
            headers,
            withCredentials: true,
        });

        const { success, message } = response.data;

        if (success) {
            return { status: 'SUCCESS', data: message || 'Usuário atualizado com sucesso!' };
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
