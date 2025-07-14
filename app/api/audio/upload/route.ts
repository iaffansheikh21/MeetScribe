import { type NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    // Get user ID from cookies
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("meetscribe_user");
    if (!userCookie) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userData = JSON.parse(userCookie.value);
    const userId = userData.userId;

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const meetingTitle = formData.get("title") as string;
    const participantsData = formData.get("participants") as string;
    const recordingDurationMs = formData.get("duration") as string;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
        { status: 400 }
      );
    }

    console.log("Audio upload started:", {
      fileName: audioFile.name,
      fileSize: audioFile.size,
      meetingTitle,
      participantsData,
      recordingDurationMs,
    });

    // Parse participants
    let participants = ["Participant 1", "Participant 2"]; // Default participants
    if (participantsData) {
      try {
        const parsedParticipants = JSON.parse(participantsData);
        if (
          Array.isArray(parsedParticipants) &&
          parsedParticipants.length > 0
        ) {
          participants = parsedParticipants;
        }
      } catch (error) {
        console.log("Failed to parse participants, using defaults:", error);
      }
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video", // Use 'video' for audio files
            folder: "meetscribe-audio",
            format: "mp3",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    console.log("Cloudinary upload result:", {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      duration: uploadResult.duration,
      format: uploadResult.format,
    });

    // Calculate duration in minutes with decimal precision
    let durationInMinutes = 0.1; // Default minimum

    if (uploadResult.duration) {
      // Use Cloudinary duration (most accurate)
      const durationSeconds = uploadResult.duration;
      durationInMinutes = durationSeconds / 60;

      if (durationInMinutes < 1) {
        // Round to 1 decimal place for sub-minute recordings
        durationInMinutes = Math.round(durationInMinutes * 10) / 10;
        // Ensure minimum of 0.1 minutes
        if (durationInMinutes < 0.1) {
          durationInMinutes = 0.1;
        }
      } else {
        // Round to 1 decimal place for longer recordings
        durationInMinutes = Math.round(durationInMinutes * 10) / 10;
      }
    } else if (recordingDurationMs) {
      // Fallback to client-side recording duration
      const durationMs = Number.parseInt(recordingDurationMs);
      const durationSeconds = durationMs / 1000;
      durationInMinutes = durationSeconds / 60;

      if (durationInMinutes < 1) {
        durationInMinutes = Math.round(durationInMinutes * 10) / 10;
        if (durationInMinutes < 0.1) {
          durationInMinutes = 0.1;
        }
      } else {
        durationInMinutes = Math.round(durationInMinutes * 10) / 10;
      }
    }

    console.log("Duration calculation:", {
      cloudinaryDuration: uploadResult.duration,
      recordingDurationMs,
      finalDurationMinutes: durationInMinutes,
    });

    // Create meeting record
    const meeting = new Meeting({
      userId,
      title: meetingTitle || "New Meeting",
      date: new Date(),
      duration: durationInMinutes,
      participants,
      status: "completed",
      transcriptionAvailable: false,
      audioUrl: uploadResult.secure_url,
    });

    await meeting.save();

    console.log("Meeting created:", {
      meetingId: meeting._id,
      title: meeting.title,
      duration: meeting.duration,
      participants: meeting.participants,
      participantCount: meeting.participants.length,
    });

    return NextResponse.json({
      success: true,
      data: {
        meetingId: meeting._id,
        audioUrl: uploadResult.secure_url,
        duration: durationInMinutes,
        participants: participants.length,
      },
    });
  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload audio" },
      { status: 500 }
    );
  }
}
