import { type NextRequest, NextResponse } from "next/server"
import { UserController } from "@/controllers/userController"

export async function POST(request: NextRequest) {
  try {
    console.log("🎤 Start recording request received")

    const { userId, meetingName } = await request.json()

    // Validation
    if (!userId || !meetingName) {
      return NextResponse.json({ success: false, error: "User ID and meeting name are required" }, { status: 400 })
    }

    // Verify user exists
    const user = await UserController.getUserById(userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Generate a session ID for this recording
    const sessionId = `recording_${userId}_${Date.now()}`

    console.log("✅ Recording session started:", sessionId)

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        meetingName,
        userId,
        startTime: new Date().toISOString(),
      },
      message: "Recording session started successfully",
    })
  } catch (error) {
    console.error("❌ Start recording error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to start recording",
      },
      { status: 500 },
    )
  }
}
