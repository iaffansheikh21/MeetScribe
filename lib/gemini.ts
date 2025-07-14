import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private chatModel: any;
  private embeddingModel: GoogleGenerativeAIEmbeddings;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Initialize both the direct Google AI and LangChain clients
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.chatModel = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.7,
      maxOutputTokens: 2048,
    });
    this.embeddingModel = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  // Enhanced response generation with context and conversation history
  async generateResponse(
    userQuery: string,
    context: string,
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<string> {
    try {
      console.log(
        `🤖 Generating response for query: "${userQuery.substring(0, 100)}..."`
      );

      const contextMessage = context
        ? `You are an AI meeting assistant. Here's relevant context from the meeting:

${context}

Respond professionally with markdown formatting:
# Headings
• Bullet points
1. Numbered lists
**Bold** for emphasis`
        : "You are an AI assistant. No meeting context was provided.";

      const messages = [
        new SystemMessage(contextMessage),
        ...conversationHistory.map((msg) =>
          msg.role === "user"
            ? new HumanMessage(msg.content)
            : new SystemMessage(`Assistant: ${msg.content}`)
        ),
        new HumanMessage(userQuery),
      ];

      const response = await this.chatModel.invoke(messages);
      console.log(
        `✅ Generated response (${response.content.toString().length} chars)`
      );
      return response.content.toString();
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error(
        `Failed to generate response: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Embedding generation methods
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      return await this.embeddingModel.embedQuery(text);
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new Error(
        `Failed to generate embedding: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      console.log(`🔄 Generating embeddings for ${texts.length} texts...`);
      const batchSize = 10;
      const embeddings: number[][] = [];

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        console.log(
          `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            texts.length / batchSize
          )}`
        );

        const batchEmbeddings = await this.embeddingModel.embedDocuments(batch);
        embeddings.push(...batchEmbeddings);

        if (i + batchSize < texts.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log(`✅ Generated ${embeddings.length} embeddings`);
      return embeddings;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw new Error(
        `Failed to generate embeddings: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Enhanced meeting summary with structured output
  async generateSummary(transcriptText: string): Promise<{
    keyPoints: string[];
    actionItems: Array<{ assignee: string; task: string; dueDate: string }>;
    decisions: string[];
    fullSummary: string;
  }> {
    try {
      console.log("🤖 Generating comprehensive meeting summary...");

      const summaryPrompt = `Analyze this meeting transcript and provide:

# Meeting Summary

## Key Discussion Points
- List 3-5 main topics with brief explanations

## Decisions Made
- Clear list of decisions with stakeholders if mentioned

## Action Items
- Format as: **Assignee**: Task (Due: date if available)
- Extract all concrete next steps

## Important Notes
- Any critical information worth highlighting

**Transcript:**
${transcriptText}

Return as JSON with these exact fields:
{
  "keyPoints": [],
  "actionItems": [{"assignee": "", "task": "", "dueDate": ""}],
  "decisions": [],
  "fullSummary": "Complete formatted summary text"
}`;

      // Using direct Google AI for better JSON response
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(summaryPrompt);
      const response = await result.response;

      try {
        const summary = JSON.parse(response.text());
        return {
          keyPoints: summary.keyPoints || [],
          actionItems: summary.actionItems || [],
          decisions: summary.decisions || [],
          fullSummary: summary.fullSummary || "Summary generation completed",
        };
      } catch (parseError) {
        console.error("Failed to parse summary JSON:", parseError);
        return this.fallbackSummaryGeneration(transcriptText);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      return this.fallbackSummaryGeneration(transcriptText);
    }
  }

  private async fallbackSummaryGeneration(transcriptText: string) {
    console.log("🔄 Falling back to simpler summary generation");
    try {
      const response = await this.chatModel.invoke([
        new HumanMessage(
          `Summarize this meeting transcript briefly:\n\n${transcriptText}`
        ),
      ]);

      return {
        keyPoints: ["Summary generated"],
        actionItems: [],
        decisions: [],
        fullSummary: response.content.toString(),
      };
    } catch (fallbackError) {
      console.error("Fallback summary failed:", fallbackError);
      return {
        keyPoints: ["Summary generation failed"],
        actionItems: [],
        decisions: [],
        fullSummary: "Could not generate summary",
      };
    }
  }

  // Enhanced action item extraction
  async extractActionItems(transcript: string): Promise<string[]> {
    try {
      console.log("📋 Extracting action items...");

      const prompt = `Extract ALL action items from this meeting transcript.
      
**Format each as:**
- [Assignee] Action description (Due: date if mentioned)

**Transcript:**
${transcript}

Return ONLY the action items as a bulleted list. If none, return "No action items found".`;

      const response = await this.chatModel.invoke([
        new SystemMessage(
          "You are an expert at extracting concrete action items from meetings."
        ),
        new HumanMessage(prompt),
      ]);

      const content = response.content.toString();
      if (content.includes("No action items found")) return [];

      return content
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.startsWith("- ") && item.length > 2)
        .map((item) => item.substring(2));
    } catch (error) {
      console.error("Error extracting action items:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
