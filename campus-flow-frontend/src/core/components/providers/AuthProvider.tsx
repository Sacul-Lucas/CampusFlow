/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { decodeToken } from "@/core/lib/utils/tokenValidation"
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface AuthContextData {
  role: string | null
  username: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const decoded = decodeToken(token)
    if (!decoded) return

    setRole(decoded.role)
    setUsername(decoded.username)
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token)

    const decoded = decodeToken(token)
    if (!decoded) return

    setRole(decoded.role)
    setUsername(decoded.username)
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/Login")
    setRole(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        username,
        isAuthenticated: !!role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
