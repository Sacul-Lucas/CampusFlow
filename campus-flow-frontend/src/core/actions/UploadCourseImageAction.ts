/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import { API_BASE_URL } from "../../Config"
import { getToken } from "../lib/utils/tokenValidation"

export type UploadCourseImageActionInput = {
  courseId: string
  file: File
  type: "thumbnail" | "banner"
}

export type UploadCourseImageActionOutput = {
  status: UploadCourseImageStatus
  data: any
}

export type UploadCourseImageStatus =
  | "SUCCESS"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "ACCESS_DENIED"
  | "UNKNOWN"

export class UploadCourseImageAction {
  static async execute(
    input: UploadCourseImageActionInput,
  ): Promise<UploadCourseImageActionOutput> {
    try {
      const token = getToken()
      const headers: Record<string, string> = {}
      if (token) headers.Authorization = `Bearer ${token}`

      const formData = new FormData()
      formData.append("file", input.file)
      formData.append("courseId", input.courseId)

      const endpoint =
        input.type === "thumbnail"
          ? `${API_BASE_URL}/upload/course-thumbnail`
          : `${API_BASE_URL}/upload/course-banner`

      const response = await axios.post(endpoint, formData, {
        headers,
        withCredentials: true,
      })

      const { url, message } = response.data
      if (url) {
        return {
          status: "SUCCESS",
          data: url,
        }
      }

      return {
        status: "UNKNOWN",
        data: message || "Falha ao enviar imagem do curso",
      }
    } catch (error: any) {
      const message = error?.response?.data?.message
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
