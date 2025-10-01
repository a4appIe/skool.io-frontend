/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Users,
  Eye,
  MoreHorizontal,
  GraduationCap,
  UserCheck,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";
import NoticeForm from "@/components/admin/notice/NoticeForm";
import NoticeCard from "@/components/admin/notice/NoticeCard";
import {
  createNewNotice,
  deleteNoticeById,
  getNotices,
  updateNoticeById,
} from "@/services/notice.service";
import NoNotices from "@/components/admin/notice/NoNotices";
import NoticeStats from "@/components/admin/notice/NoticeStats";

// Main AdminNotices Component
export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [audienceFilter, setAudienceFilter] = useState("all"); // New filter state

  // API functions
  const getAllNotices = async () => {
    try {
      let notices = await getNotices();
      if (notices) {
        return notices;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNotice = async (noticeData) => {
    try {
      let notice = await createNewNotice(noticeData);
      if (notice) {
        fetchNotices();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateNotice = async (id, noticeData) => {
    try {
      let updatedNotice = await updateNoticeById(id, noticeData);
      if (updatedNotice) {
        fetchNotices();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotice = async (notice) => {
    try {
      let isDel = await deleteNoticeById(notice);
      if (isDel) {
        fetchNotices();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await getAllNotices();
      setNotices(data || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  // Filter notices based on selected audience
  const filteredNotices = useMemo(() => {
    if (audienceFilter === "all") {
      return notices;
    }
    return notices.filter((notice) => notice.audience === audienceFilter);
  }, [notices, audienceFilter]);

  // Statistics for different audiences
  const statistics = useMemo(() => {
    return {
      all: notices.length,
      teacher: notices.filter((n) => n.audience === "teacher").length,
      student: notices.filter((n) => n.audience === "student").length,
    };
  }, [notices]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = () => {
    setEditingNotice(null);
    setIsSheetOpen(true);
  };

  const handleEditNotice = (notice) => {
    setEditingNotice(notice);
    setIsSheetOpen(true);
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await deleteNotice(noticeId);
      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  const handleFormSuccess = () => {
    fetchNotices();
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingNotice(null);
  };

  const getFilterIcon = (filter) => {
    switch (filter) {
      case "teacher":
        return <GraduationCap className="h-4 w-4" />;
      case "student":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getFilterLabel = (filter) => {
    switch (filter) {
      case "teacher":
        return "Teachers";
      case "student":
        return "Students";
      case "all":
        return "All Notices";
      default:
        return "All Notices";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">All Notices</h1>

          <div className="flex items-center gap-3">
            {/* Audience Filter */}
            <div className="flex items-center gap-2 flex-1">
              <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue placeholder="Filter by audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>All Notices ({statistics.all || 0})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="teacher">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Teachers ({statistics.teacher || 0})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      <span>Students ({statistics.student || 0})</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Create Notice Button */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  className="bg-red-700 hover:bg-red-800 text-white shadow"
                  onClick={handleCreateNotice}
                >
                  <Plus className="h-4 w-4" />
                  Add New Notice
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="!w-full md:!w-[800px] !max-w-none p-0 border-gray-200 [&>button.absolute]:hidden"
              >
                <NoticeForm
                  notice={editingNotice}
                  onClose={handleCloseSheet}
                  onSuccess={handleFormSuccess}
                  createNotice={createNotice}
                  updateNotice={updateNotice}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Statistics Cards */}
        <NoticeStats
          audienceFilter={audienceFilter}
          setAudienceFilter={setAudienceFilter}
          statistics={statistics}
        />

        {/* Active Filter Display */}
        {audienceFilter !== "all" && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            {getFilterIcon(audienceFilter)}
            <span className="text-sm font-medium text-blue-800">
              Showing notices: {getFilterLabel(audienceFilter)}
            </span>
            <Badge variant="secondary" className="ml-auto">
              {filteredNotices.length} notices
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setAudienceFilter("all")}
              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Notices Grid */}
        {filteredNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice._id}
                notice={notice}
                onEdit={handleEditNotice}
                onDelete={handleDeleteNotice}
              />
            ))}
          </div>
        ) : (
          <NoNotices
            handleCreateNotice={handleCreateNotice}
            audienceFilter={audienceFilter}
            getFilterLabel={getFilterLabel}
            setAudienceFilter={setAudienceFilter}
          />
        )}
      </div>
    </div>
  );
}
