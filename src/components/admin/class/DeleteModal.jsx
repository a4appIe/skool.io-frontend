import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteClassById } from "@/services/class.service";

async function handleDelete(cls, fetchClasses) {
  let isDel = await deleteClassById(cls);
  if (isDel) {
    fetchClasses();
  }
}

const DeleteModal = ({ cls, fetchClasses }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-300 text-gray-700 hover:border-red-700 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete class</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the{" "}
            <span className="font-semibold">{cls.className}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={"bg-red-600 text-white hover:bg-red-700"}
            onClick={() => handleDelete(cls, fetchClasses)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
