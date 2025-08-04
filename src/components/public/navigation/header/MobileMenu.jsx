import { Button } from "@/components/ui/button";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import React, { useState } from "react";
import { publicMenuItems } from "@/utils/publicNavigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => {
    setOpen(!open);
  };
  return (
    <div className="md:hidden block">
      <Button
        onClick={toggleMenu}
        className="flex items-center text-white bg-black"
      >
        <span>
          <Menu size={28} />
          <span className="sr-only">Open menu</span>
        </span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] p-0 bg-white dark:bg-gray-950 [&>button.absolute]:hidden"
        >
          {/* Animated Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-red-700"></div>
            <div className="relative p-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold text-white">
                    Menu
                  </SheetTitle>
                  <SheetDescription className="text-white/80 text-sm">
                    Navigate to your destination
                  </SheetDescription>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 mb-8">
              {publicMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group border border-gray-200 dark:border-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                      <IconComponent
                        size={20}
                        className={`${item.color} group-hover:scale-110 transition-transform`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Go to {item.title.toLowerCase()}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Enhanced Login Button */}
            <div className="space-y-4">
              <Button
                className="w-full  bg-black text-white font-semibold py-6 rounded-full flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                <LogOut size={20} />
                <span className="text-md font-normal">Close</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
