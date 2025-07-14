export interface AudioRecorderOptions {
  onRecordingStart?: () => void
  onError?: (error: Error) => void
  recordingType?: "microphone" | "meeting"
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private micStream: MediaStream | null = null
  private screenStream: MediaStream | null = null
  private combinedStream: MediaStream | null = null
  private startTime = 0
  private endTime = 0
  private options: AudioRecorderOptions
  private audioContext: AudioContext | null = null

  constructor(options: AudioRecorderOptions = {}) {
    this.options = options
  }

  async startRecording(): Promise<void> {
    try {
      if (this.options.recordingType === "meeting") {
        await this.startMeetingRecording()
      } else {
        await this.startMicrophoneRecording()
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      const recordingError = new Error("Failed to start recording. Please check permissions.")
      if (this.options.onError) {
        this.options.onError(recordingError)
      }
      throw recordingError
    }
  }

  private async startMicrophoneRecording(): Promise<void> {
    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
      },
    })

    this.setupMediaRecorder(this.micStream)
  }

  private async startMeetingRecording(): Promise<void> {
    // Get microphone stream
    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
      },
    })

    // Get screen/tab stream with audio
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      })
    } catch (error) {
      console.warn("Screen sharing not available or denied, falling back to microphone only")
      this.setupMediaRecorder(this.micStream)
      return
    }

    // Combine microphone and screen audio
    await this.combineAudioStreams()
  }

  private async combineAudioStreams(): Promise<void> {
    if (!this.micStream || !this.screenStream) {
      throw new Error("Required streams not available")
    }

    // Create audio context for mixing
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Create audio sources
    const micSource = this.audioContext.createMediaStreamSource(this.micStream)
    const screenAudioTracks = this.screenStream.getAudioTracks()

    // Create destination for combined audio
    const destination = this.audioContext.createMediaStreamDestination()

    // Connect microphone to destination
    micSource.connect(destination)

    // Connect screen audio if available
    if (screenAudioTracks.length > 0) {
      const screenSource = this.audioContext.createMediaStreamSource(new MediaStream(screenAudioTracks))
      screenSource.connect(destination)
    }

    this.combinedStream = destination.stream
    this.setupMediaRecorder(this.combinedStream)

    // Handle screen share stop
    this.screenStream.getVideoTracks()[0].addEventListener("ended", () => {
      console.log("Screen sharing stopped by user")
      // Continue recording with just microphone
      this.stopRecording().then(() => {
        if (this.options.onError) {
          this.options.onError(new Error("Screen sharing ended"))
        }
      })
    })
  }

  private setupMediaRecorder(stream: MediaStream): void {
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    })

    this.audioChunks = []
    this.startTime = Date.now()

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data)
      }
    }

    this.mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event)
      const error = new Error("Recording failed")
      if (this.options.onError) {
        this.options.onError(error)
      }
    }

    this.mediaRecorder.onstart = () => {
      console.log("Recording started at:", new Date(this.startTime).toISOString())
      if (this.options.onRecordingStart) {
        this.options.onRecordingStart()
      }
    }

    this.mediaRecorder.start(1000) // Collect data every second
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording"))
        return
      }

      this.mediaRecorder.onstop = () => {
        this.endTime = Date.now()
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" })

        console.log("Recording stopped:", {
          startTime: new Date(this.startTime).toISOString(),
          endTime: new Date(this.endTime).toISOString(),
          durationMs: this.endTime - this.startTime,
          durationMinutes: this.getRecordingDurationMinutes(),
          blobSize: audioBlob.size,
          recordingType: this.options.recordingType || "microphone",
        })

        this.cleanup()
        resolve(audioBlob)
      }

      this.mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event)
        this.cleanup()
        reject(new Error("Recording failed"))
      }

      this.mediaRecorder.stop()
    })
  }

  getRecordingDurationMs(): number {
    if (this.startTime === 0) return 0
    const currentTime = this.endTime || Date.now()
    return currentTime - this.startTime
  }

  getRecordingDurationMinutes(): number {
    const durationMs = this.getRecordingDurationMs()
    const durationMinutes = durationMs / (1000 * 60)

    if (durationMinutes < 1) {
      // Round to 1 decimal place for sub-minute recordings
      const rounded = Math.round(durationMinutes * 10) / 10
      return rounded < 0.1 ? 0.1 : rounded
    } else {
      // Round to 1 decimal place for longer recordings
      return Math.round(durationMinutes * 10) / 10
    }
  }

  getFormattedDuration(): string {
    const durationMs = this.getRecordingDurationMs()
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording"
  }

  getRecordingType(): string {
    return this.options.recordingType || "microphone"
  }

  private cleanup(): void {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop())
      this.micStream = null
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop())
      this.screenStream = null
    }

    if (this.combinedStream) {
      this.combinedStream.getTracks().forEach((track) => track.stop())
      this.combinedStream = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.mediaRecorder = null
    this.audioChunks = []
  }
}
