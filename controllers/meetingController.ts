import Meeting, { type IMeeting } from "@/models/Meeting";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export class MeetingController {
  static async getAllMeetings(): Promise<IMeeting[]> {
    await connectDB();
    try {
      const meetings = await Meeting.find({}).populate("userId", "name email");
      console.log("✅ Fetched all meetings:", meetings.length);
      return meetings;
    } catch (error) {
      console.error("❌ Error fetching meetings:", error);
      throw new Error("Failed to fetch meetings");
    }
  }

  static async getMeetingById(id: string): Promise<IMeeting | null> {
    await connectDB();
    try {
      const meeting = await Meeting.findById(id).populate(
        "userId",
        "name email"
      );
      console.log(
        "✅ Fetched meeting by ID:",
        id,
        meeting ? "Found" : "Not found"
      );
      return meeting;
    } catch (error) {
      console.error("❌ Error fetching meeting by ID:", error);
      throw new Error("Failed to fetch meeting");
    }
  }

  static async getMeetingsByUserId(userId: string): Promise<IMeeting[]> {
    await connectDB();
    try {
      const meetings = await Meeting.find({
        userId: new mongoose.Types.ObjectId(userId),
      }).sort({ date: -1 });
      console.log(
        "✅ Fetched meetings for user:",
        userId,
        "Count:",
        meetings.length
      );
      return meetings;
    } catch (error) {
      console.error("❌ Error fetching meetings by user ID:", error);
      throw new Error("Failed to fetch user meetings");
    }
  }

  static async createMeeting(
    meetingData: Partial<IMeeting>
  ): Promise<IMeeting> {
    await connectDB();
    try {
      const meeting = new Meeting(meetingData);
      const savedMeeting = await meeting.save();
      console.log("✅ Meeting created successfully:", savedMeeting._id);
      return savedMeeting;
    } catch (error) {
      console.error("❌ Error creating meeting:", error);
      throw new Error("Failed to create meeting");
    }
  }

  static async updateMeeting(
    id: string,
    updates: Partial<IMeeting>
  ): Promise<IMeeting | null> {
    await connectDB();
    try {
      const meeting = await Meeting.findById(id);
      if (!meeting) return null;

      // Manually merge updates
      Object.assign(meeting, updates);
      meeting.updatedAt = new Date();

      await meeting.save();
      return meeting;
    } catch (error) {
      console.error("❌ Error updating meeting:", error);
      throw new Error("Failed to update meeting");
    }
  }

  static async deleteMeeting(id: string): Promise<boolean> {
    await connectDB();
    try {
      const result = await Meeting.findByIdAndDelete(id);
      console.log("✅ Meeting deleted successfully:", id);
      return !!result;
    } catch (error) {
      console.error("❌ Error deleting meeting:", error);
      throw new Error("Failed to delete meeting");
    }
  }

  static async searchMeetings(
    userId: string,
    query: string
  ): Promise<IMeeting[]> {
    await connectDB();
    try {
      const searchRegex = new RegExp(query, "i");
      const meetings = await Meeting.find({
        userId: new mongoose.Types.ObjectId(userId),
        $or: [{ title: searchRegex }, { participants: { $in: [searchRegex] } }],
      }).sort({ date: -1 });

      console.log(
        "✅ Search completed for user:",
        userId,
        "Query:",
        query,
        "Results:",
        meetings.length
      );
      return meetings;
    } catch (error) {
      console.error("❌ Error searching meetings:", error);
      throw new Error("Failed to search meetings");
    }
  }
}
