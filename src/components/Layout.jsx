import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import Sidebar from "./Sidebar";
import { Menu, Sun, Moon } from "lucide-react";
import Members from "../routes/Members";
import Dashboard from "../routes/Dashboard";
import Attendance from "../routes/Attendance";
import AgGroups from "../routes/AgGroups";
import Settings from "../routes/Settings";
import Analytics from "../routes/Analytics";
import AgGroupDetails from "./AgGroupDetails";
import Visitors from "../routes/Visitors";
import Leaders from "../routes/Leaders";
import Event from "../routes/Events";
import EventDetails from "./event/EventDetails";
import MemberDetails from "./MemberDetail";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const Layout = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className={`relative flex h-screen overflow-hidden ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-md bg-indigo-600 text-white"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white"
        onClick={() => setIsMobileSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="flex-1 z-0 overflow-y-auto pt-16 lg:pt-0 lg:ml-20">
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/members" element={<PrivateRoute><Members darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/member/:memberId" element={<PrivateRoute><MemberDetails darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/groups" element={<PrivateRoute><AgGroups darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/visitors" element={<PrivateRoute><Visitors darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/leaders" element={<PrivateRoute><Leaders darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/group/:id" element={<PrivateRoute><AgGroupDetails darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/vaultevents" element={<PrivateRoute><Event darkMode={darkMode} /></PrivateRoute>} />
          <Route path="/vaultevents/:eventId" element={<PrivateRoute><EventDetails darkMode={darkMode} /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
