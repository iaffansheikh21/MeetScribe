import { geminiService } from "./gemini"
import { pineconeService } from "./pinecone"
import connectDB from "./mongodb"
import Meeting from "@/models/Meeting"

export class EmbeddingService {
  // async generateAndStoreEmbeddings(meetingId: string): Promise<void> {
  //   try {
  //     console.log(`🔄 Generating embeddings for meeting ${meetingId}`);

  //     // Check if embeddings already exist
  //     const embeddingsExist = await pineconeService.checkEmbeddingsExist(
  //       meetingId
  //     );
  //     if (embeddingsExist) {
  //       console.log(`✅ Embeddings already exist for meeting ${meetingId}`);
  //       return;
  //     }

  //     // Connect to MongoDB and fetch meeting
  //     await connectDB();
  //     const meeting = await Meeting.findById(meetingId);

  //     if (
  //       !meeting ||
  //       !meeting.transcript ||
  //       meeting.transcript.segments.length === 0
  //     ) {
  //       throw new Error("Meeting not found or has no transcription");
  //     }

  //     console.log(
  //       `📝 Found meeting with ${meeting.transcript.segments.length} transcript segments`
  //     );

  //     console.log(
  //       `📝 Found meeting with ${meeting.transcript} transcript segments`
  //     );

  //     // Prepare texts for embedding
  //     // const textsToEmbed = meeting.transcript.segments.map(
  //     //   (segment: any, index: number) => {
  //     //     const speakerName = segment.speaker || `Speaker ${index + 1}`;
  //     //     const timestamp = segment.timestamp || 0;
  //     //     const text = segment.text || "";

  //     //     return {
  //     //       text: `${speakerName}: ${text}`,
  //     //       originalText: text,
  //     //       speaker: speakerName,
  //     //       timestamp,
  //     //       segmentIndex: index,
  //     //     };
  //     //   }
  //     // );
  //     // Create a map of speakerId to speakerName
  //     const speakerMap = new Map(
  //       meeting.transcript.speakers.map((sp: any) => [
  //         sp._id.toString(),
  //         sp.name,
  //       ])
  //     );

  //     // Prepare texts for embedding with speaker names
  //     const textsToEmbed = meeting.transcript.segments.map(
  //       (segment: any, index: number) => {
  //         const speakerId = segment.speakerId?.toString();
  //         const speakerName =
  //           speakerMap.get(speakerId) || `Speaker ${index + 1}`;
  //         const timestamp = segment.startTime || 0;
  //         const text = segment.text || "";

  //         return {
  //           text: `${speakerName}: ${text}`,
  //           originalText: text,
  //           speaker: speakerName,
  //           timestamp,
  //           segmentIndex: index,
  //         };
  //       }
  //     );

  //     console.log(textsToEmbed);

  //     // Generate embeddings in batches
  //     const embeddings = await geminiService.generateEmbeddings(
  //       textsToEmbed.map((item) => item.text)
  //     );

  //     // Prepare data for Pinecone
  //     const pineconeData = embeddings.map((embedding, index) => ({
  //       id: `${meetingId}-segment-${index}`,
  //       values: embedding,
  //       metadata: {
  //         meetingId,
  //         text: textsToEmbed[index].originalText,
  //         speaker: textsToEmbed[index].speaker,
  //         timestamp: textsToEmbed[index].timestamp,
  //         segmentIndex: textsToEmbed[index].segmentIndex,
  //       },
  //     }));

  //     // Store in Pinecone
  //     await pineconeService.storeEmbeddings(meetingId, pineconeData);

