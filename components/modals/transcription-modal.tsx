"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  meetingId: string;
  audioUrl: string;
}

export default function TranscriptionModal({
  isOpen,
  onClose,
  onSuccess,
  meetingId,
  audioUrl,
}: TranscriptionModalProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"generating" | "success" | "error">(
    "generating"
  );

  const generateTranscription = async () => {
    try {
      setStatus("generating");
      setProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 500);

      const response = await fetch("/api/transcription/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingId,
          audioUrl,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);
      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        toast.success(`${data.message} `);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setStatus("error");
        toast.error("Failed to generate transcription");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      setStatus("error");
      toast.error("Failed to generate transcription");
    }
  };

  // Auto-start generation when modal opens
  // useState(() => {
  //   if (isOpen) {
  //     generateTranscription()
  //   }
  // })
  useEffect(() => {
    if (isOpen) {
      generateTranscription();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === "generating" && (
              <FileText className="h-5 w-5 text-blue-500" />
            )}
            {status === "success" && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {status === "error" && (
              <div className="h-5 w-5 rounded-full bg-red-500" />
            )}
            {status === "generating" && "Generating Transcription"}
            {status === "success" && "Transcription Complete"}
            {status === "error" && "Generation Failed"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {status === "generating" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Processing your audio and generating transcription...
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                This may take a few moments
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <p className="font-medium">Transcription Generated!</p>
                <p className="text-sm text-muted-foreground">
                  Your meeting transcription is ready to view.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                  <div className="h-6 w-6 rounded-full bg-red-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Failed to generate transcription. Please try again.
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateTranscription} className="flex-1">
                  Retry
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
