/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL } from "../../Config";
import { getToken } from "../lib/utils/tokenValidation";

export type CreateCourseActionInput = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail?: string;
  banner?: string;
  level?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  hasCertificate?: boolean;
  teacher?: string;
};

export type CreateCourseActionOutput = {
  status: CreateCourseStatus;
  data: any;
};

export type CreateCourseStatus =
  | "SUCCESS"
  | "ACCESS_DENIED"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "UNKNOWN";

export class CreateCourseAction {
  static async execute(
    input: CreateCourseActionInput
  ): Promise<CreateCourseActionOutput> {
    try {
      const token = getToken()
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await axios.post(
        `${API_BASE_URL}/courses`,
        input,
        {
          headers,
          withCredentials: true,
        }
      );

      const { success, message } = response.data;

      if (success) {
        return { status: "SUCCESS", data: message };
      }

      return { status: "UNKNOWN", data: message };
    } catch (error: any) {
      const message = error?.response?.data?.message;

      if (message === "Token não fornecido") {
        return { status: "TOKEN_NOT_FOUND", data: message };
      }

      if (message === "Token inválido") {
        return { status: "INVALID_TOKEN", data: message };
      }

      if (message === "Acesso negado") {
        return { status: "ACCESS_DENIED", data: message };
      }

      return {
        status: "UNKNOWN",
        data: message || error.message || "Erro desconhecido",
      };
    }
  }
}