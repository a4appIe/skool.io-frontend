import { Card, CardContent } from '@/components/ui/card'
import { CalendarX, FileSpreadsheet } from 'lucide-react'
import React from 'react'

const ScheduleStats = ({stats}) => {
  return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.gradient} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl lg:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FileSpreadsheet className="h-3 w-3" />
                        {stat.subtitle}
                      </p>
                    )}
                    {stat.warning && (
                      <p className="text-xs text-orange-600 flex items-center gap-1">
                        <CalendarX className="h-3 w-3" />
                        {stat.warning}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
  )
}

export default ScheduleStats
