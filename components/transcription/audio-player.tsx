"use client"

import { useState, useRef, useImperativeHandle, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

export interface AudioPlayerRef {
  seekTo: (time: number) => void
}

interface AudioPlayerProps {
  audioUrl: string
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ audioUrl }, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time
        setCurrentTime(time)
      }
    },
  }))

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    const time = value[0]
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const vol = value[0]
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} className="w-full" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="sm" onClick={skipBackward}>
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button onClick={togglePlayPause} size="sm">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button variant="outline" size="sm" onClick={skipForward}>
          <SkipForward className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 ml-4">
          <Volume2 className="h-4 w-4" />
          <Slider value={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="w-20" />
        </div>
      </div>
    </div>
  )
})

AudioPlayer.displayName = "AudioPlayer"

export default AudioPlayer
