import { type NextRequest, NextResponse } from "next/server"
import { embeddingService } from "@/lib/embedding-service"

export async function GET(request: NextRequest, { params }: { params: { meetingId: string } }) {
  try {
    const { meetingId } = params

    if (!meetingId) {
      return NextResponse.json({ success: false, error: "Meeting ID is required" }, { status: 400 })
    }

    console.log(`📊 Generating AI summary for meeting ${meetingId}`)

    // Generate meeting summary
    const summary = await embeddingService.generateMeetingSummary(meetingId)

    // Extract action items
    const actionItems = await embeddingService.extractActionItems(meetingId)

    return NextResponse.json({
      success: true,
      data: {
        summary,
        actionItems,
      },
    })
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate AI summary",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { meetingId: string } }) {
  try {
    const { meetingId } = params
    const { type } = await request.json()

    if (!meetingId) {
      return NextResponse.json({ success: false, error: "Meeting ID is required" }, { status: 400 })
    }

    if (type === "regenerate") {
      console.log(`🔄 Regenerating AI summary for meeting ${meetingId}`)

      // Generate fresh summary
      const summary = await embeddingService.generateMeetingSummary(meetingId)
      const actionItems = await embeddingService.extractActionItems(meetingId)

      return NextResponse.json({
        success: true,
        data: {
          summary,
          actionItems,
        },
      })
    }

    return NextResponse.json({ success: false, error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("Error processing AI summary request:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process AI summary request",
      },
      { status: 500 },
    )
  }
}
