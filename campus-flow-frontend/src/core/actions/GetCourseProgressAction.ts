/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { API_BASE_URL } from "../../Config"
import { getToken } from "../lib/utils/tokenValidation"

export type GetCourseProgressActionOutput = {
  status: GetCourseProgressStatus
  data: any
}

export type GetCourseProgressStatus =
  | "SUCCESS"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "COURSE_NOT_ENROLLED"
  | "UNKNOWN"

export class GetCourseProgressAction {
  static async execute(courseId: string): Promise<GetCourseProgressActionOutput> {
    const token = getToken()

    try {
      const response = await axios.get(
        `${API_BASE_URL}/progress/course/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      if (message === "Progresso não encontrado") {
        return {
          status: "COURSE_NOT_ENROLLED",
          data: message,
        }
      }
      return {
        status: "UNKNOWN",
        data: message || error.message || "Erro desconhecido",
      }
    }
  }
}
