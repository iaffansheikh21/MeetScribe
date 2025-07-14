import mongoose, { type Document, Schema } from "mongoose"

export interface IUserStats {
  totalMeetings: number
  hoursRecorded: number
  participants: number
  transcriptions: number
  changeFromLastMonth: {
    meetings: number
    hours: number
    participants: number
    transcriptions: number
  }
}

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  avatar?: string
  stats: IUserStats
  createdAt: Date
  updatedAt: Date
}

const UserStatsSchema = new Schema({
  totalMeetings: { type: Number, default: 0 },
  hoursRecorded: { type: Number, default: 0 },
  participants: { type: Number, default: 0 },
  transcriptions: { type: Number, default: 0 },
  changeFromLastMonth: {
    meetings: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
    participants: { type: Number, default: 0 },
    transcriptions: { type: Number, default: 0 },
  },
})

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    stats: { type: UserStatsSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
