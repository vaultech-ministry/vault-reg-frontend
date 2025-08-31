import React, { useState, useEffect, lazy } from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  BarController,
} from "chart.js"

const Pie = lazy(() => import("react-chartjs-2").then((module) => ({default: module.Pie})))
const Doughnut = lazy(() => import("react-chartjs-2").then((module) => ({ default: module.Doughnut})))

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, BarElement, BarController);

function AttendanceCard({ darkMode }) {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchAttendanceData()
  }, [])

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${api}analytics`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.attendance_today);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // if (!attendanceData) return <p className='text-gray-400'>No attendance data available</p>;
  

  const ChartCard = ({ title, children }) => (
    <div className={`rounded-lg shadow p-6 border flex flex-col items-center justify-center h-72 w-full ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
      <h2 className={`text-xl font-semibold mb-4 text-center ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{title}</h2>
      <div className="w-full h-full flex items-center justify-center">{children}</div>
    </div>
  );

  const todayPieChart = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [  
          attendanceData?.total_present_count || 0,
          attendanceData?.total_absent_count || 0],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 99, 132, 0.8)"]
          : ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
      },
    ],
  };

  const todayDonutChart = {
    labels: ["Telios", "Elysian"],
    datasets: [
      {
        data: [
          attendanceData?.total_telios_attendance_percentage || 0,
          attendanceData?.total_elysians_attendance_percentage || 0],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 159, 64, 0.8)"]
          : ["rgba(75, 192, 192, 0.8)", "rgba(255, 206, 86, 0.8)"],
      },
    ],
  };

  return (
    <div className={`px-4 py-4 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <h2 className={`font-bold text-2xl text-center ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
        Today's Attenance 
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
        <ChartCard title="Total Attendance">
          <div className="w-60 h-60">
            <Pie data={todayPieChart}/>
          </div>
        </ChartCard>

        <ChartCard title="Attendance by Gender">
          <div className="w-60 h-60">
            <Doughnut data={todayDonutChart} options={{ maintainAspectRatio: false }}/>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default AttendanceCard
