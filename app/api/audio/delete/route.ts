import { type NextRequest, NextResponse } from "next/server"
import { MeetingController } from "@/controllers/meetingController"
import CloudinaryService from "@/lib/cloudinary"

export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ Delete audio request received")

    const { meetingId, userId } = await request.json()

    // Validation
    if (!meetingId || !userId) {
      return NextResponse.json({ success: false, error: "Meeting ID and user ID are required" }, { status: 400 })
    }

    // Get meeting to verify ownership and get audio URL
    const meeting = await MeetingController.getMeetingById(meetingId)
    if (!meeting) {
      return NextResponse.json({ success: false, error: "Meeting not found" }, { status: 404 })
    }

    // Verify user owns this meeting
    if (meeting.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - you can only delete your own meetings" },
        { status: 403 },
      )
    }

    // Extract Cloudinary public ID from URL
    if (meeting.audioUrl) {
      try {
        const urlParts = meeting.audioUrl.split("/")
        const fileWithExtension = urlParts[urlParts.length - 1]
        const publicId = `meetscribe/audio/${userId}/${fileWithExtension.split(".")[0]}`

        // Delete from Cloudinary
        await CloudinaryService.deleteAudio(publicId)
        console.log("✅ Audio deleted from Cloudinary")
      } catch (error) {
        console.warn("⚠️ Failed to delete from Cloudinary:", error)
        // Continue with meeting deletion even if Cloudinary deletion fails
      }
    }

    // Delete meeting from database
    const deleted = await MeetingController.deleteMeeting(meetingId)
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Failed to delete meeting" }, { status: 500 })
    }

    console.log("✅ Meeting deleted successfully:", meetingId)

    return NextResponse.json({
      success: true,
      message: "Audio and meeting deleted successfully",
    })
  } catch (error) {
    console.error("❌ Delete audio error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete audio",
      },
      { status: 500 },
    )
  }
}
