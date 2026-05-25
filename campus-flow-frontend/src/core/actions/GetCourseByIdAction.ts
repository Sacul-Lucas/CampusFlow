/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { API_BASE_URL } from "../../Config"
import { getToken } from "../lib/utils/tokenValidation"

export type GetCourseByIdActionOutput = {
  status: GetCourseByIdStatus
  data: any
}

export type GetCourseByIdStatus =
  | "SUCCESS"
  | "COURSE_NOT_FOUND"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "UNKNOWN"

export class GetCourseByIdAction {
  static async execute(courseId: string): Promise<GetCourseByIdActionOutput> {
    const token = getToken()

    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      })

      const { success, message } = response.data
      if (success) {
        return {
          status: "SUCCESS",
          data: message,
        }
      }

      return {
        status: "COURSE_NOT_FOUND",
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
      return {
        status: "UNKNOWN",
        data: message || error.message || "Erro desconhecido",
      }
    }
  }
}
