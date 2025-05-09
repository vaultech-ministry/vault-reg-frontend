import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  Church,
  Group,
  Contact,
  Medal,
  PartyPopper,
  User,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Users, label: "Vaultizens", path: "/members" },
    { icon: Group, label: "AG Groups", path: "/groups" },
    { icon: CalendarCheck, label: "Attendance", path: "/attendance" },
    { icon: Contact, label: "Visitors", path: "/visitors" },
    { icon: Medal, label: "Leaders", path: "/leaders" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: PartyPopper, label: "Events", path: "/vaultevents" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0 w-72" : "-translate-x-full"}  // Increased mobile sidebar width
        bg-indigo-900 text-white lg:translate-x-0 lg:w-20`} // Desktop: smaller width for sidebar
    >
      <div className="flex flex-col h-full">
        {/* Close button for mobile */}
        <div className="flex flex-row justify-between items-center">
          {/* Logo */}
        <div
          className="p-6 flex items-center lg:justify-center gap-3 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          <Church className="w-8 h-8 text-white" />
          <span className="text-xl font-bold block lg:hidden">Vault Reg</span>
        </div>

        <div className="lg:hidden flex justify-end p-4">
          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-2">
          {menuItems.map((item) => (
            <div key={item.path} className="relative group">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors justify-start lg:justify-center
                ${
                  location.pathname === item.path
                    ? "bg-indigo-800 text-white"
                    : "text-gray-300 hover:bg-indigo-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="lg:hidden">{item.label}</span>
              </button>

              {/* Tooltip for collapsed desktop sidebar */}
              <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg transition-opacity duration-200">
                {item.label}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin block at bottom */}
        <div className="p-4 border-t border-indigo-800 mt-auto">
          {/* Mobile view */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="bg-indigo-800 w-8 h-8 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Vault Reg</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>

          {/* Desktop collapsed view */}
          <div className="hidden lg:flex flex-col items-center text-center">
            <div className="bg-indigo-800 w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">V</span>
            </div>
            <p className="text-xs mt-1 font-medium">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
