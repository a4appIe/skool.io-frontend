/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, RefreshCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteSessionById } from "@/services/session.service";

export default function AdminViewSession({ fetchSessions, sessions, loading }) {
  async function handleDelete() {
    let isDel = deleteSessionById();
    if (isDel) {
      fetchSessions();
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 flex-1 w-full">
          <Eye className="h-4 w-4" />
          <span className="hidden sm:block">View All Sessions</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>All Sessions </DialogTitle>
          <DialogDescription
            className={"flex items-center gap-5 justify-between"}
          >
            Sessions list{" "}
            <Button
              variant={"outline"}
              onClick={fetchSessions}
              className={"p-0"}
            >
              <RefreshCcw /> Refresh
            </Button>
          </DialogDescription>
        </DialogHeader>
        {!loading ? (
          <ScrollArea className="max-h-[360px] pr-1 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-50">
                  <TableHead className="font-semibold text-gray-700 w-2/3">
                    Session Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 w-1/3 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-gray-500 text-center py-10"
                    >
                      No sessions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell className="text-gray-900">
                        {s.session}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mx-1"
                          onClick={() => handleDelete?.(s)}
                        >
                          <Trash2 className="h-4 w-4 text-red-700" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
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
