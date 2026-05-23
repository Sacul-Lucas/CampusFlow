import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
}) => {
    const jwtToken = localStorage.getItem("jwtToken");
    
    if (!jwtToken) {
      return <Navigate to="/Login" replace />;
    }
  
    return children;
};