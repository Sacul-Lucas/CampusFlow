/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios'

import { API_BASE_URL } from '../../Config'

import { getToken } from '../lib/utils/tokenValidation'

export interface LiveItem {
  _id: string
  title: string
  description?: string
  thumbnail?: string
  banner?: string
  liveUrl: string
  scheduledDate: string
  status: 'scheduled' | 'live' | 'finished'
  createdAt?: string
  courseId: string
  courseTitle: string
  courseThumbnail?: string
  courseCategory?: string
}

export type GetLivesActionOutput = {
  status: GetLivesStatus
  data: any
}

export type GetLivesStatus =
  | 'SUCCESS'
  | 'TOKEN_NOT_FOUND'
  | 'INVALID_TOKEN'
  | 'ACCESS_DENIED'
  | 'UNKNOWN'

export class GetLivesAction {
  static async execute(): Promise<GetLivesActionOutput> {
    try {
      const token = getToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await axios.get(
        `${API_BASE_URL}/lives`,
        {
          headers,
          withCredentials: true,
        },
      )

      const { success, message } = response.data

      if (success) {
        return {
          status: 'SUCCESS',
          data: message,
        }
      }

      return {
        status: 'UNKNOWN',
        data: message || 'Erro desconhecido',
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, error: backendError } = error.response.data

        if (message === 'Token não fornecido') {
          return {
            status: 'TOKEN_NOT_FOUND',
            data: message,
          }
        }

        if (message === 'Token inválido') {
          return {
            status: 'INVALID_TOKEN',
            data: message,
          }
        }

        if (message === 'Acesso negado') {
          return {
            status: 'ACCESS_DENIED',
            data: message,
          }
        }

        return {
          status: 'UNKNOWN',
          data: message || backendError || 'Erro desconhecido',
        }
      }

      return {
        status: 'UNKNOWN',
        data: error.message || 'Erro de conexão',
      }
    }
  }
}
