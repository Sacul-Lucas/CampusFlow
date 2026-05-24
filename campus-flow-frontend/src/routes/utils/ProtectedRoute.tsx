import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "@/core/lib/utils/tokenValidation";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
}) => {
    const token = getToken();
    
    if (!token) {
      return <Navigate to="/Login" replace />;
    }
  
    return children;
};