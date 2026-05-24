import { AuthContext } from "@/core/components/providers/AuthProvider"
import { useContext } from "react"

export const useAuth = () => {
    return useContext(AuthContext)
}