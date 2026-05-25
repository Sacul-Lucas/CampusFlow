/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "../lib/utils/tokenValidation";
import { API_BASE_URL } from "../../Config";
import axios from "axios";

export type DeleteUserActionOutput = {
  status: DeleteUserStatus;
  data: any;
};

export type DeleteUserStatus = 'SUCCESS' | 'USER_NOT_FOUND' | 'ACCESS_DENIED' | 'TOKEN_NOT_FOUND' | 'INVALID_TOKEN' | 'UNKNOWN';

export class DeleteUserAction {
    static async execute(id: string): Promise<DeleteUserActionOutput> {
        try {
            const token = getToken()
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }
            if (token) headers.Authorization = `Bearer ${token}`

            const response = await axios.delete(`${API_BASE_URL}/users/${id}`,
            {
                headers,
                withCredentials: true
            });

            const { success, message } = response.data;

            if (success) {
                return { status: 'SUCCESS', data: message };
            } else {
                return { status: 'USER_NOT_FOUND', data: message || 'Erro desconhecido' };
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const { message, error: backendError } = error.response.data;

                if (message === 'Token não fornecido') {
                    return { status: 'TOKEN_NOT_FOUND', data: message };
                } else if (message === 'Token inválido') {
                    return { status: 'INVALID_TOKEN', data: message };
                } else if (message === 'Acesso negado') {
                    return { status: 'ACCESS_DENIED', data: message };
                } else {
                    return { status: 'UNKNOWN', data: message || backendError || 'Erro desconhecido' };
                }
            }

            return { status: 'UNKNOWN', data: error.message || 'Erro de conexão'};
        }
    } 
}
