import { Button } from '@/components/ui/button'
import { CalendarIcon, Plus, ArrowLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import AddPeriods from './AddPeriods'

const Header = ({state, getClassName, updateState, handlePeriodsRefresh}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-8 flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-2 bg-red-700 rounded-md hover:bg-red-800 text-white hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Schedule Management
              </h1>
              <p className="text-xs text-gray-500">
                {state.selectedClassFilter === "all"
                  ? "Manage school events and holidays"
                  : `Manage schedules for ${getClassName(
                      state.selectedClassFilter
                    )} - Academic Year ${state.academicYear}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              onClick={() => updateState({ isSheetOpen: true })}
              className="bg-red-700 hover:bg-red-800 text-white"
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
      </div>
    </div>
  )
}

export default Header
