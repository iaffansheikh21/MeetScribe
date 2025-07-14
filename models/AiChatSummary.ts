import mongoose, { type Document, Schema } from "mongoose"

export interface IChatMessage {
  sender: "user" | "ai"
  text: string
  timestamp: Date
}

export interface IAiChatSummary extends Document {
  _id: string
  meetingId: mongoose.Types.ObjectId
  aiChat: IChatMessage[]
  summary?: {
    keyPoints: string[]
    actionItems: Array<{
      assignee: string
      task: string
      dueDate: string
    }>
    decisions: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const ChatMessageSchema = new Schema({
  sender: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

const AiChatSummarySchema = new Schema(
  {
    meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", required: true },
    aiChat: [ChatMessageSchema],
    summary: {
      keyPoints: [String],
      actionItems: [
        {
          assignee: String,
          task: String,
          dueDate: String,
        },
      ],
      decisions: [String],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.AiChatSummary || mongoose.model<IAiChatSummary>("AiChatSummary", AiChatSummarySchema)
