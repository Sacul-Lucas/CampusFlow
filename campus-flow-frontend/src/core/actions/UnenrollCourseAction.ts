/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { API_BASE_URL } from "../../Config"
import { getToken } from "../lib/utils/tokenValidation"

export type UnenrollCourseActionOutput = {
  status: UnenrollCourseStatus
  data: any
}

export type UnenrollCourseStatus =
  | "SUCCESS"
  | "COURSE_NOT_FOUND"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "ACCESS_DENIED"
  | "UNKNOWN"

export class UnenrollCourseAction {
  static async execute(courseId: string): Promise<UnenrollCourseActionOutput> {
    const token = getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (token) headers.Authorization = `Bearer ${token}`

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/courses/${courseId}/enroll`,
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
      if (message === "Curso não encontrado") {
        return { status: "COURSE_NOT_FOUND", data: message }
      }
      if (message === "Token não fornecido") {
        return { status: "TOKEN_NOT_FOUND", data: message }
      }
      if (message === "Token inválido") {
        return { status: "INVALID_TOKEN", data: message }
      }
      if (message === "Acesso negado") {
        return { status: "ACCESS_DENIED", data: message }
      }
      return {
        status: "UNKNOWN",
        data: message || error.message || "Erro desconhecido",
      }
    }
  }
}
