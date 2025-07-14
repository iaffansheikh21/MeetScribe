import { type NextRequest, NextResponse } from "next/server"
import { UserController } from "@/controllers/userController"

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const user = await UserController.getUserById(params.id)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("API Error - GET /api/users/[id]:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const updates = await request.json()
    const user = await UserController.updateUser(params.id, updates)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("API Error - PUT /api/users/[id]:", error)
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const success = await UserController.deleteUser(params.id)
    if (!success) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("API Error - DELETE /api/users/[id]:", error)
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}
