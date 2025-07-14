"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import UploadModal from "@/components/modals/upload-modal";
import TranscriptionModal from "@/components/modals/transcription-modal";
import { AudioRecorder } from "@/lib/audio-recorder";
import {
  Mic,
  MicOff,
  Users,
  Plus,
  X,
  Loader2,
  Monitor,
  Video,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/lib/toast";
import type { User, ApiResponse } from "@/types";

export default function NewMeetingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Recording state
  const [meetingName, setMeetingName] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [recordingType, setRecordingType] = useState<"microphone" | "meeting">(
    "microphone"
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioRecorder, setAudioRecorder] = useState<AudioRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
  const [currentMeetingData, setCurrentMeetingData] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/auth/sign-in");
          return;
        }

        const userData: ApiResponse<User> = await response.json();
        if (!userData.user) {
          router.push("/auth/sign-in");
          return;
        }

        setUser(userData.user);
      } catch (error) {
        console.error("Error loading user:", error);
        router.push("/auth/sign-in");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const addParticipant = () => {
    if (
      newParticipant.trim() &&
      !participants.includes(newParticipant.trim())
    ) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter((p) => p !== participant));
  };

  const startRecording = async () => {
    if (!meetingName.trim()) {
      toast.error("Please enter a meeting name before recording");
      return;
    }

    try {
      const recorder = new AudioRecorder({
        recordingType: recordingType,
        onRecordingStart: () => {
          setIsRecording(true);
          setRecordingTime(0);
          const message =
            recordingType === "meeting"
              ? "Meeting recording started with screen sharing"
              : "Recording started";
          toast.success(message);
        },
        onError: (error) => {
          toast.error("Failed to start recording: " + error.message);
          setIsRecording(false);
        },
      });

      await recorder.startRecording();
      setAudioRecorder(recorder);
    } catch (error) {
      toast.error("Failed to access microphone or screen sharing");
      console.error("Recording error:", error);
    }
  };

  const stopRecording = async () => {
    if (!audioRecorder) return;

    try {
      const blob = await audioRecorder.stopRecording();
      setAudioBlob(blob);
      setIsRecording(false);
      setShowUploadModal(true);
      toast.success("Recording stopped");
    } catch (error) {
      toast.error("Failed to stop recording");
      console.error("Stop recording error:", error);
    }
  };

  const handleUploadSuccess = (data: any) => {
    setCurrentMeetingData(data);
    setShowUploadModal(false);

    if (data.skipTranscription) {
      // User chose "Later" - just redirect to meetings list
      toast.success("Meeting saved! You can generate transcription later.");
      router.push("/dashboard/transcriptions");
    } else {
      // User chose "Generate Now" - show transcription modal
      setShowTranscriptionModal(true);
    }
  };

  const handleTranscriptionSuccess = () => {
    setShowTranscriptionModal(false);
    toast.success("Meeting created successfully!");
    router.push(`/dashboard/transcriptions/${currentMeetingData.meeting._id}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <SidebarNavigation user={user} />

      <div className="flex-1 overflow-auto">
        <div className="p-8 pt-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">New Meeting</h2>
            <p className="text-muted-foreground">
              Start recording your meeting and generate AI-powered
              transcriptions
            </p>
          </div>

          <div className="grid gap-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Details</CardTitle>
                <CardDescription>
                  Enter the meeting information before starting the recording
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting-name">Meeting Name *</Label>
                  <Input
                    id="meeting-name"
                    placeholder="e.g., Weekly Team Standup"
                    value={meetingName}
                    onChange={(e) => setMeetingName(e.target.value)}
                    disabled={isRecording}
                  />
                </div>

                <div className="space-y-2 hidden">
                  <Label>Participants</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add participant name"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addParticipant()}
                      disabled={isRecording}
                    />
                    <Button
                      onClick={addParticipant}
                      size="icon"
                      variant="outline"
                      disabled={isRecording}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {participants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {participants.map((participant, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Users className="h-3 w-3" />
                          {participant}
                          {!isRecording && (
                            <button
                              onClick={() => removeParticipant(participant)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recording Type</CardTitle>
                <CardDescription>
                  Choose how you want to record your meeting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={recordingType}
                  onValueChange={(value: "microphone" | "meeting") =>
                    setRecordingType(value)
                  }
                  disabled={isRecording}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="microphone" id="microphone" />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Mic className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <Label
                          htmlFor="microphone"
                          className="text-base font-medium cursor-pointer"
                        >
                          Microphone Recording
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Record audio from your microphone only. Perfect for
                          in-person meetings or phone calls.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="meeting" id="meeting" />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                        <Monitor className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <Label
                          htmlFor="meeting"
                          className="text-base font-medium cursor-pointer"
                        >
                          Meeting Recording
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Record your microphone + screen/tab audio. Perfect for
                          online meetings, webinars, or video calls.
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {recordingType === "meeting" && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Screen Sharing Required
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          When you start recording, your browser will ask
                          permission to share your screen or a specific tab.
                          This allows us to capture both your microphone and the
                          meeting audio from your browser.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audio Recording</CardTitle>
                <CardDescription>
                  {isRecording
                    ? `${
                        recordingType === "meeting" ? "Meeting" : "Microphone"
                      } recording in progress... Click stop when finished`
                    : `Click start to begin ${
                        recordingType === "meeting" ? "meeting" : "microphone"
                      } recording`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="text-center space-y-4">
                    {isRecording && (
                      <div className="space-y-2">
                        <div className="text-2xl font-mono font-bold text-red-500">
                          {formatTime(recordingTime)}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          {recordingType === "meeting" ? (
                            <>
                              <Video className="h-4 w-4" />
                              <span>Recording meeting with screen sharing</span>
                            </>
                          ) : (
                            <>
                              <Mic className="h-4 w-4" />
                              <span>Recording microphone audio</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      size="lg"
                      className={`w-32 h-32 rounded-full ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600 animate-pulse"
                          : "bg-primary hover:bg-primary/90"
                      }`}
                      disabled={!meetingName.trim()}
                    >
                      {isRecording ? (
                        <MicOff className="h-8 w-8" />
                      ) : (
                        <Mic className="h-8 w-8" />
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </p>
                  </div>
                </div>

                {isRecording && (
                  <div
                    className={`border rounded-lg p-4 ${
                      recordingType === "meeting"
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        recordingType === "meeting"
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full animate-pulse ${
                          recordingType === "meeting"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {recordingType === "meeting"
                          ? "Meeting recording in progress"
                          : "Recording in progress"}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        recordingType === "meeting"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {recordingType === "meeting"
                        ? "Capturing microphone and screen/tab audio. Make sure your meeting tab is active."
                        : "Make sure your microphone is working and speak clearly"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
        audioBlob={audioBlob}
        meetingName={meetingName}
        userId={user._id}
        participants={participants}
        recordingType={audioRecorder?.getRecordingType()}
      />

      {/* Transcription Modal */}
      <TranscriptionModal
        isOpen={showTranscriptionModal}
        onClose={() => setShowTranscriptionModal(false)}
        onSuccess={handleTranscriptionSuccess}
        meetingId={currentMeetingData?.meeting._id || ""}
        audioUrl={currentMeetingData?.audioUrl || ""}
      />
    </div>
  );
}
