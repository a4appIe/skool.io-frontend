import { Button } from "@/components/ui/button";
import { Bell, Plus, Users } from "lucide-react";
import React from "react";

const NoNotices = ({
  handleCreateNotice,
  audienceFilter,
  getFilterLabel,
  setAudienceFilter,
}) => {
  return (
    <div className="text-center py-12">
      <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {audienceFilter === "all"
          ? "No Notices Yet"
          : `No ${getFilterLabel(audienceFilter)} Notices`}
      </h3>
      <p className="text-gray-600 mb-4">
        {audienceFilter === "all"
          ? "Create your first notice to get started with school communications."
          : `No notices found for ${getFilterLabel(
              audienceFilter
            ).toLowerCase()}. Try changing the filter or create a new notice.`}
      </p>
      <div className="flex items-center gap-3 justify-center">
        {audienceFilter !== "all" && (
          <Button
            variant="outline"
            onClick={() => setAudienceFilter("all")}
            className="border-gray-300"
          >
            <Users className="h-4 w-4" />
            Show All Notices
          </Button>
        )}
        <Button
          className="bg-red-700 hover:bg-red-800 text-white"
          onClick={handleCreateNotice}
        >
          <Plus className="h-4 w-4" />
          Create Notice
        </Button>
      </div>
    </div>
  );
};

export default NoNotices;
