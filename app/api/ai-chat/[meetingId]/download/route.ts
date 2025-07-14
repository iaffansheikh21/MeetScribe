import { type NextRequest, NextResponse } from "next/server"
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"

export async function POST(request: NextRequest, props: { params: Promise<{ meetingId: string }> }) {
  const params = await props.params

  try {
    const { chatMessages, meetingTitle, meetingDate } = await request.json()

    if (!chatMessages || chatMessages.length === 0) {
      return NextResponse.json({ success: false, error: "No chat messages to export" }, { status: 400 })
    }

    // Create document sections
    const docSections = []

    // Title
    docSections.push(
      new Paragraph({
        text: `AI Chat Export: ${meetingTitle || "Meeting"}`,
        heading: HeadingLevel.TITLE,
        spacing: { after: 300 },
      }),
    )

    // Meeting info
    if (meetingDate) {
      docSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Meeting Date: ${new Date(meetingDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`,
              bold: true,
            }),
          ],
          spacing: { after: 200 },
        }),
      )
    }

    docSections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Export Date: ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            bold: true,
          }),
        ],
        spacing: { after: 400 },
      }),
    )

    // Chat messages
    docSections.push(
      new Paragraph({
        text: "Chat Conversation",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),
    )

    // Add each message
    chatMessages.forEach((message: any, index: number) => {
      const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })

      // Message header
      docSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${message.sender === "user" ? "👤 User" : "🤖 AI Assistant"} - ${timestamp}`,
              bold: true,
              color: message.sender === "user" ? "2563EB" : "7C3AED",
            }),
          ],
          spacing: { before: 200, after: 100 },
        }),
      )

      // Message content - handle formatted text
      const messageLines = message.text.split("\n")
      messageLines.forEach((line: string) => {
        if (line.trim()) {
          // Handle different formatting
          if (line.startsWith("# ")) {
            docSections.push(
              new Paragraph({
                text: line.substring(2),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
            )
          } else if (line.startsWith("## ")) {
            docSections.push(
              new Paragraph({
                text: line.substring(3),
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 150, after: 100 },
              }),
            )
          } else if (line.startsWith("• ") || line.startsWith("- ")) {
            docSections.push(
              new Paragraph({
                text: line.substring(2),
                bullet: { level: 0 },
                spacing: { after: 50 },
              }),
            )
          } else if (/^\d+\.\s/.test(line)) {
            docSections.push(
              new Paragraph({
                text: line.substring(line.indexOf(".") + 2),
                numbering: { reference: "default-numbering", level: 0 },
                spacing: { after: 50 },
              }),
            )
          } else {
            // Handle bold text
            if (line.includes("**")) {
              const parts = line.split("**")
              const children = parts.map(
                (part, i) =>
                  new TextRun({
                    text: part,
                    bold: i % 2 === 1,
                  }),
              )
              docSections.push(
                new Paragraph({
                  children,
                  spacing: { after: 100 },
                }),
              )
            } else {
              docSections.push(
                new Paragraph({
                  text: line,
                  spacing: { after: 100 },
                }),
              )
            }
          }
        }
      })

      // Add separator between messages
      if (index < chatMessages.length - 1) {
        docSections.push(
          new Paragraph({
            text: "─".repeat(50),
            spacing: { before: 200, after: 200 },
          }),
        )
      }
    })

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docSections,
        },
      ],
      numbering: {
        config: [
          {
            reference: "default-numbering",
            levels: [
              {
                level: 0,
                format: "decimal",
                text: "%1.",
                alignment: "start",
              },
            ],
          },
        ],
      },
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    // Return the file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${meetingTitle || "Meeting"}_Chat_${new Date().toISOString().split("T")[0]}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating Word document:", error)
    return NextResponse.json({ success: false, error: "Failed to generate document" }, { status: 500 })
  }
}
