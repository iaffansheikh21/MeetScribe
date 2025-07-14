"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Upload, Loader2, AlertCircle, Mic, Monitor } from "lucide-react"
import { toast } from "@/lib/toast"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: any) => void
  audioBlob: Blob | null
  meetingName: string
  userId: string
  participants: string[]
  recordingType?: string
}

export default function UploadModal({
  isOpen,
  onClose,
  onSuccess,
  audioBlob,
  meetingName,
  userId,
  participants,
  recordingType = "microphone",
}: UploadModalProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (generateTranscription = false) => {
    if (!audioBlob) {
      toast.error("No audio data to upload")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)

      reader.onload = async () => {
        try {
          const base64Audio = (reader.result as string).split(",")[1]

          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval)
                return 90
              }
              return prev + 10
            })
          }, 200)

          const response = await fetch("/api/audio/stop-recording", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              audioBlob: base64Audio,
              meetingName,
              userId,
              participants,
              recordingDuration: audioBlob.size, // Approximate duration
              recordingType: recordingType,
            }),
          })

          clearInterval(progressInterval)
          setUploadProgress(100)

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Upload failed")
          }

          const data = await response.json()

          if (data.success) {
            setUploadComplete(true)
            setTimeout(() => {
              onSuccess({
                ...data.data,
                skipTranscription: !generateTranscription,
              })
            }, 1000)
          } else {
            throw new Error(data.error || "Upload failed")
          }
        } catch (error) {
          console.error("Upload error:", error)
          setError(error instanceof Error ? error.message : "Upload failed")
          setUploading(false)
        }
      }

      reader.onerror = () => {
        setError("Failed to process audio file")
        setUploading(false)
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Upload failed")
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      onClose()
      // Reset state
      setUploadProgress(0)
      setUploadComplete(false)
      setError(null)
    }
  }

  const getRecordingTypeIcon = () => {
    return recordingType === "meeting" ? (
      <Monitor className="h-5 w-5 text-green-600" />
    ) : (
      <Mic className="h-5 w-5 text-blue-600" />
    )
  }

  const getRecordingTypeLabel = () => {
    return recordingType === "meeting" ? "Meeting Recording" : "Microphone Recording"
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Recording
          </DialogTitle>
          <DialogDescription>Save your recording and optionally generate a transcription</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recording Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              {getRecordingTypeIcon()}
              <span className="font-medium">{getRecordingTypeLabel()}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Meeting:</strong> {meetingName}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Participants:</strong> {participants.length > 0 ? participants.join(", ") : "None specified"}
            </p>
            {audioBlob && (
              <p className="text-sm text-muted-foreground">
                <strong>Size:</strong> {(audioBlob.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Uploading recording...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Upload Complete */}
          {uploadComplete && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Recording uploaded successfully!</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          {!uploading && !uploadComplete && !error && (
            <div className="flex flex-col gap-2">
              <Button onClick={() => handleUpload(true)} className="w-full">
                Upload & Generate Transcription
              </Button>
              <Button onClick={() => handleUpload(false)} variant="outline" className="w-full">
                Upload Only (Generate Later)
              </Button>
            </div>
          )}

          {/* Close Button */}
          {(uploadComplete || error) && (
            <Button onClick={handleClose} className="w-full">
              {uploadComplete ? "Continue" : "Close"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
