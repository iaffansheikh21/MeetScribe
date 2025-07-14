import { NextResponse } from "next/server"
import { AuthController } from "@/controllers/authController"

export async function POST() {
  try {
    await AuthController.clearSession()
    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
