import React, { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetFooter } from "@/components/ui/sheet";
import { Plus, BookOpen, X } from "lucide-react";
import { createSession } from "@/services/session.service";

const AdminCreateSession = () => {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSession({ session });
    } finally {
      setSession("");
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Sheet trigger */}
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-red-700 text-white flex-1 w-full"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:block">Add Session</span>
        </Button>
      </SheetTrigger>

      {/* Sheet Content */}
      <SheetContent
        side="right"
        className="w-full max-w-md !p-0 overflow-y-auto [&>button]:hidden"
        style={{ border: "none" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-4 pb-2 bg-red-50 border-b border-red-100 rounded-tr-xl rounded-tl-xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-red-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-red-700" />
              </div>
              <span className="text-lg font-bold text-gray-800">
                Add New Session
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Add details to create a new session.
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-gray-700"
            tabIndex={-1}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Fields */}
        <form className="flex flex-col gap-6 px-6 py-8" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Session Name <span className="text-red-600">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. 2024-2025"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="py-6 rounded-lg placeholder:text-gray-400"
              required
              maxLength={24}
            />
          </div>
          <SheetFooter className="flex-row-reverse gap-2 justify-end">
            <Button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white flex-1"
              disabled={!session || loading}
            >
              {loading ? "Adding..." : "Create Session"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AdminCreateSession;
