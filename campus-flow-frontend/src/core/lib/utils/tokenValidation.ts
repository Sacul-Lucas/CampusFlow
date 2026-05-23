import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  sub: string
  email: string
  username: string
  role: string
  exp?: number
}

export function getToken(): string | null {
  return localStorage.getItem("token")
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false
  return !!decodeToken(token)
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true

  const decoded = decodeToken(token)
  if (!decoded?.exp) return false

  const now = Date.now() / 1000
  return decoded.exp < now
}

export function getUserFromToken() {
  const token = getToken()
  if (!token) return null

  const decoded = decodeToken(token)
  if (!decoded) return null

  return {
    username: decoded.username,
    role: decoded.role,
  }
}



