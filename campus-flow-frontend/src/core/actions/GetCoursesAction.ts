/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios"

import { API_BASE_URL } from "../../Config"

import { getToken } from "../lib/utils/tokenValidation"

export type GetCoursesActionOutput = {
  status: GetCoursesStatus
  data: any
}

export type GetCoursesStatus =
  | "SUCCESS"
  | "COURSE_NOT_FOUND"
  | "ACCESS_DENIED"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "UNKNOWN"

const token = getToken()

export class GetCoursesAction {
  static async execute(): Promise<GetCoursesActionOutput> {
    try {

      const response = await axios.get(
        `${API_BASE_URL}/courses`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true,
        }
      )

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

      if (
        error.response &&
        error.response.data
      ) {

        const {
          message,
          error: backendError,
        } = error.response.data

        if (message === "Token não fornecido") {
          return {
            status: "TOKEN_NOT_FOUND",
            data: message,
          }
        }

        if (message === "Token inválido") {
          return {
            status: "INVALID_TOKEN",
            data: message,
          }
        }

        if (message === "Acesso negado") {
          return {
            status: "ACCESS_DENIED",
            data: message,
          }
        }

        return {
          status: "UNKNOWN",
          data:
            message ||
            backendError ||
            "Erro desconhecido",
        }
      }

      return {
        status: "UNKNOWN",
        data:
          error.message ||
          "Erro de conexão",
      }
    }
  }
}