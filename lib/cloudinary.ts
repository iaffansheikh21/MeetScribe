import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  resource_type: string
  format: string
  duration?: number
  bytes: number
  created_at: string
}

export class CloudinaryService {
  /**
   * Upload audio file to Cloudinary
   * @param audioBuffer - Audio file buffer
   * @param fileName - Name for the file
   * @param userId - User ID for folder organization
   * @returns Promise with upload result
   */
  static async uploadAudio(audioBuffer: Buffer, fileName: string, userId: string): Promise<CloudinaryUploadResult> {
    try {
      console.log("🔄 Uploading audio to Cloudinary...")

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video", // Use 'video' for audio files
            folder: `meetscribe/audio/${userId}`,
            public_id: `${fileName}-${Date.now()}`,
            format: "mp3",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
            tags: ["meetscribe", "audio", "meeting"],
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload error:", error)
              reject(error)
            } else if (result) {
              console.log("✅ Audio uploaded successfully:", result.secure_url)
              resolve(result as CloudinaryUploadResult)
            } else {
              reject(new Error("Upload failed - no result returned"))
            }
          },
        )

        uploadStream.end(audioBuffer)
      })
    } catch (error) {
      console.error("❌ Error uploading to Cloudinary:", error)
      throw new Error("Failed to upload audio to Cloudinary")
    }
  }

  /**
   * Delete audio file from Cloudinary
   * @param publicId - Cloudinary public ID
   * @returns Promise with deletion result
   */
  static async deleteAudio(publicId: string): Promise<any> {
    try {
      console.log("🗑️ Deleting audio from Cloudinary:", publicId)

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "video",
      })

      console.log("✅ Audio deleted successfully")
      return result
    } catch (error) {
      console.error("❌ Error deleting from Cloudinary:", error)
      throw new Error("Failed to delete audio from Cloudinary")
    }
  }

  /**
   * Get audio file info from Cloudinary
   * @param publicId - Cloudinary public ID
   * @returns Promise with file info
   */
  static async getAudioInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "video",
      })

      return result
    } catch (error) {
      console.error("❌ Error getting audio info:", error)
      throw new Error("Failed to get audio info from Cloudinary")
    }
  }
}

export default CloudinaryService
