import { type NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { ObjectId } from "mongodb";

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectToDB();

    const { speakerId, newName, newSpeakerId, segmentId, newColor } =
      await request.json();
    console.log("Speaker update request:", {
      speakerId,
      newName,
      newSpeakerId,
      segmentId,
      newColor,
    });

    // Validate meeting ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid meeting ID format" },
        { status: 400 }
      );
    }

    const meeting = await Meeting.findById(params.id);
    if (!meeting) {
      return NextResponse.json(
        { success: false, error: "Meeting not found" },
        { status: 404 }
      );
    }

    if (!meeting.transcript) {
      return NextResponse.json(
        { success: false, error: "No transcript found" },
        { status: 404 }
      );
    }

    let updated = false;

    // Handle speaker name update
    if (newName && speakerId) {
      console.log("Updating speaker name:", { speakerId, newName });
      const speaker = meeting.transcript.speakers.find(
        (s: any) => s._id.toString() === speakerId
      );
      if (speaker) {
        speaker.name = newName;
        updated = true;
        console.log("Speaker name updated successfully");
      } else {
        console.error("Speaker not found:", speakerId);
        return NextResponse.json(
          { success: false, error: "Speaker not found" },
          { status: 404 }
        );
      }
    }

    // Handle speaker color update
    if (newColor && speakerId) {
      console.log("Updating speaker color:", { speakerId, newColor });
      const speaker = meeting.transcript.speakers.find(
        (s: any) => s._id.toString() === speakerId
      );
      if (speaker) {
        speaker.color = newColor;
        updated = true;
        console.log("Speaker color updated successfully");
      } else {
        console.error("Speaker not found:", speakerId);
        return NextResponse.json(
          { success: false, error: "Speaker not found" },
          { status: 404 }
        );
      }
    }

    // Handle speaker change for specific segment
    if (newSpeakerId && segmentId) {
      console.log("Changing speaker for segment:", { segmentId, newSpeakerId });
      const segment = meeting.transcript.segments.find(
        (s: any) => s._id.toString() === segmentId
      );
      if (segment) {
        segment.speakerId = new ObjectId(newSpeakerId);
        updated = true;
        console.log("Segment speaker updated successfully");
      } else {
        console.error("Segment not found:", segmentId);
        return NextResponse.json(
          { success: false, error: "Segment not found" },
          { status: 404 }
        );
      }
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "No valid update operation provided" },
        { status: 400 }
      );
    }

    // Update participants count based on speakers array length
    meeting.participants = meeting.transcript.speakers.length;

    // Save the updated meeting
    await meeting.save();
    console.log("Meeting saved successfully");

    // ✅ Try to regenerate embeddings (force = true)
    try {
      const { embeddingService } = await import("@/lib/embedding-service"); // dynamic import to avoid circular deps
      await embeddingService.generateAndStoreEmbeddings(params.id, true);
      console.log("Embeddings regenerated due to speaker update");
    } catch (embedErr) {
      console.error("❌ Error while regenerating embeddings:", embedErr);
      return NextResponse.json(
        {
          success: false,
          error: "Speaker updated but failed to regenerate embeddings",
          details:
            embedErr instanceof Error ? embedErr.message : String(embedErr),
        },
        { status: 500 }
      );
    }

    // Return the updated transcript
    return NextResponse.json({
      success: true,
      data: meeting.transcript,
      message: "Speaker updated successfully",
    });
  } catch (error) {
    console.error("Error updating speaker:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update speaker" },
      { status: 500 }
    );
  }
}
