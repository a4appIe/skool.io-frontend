// In your dashboard or any component
import { AddSchool } from "./AddSchool";

export default function SuperAdminDashboard() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schools Management</h1>
        <AddSchool />
      </div>

      {/* Rest of your dashboard content */}
    </div>
  );
}
