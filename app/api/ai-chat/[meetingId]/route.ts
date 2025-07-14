import { type NextRequest, NextResponse } from "next/server"
import { AiChatSummaryController } from "@/controllers/aiChatSummaryController"
import { embeddingService } from "@/lib/embedding-service"
import { geminiService } from "@/lib/gemini"

export async function GET(request: NextRequest, props: { params: Promise<{ meetingId: string }> }) {
  const params = await props.params
  try {
    const chatSummary = await AiChatSummaryController.getAiChatSummary(params.meetingId)
    return NextResponse.json({ success: true, data: chatSummary })
  } catch (error) {
    console.error("API Error - GET /api/ai-chat/[meetingId]:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch AI chat summary" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ meetingId: string }> }) {
  const params = await props.params
  try {
    const { message, type, context } = await request.json()

    if (type === "user_message") {
      // Handle user message with RAG and context
      const userMessage = message.text

      console.log(`💬 Processing AI chat for meeting ${params.meetingId}`)
      console.log(`📝 User message: "${userMessage.substring(0, 100)}..."`)
      console.log(`📚 Context messages: ${context?.length || 0}`)

      // Get relevant context from embeddings
      let relevantContext = ""
      try {
        relevantContext = await embeddingService.queryRelevantContext(params.meetingId, userMessage)
        console.log(`📊 Retrieved context: ${relevantContext.length} characters`)
      } catch (error) {
        console.warn("Could not retrieve context from embeddings:", error)
        relevantContext = "No relevant context found in the meeting transcription."
      }

      // Prepare conversation context from recent messages
      let conversationContext = ""
      if (context && context.length > 0) {
        conversationContext =
          "\n\nRecent conversation context:\n" + context.map((msg: any) => `${msg.sender}: ${msg.text}`).join("\n")
      }

      // Generate AI response using Gemini with enhanced context
      const aiResponseText = await geminiService.generateResponse(userMessage, relevantContext + conversationContext)

      // Save user message
      await AiChatSummaryController.addChatMessage(params.meetingId, {
        sender: "user",
        text: userMessage,
        timestamp: new Date(),
      })

      // Save AI response
      const chatSummary = await AiChatSummaryController.addChatMessage(params.meetingId, {
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date(),
      })

      return NextResponse.json({
        success: true,
        data: {
          userMessage: {
            sender: "user",
            text: userMessage,
            timestamp: new Date(),
          },
          aiResponse: {
            sender: "ai",
            text: aiResponseText,
            timestamp: new Date(),
          },
          chatSummary,
        },
      })
    } else {
      // Handle regular message addition
      const chatSummary = await AiChatSummaryController.addChatMessage(params.meetingId, message)
      return NextResponse.json({ success: true, data: chatSummary })
    }
  } catch (error) {
    console.error("API Error - POST /api/ai-chat/[meetingId]:", error)
    return NextResponse.json({ success: false, error: "Failed to process chat message" }, { status: 500 })
  }
}
