import { z } from "zod"
import { AdminUserRole, UserRole } from "./userRole";

export const passwordValidation = z
    .string()
    .min(8, {
      message: "A senha deve possuir ao menos 8 caracteres",
    })
    .regex(/[a-z]/, {
      message: "A senha deve conter pelo menos uma letra minúscula",
    })
    .regex(/[A-Z]/, {
      message: "A senha deve conter pelo menos uma letra maiúscula",
    })
    .regex(/[0-9]/, {
      message: "A senha deve conter pelo menos um número",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "A senha deve conter pelo menos um caractere especial",
    });

export const loginSchema = z.object({
  email: z
    .string()
    .email("O email inserido é inválido")
    .min(12, {
      message: "Email deve possuir ao menos 12 caracteres",
    }),

  password: passwordValidation,
});

export const formSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: "Nome de usuário deve possuir ao menos 2 caracteres",
      })
      .max(50, {
        message: "Nome de usuário não pode ter mais de 50 caracteres",
      }),

    email: z
      .email("O email inserido é inválido")
      .min(12, {
        message: "Email deve possuir ao menos 12 caracteres",
      }),

    password: passwordValidation,

    confirmPassword: z.string().optional().or(z.literal("")),

    role: z
      .enum([UserRole.Student, UserRole.Teacher])
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

export const adminFormSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: "Nome de usuário deve possuir ao menos 2 caracteres",
      })
      .max(50, {
        message: "Nome de usuário não pode ter mais de 50 caracteres",
      }),

    email: z
      .email("O email inserido é inválido")
      .min(12, {
        message: "Email deve possuir ao menos 12 caracteres",
      }),

    password: passwordValidation,

    role: z
      .enum([AdminUserRole.Student, AdminUserRole.Teacher, AdminUserRole.Administrator])
})