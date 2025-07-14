import { type NextRequest, NextResponse } from "next/server";
import { MeetingController } from "@/controllers/meetingController";
import axios from "axios";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    console.log("🎯 Transcription generation request received");

    const { meetingId, audioUrl } = await request.json();
    console.log("📥 Request data:", { meetingId, audioUrl });

    if (!meetingId || !audioUrl) {
      return NextResponse.json(
        { success: false, error: "Meeting ID and audio URL are required" },
        { status: 400 }
      );
    }

    const API_KEY = process.env.ASSEMBLYAI_API_KEY;
    if (!API_KEY) throw new Error("Missing AssemblyAI API key");

    const meeting = await MeetingController.getMeetingById(meetingId);
    if (!meeting) {
      return NextResponse.json(
        { success: false, error: "Meeting not found" },
        { status: 404 }
      );
    }

    // Step 1: Submit audio for transcription
    const transcriptResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
        speaker_labels: true,
        auto_chapters: true,
      },
      {
        headers: {
          authorization: API_KEY,
          "content-type": "application/json",
        },
      }
    );

    const transcriptId = transcriptResponse.data.id;

    // Step 2: Poll for transcription completion
    let transcriptResult;
    while (true) {
      const poll = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: { authorization: API_KEY },
        }
      );

      transcriptResult = poll.data;
      console.log("🔄 Polling status:", transcriptResult.status);

      if (transcriptResult.status === "completed") break;
      if (
        transcriptResult.status === "error" ||
        transcriptResult.status === "failed"
      ) {
        throw new Error("Transcription failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // Step 3: Process utterances
    const utterances = transcriptResult.utterances || [];

    if (utterances.length === 0) {
      console.warn("🟡 Audio processed, but no speech was detected.");

      const updatedMeeting = await MeetingController.updateMeeting(meetingId, {
        status: "audioempty",
        transcriptionAvailable: true,
      });

      return NextResponse.json({
        success: true,
        emptyTranscript: true,
        data: { meeting: updatedMeeting },
        message:
          "Audio contained no detectable speech. Meeting marked as 'audioempty'.",
      });
    }

    // Transform utterances into speakers and segments with proper ObjectIds
    const speakerMap = new Map<
      string,
      { _id: ObjectId; name: string; color: string }
    >();
    const segments = utterances.map((u: any, idx: number) => {
      // Create new speaker if not exists
      if (!speakerMap.has(u.speaker)) {
        speakerMap.set(u.speaker, {
          _id: new ObjectId(),
          name: `Speaker ${u.speaker}`,
          color: generateRandomColor(),
        });
      }

      const speaker = speakerMap.get(u.speaker)!;

      return {
        _id: new ObjectId(),
        speakerId: speaker._id,
        text: u.text,
        startTime: u.start / 1000,
        endTime: u.end / 1000,
        confidence: u.confidence || 0.9,
      };
    });

    const transcript = {
      speakers: Array.from(speakerMap.values()),
      segments,
      summary: transcriptResult.summary || "Transcript summary not available.",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("📝 Generated transcript:", transcript);

    // Save transcript to meeting
    const updatedMeeting = await MeetingController.updateMeeting(meetingId, {
      transcript,
      transcriptionAvailable: true,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      data: {
        meeting: updatedMeeting,
        transcript,
      },
      message: "Transcription generated and stored successfully",
    });
  } catch (error) {
    console.error("❌ Transcription generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate transcription",
      },
      { status: 500 }
    );
  }
}

// Helper function to generate random colors
function generateRandomColor(): string {
  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#6366F1"];
  return colors[Math.floor(Math.random() * colors.length)];
}
