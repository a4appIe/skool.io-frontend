import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon, Plus } from 'lucide-react'
import React from 'react'
import AddPeriods from './AddPeriods'

const Header = ({state, getClassName, updateState, handlePeriodsRefresh}) => {
  return (
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <CalendarIcon className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                  Schedule Management
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  {state.selectedClassFilter === "all"
                    ? "Manage school events and holidays"
                    : `Manage schedules for ${getClassName(
                        state.selectedClassFilter
                      )} - Academic Year ${state.academicYear}`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => updateState({ isSheetOpen: true })}
                  className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event/Holiday
                </Button>

                {state.selectedClassFilter !== "all" && (
                  <AddPeriods
                    classId={state.selectedClassFilter}
                    className={getClassName(state.selectedClassFilter)}
                    onUploadSuccess={() =>
                      handlePeriodsRefresh(state.selectedClassFilter)
                    }
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
  )
}

export default Header
