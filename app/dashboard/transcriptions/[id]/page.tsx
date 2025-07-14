"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import SidebarNavigation from "@/components/dashboard/sidebar-navigation"
import AudioPlayer, { type AudioPlayerRef } from "@/components/transcription/audio-player"
import DeleteMeetingModal from "@/components/modals/delete-meeting-modal"
import SpeakerDropdown from "@/components/transcription/speaker-dropdown"
import {
  Calendar,
  Clock,
  Users,
  Download,
  Copy,
  MessageSquare,
  FileText,
  Bot,
  Send,
  AlertCircle,
  Trash2,
  Play,
  Loader2,
  Sparkles,
  History,
} from "lucide-react"
import type { User, Meeting, Transcript, ApiResponse } from "@/types"
import TranscriptionModal from "@/components/modals/transcription-modal"
import { toast } from "@/lib/toast"

interface ChatMessage {
  sender: "user" | "ai"
  text: string
  timestamp: Date
}

export default function TranscriptionPage() {
  const { id } = useParams()
  const router = useRouter()
  const audioPlayerRef = useRef<AudioPlayerRef>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [aiResponse, setAiResponse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [userPrompt, setUserPrompt] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [transcript, setTranscript] = useState<Transcript | null>(null)
  const [loading, setLoading] = useState(true)
  const [editableTitle, setEditableTitle] = useState("")
  const [isTitleEditing, setIsTitleEditing] = useState(false)
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // New states for AI chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false)
  const [embeddingsGenerated, setEmbeddingsGenerated] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isDownloadingChat, setIsDownloadingChat] = useState(false)
  const [isDownloadingTranscript, setIsDownloadingTranscript] = useState(false)
  const [isCopyingTranscript, setIsCopyingTranscript] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user from auth API
        const userResponse = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (!userResponse.ok) {
          router.push("/auth/sign-in")
          return
        }

        const userData: ApiResponse<User> = await userResponse.json()
        if (!userData.user) {
          router.push("/auth/sign-in")
          return
        }

        setUser(userData.user)

        // Get meeting data
        const meetingResponse = await fetch(`/api/meetings/${id}`, {
          credentials: "include",
        })

        if (!meetingResponse.ok) {
          router.push("/dashboard/transcriptions")
          return
        }

        const meetingData: ApiResponse<Meeting> = await meetingResponse.json()
        if (!meetingData.data) {
          router.push("/dashboard/transcriptions")
          return
        }

        setMeeting(meetingData.data)

        // Get transcript data from the meeting
        if (meetingData.data.transcript) {
          setTranscript(meetingData.data.transcript)
        }

        // Load existing chat messages
        await loadChatMessages()

        setLoading(false)
      } catch (error) {
        console.error("Error loading transcription data:", error)
        router.push("/dashboard/transcriptions")
      }
    }

    loadData()
  }, [id, router])

  useEffect(() => {
    if (meeting) {
      setEditableTitle(meeting.title)
    }
  }, [meeting])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Auto-generate embeddings when AI tab is opened and transcript is available
  useEffect(() => {
    const generateEmbeddingsIfNeeded = async () => {
      if (meeting?.transcriptionAvailable && transcript && !embeddingsGenerated && !isGeneratingEmbeddings) {
        await generateEmbeddings()
      }
    }

    generateEmbeddingsIfNeeded()
  }, [meeting, transcript, embeddingsGenerated, isGeneratingEmbeddings])

  const loadChatMessages = async () => {
    try {
      const response = await fetch(`/api/ai-chat/${id}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.aiChat) {
          setChatMessages(data.data.aiChat)
        }
      }
    } catch (error) {
      console.error("Error loading chat messages:", error)
    }
  }

  const generateEmbeddings = async () => {
    if (!meeting?._id) return

    setIsGeneratingEmbeddings(true)
    try {
      const response = await fetch("/api/embeddings/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingId: meeting._id }),
      })

      const data = await response.json()
      if (data.success) {
        setEmbeddingsGenerated(true)
        toast.success("AI knowledge base prepared successfully!")
      } else {
        toast.error(data.error || "Failed to prepare AI knowledge base")
      }
    } catch (error) {
      console.error("Error generating embeddings:", error)
      toast.error("Failed to prepare AI knowledge base")
    } finally {
      setIsGeneratingEmbeddings(false)
    }
  }

  const handleSegmentClick = (startTime: number) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.seekTo(startTime)
      toast.success(`Jumped to ${formatTime(startTime)}`)
    }
  }

  const handleSpeakerNameChange = async (speakerId: string, newName: string) => {
    console.log("Updating speaker name:", { speakerId, newName })

    try {
      const response = await fetch(`/api/meetings/${meeting?._id}/speakers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speakerId,
          newName,
        }),
      })

      const data = await response.json()
      console.log("Speaker name update response:", data)

      if (response.ok && data.success) {
        setTranscript(data.data)
        toast.success("Speaker name updated successfully")
      } else {
        console.error("Failed to update speaker name:", data)
        toast.error(data.error || "Failed to update speaker name")
      }
    } catch (error) {
      console.error("Error updating speaker:", error)
      toast.error("Failed to update speaker name")
    }
  }

  const handleSpeakerColorChange = async (speakerId: string, newColor: string) => {
    console.log("Updating speaker color:", { speakerId, newColor })

    try {
      const response = await fetch(`/api/meetings/${meeting?._id}/speakers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          speakerId,
          newColor,
        }),
      })

      const data = await response.json()
      console.log("Speaker color update response:", data)

      if (response.ok && data.success) {
        setTranscript(data.data)
        toast.success("Speaker color updated successfully")
      } else {
        console.error("Failed to update speaker color:", data)
        toast.error(data.error || "Failed to update speaker color")
      }
    } catch (error) {
      console.error("Error updating speaker color:", error)
      toast.error("Failed to update speaker color")
    }
  }

  const handleSpeakerChange = async (segmentId: string, newSpeakerId: string) => {
    console.log("Changing speaker for segment:", { segmentId, newSpeakerId })

    // Find the current speaker for this segment
    const segment = transcript?.segments.find((s) => s._id === segmentId)
    if (!segment) {
      console.error("Segment not found:", segmentId)
      return
    }

    const oldSpeakerId = segment.speakerId

    try {
      const response = await fetch(`/api/meetings/${meeting?._id}/speakers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          segmentId,
          speakerId: oldSpeakerId,
          newSpeakerId,
        }),
      })

      const data = await response.json()
      console.log("Speaker change response:", data)

      if (response.ok && data.success) {
        setTranscript(data.data)
        toast.success("Speaker changed successfully")
      } else {
        console.error("Failed to change speaker:", data)
        toast.error(data.error || "Failed to change speaker")
      }
    } catch (error) {
      console.error("Error changing speaker:", error)
      toast.error("Failed to change speaker")
    }
  }

  const handleGenerateSummary = async () => {
    if (!meeting || !meeting.transcriptionAvailable) {
      toast.error("Please generate transcription first")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch(`/api/ai-summary/${meeting._id}`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data: ApiResponse = await response.json()
        const summaryData = data.data

        const formattedSummary =
          `# Meeting Summary\n\n` +
          `**Meeting:** ${meeting.title}\n` +
          `**Date:** ${new Date(meeting.date).toLocaleDateString()}\n` +
          `**Duration:** ${meeting.duration} minutes\n` +
          `**Participants:** ${typeof meeting.participants === "number" ? meeting.participants : meeting.participants.length}\n\n` +
          `## Key Points\n\n` +
          summaryData.summary.keyPoints.map((point: string) => `• ${point}`).join("\n") +
          "\n\n" +
          `## Action Items\n\n` +
          summaryData.actionItems
            .map((item: any) => `**${item.assignee}**: ${item.task}${item.dueDate ? ` (Due: ${item.dueDate})` : ""}`)
            .join("\n\n") +
          `## Decisions Made\n\n` +
          summaryData.summary.decisions.map((decision: string) => `• ${decision}`).join("\n")

        setAiResponse(formattedSummary)
        toast.success("Summary generated successfully!")
      } else {
        const errorData = await response.json()
        setAiResponse("Error generating summary. Please try again.")
        toast.error(errorData.error || "Failed to generate summary")
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      setAiResponse("Error generating summary. Please try again.")
      toast.error("Failed to generate summary")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleChatMessage = async () => {
    if (!userPrompt.trim() || !meeting || !user) return

    if (!meeting.transcriptionAvailable) {
      toast.error("Please generate transcription first")
      return
    }

    if (!embeddingsGenerated) {
      toast.error("AI knowledge base is still being prepared. Please wait...")
      return
    }

    setIsChatLoading(true)
    const currentPrompt = userPrompt
    setUserPrompt("")

    try {
      // Get last 10 messages for context
      const recentMessages = chatMessages.slice(-10)

      const response = await fetch(`/api/ai-chat/${meeting._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: { text: currentPrompt },
          type: "user_message",
          context: recentMessages, // Send recent messages as context
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add both user message and AI response to chat
        setChatMessages((prev) => [...prev, data.data.userMessage, data.data.aiResponse])
      } else {
        toast.error(data.error || "Failed to send message")
        setUserPrompt(currentPrompt) // Restore the prompt on error
      }
    } catch (error) {
      console.error("Error sending chat message:", error)
      toast.error("Failed to send message")
      setUserPrompt(currentPrompt) // Restore the prompt on error
    } finally {
      setIsChatLoading(false)
    }
  }

  const downloadChatAsWord = async () => {
    if (chatMessages.length === 0) {
      toast.error("No chat messages to download")
      return
    }

    setIsDownloadingChat(true)
    try {
      const response = await fetch(`/api/ai-chat/${meeting?._id}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatMessages,
          meetingTitle: meeting?.title,
          meetingDate: meeting?.date,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${meeting?.title || "Meeting"}_Chat_${new Date().toISOString().split("T")[0]}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Chat downloaded successfully!")
      } else {
        toast.error("Failed to download chat")
      }
    } catch (error) {
      console.error("Error downloading chat:", error)
      toast.error("Failed to download chat")
    } finally {
      setIsDownloadingChat(false)
    }
  }

  const downloadTranscriptAsWord = async () => {
    if (!meeting?._id) {
      toast.error("Meeting not found")
      return
    }

    setIsDownloadingTranscript(true)
    try {
      const response = await fetch(`/api/transcription/${meeting._id}/download`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${meeting.title || "Meeting"}_Transcript_${new Date().toISOString().split("T")[0]}.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Word document downloaded successfully!")
      } else {
        toast.error("Failed to download transcript")
      }
    } catch (error) {
      console.error("Error downloading transcript:", error)
      toast.error("Failed to download transcript")
    } finally {
      setIsDownloadingTranscript(false)
    }
  }

  const copyTranscriptToClipboard = async () => {
    if (!meeting?._id) {
      toast.error("Meeting not found")
      return
    }

    setIsCopyingTranscript(true)
    try {
      const response = await fetch(`/api/transcription/${meeting._id}/copy`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data?.text) {
          await navigator.clipboard.writeText(data.data.text)
          toast.success("Transcript copied to clipboard!")
        } else {
          toast.error("Failed to copy transcript")
        }
      } else {
        toast.error("Failed to copy transcript")
      }
    } catch (error) {
      console.error("Error copying transcript:", error)
      toast.error("Failed to copy transcript")
    } finally {
      setIsCopyingTranscript(false)
    }
  }

  const handleTranscriptionSuccess = () => {
    setShowTranscriptionModal(false)
    window.location.reload()
  }

  const handleDeleteSuccess = () => {
    router.push("/dashboard/transcriptions")
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.floor(seconds)}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatChatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Function to render formatted AI text
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n")
    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-xl font-bold mb-3 text-primary">
            {line.substring(2)}
          </h1>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-lg font-semibold mb-2 text-primary">
            {line.substring(3)}
          </h2>
        )
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-md font-medium mb-2 text-primary">
            {line.substring(4)}
          </h3>
        )
      }

      // Handle bullet points
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1 text-sm">
            {line.substring(2)}
          </li>
        )
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={index} className="ml-4 mb-1 text-sm list-decimal">
            {line.substring(line.indexOf(".") + 2)}
          </li>
        )
      }

      // Handle bold text
      if (line.includes("**")) {
        const parts = line.split("**")
        return (
          <p key={index} className="mb-2 text-sm leading-relaxed">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold">
                  {part}
                </strong>
              ) : (
                part
              ),
            )}
          </p>
        )
      }

      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="mb-2 text-sm leading-relaxed">
            {line}
          </p>
        )
      }

      // Empty lines
      return <br key={index} />
    })
  }

  if (loading || !user || !meeting) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Format date
  const date = new Date(meeting.date)
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const hasTranscription = meeting.transcriptionAvailable && transcript
  const isAudioEmpty = meeting.status === "audioempty"

  return (
    <div className="flex h-screen">
      <SidebarNavigation user={user} />

      <div className="flex-1 overflow-auto">
        <div className="p-8 pt-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {isTitleEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className="text-3xl font-bold tracking-tight w-full bg-primary/5 border border-primary/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={async () => {
                      try {
                        await fetch(`/api/meetings/${meeting._id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                          body: JSON.stringify({ title: editableTitle }),
                        })
                        if (meeting) {
                          meeting.title = editableTitle
                        }
                        setIsTitleEditing(false)
                        toast.success("Meeting title updated")
                      } catch (error) {
                        console.error("Error updating title:", error)
                        toast.error("Failed to update title")
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group flex-1">
                  <h2 className="text-3xl font-bold tracking-tight">{editableTitle}</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsTitleEditing(true)}
                  >
                    Edit
                  </Button>
                </div>
              )}

              {/* Delete Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>

            {/* Meeting Info with Speaker Labels */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
                <span className="flex items-center text-orange-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formattedDate}
                </span>
                <span className="flex items-center text-purple-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {meeting.duration} minutes
                </span>
                <span className="flex items-center text-green-600">
                  <Users className="h-3 w-3 mr-1" />
                  {typeof meeting.participants === "number" ? meeting.participants : meeting.participants.length}{" "}
                  participants
                </span>
              </p>

              {/* Speaker Labels */}
              {hasTranscription && transcript.speakers.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-muted-foreground">Speakers:</span>
                  {transcript.speakers.map((speaker) => (
                    <Badge key={speaker._id} variant="outline" className="flex items-center gap-2 px-2 py-1">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: speaker.color }} />
                      <span className="text-xs">{speaker.name}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="transcript" className="w-full">
            <TabsList className="w-full mb-6 bg-primary/10">
              <TabsTrigger
                value="transcript"
                className="flex-1 text-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <FileText className="h-4 w-4 mr-2" />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="flex-1 text-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
                {isGeneratingEmbeddings && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transcript" className="space-y-6">
              {!hasTranscription || isAudioEmpty ? (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2 text-yellow-800">
                      <AlertCircle className="h-5 w-5" />
                      {isAudioEmpty ? "No Speech Detected in Audio" : "Transcription Not Available"}
                    </CardTitle>
                    <CardDescription className="text-yellow-700">
                      {isAudioEmpty
                        ? "The audio file was uploaded, but no speech was detected in the recording."
                        : "This meeting doesn't have a transcription yet. Generate one to view the transcript and use AI features."}
                    </CardDescription>
                  </CardHeader>

                  {!isAudioEmpty && (
                    <CardContent className="text-center">
                      <Button onClick={() => setShowTranscriptionModal(true)} className="w-full max-w-xs">
                        Generate Transcription Now
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ) : (
                <Card className="border-purple-100">
                  <CardHeader>
                    <CardTitle>Transcript</CardTitle>
                    <CardDescription>
                      Full transcript of the meeting with speaker identification. Click on segments to jump to that time
                      in the audio. Click on speaker names to edit names, change colors, or reassign speakers for
                      individual segments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="transcript-container">
                    <div className="space-y-4">
                      {transcript.segments.map((segment) => {
                        const speaker = transcript.speakers.find((s) => s._id === segment.speakerId)
                        const duration = segment.endTime - segment.startTime

                        return (
                          <div
                            key={segment._id}
                            className="group relative border border-transparent hover:border-purple-200 hover:bg-purple-50/50 rounded-lg p-3 transition-all"
                          >
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {/* Speaker Dropdown */}
                                  {speaker && (
                                    <SpeakerDropdown
                                      segmentId={segment._id}
                                      currentSpeaker={speaker}
                                      allSpeakers={transcript.speakers}
                                      onSpeakerChange={handleSpeakerChange}
                                      onSpeakerNameChange={handleSpeakerNameChange}
                                      onSpeakerColorChange={handleSpeakerColorChange}
                                    />
                                  )}
                                  {/* Clickable Timestamp */}({formatDuration(duration)})
                                  <button
                                    onClick={() => handleSegmentClick(segment.startTime)}
                                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted px-2 py-0.5 rounded-md transition-colors group/time"
                                  >
                                    <Play className="h-3 w-3 opacity-50 group-hover/time:opacity-100 transition-opacity" />
                                    {formatTime(segment.startTime)}
                                    {"-"}
                                    {formatTime(segment.endTime)}
                                  </button>
                                </div>
                                <div
                                  className="pl-10 cursor-pointer"
                                  onClick={() => handleSegmentClick(segment.startTime)}
                                >
                                  <p className="text-foreground leading-relaxed">{segment.text}</p>
                                </div>
                              </div>
                            </div>

                            {/* Hover indicator */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-md">
                                <Play className="h-3 w-3" />
                                Click to play
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Total duration: {Math.floor(meeting.duration / 60)}:
                      {(meeting.duration % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadTranscriptAsWord}
                        disabled={isDownloadingTranscript}
                      >
                        {isDownloadingTranscript ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Download Word
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyTranscriptToClipboard}
                        disabled={isCopyingTranscript}
                      >
                        {isCopyingTranscript ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        Copy
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}

              {/* Audio Player - Always show if audio URL exists */}
              {meeting.audioUrl && <AudioPlayer ref={audioPlayerRef} audioUrl={meeting.audioUrl} />}
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <Card className="border-purple-100 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          AI Assistant
                          {isGeneratingEmbeddings && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Preparing knowledge base...
                            </div>
                          )}
                        </CardTitle>
                        <CardDescription>Powered by Gemini Flash 2.0 • Context-aware responses</CardDescription>
                      </div>
                    </div>
                    {chatMessages.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadChatAsWord}
                        disabled={isDownloadingChat}
                        className="bg-white/80 hover:bg-white"
                      >
                        {isDownloadingChat ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Download Chat
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!hasTranscription || isAudioEmpty ? (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <div className="space-y-3">
                          <p>
                            {isAudioEmpty
                              ? "The audio was uploaded, but no speech was detected. Please upload a valid recording."
                              : "Transcription not available. Generate transcription first to use AI features."}
                          </p>
                          {!isAudioEmpty && (
                            <Button
                              onClick={() => setShowTranscriptionModal(true)}
                              size="sm"
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              Generate Transcription Now
                            </Button>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Tabs defaultValue="chat">
                      <TabsList className="w-full bg-white/60 backdrop-blur-sm">
                        <TabsTrigger value="chat" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Smart Chat
                        </TabsTrigger>
                        <TabsTrigger value="summary" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Summary
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="chat" className="mt-4">
                        <div className="space-y-4">
                          {/* Chat Messages */}
                          <ScrollArea className="h-96 w-full border rounded-lg bg-white/60 backdrop-blur-sm">
                            <div className="p-4 space-y-4">
                              {chatMessages.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                  <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                    <Bot className="h-10 w-10 text-purple-600" />
                                  </div>
                                  <h3 className="font-semibold text-lg mb-2">Start a conversation!</h3>
                                  <p className="text-sm mb-4">Ask me anything about your meeting</p>
                                  <div className="bg-white/80 rounded-lg p-4 text-left">
                                    <p className="text-sm font-medium mb-2">Try asking:</p>
                                    <ul className="text-sm space-y-1">
                                      <li>• "What were the main topics discussed?"</li>
                                      <li>• "Who made the key decisions?"</li>
                                      <li>• "What are the action items?"</li>
                                      <li>• "Summarize the meeting in bullet points"</li>
                                    </ul>
                                  </div>
                                </div>
                              ) : (
                                chatMessages.map((message, index) => (
                                  <div
                                    key={index}
                                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                        message.sender === "user"
                                          ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white"
                                          : "bg-white border border-gray-200 shadow-sm"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        {message.sender === "ai" && (
                                          <div className="p-1 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
                                            <Bot className="h-3 w-3 text-white" />
                                          </div>
                                        )}
                                        <span
                                          className={`text-xs ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}
                                        >
                                          {formatChatTime(message.timestamp)}
                                        </span>
                                      </div>
                                      <div className={`${message.sender === "ai" ? "prose prose-sm max-w-none" : ""}`}>
                                        {message.sender === "ai" ? (
                                          <div className="text-gray-800">{renderFormattedText(message.text)}</div>
                                        ) : (
                                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                              {isChatLoading && (
                                <div className="flex justify-start">
                                  <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
                                        <Bot className="h-3 w-3 text-white" />
                                      </div>
                                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                                      <span className="text-sm text-gray-600">AI is analyzing...</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div ref={chatEndRef} />
                            </div>
                          </ScrollArea>

                          {/* Chat Input */}
                          <div className="space-y-2">
                            {isGeneratingEmbeddings && (
                              <Alert className="border-blue-200 bg-blue-50">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                <AlertDescription className="text-blue-800">
                                  Preparing AI knowledge base from your meeting transcript...
                                </AlertDescription>
                              </Alert>
                            )}

                            {chatMessages.length > 0 && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/60 rounded-lg p-2">
                                <History className="h-3 w-3" />
                                <span>AI remembers the last 10 messages for better context</span>
                              </div>
                            )}

                            <div className="relative">
                              <Textarea
                                placeholder={
                                  isGeneratingEmbeddings
                                    ? "Please wait while AI knowledge base is being prepared..."
                                    : "Ask me anything about your meeting..."
                                }
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                className="pr-12 min-h-[80px] resize-none bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400"
                                disabled={isGeneratingEmbeddings || isChatLoading}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleChatMessage()
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                                onClick={handleChatMessage}
                                disabled={
                                  isGeneratingEmbeddings || isChatLoading || !userPrompt.trim() || !embeddingsGenerated
                                }
                              >
                                {isChatLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Press Enter to send, Shift+Enter for new line
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="summary" className="mt-4">
                        <div className="space-y-4">
                          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-4">
                              Generate a comprehensive AI summary of the meeting including key points, action items, and
                              decisions.
                            </p>
                            <Button
                              onClick={handleGenerateSummary}
                              disabled={isGenerating}
                              className="w-full bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generating Summary...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Generate Smart Summary
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>

              {aiResponse && (
                <Card className="border-purple-100 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-1 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      AI Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="text-gray-800">{renderFormattedText(aiResponse)}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="ml-auto bg-white/80 hover:bg-white">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Summary
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      <TranscriptionModal
        isOpen={showTranscriptionModal}
        onClose={() => setShowTranscriptionModal(false)}
        onSuccess={handleTranscriptionSuccess}
        meetingId={meeting._id}
        audioUrl={meeting.audioUrl || ""}
      />

      <DeleteMeetingModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
        meetingTitle={meeting.title}
        meetingId={meeting._id}
      />
    </div>
  )
}
