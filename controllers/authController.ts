import { cookies } from "next/headers"
import { UserController } from "./userController"
import User, { type IUser } from "@/models/User"
import connectDB from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export class AuthController {
  static readonly SESSION_COOKIE_NAME = "session-token"
  static readonly USER_COOKIE_NAME = "user-data"

  // Authenticate user with email and password
  static async authenticateUser(email: string, password: string): Promise<IUser | null> {
    await connectDB()
    try {
      const user = await User.findOne({ email })
      if (!user) {
        console.log("❌ User not found for email:", email)
        return null
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        console.log("❌ Invalid password for email:", email)
        return null
      }

      console.log("✅ User authenticated successfully:", email)
      // Return user without password
      const { password: _, ...userWithoutPassword } = user.toObject()
      return userWithoutPassword as IUser
    } catch (error) {
      console.error("❌ Error authenticating user:", error)
      throw new Error("Failed to authenticate user")
    }
  }

  // Set session after successful login
  static async setSession(user: IUser) {
    const sessionToken = this.generateSessionToken(user._id)

    // Set cookies
    const cookieStore = await cookies()

    cookieStore.set(this.SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    cookieStore.set(this.USER_COOKIE_NAME, JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })
  }

  // Get current session
  static async getSession(): Promise<string | null> {
    try {
      const cookieStore = await cookies()
      return cookieStore.get(this.SESSION_COOKIE_NAME)?.value || null
    } catch {
      return null
    }
  }

  // Get current user from session
  static async getCurrentUser(): Promise<IUser | null> {
    try {
      const cookieStore = await cookies()
      const userCookie = cookieStore.get(this.USER_COOKIE_NAME)?.value
      if (userCookie) {
        return JSON.parse(userCookie)
      }
      return null
    } catch {
      return null
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return !!session
  }

  // Clear session (logout)
  static async clearSession() {
    const cookieStore = await cookies()
    cookieStore.delete(this.SESSION_COOKIE_NAME)
    cookieStore.delete(this.USER_COOKIE_NAME)
  }

  // Generate session token
  private static generateSessionToken(userId: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    return `${userId}-${timestamp}-${random}`
  }

  // Validate session token
  static validateSession(token: string): boolean {
    if (!token) return false

    const parts = token.split("-")
    if (parts.length !== 3) return false

    const timestamp = Number.parseInt(parts[1])
    const now = Date.now()
    const thirtyDays = 30 * 24 * 60 * 60 * 1000

    // Check if token is not older than 30 days
    return now - timestamp < thirtyDays
  }

  // Get user ID from session token
  static getUserIdFromToken(token: string): string | null {
    if (!this.validateSession(token)) return null
    return token.split("-")[0]
  }

  // Verify session and get current user
  static async verifySession(): Promise<IUser | null> {
    const session = await this.getSession()
    if (!session) return null

    const userId = this.getUserIdFromToken(session)
    if (!userId) return null

    try {
      return await UserController.getUserById(userId)
    } catch (error) {
      console.error("Error verifying session:", error)
      return null
    }
  }
}
