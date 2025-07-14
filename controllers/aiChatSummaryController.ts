import AiChatSummary, { type IAiChatSummary, type IChatMessage } from "@/models/AiChatSummary"
import connectDB from "@/lib/mongodb"
import mongoose from "mongoose"

export class AiChatSummaryController {
  static async getAiChatSummary(meetingId: string): Promise<IAiChatSummary | null> {
    await connectDB()
    try {
      const chatSummary = await AiChatSummary.findOne({
        meetingId: new mongoose.Types.ObjectId(meetingId),
      })
      console.log("✅ Fetched AI chat summary for meeting:", meetingId, chatSummary ? "Found" : "Not found")
      return chatSummary
    } catch (error) {
      console.error("❌ Error fetching AI chat summary:", error)
      throw new Error("Failed to fetch AI chat summary")
    }
  }

  static async createOrUpdateAiChatSummary(meetingId: string, data: Partial<IAiChatSummary>): Promise<IAiChatSummary> {
    await connectDB()
    try {
      const chatSummary = await AiChatSummary.findOneAndUpdate(
        { meetingId: new mongoose.Types.ObjectId(meetingId) },
        { ...data, meetingId: new mongoose.Types.ObjectId(meetingId) },
        { upsert: true, new: true },
      )
      console.log("✅ AI chat summary created/updated for meeting:", meetingId)
      return chatSummary
    } catch (error) {
      console.error("❌ Error creating/updating AI chat summary:", error)
      throw new Error("Failed to create/update AI chat summary")
    }
  }

  static async addChatMessage(meetingId: string, message: IChatMessage): Promise<IAiChatSummary | null> {
    await connectDB()
    try {
      const chatSummary = await AiChatSummary.findOneAndUpdate(
        { meetingId: new mongoose.Types.ObjectId(meetingId) },
        {
          $push: {
            aiChat: {
              ...message,
              timestamp: new Date(),
            },
          },
        },
        { new: true, upsert: true },
      )
      console.log("✅ Chat message added for meeting:", meetingId)
      return chatSummary
    } catch (error) {
      console.error("❌ Error adding chat message:", error)
      throw new Error("Failed to add chat message")
    }
  }

  static async generateSummary(meetingId: string): Promise<any> {
    await connectDB()
    try {
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get meeting data to generate summary
      const Meeting = (await import("@/models/Meeting")).default
      const meeting = await Meeting.findById(meetingId)

      if (!meeting) {
        throw new Error("Meeting not found")
      }

      // Generate AI summary (in real app, this would call an AI service)
      const summary = {
        title: meeting.title,
        date: new Date(meeting.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        duration: `${meeting.duration} minutes`,
        participants: meeting.participants,
        keyPoints: ["Key discussion points identified", "Important decisions made", "Action items assigned"],
        actionItems: [
          {
            assignee: meeting.participants[0] || "Team Member",
            task: "Follow up on discussed items",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          },
        ],
        decisions: ["Proceed with planned approach", "Schedule follow-up meeting"],
      }

      // Save or update the summary
      const chatSummary = await this.createOrUpdateAiChatSummary(meetingId, { summary })

      console.log("✅ AI summary generated for meeting:", meetingId)
      return summary
    } catch (error) {
      console.error("❌ Error generating AI summary:", error)
      throw new Error("Failed to generate AI summary")
    }
  }
}
