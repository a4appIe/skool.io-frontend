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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Bell, Edit, Trash2, Users } from "lucide-react";
import React from "react";

const NoticeCard = ({ notice, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAudienceBadge = (audience) => {
    switch (audience) {
      case "teacher":
        return (
          <Badge className="bg-red-100 text-red-500 border-red-500">
            Teachers
          </Badge>
        );
      case "student":
        return (
          <Badge className="bg-green-100 text-green-500 border-green-500">
            Students
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-500 border-blue-500">
            All
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-white border border-gray-500 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-red-700" />
              <h3 className="font-semibold text-gray-900 text-md">
                {notice.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <span>Created: {formatDate(notice.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">Audience:</span>
              {getAudienceBadge(notice.audience)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {notice.message}
        </p>
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(notice)}
            className="border-gray-300 text-gray-700 hover:border-gray-400"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this notice? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(notice)}
                  className="bg-red-700 hover:bg-red-800"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoticeCard;
