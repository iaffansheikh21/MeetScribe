import { type NextRequest, NextResponse } from "next/server"
import { MeetingController } from "@/controllers/meetingController"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const search = searchParams.get("search")

    if (userId && search) {
      const meetings = await MeetingController.searchMeetings(userId, search)
      return NextResponse.json({ success: true, data: meetings })
    } else if (userId) {
      const meetings = await MeetingController.getMeetingsByUserId(userId)
      return NextResponse.json({ success: true, data: meetings })
    } else {
      const meetings = await MeetingController.getAllMeetings()
      return NextResponse.json({ success: true, data: meetings })
    }
  } catch (error) {
    console.error("API Error - GET /api/meetings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch meetings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const meetingData = await request.json()
    const meeting = await MeetingController.createMeeting(meetingData)
    return NextResponse.json({ success: true, data: meeting }, { status: 201 })
  } catch (error) {
    console.error("API Error - POST /api/meetings:", error)
    return NextResponse.json({ success: false, error: "Failed to create meeting" }, { status: 500 })
  }
}
