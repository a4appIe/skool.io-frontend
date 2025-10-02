import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import React, { useMemo } from "react";

// Payroll Overview Card Component
const TeacherPayrollOverviewCard = ({ payrolls }) => {
  const stats = useMemo(() => {
    const total = payrolls?.length || 0;
    const paid = payrolls?.filter((p) => p?.status === "paid").length;
    const pending = payrolls?.filter((p) => p?.status === "pending").length;
    const paidPercentage = total > 0 ? Math.round((paid / total) * 100) : 0;
    const pendingPercentage =
      total > 0 ? Math.round((pending / total) * 100) : 0;

    return { total, paid, pending, paidPercentage, pendingPercentage };
  }, [payrolls]);

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Payroll Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-center mb-6">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500">Total Months</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {stats.paid}
            </div>
            <div className="text-sm text-gray-500">Paid</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>

        {/* Simple Progress Bar instead of pie chart */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment Status</span>
            <span>{stats.paidPercentage}% Paid</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stats.paidPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{stats.paidPercentage}% Paid</span>
            <span>{stats.pendingPercentage}% Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherPayrollOverviewCard;
