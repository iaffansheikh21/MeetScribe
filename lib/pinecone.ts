import { Pinecone } from "@pinecone-database/pinecone";

interface PineconeVector {
  id: string;
  values: number[];
  metadata: {
    meetingId: string;
    speakerName?: string;
    text: string;
    startTime?: number;
    endTime?: number;
    segmentId: string;
  };
}

interface QueryMatch {
  id: string;
  score: number;
  metadata: {
    meetingId: string;
    speakerName?: string;
    text: string;
    startTime?: number;
    endTime?: number;
    segmentId: string;
  };
}

export class PineconeService {
  private client: Pinecone;
  public indexName: string;

  constructor() {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY is required");
    }

    this.client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.indexName = process.env.PINECONE_INDEX_NAME || "meetscribe-embeddings";
  }

  async checkEmbeddingsExist(meetingId: string): Promise<boolean> {
    try {
      const index = this.client.index(this.indexName);

      // Use a dummy vector to check if any vectors exist for this meeting
      const dummyVector = new Array(768).fill(0);

      const queryResponse = await index.query({
        vector: dummyVector,
        filter: { meetingId: { $eq: meetingId } },
        topK: 1,
        includeMetadata: true,
      });

      return queryResponse.matches && queryResponse.matches.length > 0;
    } catch (error) {
      console.error("Error checking embeddings existence:", error);
      return false;
    }
  }

  async storeEmbeddings(
    meetingId: string,
    embeddings: Array<{
      id: string;
      values: number[];
      metadata: {
        meetingId: string;
        text: string;
        speaker?: string;
        timestamp?: number;
        segmentIndex: number;
      };
    }>
  ): Promise<void> {
    try {
      const index = this.client.index(this.indexName);

      // Store embeddings in batches
      const batchSize = 100;
      for (let i = 0; i < embeddings.length; i += batchSize) {
        const batch = embeddings.slice(i, i + batchSize);

        console.log(
          `📤 Storing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            embeddings.length / batchSize
          )}`
        );

        await index.upsert(batch);

        // Add delay between batches
        if (i + batchSize < embeddings.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      console.log(
        `✅ Stored ${embeddings.length} embeddings for meeting ${meetingId}`
      );
    } catch (error) {
      console.error("Error storing embeddings:", error);
      throw new Error(
        `Failed to store embeddings: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async queryRelevantContext(
    meetingId: string,
    queryVector: number[],
    topK = 5
  ): Promise<
    Array<{
      text: string;
      speaker?: string;
      timestamp?: number;
      score: number;
    }>
  > {
    try {
      const index = this.client.index(this.indexName);

      const queryResponse = await index.query({
        vector: queryVector,
        filter: { meetingId: { $eq: meetingId } },
        topK,
        includeMetadata: true,
      });

      return (
        queryResponse.matches?.map((match) => ({
          text: (match.metadata?.text as string) || "",
          speaker: match.metadata?.speaker as string,
          timestamp: match.metadata?.timestamp as number,
          score: match.score || 0,
        })) || []
      );
    } catch (error) {
      console.error("Error querying relevant context:", error);
      throw new Error(
        `Failed to query relevant context: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteEmbeddings(meetingId: string): Promise<void> {
    try {
      const index = this.client.index(this.indexName);

      // Best practice: Try simple equality first
      await index.deleteMany({
        meetingId: { $in: [meetingId] },
      });

      console.log(`✅ Deleted embeddings for meeting ${meetingId}`);
    } catch (error) {
      console.error("Error deleting embeddings:", error);
      throw new Error(
        `Failed to delete embeddings: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const pineconeService = new PineconeService();
