import { type NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Meeting from "@/models/Meeting";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ meetingId: string }> }
) {
  const params = await props.params;

  try {
    await connectToDB();

    const meeting = await Meeting.findById(params.meetingId).populate(
      "transcript"
    );

    if (!meeting || !meeting.transcript) {
      return NextResponse.json(
        { success: false, error: "Meeting or transcript not found" },
        { status: 404 }
      );
    }

    const transcript = meeting.transcript;

    // Create formatted text
    let formattedText = `${meeting.title}\n`;
    formattedText += `${"=".repeat(meeting.title.length)}\n\n`;

    // Meeting Information
    formattedText += `Meeting Information:\n`;
    formattedText += `• Date: ${new Date(meeting.date).toLocaleDateString()}\n`;
    formattedText += `• Duration: ${meeting.duration} minutes\n`;
    formattedText += `• Participants: ${
      typeof meeting.participants === "number"
        ? meeting.participants
        : meeting.participants.length
    }\n\n`;

    // Speakers
    formattedText += `Speakers:\n`;
    transcript.speakers.forEach((speaker: any) => {
      formattedText += `• ${speaker.name} (${speaker.color})\n`;
    });
    formattedText += `\n`;

    // Transcript
    formattedText += `Transcript:\n`;
    formattedText += `${"-".repeat(50)}\n\n`;

    transcript.segments.forEach((segment: any) => {
      const speaker = transcript.speakers.find(
        (s: any) => s._id.toString() === segment.speakerId.toString()
      );
      const startTime = formatTime(segment.startTime);
      const endTime = formatTime(segment.endTime);
      const duration = formatDuration(segment.endTime - segment.startTime);

      formattedText += `${
        speaker?.name || "Unknown"
      } (${startTime} - ${endTime}, ${duration}):\n`;
      formattedText += `${segment.text}\n\n`;
    });

    // Summary if available
    if (transcript.summary) {
      formattedText += `Summary:\n`;
      formattedText += `${"-".repeat(50)}\n`;
      formattedText += `${transcript.summary}\n`;
    }

    return NextResponse.json({
      success: true,
      data: { text: formattedText },
    });
  } catch (error) {
    console.error("Error generating formatted text:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate formatted text" },
      { status: 500 }
    );
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}
