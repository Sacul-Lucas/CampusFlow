/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
import { Button } from "../shadcnComponents/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../shadcnComponents/ui/card"
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldSeparator } from "../shadcnComponents/ui/field"
import { Input } from "../shadcnComponents/ui/input"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { formSchema, loginSchema } from "@/core/lib/utils/userFormSchema"
import { Link } from "react-router-dom"
import { UserRole } from "@/core/lib/utils/userRole"
import { FaGoogle } from "react-icons/fa";
import {
  Eye,
  EyeClosed
} from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../shadcnComponents/ui/select"

interface AuthFormProps {
    formAction: SubmitHandler<any>;
    formType: string;
    formMethod: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
    formAction,
    formType,
    formMethod,
}) => {
    const isRegister = formType === "Register"
    const schema = isRegister ? formSchema : loginSchema

    const form = useForm<any>({
        resolver: zodResolver(schema),
        defaultValues: isRegister ? {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: UserRole.Student,
        } : {
            email: "",
            password: "",
        },
    })

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Card className="lg:w-[40dvw]! w-[70dvw] bg-black/20 border-white/10 backdrop-blur-md">
            <CardHeader>
                <CardTitle>{formType === "Register" ? 'Crie sua conta' : 'Entrar'}</CardTitle>
                <CardDescription>
                    {formType === "Register" ? 
                        'Insira suas informações abaixo para criar sua conta' 
                    :   'Insira seus dados de cadastro para entrar'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(formAction)} method={formMethod}>
                    <FieldGroup>
                        {formType === "Register" ? (
                            <Field>
                                <FieldLabel htmlFor="name">Nome de usuário</FieldLabel>
                                <Input
                                  id="name"
                                  type="text"
                                  placeholder="John Doe"
                                  {...form.register("username")}
                                  required
                                />
                                {form.formState.errors.username && (
                                    <FieldDescription className="text-red-400">
                                        {String(form.formState.errors.username.message)}
                                    </FieldDescription>
                                )}
                                </Field>
                        ):(
                            <></>
                        )}

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="me@example.com"
                                {...form.register("email")}
                                required
                            />
                            {form.formState.errors.email && (
                                <FieldDescription className="text-red-400">
                                    {String(form.formState.errors.email.message)}
                                </FieldDescription>
                            )}
                            <FieldDescription>
                                {formType === "Register" ? 
                                    'Usaremos isso para contato. Nunca compartilharemos seu email com alguém'
                                :   'Email usado no momento de cadastro de conta'
                                }
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Senha</FieldLabel>
                            <div className="relative">
                                <Input 
                                    id="password" 
                                    type={showPassword ? "text" : "password"} 
                                    {...form.register("password")}
                                    required 
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 hover:text-black cursor-pointer"
                                >
                                    {showPassword ? <Eye /> : <EyeClosed />}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <FieldDescription className="text-red-400">
                                    {String(form.formState.errors.password.message)}
                                </FieldDescription>
                            )}
                            <FieldDescription>
                                Deve possuir ao menos 8 caracteres.
                            </FieldDescription>
                        </Field>
                        {formType === 'Register' ? (
                            <Field>
                                <FieldLabel htmlFor="confirm-password">
                                    Confirmar senha
                                </FieldLabel>

                                <Input 
                                    id="confirm-password" 
                                    type="password" 
                                    {...form.register("confirmPassword")}
                                    required 
                                />
                                {form.formState.errors.confirmPassword && (
                                    <FieldDescription className="text-red-400">
                                        {String(form.formState.errors.confirmPassword.message)}
                                    </FieldDescription>
                                )}
                                <FieldDescription>Confirme sua senha, por favor.</FieldDescription>
                            </Field>    
                        ) : <></>}
                        {formType === "Register" ? (
                            <Field>
                                <FieldLabel htmlFor="role">
                                    Tipo de usuário
                                </FieldLabel>
                                <Select
                                    onValueChange={(value) => form.setValue("role", value as UserRole)}
                                    value={form.watch("role")}
                                >
                                    <SelectTrigger className="w-md">
                                        <SelectValue id="role" placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value={UserRole.Student}>Aluno</SelectItem>
                                            <SelectItem value={UserRole.Teacher}>Professor</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.role && (
                                  <FieldDescription className="text-red-400">
                                    {String(form.formState.errors.role.message)}
                                  </FieldDescription>
                                )}
                                <FieldDescription>Confirme sua senha, por favor.</FieldDescription>
                            </Field>
                        ) : <></>}

                        <FieldGroup>
                            <Field>
                                <div className="flex flex-col gap-6">
                                    <Button type="submit" className="cursor-pointer">{formType === 'Register' ? 'Criar conta' : 'Entrar'}</Button>
                                    <FieldSeparator></FieldSeparator>
                                    <Button variant="outline" type="button" className="cursor-pointer">
                                        <FaGoogle />
                                        Entrar com google
                                    </Button>
                                    <FieldDescription className="px-6 text-center">
                                        {formType === 'Register' ? (
                                            <span>Já possui uma conta? <Link to="/Login" className="no-underline hover:underline cursor-pointer text-blue-700">Entrar</Link></span>

                                        ) : (
                                            <span>Ainda não tem uma conta? <Link to="/Register" className="no-underline hover:underline cursor-pointer text-blue-700">Cadastre-se</Link></span>
                                        )}
                                    </FieldDescription>
                                </div>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}