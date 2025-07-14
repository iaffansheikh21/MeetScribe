import { type NextRequest, NextResponse } from "next/server";
import { MeetingController } from "@/controllers/meetingController";
import { UserController } from "@/controllers/userController";
import CloudinaryService from "@/lib/cloudinary";
import { AuthController } from "@/controllers/authController";

export async function POST(request: NextRequest) {
  try {
    console.log("🛑 Stop recording request received");

    // Check authentication
    const user = await AuthController.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { audioBlob, meetingName, userId, participants, recordingDuration } =
      body;

    // Validation
    if (!audioBlob || !meetingName || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Audio data, meeting name, and user ID are required",
        },
        { status: 400 }
      );
    }

    // Verify user exists and matches authenticated user
    const targetUser = await UserController.getUserById(userId);
    if (!targetUser || targetUser._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, error: "User not found or unauthorized" },
        { status: 404 }
      );
    }

    console.log("📝 Recording details:", {
      meetingName,
      userId,
      recordingDuration,
      participantsCount: participants?.length || 0,
    });

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audioBlob, "base64");

    // Upload to Cloudinary
    const uploadResult = await CloudinaryService.uploadAudio(
      audioBuffer,
      meetingName.replace(/[^a-zA-Z0-9]/g, "-"),
      userId
    );

    console.log("☁️ Cloudinary upload result:", {
      duration: uploadResult.duration,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });

    // Handle participants
    let participantsList: string[] = [];
    if (
      participants &&
      Array.isArray(participants) &&
      participants.length > 0
    ) {
      participantsList = participants;
    } else {
      // Default to 2 participants if none provided
      participantsList = ["Participant 1", "Participant 2"];
    }

    // Calculate duration - use Cloudinary duration if available, otherwise use recordingDuration, fallback to 1 minute
    let durationInMinutes = 1;
    if (uploadResult.duration) {
      durationInMinutes = Math.round(uploadResult.duration / 60);
    } else if (recordingDuration) {
      durationInMinutes = Math.round(recordingDuration / 60);
    }

    console.log("⏱️ Final duration calculation:", {
      cloudinaryDuration: uploadResult.duration,
      recordingDuration: recordingDuration,
      finalMinutes: durationInMinutes,
    });

    // Create meeting record
    const meetingData = {
      userId: userId,
      title: meetingName,
      date: new Date(),
      duration: durationInMinutes,
      participants: participantsList,
      status: "completed" as const,
      transcriptionAvailable: false,
      audioUrl: uploadResult.secure_url,
      transcript: undefined,
    };

    const meeting = await MeetingController.createMeeting(meetingData);

    console.log("✅ Meeting created successfully:", meeting._id);

    // Update user stats
    try {
      const currentStats = targetUser.stats;
      const updatedStats = {
        ...currentStats,
        totalMeetings: currentStats.totalMeetings + 1,
        hoursRecorded: currentStats.hoursRecorded + durationInMinutes / 60,
        participants: currentStats.participants + participantsList.length,
        changeFromLastMonth: {
          ...currentStats.changeFromLastMonth,
          meetings: currentStats.changeFromLastMonth.meetings + 1,
        },
      };

      await UserController.updateUser(userId, { stats: updatedStats });
      console.log("📊 User stats updated");
    } catch (error) {
      console.warn("⚠️ Failed to update user stats:", error);
    }

    return NextResponse.json({
      success: true,
      data: {
        meeting: meeting,
        audioUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        duration: uploadResult.duration || recordingDuration,
        durationMinutes: durationInMinutes,
        fileSize: uploadResult.bytes,
        participants: participantsList,
      },
      message: "Recording stopped and meeting created successfully",
    });
  } catch (error) {
    console.error("❌ Stop recording error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to stop recording",
      },
      { status: 500 }
    );
  }
}
