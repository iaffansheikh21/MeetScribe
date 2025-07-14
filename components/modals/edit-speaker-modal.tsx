"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Speaker } from "@/types"

interface EditSpeakerModalProps {
  isOpen: boolean
  onClose: () => void
  speaker: Speaker | null
  allSpeakers: Speaker[]
  onSpeakerUpdate: (speakerId: string, newName: string) => void
  onSpeakerChange: (oldSpeakerId: string, newSpeakerId: string) => void
}

const SPEAKER_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
]

export default function EditSpeakerModal({
  isOpen,
  onClose,
  speaker,
  allSpeakers,
  onSpeakerUpdate,
  onSpeakerChange,
}: EditSpeakerModalProps) {
  const [speakerName, setSpeakerName] = useState("")
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("")

  useEffect(() => {
    if (speaker) {
      setSpeakerName(speaker.name)
      setSelectedSpeakerId(speaker._id)
    }
  }, [speaker])

  const handleSave = () => {
    if (!speaker) return

    if (selectedSpeakerId !== speaker._id) {
      // Speaker changed to a different existing speaker
      onSpeakerChange(speaker._id, selectedSpeakerId)
    } else if (speakerName.trim() !== speaker.name) {
      // Speaker name updated
      onSpeakerUpdate(speaker._id, speakerName.trim())
    }

    onClose()
  }

  const handleClose = () => {
    setSpeakerName("")
    setSelectedSpeakerId("")
    onClose()
  }

  if (!speaker) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Speaker</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Speaker Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: speaker.color }}
            >
              {speaker.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium">{speaker.name}</div>
              <div className="text-sm text-muted-foreground">Current speaker</div>
            </div>
          </div>

          {/* Edit Speaker Name */}
          <div className="space-y-2">
            <Label htmlFor="speakerName">Speaker Name</Label>
            <Input
              id="speakerName"
              value={speakerName}
              onChange={(e) => setSpeakerName(e.target.value)}
              placeholder="Enter speaker name"
              className="w-full"
            />
          </div>

          {/* Change to Existing Speaker */}
          <div className="space-y-3">
            <Label>Or change to existing speaker:</Label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {allSpeakers.map((existingSpeaker) => (
                <button
                  key={existingSpeaker._id}
                  onClick={() => setSelectedSpeakerId(existingSpeaker._id)}
                  className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                    selectedSpeakerId === existingSpeaker._id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: existingSpeaker.color }}
                  >
                    {existingSpeaker.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{existingSpeaker.name}</span>
                  {selectedSpeakerId === existingSpeaker._id && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Selected
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!speakerName.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
