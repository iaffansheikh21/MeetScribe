import { type NextRequest, NextResponse } from "next/server";
import { embeddingService } from "@/lib/embedding-service";

export async function POST(request: NextRequest) {
  try {
    const { meetingId } = await request.json();

    if (!meetingId) {
      return NextResponse.json(
        { success: false, error: "Meeting ID is required" },
        { status: 400 }
      );
    }
    //code
    console.log(`🚀 Starting embedding generation for meeting ${meetingId}`);

    // Generate and store embeddings
    await embeddingService.generateAndStoreEmbeddings(meetingId);

    return NextResponse.json({
      success: true,
      message: "Embeddings generated and stored successfully",
    });
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate embeddings",
      },
      { status: 500 }
    );
  }
}
