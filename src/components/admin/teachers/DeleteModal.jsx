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
import { Trash2 } from "lucide-react";
import { deleteTeacher } from "@/services/teacher.service";

async function handleDelete(teacher) {
  await deleteTeacher(teacher._id);
}

const DeleteModal = ({ teacher }) => {
  return (
    <AlertDialog>
      {/* TRIGGER */}
      <AlertDialogTrigger asChild>
        <div className="text-red-600 focus:text-red-600 px-2 rounded hover:bg-red-50 hover:text-red-700 outline-none p-1">
          <span className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete class</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the{" "}
            <span className="font-semibold">{teacher.name}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={"bg-red-600 text-white hover:bg-red-700"}
            onClick={() => handleDelete(teacher)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
