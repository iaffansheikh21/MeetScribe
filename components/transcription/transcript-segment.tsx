interface TranscriptSegmentProps {
  text: string
  speakerName: string
  speakerColor: string
  startTime: number
  endTime: number
}

export default function TranscriptSegment({
  text,
  speakerName,
  speakerColor,
  startTime,
  endTime,
}: TranscriptSegmentProps) {
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Calculate duration
  const duration = endTime - startTime
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.floor(seconds)}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="flex gap-4">
      <div className="text-sm text-muted-foreground w-20 flex-shrink-0 space-y-1">
        <div className="font-medium">{formatTime(startTime)}</div>
        <div className="text-xs opacity-70">{formatTime(endTime)}</div>
        <div className="text-xs opacity-50">({formatDuration(duration)})</div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs"
            style={{ backgroundColor: speakerColor }}
          >
            {speakerName.charAt(0)}
          </div>
          <div className="font-medium" style={{ color: speakerColor }}>
            {speakerName}
          </div>
        </div>
        <div className="pl-8">
          <p className="text-foreground">{text}</p>
        </div>
      </div>
    </div>
  )
}
