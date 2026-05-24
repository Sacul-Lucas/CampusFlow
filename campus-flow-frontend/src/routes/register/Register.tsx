import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner"
import { z } from "zod";
import type { formSchema } from "@/core/lib/utils/userFormSchema";
import { RegisterUserAction } from "@/core/actions/RegisterUserAction";
import { AuthForm } from "@/core/components/forms/AuthForm";
import { DefineApp } from "@/core/components/utils/DefineApp";
import campusFlowLogo from "@/assets/img/CampusFlowLogo.png"
import { UserCircle } from "lucide-react";

export const Register = () => {
    const navigate = useNavigate()

    const handleSubmit = async (authValues: z.infer<typeof formSchema>) => {
        const { username, email, password, role } = authValues;
        
        const registerRes = await RegisterUserAction.execute({ username, email, password, role });
        const message = registerRes.data;
        
        switch (registerRes.status) {
            case "SUCCESS":
                toast.success(message, {
                    duration: 1500,
                    className: "!bg-emerald-700 !border-emerald-800 !text-white"
                });
            setTimeout(() => navigate("/Login"), 1500);
            break;
            
            case "EMAIL_ALREADY_EXISTS":
            case "UNKNOWN":
                toast.error(message, {
                    className: "!bg-red-700 !border-red-800 !text-white"
                });
            break;
            
            default:
                toast.error("Não foi possível criar a conta no momento. Tente novamente mais tarde.", {
                    className: "!bg-red-700 !border-red-800 !text-white"
                });
            break;
        }
    };

    return (
        <DefineApp
            appTitle="CampusFlow - Cadastro"
            bodyStyle="flex w-full min-h-dvh bg-[radial-gradient(circle_at_50%_75%,#002D8E,#000D28)] from-slate-900 to-blue-900" 
            lucideIcon={UserCircle}
        >
            <img
              className="lg:max-w-[21%]! sm:max-w-[30%]! sm:block! xsm:hidden! ml-4 mt-2 absolute"
              src={campusFlowLogo}
            />

            <div className="flex w-full justify-center items-center">
                <AuthForm formType="Register" formAction={handleSubmit} formMethod="POST" />
            </div>

            <Toaster position="bottom-left"/>
        </DefineApp>
    );
};
