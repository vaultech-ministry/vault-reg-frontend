import React, { useState } from "react";
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
} from "lucide-react";

const Sidebar = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

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
  };

  return (
    <div
      className={`h-screen fixed inset-y-0 left-0 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-indigo-900 text-white"
      } ${isHovered ? "w-64" : "w-20"} `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className="p-6 flex items-center gap-3 cursor-pointer"
        onClick={() => handleNavigation("/")}
      >
        <Church className="w-8 h-8 transition-all duration-300" />
        {isHovered && <span className="text-xl font-bold">Vault Reg</span>}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? `${darkMode ? "bg-gray-700" : "bg-indigo-800"} text-white`
                : `${darkMode ? "text-gray-400" : "text-gray-300"} hover:${
                    darkMode ? "bg-gray-700" : "bg-indigo-800"
                  }`
            }`}
          >
            <item.icon className="w-6 h-6 transition-all duration-300" />
            {isHovered && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Profile Section (Always at the Bottom) */}
      <div
        className={`p-4 border-t ${
          darkMode ? "border-gray-700" : "border-indigo-800"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-2">
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-indigo-700"
            } w-8 h-8 rounded-full flex items-center justify-center`}
          >
            <span className="text-sm font-medium">V</span>
          </div>
          {isHovered && (
            <div className="flex-1">
              <p className="text-sm font-medium">Vault Reg</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
