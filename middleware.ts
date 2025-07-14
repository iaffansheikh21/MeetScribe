import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define protected routes
  const isProtectedRoute = path.startsWith("/dashboard")
  const isAuthRoute = path.startsWith("/auth")

  // Get the session token from cookies
  const sessionToken = request.cookies.get("session-token")?.value

  // Simple session validation (without database calls)
  const isAuthenticated = sessionToken && validateSessionToken(sessionToken)

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/auth/sign-in", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    const redirectUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Simple token validation without database calls
function validateSessionToken(token: string): boolean {
  if (!token) return false

  const parts = token.split("-")
  if (parts.length !== 3) return false

  const timestamp = Number.parseInt(parts[1])
  if (isNaN(timestamp)) return false

  const now = Date.now()
  const thirtyDays = 30 * 24 * 60 * 60 * 1000

  // Check if token is not older than 30 days
  return now - timestamp < thirtyDays
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
