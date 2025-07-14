import { type NextRequest, NextResponse } from "next/server"
import { MeetingController } from "@/controllers/meetingController"

export async function GET(request: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const userId = params.userId

    // Get all meetings for the user
    const meetings = await MeetingController.getMeetingsByUserId(userId)

    // Calculate statistics
    const totalMeetings = meetings.length
    const hoursRecorded = meetings.reduce((total, meeting) => total + (meeting.duration || 0), 0) / 60
    const participants = meetings.reduce((total, meeting) => total + (meeting.participants?.length || 0), 0)
    const transcriptions = meetings.filter((meeting) => meeting.transcriptionAvailable).length

    // Calculate last month's data (simplified - you can make this more sophisticated)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const lastMonthMeetings = meetings.filter((meeting) => new Date(meeting.date) >= lastMonth)
    const changeFromLastMonth = {
      meetings: lastMonthMeetings.length,
      hours: lastMonthMeetings.reduce((total, meeting) => total + (meeting.duration || 0), 0) / 60,
      participants: lastMonthMeetings.reduce((total, meeting) => total + (meeting.participants?.length || 0), 0),
      transcriptions: lastMonthMeetings.filter((meeting) => meeting.transcriptionAvailable).length,
    }

    const stats = {
      totalMeetings,
      hoursRecorded: Math.round(hoursRecorded * 100) / 100,
      participants,
      transcriptions,
      changeFromLastMonth,
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("API Error - GET /api/stats/[userId]:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
