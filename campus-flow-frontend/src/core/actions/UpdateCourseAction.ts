/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL } from "../../Config";
import { getToken } from "../lib/utils/tokenValidation";

export type UpdateCourseActionInput = {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  thumbnail?: string;
  banner?: string;
  level?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  hasCertificate?: boolean;
};

export type UpdateCourseActionOutput = {
  status: UpdateCourseStatus;
  data: any;
};

export type UpdateCourseStatus =
  | "SUCCESS"
  | "NOT_FOUND"
  | "ACCESS_DENIED"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "UNKNOWN";

export class UpdateCourseAction {
  static async execute(
    input: UpdateCourseActionInput,
    courseId: string
  ): Promise<UpdateCourseActionOutput> {
    try {
      const token = getToken()
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await axios.patch(
        `${API_BASE_URL}/courses/${courseId}`,
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

      return { status: "NOT_FOUND", data: message };
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