import { type NextRequest, NextResponse } from "next/server"
import { UserController } from "@/controllers/userController"

export async function GET(request: NextRequest) {
  try {
    const users = await UserController.getAllUsers()
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error("API Error - GET /api/users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const user = await UserController.createUser(userData)
    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    console.error("API Error - POST /api/users:", error)
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
