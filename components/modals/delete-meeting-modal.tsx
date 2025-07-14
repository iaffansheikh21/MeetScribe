"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface DeleteMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  meetingTitle: string;
  meetingId: string;
}

export default function DeleteMeetingModal({
  isOpen,
  onClose,
  onSuccess,
  meetingTitle,
  meetingId,
}: DeleteMeetingModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== meetingTitle) {
      toast.error("Meeting title doesn't match");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Meeting deleted successfully");
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete meeting");
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error("Failed to delete meeting");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("");
      onClose();
    }
  };

  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Meeting
          </DialogTitle>

          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">
                This action cannot be undone. This will permanently delete the
                meeting, its transcription, and audio file.
              </span>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-text" className="text-sm font-medium">
              Type the meeting title to confirm deletion:
            </Label>
            <div className="p-2 bg-gray-100 rounded border text-sm font-mono break-all">
              {meetingTitle}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Enter meeting title here..."
              disabled={isDeleting}
              className="font-mono"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== meetingTitle}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Meeting
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;
}
