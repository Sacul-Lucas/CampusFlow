/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { API_BASE_URL } from "../../Config"
import { getToken } from "../lib/utils/tokenValidation"

export type GetFeaturedCoursesActionOutput = {
  status: GetFeaturedCoursesStatus
  data: any
}

export type GetFeaturedCoursesStatus =
  | "SUCCESS"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "UNKNOWN"

export class GetFeaturedCoursesAction {
  static async execute(): Promise<GetFeaturedCoursesActionOutput> {
    try {
      const token = getToken()
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await axios.get(
        `${API_BASE_URL}/courses/featured`,
        {
          headers,
          withCredentials: true,
        },
      )

      const { success, message } = response.data
      if (success) {
        return {
          status: "SUCCESS",
          data: message,
        }
      }

      return {
        status: "UNKNOWN",
        data: message || "Erro desconhecido",
      }
    } catch (error: any) {
      const message = error?.response?.data?.message
      if (message === "Token não fornecido") {
        return { status: "TOKEN_NOT_FOUND", data: message }
      }
      if (message === "Token inválido") {
        return { status: "INVALID_TOKEN", data: message }
      }
      return {
        status: "UNKNOWN",
        data: message || error.message || "Erro desconhecido",
      }
    }
  }
}
