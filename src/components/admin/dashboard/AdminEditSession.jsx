import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import React, { useState } from "react";

export default function AdminEditSession({
  session,
  sessions,
  loading,
  handleEditSession,
}) {
  const [open, setOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(session);
  console.log(session)
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Trigger parent handler for session update
      handleEditSession(selectedSession);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button with Icon */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-red-50">
          <Pencil className="h-4 w-4 text-red-700" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
        </DialogHeader>
        {!loading ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Session dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Session
              </label>
              <Select
                value={selectedSession}
                onValueChange={setSelectedSession}
                required
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-red-700 focus:border-red-700">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session?._id} value={session?.session}>
                      {session?.session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Footer */}
            <DialogFooter className="gap-2 flex flex-row-reverse">
              <Button
                type="submit"
                className="bg-red-700 hover:bg-red-800"
                disabled={submitting || !selectedSession}
              >
                {submitting ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex items-center flex-col justify-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-700 border-t-transparent"></div>
            <p>Loading</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
