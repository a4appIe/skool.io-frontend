import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, PersonStanding } from "lucide-react";
import { ClassForm } from "@/components/admin/class/ClassForm";
import { formatDate } from "@/utils/formatDate";
import DeleteModal from "@/components/admin/class/DeleteModal";
import { useEffect, useState } from "react";
import { getAllClasses } from "@/services/class.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // API CALL
  async function fetchClasses() {
    setLoading(true);
    let classesData = await getAllClasses();
    console.log(classesData);
    setClasses(classesData || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) return <h1>LOADING...</h1>;

  // Data for the chart: [{name: "Class 1", students: 31}, ...]
  const chartData = classes.map((cls) => ({
    name: cls.className,
    students: cls.studentsCount || 0,
  }));

  return (
    <div className="bg-gray-50 px-4 py-7 md:px-8 min-h-screen">
      <div className="flex md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          All Classes
        </h1>
        <ClassForm edit={false} id={null} fetchClasses={fetchClasses} />
      </div>
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        {/* CLASS CARDS */}
        <div className="flex-1">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {classes.map((cls) => (
              <Card
                key={cls._id}
                className="border-gray-200 group hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-red-700 font-semibold flex items-center gap-2">
                    <PersonStanding className="h-5 w-5" />
                    {cls.className}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">
                      Created: {formatDate(cls.createdAt)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      Strength:&nbsp;
                      <span className="font-semibold">
                        {cls.studentsCount > 0 ? cls.studentsCount : 0}
                      </span>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-gray-700 text-sm">
                      <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                        Incharge: {cls?.attendee?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 flex gap-2 justify-between">
                  <div className="flex gap-2">
                    <ClassForm
                      edit={true}
                      cls={cls}
                      fetchClasses={fetchClasses}
                    />
                    <DeleteModal cls={cls} fetchClasses={fetchClasses} />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        {/* BAR CHART */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="h-fit border-gray-200 flex flex-col w-full">
            <CardHeader>
              <CardTitle className="text-red-700">
                Students Count By Class
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center w-full min-h-[220px] sm:min-h-[320px]">
              {chartData.length === 0 ? (
                <span className="text-gray-500">No data to show</span>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 14 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="students"
                      fill="#dc2626"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
            <CardFooter className="justify-center text-gray-500 text-xs">
              <Badge variant="outline">
                {chartData.reduce((t, c) => t + c.students, 0)} Total Students
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
