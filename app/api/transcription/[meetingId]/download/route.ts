import { type NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

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

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: meeting.title,
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),

            // Meeting Information
            new Paragraph({
              text: "Meeting Information",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Date: ", bold: true }),
                new TextRun({
                  text: new Date(meeting.date).toLocaleDateString(),
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Duration: ", bold: true }),
                new TextRun({ text: `${meeting.duration} minutes` }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Participants: ", bold: true }),
                new TextRun({
                  text: `${
                    typeof meeting.participants === "number"
                      ? meeting.participants
                      : meeting.participants.length
                  }`,
                }),
              ],
            }),

            // Empty line
            new Paragraph({ text: "" }),

            // Speakers Section
            new Paragraph({
              text: "Speakers",
              heading: HeadingLevel.HEADING_1,
            }),
            ...transcript.speakers.map(
              (speaker: any) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: "• ", bold: true }),
                    new TextRun({ text: speaker.name, bold: true }),
                    new TextRun({ text: ` (${speaker.color})` }),
                  ],
                })
            ),

            // Empty line
            new Paragraph({ text: "" }),

            // Transcript Section
            new Paragraph({
              text: "Transcript",
              heading: HeadingLevel.HEADING_1,
            }),

            // Transcript segments
            ...transcript.segments.flatMap((segment: any) => {
              const speaker = transcript.speakers.find(
                (s: any) => s._id.toString() === segment.speakerId.toString()
              );
              const startTime = formatTime(segment.startTime);
              const endTime = formatTime(segment.endTime);
              const duration = formatDuration(
                segment.endTime - segment.startTime
              );

              return [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${speaker?.name || "Unknown"}`,
                      bold: true,
                      color: speaker?.color?.replace("#", "") || "000000",
                    }),
                    new TextRun({
                      text: ` (${startTime} - ${endTime}, ${duration})`,
                      italics: true,
                    }),
                  ],
                }),
                new Paragraph({
                  text: segment.text,
                  indent: { left: 720 }, // Indent the text
                }),
                new Paragraph({ text: "" }), // Empty line between segments
              ];
            }),

            // Summary section if available
            ...(transcript.summary
              ? [
                  new Paragraph({ text: "" }),
                  new Paragraph({
                    text: "Summary",
                    heading: HeadingLevel.HEADING_1,
                  }),
                  new Paragraph({
                    text: transcript.summary,
                  }),
                ]
              : []),
          ],
        },
      ],
    });

    // Generate the document buffer
    const buffer = await Packer.toBuffer(doc);

    // Return the Word document
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${
          meeting.title
        }_Transcript_${
          new Date().toISOString().split("T")[0].split(".")[0]
        }.docx"`,
      },
    });
  } catch (error) {
    console.error("Error generating Word document:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate Word document" },
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
