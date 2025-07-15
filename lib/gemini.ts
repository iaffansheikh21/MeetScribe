import OpenAI from "openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

class GeminiService {
  private openai: OpenAI;
  private chatModel: string;
  private embeddingModel: string;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.chatModel = "gpt-3.5-turbo"; // or "gpt-3.5-turbo"
    this.embeddingModel = "text-embedding-3-small";
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

      const messages: any[] = [
        { role: "system", content: contextMessage },
        ...conversationHistory.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: userQuery },
      ];

      const response = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      });

      const content = response.choices[0]?.message?.content || "";
      console.log(`✅ Generated response (${content.length} chars)`);
      return content;
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
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
        dimensions: 768,
      });
      return response.data[0].embedding;
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

        const response = await this.openai.embeddings.create({
          model: this.embeddingModel,
          input: batch,
        });

        embeddings.push(...response.data.map((item) => item.embedding));

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

      const summaryPrompt = `Analyze this meeting transcript and provide structured output as JSON with these exact fields:
{
  "keyPoints": ["list of 3-5 main topics"],
  "actionItems": [{"assignee": "name", "task": "description", "dueDate": "date if available"}],
  "decisions": ["list of decisions made"],
  "fullSummary": "complete formatted summary text"
}

**Transcript:**
${transcriptText}`;

      const response = await this.openai.chat.completions.create({
        model: this.chatModel,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an expert at summarizing meetings with structured output.",
          },
          { role: "user", content: summaryPrompt },
        ],
      });

      try {
        const content = response.choices[0]?.message?.content || "{}";
        const summary = JSON.parse(content);
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
      const response = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: "user",
            content: `Summarize this meeting transcript briefly:\n\n${transcriptText}`,
          },
        ],
      });

      return {
        keyPoints: ["Summary generated"],
        actionItems: [],
        decisions: [],
        fullSummary:
          response.choices[0]?.message?.content || "No summary generated",
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

      const response = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: "system",
            content:
              "You are an expert at extracting concrete action items from meetings.",
          },
          { role: "user", content: prompt },
        ],
      });

      const content = response.choices[0]?.message?.content || "";
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

// Maintain the exact same export name
export const geminiService = new GeminiService();
