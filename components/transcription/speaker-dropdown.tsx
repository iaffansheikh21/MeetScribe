"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Check, ChevronDown, Edit3, User, Palette } from "lucide-react"

interface Speaker {
  _id: string
  name: string
  color: string
}

interface SpeakerDropdownProps {
  segmentId: string
  currentSpeaker: Speaker
  allSpeakers: Speaker[]
  onSpeakerChange: (segmentId: string, newSpeakerId: string) => void
  onSpeakerNameChange: (speakerId: string, newName: string) => void
  onSpeakerColorChange: (speakerId: string, newColor: string) => void
}

const PRESET_COLORS = [
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
  "#14B8A6", // Teal
  "#A855F7", // Violet
]

export default function SpeakerDropdown({
  segmentId,
  currentSpeaker,
  allSpeakers,
  onSpeakerChange,
  onSpeakerNameChange,
  onSpeakerColorChange,
}: SpeakerDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingColor, setIsEditingColor] = useState(false)
  const [editName, setEditName] = useState("")

  // Update editName when currentSpeaker changes or when opening edit mode
  useEffect(() => {
    setEditName(currentSpeaker.name)
  }, [currentSpeaker.name])

  const handleNameSave = async () => {
    if (editName.trim() && editName !== currentSpeaker.name) {
      try {
        await onSpeakerNameChange(currentSpeaker._id, editName.trim())
      } catch (error) {
        console.error("Failed to update speaker name:", error)
      }
    }
    setIsEditing(false)
    setIsOpen(false)
  }

  const handleColorChange = async (newColor: string) => {
    if (newColor !== currentSpeaker.color) {
      try {
        await onSpeakerColorChange(currentSpeaker._id, newColor)
      } catch (error) {
        console.error("Failed to update speaker color:", error)
      }
    }
    setIsEditingColor(false)
  }

  const handleSpeakerSelect = async (speakerId: string) => {
    if (speakerId !== currentSpeaker._id) {
      try {
        await onSpeakerChange(segmentId, speakerId)
      } catch (error) {
        console.error("Failed to change speaker:", error)
      }
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setEditName(currentSpeaker.name)
    setIsEditing(false)
  }

  const handleEditStart = () => {
    setEditName(currentSpeaker.name) // Ensure we have the latest name
    setIsEditing(true)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 hover:bg-white/80 rounded-md p-1 transition-colors group/speaker"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: currentSpeaker.color }}
          >
            {currentSpeaker.name.charAt(0).toUpperCase()}
          </div>
          <div className="font-medium text-sm" style={{ color: currentSpeaker.color }}>
            {currentSpeaker.name}
          </div>
          <ChevronDown className="h-3 w-3 opacity-0 group-hover/speaker:opacity-100 transition-opacity text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="p-3">
          {/* Edit Speaker Name Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Edit3 className="h-3 w-3" />
              Edit Speaker Name
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNameSave()
                    } else if (e.key === "Escape") {
                      handleCancel()
                    }
                  }}
                />
                <div className="flex gap-1">
                  <Button size="sm" onClick={handleNameSave} className="h-7 px-2 text-xs">
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="h-7 px-2 text-xs bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleEditStart}
                className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors text-sm border border-transparent hover:border-border"
              >
                {currentSpeaker.name}
              </button>
            )}
          </div>

          <Separator className="my-3" />

          {/* Edit Speaker Color Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Palette className="h-3 w-3" />
              Change Color
            </div>
            {isEditingColor ? (
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-1">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                        color === currentSpeaker.color ? "border-gray-800 scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingColor(false)}
                  className="h-7 px-2 text-xs bg-transparent w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingColor(true)}
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-sm border border-transparent hover:border-border"
              >
                <div
                  className="h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: currentSpeaker.color }}
                />
                <span>Change speaker color</span>
              </button>
            )}
          </div>

          <Separator className="my-3" />

          {/* Change Speaker Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-3 w-3" />
              Change to Existing Speaker
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {allSpeakers.map((speaker) => (
                <button
                  key={speaker._id}
                  onClick={() => handleSpeakerSelect(speaker._id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-sm ${
                    speaker._id === currentSpeaker._id ? "bg-muted" : ""
                  }`}
                >
                  <div
                    className="h-4 w-4 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: speaker.color }}
                  >
                    {speaker.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 text-left">{speaker.name}</span>
                  {speaker._id === currentSpeaker._id && <Check className="h-3 w-3 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
