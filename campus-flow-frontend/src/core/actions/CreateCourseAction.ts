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

const token = getToken();

export class CreateCourseAction {
  static async execute(
    input: CreateCourseActionInput
  ): Promise<CreateCourseActionOutput> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/courses`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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