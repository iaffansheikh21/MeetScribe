import mongoose, { type Document, Schema } from "mongoose"

export interface ISpeaker {
  _id: string
  name: string
  color: string
}

export interface ISegment {
  _id: string
  speakerId: string
  text: string
  startTime: number
  endTime: number
}

export interface ITranscript {
  speakers: ISpeaker[]
  segments: ISegment[]
}

export interface IMeeting extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  title: string
  date: Date
  duration: number
  participants: number | string[] // Support both number and array
  status: "completed" | "in-progress" | "scheduled" | "audioempty"
  transcriptionAvailable: boolean
  audioUrl?: string
  transcript?: ITranscript
  createdAt: Date
  updatedAt: Date
}

const SpeakerSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
})

const SegmentSchema = new Schema({
  speakerId: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
})

const TranscriptSchema = new Schema({
  speakers: [SpeakerSchema],
  segments: [SegmentSchema],
})

const MeetingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    participants: {
      type: Schema.Types.Mixed, // Allow both number and array
      default: 0,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "scheduled", "audioempty"],
      default: "scheduled",
    },
    transcriptionAvailable: { type: Boolean, default: false },
    audioUrl: { type: String },
    transcript: TranscriptSchema,
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Meeting || mongoose.model<IMeeting>("Meeting", MeetingSchema)
