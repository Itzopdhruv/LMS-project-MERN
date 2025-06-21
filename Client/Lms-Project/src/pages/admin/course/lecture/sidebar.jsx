import { ChartBar, Library, Menu } from "lucide-react";
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setOpen(false); // Manually close the drawer
  };

  const linkClasses =
    "flex items-center gap-3 text-gray-700 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all";

  const activeClasses = "bg-gray-200 dark:bg-gray-700 font-semibold";

  const SidebarLinks = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white px-2">Menu</h2>

      <button onClick={() => handleNav("dashboard")} className={linkClasses}>
        <ChartBar size={22} />
        <span>Dashboard</span>
      </button>

      <button onClick={() => handleNav("course")} className={linkClasses}>
        <Library size={22} />
        <span>Courses</span>
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[250px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 shadow-md p-6">
        <SidebarLinks />
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 shadow-md">
              <Menu />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[250px] p-6 dark:bg-gray-900">
            <SidebarLinks />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-10 bg-gray-50 dark:bg-gray-950">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