  //     console.log(
  //       `✅ Successfully generated and stored embeddings for meeting ${meetingId}`
  //     );
  //   } catch (error) {
  //     console.error("Error generating and storing embeddings:", error);
  //     throw new Error(
  //       `Failed to generate embeddings: ${
  //         error instanceof Error ? error.message : "Unknown error"
  //       }`
  //     );
  //   }
  // }
  async generateAndStoreEmbeddings(meetingId: string, force = false): Promise<void> {
    try {
      console.log(`🔄 Generating embeddings for meeting ${meetingId}`)

      // Only check for existing embeddings if force === false
      if (!force) {
        const embeddingsExist = await pineconeService.checkEmbeddingsExist(meetingId)
        if (embeddingsExist) {
          console.log(`✅ Embeddings already exist for meeting ${meetingId}`)
          return
        }
      } else {
        console.log(`♻️ Force re-generating embeddings for meeting ${meetingId}`)
        await pineconeService.deleteEmbeddings(meetingId)
      }

      // Connect to MongoDB and fetch meeting
      await connectDB()
      const meeting = await Meeting.findById(meetingId)

      if (!meeting || !meeting.transcript || meeting.transcript.segments.length === 0) {
        throw new Error("Meeting not found or has no transcription")
      }

      console.log(`📝 Found meeting with ${meeting.transcript.segments.length} transcript segments`)

      // Build speakerId → name map
      const speakerMap = new Map(meeting.transcript.speakers.map((sp: any) => [sp._id.toString(), sp.name]))

      // Prepare texts with speaker name
      const textsToEmbed = meeting.transcript.segments.map((segment: any, index: number) => {
        const speakerId = segment.speakerId?.toString()
        const speakerName = speakerMap.get(speakerId) || `Speaker ${index + 1}`
        const timestamp = segment.startTime || 0
        const text = segment.text || ""

        return {
          text: `${speakerName}: ${text}`,
          originalText: text,
          speaker: speakerName,
          timestamp,
          segmentIndex: index,
        }
      })

      // Generate embeddings
      const embeddings = await geminiService.generateEmbeddings(textsToEmbed.map((item) => item.text))

      // Format for Pinecone
      const pineconeData = embeddings.map((embedding, index) => ({
        id: `${meetingId}-segment-${index}`,
        values: embedding,
        metadata: {
          meetingId,
          text: textsToEmbed[index].originalText,
          speaker: textsToEmbed[index].speaker,
          timestamp: textsToEmbed[index].timestamp,
          segmentIndex: textsToEmbed[index].segmentIndex,
        },
      }))

      // Store in Pinecone
      await pineconeService.storeEmbeddings(meetingId, pineconeData)

      console.log(`✅ Successfully generated and stored embeddings for meeting ${meetingId}`)
    } catch (error) {
      console.error("Error generating and storing embeddings:", error)
      throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async queryRelevantContext(meetingId: string, query: string): Promise<string> {
    try {
      console.log(`🔍 Querying relevant context for: "${query.substring(0, 100)}..."`)

      // Generate embedding for the query
      const queryEmbedding = await geminiService.generateEmbedding(query)

      // Query Pinecone for relevant context
      const relevantSegments = await pineconeService.queryRelevantContext(meetingId, queryEmbedding, 5)

      if (relevantSegments.length === 0) {
        console.log(`⚠️ No relevant context found for query`)
        return "No relevant context found in the meeting transcription."
      }

      // Format the context
      const context = relevantSegments
        .map((segment) => {
          const speakerInfo = segment.speaker ? `${segment.speaker}` : "Unknown Speaker"
          const timeInfo = segment.timestamp
            ? ` (${Math.floor(segment.timestamp / 60)}:${String(Math.floor(segment.timestamp % 60)).padStart(2, "0")})`
            : ""
          return `${speakerInfo}${timeInfo}: ${segment.text}`
        })
        .join("\n\n")

      console.log(`✅ Found ${relevantSegments.length} relevant segments`)
      return context
    } catch (error) {
      console.error("Error querying relevant context:", error)
      throw new Error(`Failed to query context: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async generateMeetingSummary(meetingId: string): Promise<{
    keyPoints: string[]
    actionItems: Array<{ assignee: string; task: string; dueDate: string }>
    decisions: string[]
  }> {
    try {
      console.log(`📊 Generating meeting summary for ${meetingId}`)

      await connectDB()
      const meeting = await Meeting.findById(meetingId)

      if (!meeting || !meeting.transcript || meeting.transcript.segments.length === 0) {
        throw new Error("Meeting not found or has no transcription")
      }

      // Create a map of speakerId to speakerName
      const speakerMap = new Map(meeting.transcript.speakers.map((sp: any) => [sp._id.toString(), sp.name]))

      // Combine all transcript segments with proper speaker names
      const fullTranscript = meeting.transcript.segments
        .map((segment: any) => {
          const speakerId = segment.speakerId?.toString()
          const speakerName = speakerMap.get(speakerId) || "Unknown Speaker"
          return `${speakerName}: ${segment.text}`
        })
        .join("\n")

      // Generate summary using Gemini
      const summary = await geminiService.generateSummary(fullTranscript)

      console.log(`✅ Generated meeting summary`)
      return {
        keyPoints: summary.keyPoints,
        actionItems: summary.actionItems,
        decisions: summary.decisions,
      }
    } catch (error) {
      console.error("Error generating meeting summary:", error)
      throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async extractActionItems(meetingId: string): Promise<string[]> {
    try {
      console.log(`📋 Extracting action items for meeting ${meetingId}`)

      await connectDB()
      const meeting = await Meeting.findById(meetingId)

      if (!meeting || !meeting.transcript || meeting.transcript.segments.length === 0) {
        throw new Error("Meeting not found or has no transcription")
      }

      // Create a map of speakerId to speakerName
      const speakerMap = new Map(meeting.transcript.speakers.map((sp: any) => [sp._id.toString(), sp.name]))

      // Combine all transcript segments with proper speaker names
      const fullTranscript = meeting.transcript.segments
        .map((segment: any) => {
          const speakerId = segment.speakerId?.toString()
          const speakerName = speakerMap.get(speakerId) || "Unknown Speaker"
          return `${speakerName}: ${segment.text}`
        })
        .join("\n")

      // Extract action items using Gemini
      const actionItems = await geminiService.extractActionItems(fullTranscript)

      console.log(`✅ Extracted ${actionItems.length} action items`)
      return actionItems
    } catch (error) {
      console.error("Error extracting action items:", error)
      throw new Error(`Failed to extract action items: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

export const embeddingService = new EmbeddingService()
