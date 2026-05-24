/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL } from "../../Config";
import { getToken } from "../lib/utils/tokenValidation";

export type DeleteCourseActionOutput = {
  status: DeleteCourseStatus;
  data: any;
};

export type DeleteCourseStatus =
  | "SUCCESS"
  | "NOT_FOUND"
  | "ACCESS_DENIED"
  | "TOKEN_NOT_FOUND"
  | "INVALID_TOKEN"
  | "UNKNOWN";

const token = getToken();

export class DeleteCourseAction {
  static async execute(courseId: string): Promise<DeleteCourseActionOutput> {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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