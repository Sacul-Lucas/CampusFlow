import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken, getUserFromToken } from "@/core/lib/utils/tokenValidation";

interface AdminRouteProps {
    children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
    children,
}) => {
    const token = getToken()
    const tokenUserRole = getUserFromToken()?.role

    if (!token) return <Navigate to="/Login" replace />;
    
    if (tokenUserRole !== "admin") {
      return <Navigate to="/Forbidden" replace />;
    }
  
    return children;
};