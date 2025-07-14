"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, FileText, Play, AlertCircle } from "lucide-react"
import type { Meeting } from "@/types"

interface MeetingCardProps {
  meeting: Meeting
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  // Format date
  const date = new Date(meeting.date)
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "scheduled":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <Card className="border-purple-100 hover:border-primary transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium line-clamp-2">{meeting.title}</CardTitle>
          <Badge variant="secondary" className={getStatusColor(meeting.status)}>
            {meeting.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              {formattedDate}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {formattedTime}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="mr-1 h-3 w-3" />
              {meeting.participants.length} participants
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {meeting.duration} min
            </div>
          </div>

          {/* Transcription status indicator */}
          <div
            className={`flex items-center text-sm ${meeting.transcriptionAvailable ? "text-green-600" : "text-red-600"}`}
          >
            {meeting.transcriptionAvailable ? (
              <>
                <FileText className="mr-1 h-3 w-3" />
                Transcript available
              </>
            ) : (
              <>
                <AlertCircle className="mr-1 h-3 w-3" />
                No transcript
              </>
            )}
          </div>

          <div className="pt-2">
            {/* Always link to the transcription detail page */}
            <Link href={`/dashboard/transcriptions/${meeting._id}`}>
              <Button variant="outline" className="w-full hover:bg-primary/10 hover:text-primary">
                {meeting.status === "scheduled" ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Join Meeting
                  </>
                ) : meeting.transcriptionAvailable ? (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    View Transcript
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Transcript
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
