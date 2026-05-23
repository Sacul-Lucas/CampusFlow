import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner"
import { z } from "zod";
import type { formSchema } from "@/core/lib/utils/userFormSchema";
import { AuthUserAction } from "@/core/actions/AuthUserAction";
import { AuthForm } from "@/core/components/forms/AuthForm";
import { DefineApp } from "@/core/components/utils/DefineApp";
import campusFlowLogo from "@/assets/img/CampusFlowLogo.png"
import appAuthIcon from "@/assets/icons/user-auth.svg";

export const Login = () => {
    const navigate = useNavigate()

    const handleSubmit = async (authValues: z.infer<typeof formSchema>) => {
        const { email, password, role } = authValues;
        
        const authRes = await AuthUserAction.execute({ email, password, role });
        const message = authRes.data;
        
        switch (authRes.status) {
            case "SUCCESS":
                localStorage.setItem("token", authRes.token.access_token);
                toast.success(message, {
                    duration: 1500,
                    className: "!bg-emerald-700 !border-emerald-800 !text-white"
                });
                setTimeout(() => navigate("/Dashboard"), 1500);
            break;
            
            case "EMAIL_NOT_FOUND":
            case "INVALID_PASSWORD":
            case "UNKNOWN":
                toast.error(message, {
                    className: "!bg-red-700 !border-red-800 !text-white !align-middle"
                });
            break;
            
            default:
                toast.error("Não foi possível fazer login no momento. Tente novamente mais tarde.", {
                    className: "!bg-red-700 !border-red-800 !text-white"
                });
            break;
        }
    };

    return (
        <DefineApp
            appTitle="CampusFlow - Login"
            appIcon={appAuthIcon}
            bodyStyle="flex w-full min-h-dvh bg-[radial-gradient(circle_at_50%_75%,#002D8E,#000D28)] from-slate-900 to-blue-900" 
        >
            <img
              className="lg:max-w-[21%]! sm:max-w-[45%]! absolute"
              src={campusFlowLogo}
            />

            <div className="flex w-full justify-center items-center">
                <AuthForm formType="Login" formAction={handleSubmit} formMethod="POST" />
            </div>

            <Toaster position="bottom-left"/>
        </DefineApp>
    );
};
