import { type NextRequest, NextResponse } from "next/server";
import { MeetingController } from "@/controllers/meetingController";
import { AuthController } from "@/controllers/authController";
import { CloudinaryService } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const meeting = await MeetingController.getMeetingById(params.id);
    if (!meeting) {
      return NextResponse.json(
        { success: false, error: "Meeting not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: meeting });
  } catch (error) {
    console.error("API Error - GET /api/meetings/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch meeting" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const updates = await request.json();
    const meeting = await MeetingController.updateMeeting(params.id, updates);
    if (!meeting) {
      return NextResponse.json(
        { success: false, error: "Meeting not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: meeting });
  } catch (error) {
    console.error("API Error - PUT /api/meetings/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update meeting" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    // Check authentication
    const user = await AuthController.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get meeting to check ownership and get audio URL
    const meeting = await MeetingController.getMeetingById(params.id);
    if (!meeting) {
      return NextResponse.json(
        { success: false, error: "Meeting not found" },
        { status: 404 }
      );
    }

    // Check if user owns the meeting
    if (String(meeting.userId._id) !== String(user._id)) {
      console.warn(
        `🚫 Unauthorized delete attempt. Meeting owned by ${JSON.stringify(
          meeting.userId
        )}, but attempted by ${user._id}`
      );
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete audio file from Cloudinary if it exists
    if (meeting.audioUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = meeting.audioUrl.split("/");
        const fileWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileWithExtension.split(".")[0];
        const folderPath = `meetscribe/audio/${user._id}/${publicId}`;
        console.log("Deleting audio file from Cloudinary:", folderPath);
        await CloudinaryService.deleteAudio(folderPath);
        console.log("✅ Audio file deleted from Cloudinary");
      } catch (cloudinaryError) {
        console.error(
          "❌ Error deleting audio from Cloudinary:",
          cloudinaryError
        );
        // Continue with meeting deletion even if Cloudinary deletion fails
      }
    }

    // Delete meeting from database
    const success = await MeetingController.deleteMeeting(params.id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete meeting" },
        { status: 500 }
      );
    }

    console.log("✅ Meeting deleted successfully:", params.id);
    return NextResponse.json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("API Error - DELETE /api/meetings/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete meeting" },
      { status: 500 }
    );
  }
}
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // Check authentication
//     const user = await AuthController.getCurrentUser(request)
//     if (!user) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     // Get meeting to check ownership and get audio URL
//     const meeting = await MeetingController.getMeetingById(params.id)
//     if (!meeting) {
//       return NextResponse.json({ success: false, error: "Meeting not found" }, { status: 404 })
//     }

//     // Check if user owns the meeting
//     if (meeting.userId.toString() !== user._id.toString()) {
//       return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
//     }

//     // Delete audio file from Cloudinary if it exists
//     if (meeting.audioUrl) {
//       try {
//         // Extract public_id from Cloudinary URL
//         const urlParts = meeting.audioUrl.split("/")
//         const fileWithExtension = urlParts[urlParts.length - 1]
//         const publicId = fileWithExtension.split(".")[0]
//         const folderPath = `meetscribe/audio/${user._id}/${publicId}`

//         await CloudinaryService.deleteAudio(folderPath)
//         console.log("✅ Audio file deleted from Cloudinary")
//       } catch (cloudinaryError) {
//         console.error("❌ Error deleting audio from Cloudinary:", cloudinaryError)
//         // Continue with meeting deletion even if Cloudinary deletion fails
//       }
//     }

//     // Delete meeting from database
//     const success = await MeetingController.deleteMeeting(params.id)
//     if (!success) {
//       return NextResponse.json({ success: false, error: "Failed to delete meeting" }, { status: 500 })
//     }

//     console.log("✅ Meeting deleted successfully:", params.id)
//     return NextResponse.json({ success: true, message: "Meeting deleted successfully" })
//   } catch (error) {
//     console.error("API Error - DELETE /api/meetings/[id]:", error)
//     return NextResponse.json({ success: false, error: "Failed to delete meeting" }, { status: 500 })
//   }
// }
