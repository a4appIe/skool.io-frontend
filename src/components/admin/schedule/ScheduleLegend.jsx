import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Hotel, PartyPopper } from 'lucide-react'
import React from 'react'

const ScheduleLegend = ({state}) => {
  return (
            <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h3 className="font-semibold text-gray-700">Legend:</h3>
              <div className="flex flex-wrap gap-2">
                {state.selectedClassFilter !== "all" && (
                  <>
                    <Badge className="bg-blue-600 text-white text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Class Periods
                    </Badge>
                  </>
                )}
                <Badge className="bg-red-600 text-white text-xs">
                  <PartyPopper className="h-3 w-3 mr-1" />
                  Events
                </Badge>
                <Badge className="bg-orange-500 text-white text-xs">
                  <Hotel className="h-3 w-3 mr-1" />
                  Holidays
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
  )
}

export default ScheduleLegend
