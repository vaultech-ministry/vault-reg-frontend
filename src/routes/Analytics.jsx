import React, { useEffect, useState } from "react";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import toast from "react-hot-toast";
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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, BarElement, BarController);

function Analytics({ darkMode }) {
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${api}analytics`);
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const ChartCard = ({ title, children }) => (
    <div className={`rounded-lg shadow p-6 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{title}</h2>
      {children}
    </div>
  );

  if (isLoading) return <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Loading...</p>;
  if (!attendanceData) return <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>No attendance data available.</p>;

  const { attendance_today, attendance_this_month, ag_group_attendance_today, ag_group_attendance_month, attendance_last_six_months, ag_group_attendance_last_six_months, attendance_past_one_year, ag_group_attendance_last_12_months } = attendanceData;

  const presentToday = attendance_today.total_attendance_percentage; 

  const gaugeData = {
    datasets: [
      {
        data: [presentToday, 100 - presentToday],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
        cutout: "80%",        
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  const todayPieChart = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendance_today.total_present_count, attendance_today.total_absent_count],
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
        data: [attendance_today.total_telios_attendance_percentage, attendance_today.total_elysians_attendance_percentage],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 159, 64, 0.8)"]
          : ["rgba(75, 192, 192, 0.8)", "rgba(255, 206, 86, 0.8)"],
      },
    ],
  };

  const todayByAgGroupChart = {
    labels: ag_group_attendance_today.map((group) => group.group_name),
    datasets: [
      {
        data: ag_group_attendance_today.map((group) => group.present_count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
      },
    ],
  };

  const todayByAgGroupBarChart = {
    labels: ag_group_attendance_today.map((group) => group.group_name),
    datasets: [
      {
        label: "Attendance (%)",
        data: ag_group_attendance_today.map((group) => group.attendance_percentage),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };
  

  const monthPieChart = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendance_this_month.total_attendance_percentage, 100 - attendance_this_month.total_attendance_percentage],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 99, 132, 0.8)"]
          : ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
      },
    ],
  };

  const monthDonutChart = {
    labels: ["Telios", "Elysian"],
    datasets: [
      {
        data: [attendance_this_month.total_telios_attendance_percentage, attendance_this_month.total_elysians_attendance_percentage],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 159, 64, 0.8)"]
          : ["rgba(75, 192, 192, 0.8)", "rgba(255, 206, 86, 0.8)"],
      },
    ],
  };

  const monthByAgGroupBarChart = {
    labels: ag_group_attendance_month.map((group) => group.group_name),
    datasets: [
      {
        label: "Attendance (%)",
        data: ag_group_attendance_month.map((group) => group.attendance_percentage),
        backgroundColor: "rgba(75, 54, 235, 0.8)",
        borderColor: "rgba(75, 54, 235, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  const lastSixMonthPieChart = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendance_last_six_months.total_attendance_percentage, 100 - attendance_last_six_months.total_attendance_percentage],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 99, 132, 0.8)"]
          : ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
      },
    ],
  };

  const lastSixMonthGenderDonutChart = {
    labels: ["Telios", "Elysian"],
    datasets: [
      {
        data: [attendance_last_six_months.total_telios_attendance_percentage, attendance_last_six_months.total_elysians_attendance_percentage],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 159, 64, 0.8)"]
          : ["rgba(75, 192, 192, 0.8)", "rgba(255, 206, 86, 0.8)"],
      },
    ],
  };

  const lastSixMonthsByAgGroupBarChart = {
    labels: ag_group_attendance_last_six_months.map((group) => group.group_name),
    datasets: [
      {
        label: "Attendance (%)",
        data: ag_group_attendance_last_six_months.map((group) => group.attendance_percentage),
        backgroundColor: "rgba(75, 54, 235, 0.8)",
        borderColor: "rgba(75, 54, 235, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  const pastOneYearPieChart = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendance_past_one_year.total_attendance_percentage, 100 - attendance_past_one_year.total_attendance_percentage],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 99, 132, 0.8)"]
          : ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
      },
    ],
  };

  const pastOneYearGenderDonutChart = {
    labels: ["Telios", "Elysian"],
    datasets: [
      {
        data: [attendance_past_one_year.total_telios_attendance_percentage, attendance_past_one_year.total_elysians_attendance_percentage],
        backgroundColor: darkMode
          ? ["rgba(255, 206, 86, 0.8)", "rgba(255, 159, 64, 0.8)"]
          : ["rgba(75, 192, 192, 0.8)", "rgba(255, 206, 86, 0.8)"],
      },
    ],
  };

  const pastOneYearByAgGroupBarChart = {
    labels: ag_group_attendance_last_12_months.map((group) => group.group_name),
    datasets: [
      {
        label: "Attendance (%)",
        data: ag_group_attendance_last_12_months.map((group) => group.attendance_percentage),
        backgroundColor: "rgba(75, 54, 235, 0.8)",
        borderColor: "rgba(75, 54, 235, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`px-4 py-4 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <h1 className={`font-bold text-2xl ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Attendance Analytics</h1>
      <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Track attendance trends for your organization.</p>

        <div>
          <h1>Today's Attenance</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-8">
        {/* Gauge Chart for Today's Attendance */}
        <ChartCard title="Today's Attendance Percentage">
          <div className="relative w-full h-64 flex items-center justify-center">
            <Doughnut data={gaugeData} options={gaugeOptions} />
            <div className="absolute text-center">
              <p className="text-xl font-bold text-gray-100">{presentToday}%</p>
              <p className="text-sm text-gray-400">Attendance</p>
            </div>
          </div>
        </ChartCard>

        {/* Pie Chart for Today’s Attendance Breakdown */}
        <ChartCard title="Today's Attendance Breakdown">
          <div className="h-64">
            <Pie data={todayPieChart} />
          </div>
        </ChartCard>

        {/* Doughnut Chart for Today’s Attendance by Gender */}
        <ChartCard title="Today's Attendance by Gender">
          <div className="h-64">
            <Doughnut data={todayDonutChart} />
          </div>
        </ChartCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
        {/* Pie Chart for Today’s Attendance by AG Group */}
        <ChartCard title="Today's Attendance by AG Group">
          <div className="h-64">
            <Pie data={todayByAgGroupChart} />
          </div>
        </ChartCard>


        <ChartCard title="Today's Attendance by AG Group (Bar Graph)">
          <div className="h-64">
            <Bar data={todayByAgGroupBarChart} options={barOptions} />
          </div>
        </ChartCard>
        </div>

        <div>
          <h1>This Month Attendance</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
        {/* Pie Chart for Monthly Attendance Breakdown */}
        <ChartCard title="Monthly Attendance Breakdown">
          <div className="h-64">
            <Pie data={monthPieChart} />
          </div>
        </ChartCard>
        

        {/* Doughnut Chart for Monthly Attendance by Gender */}
        <ChartCard title="Monthly Attendance by Gender">
          <div className="h-64">
            <Doughnut data={monthDonutChart} />
          </div>
        </ChartCard>
        </div>

        <div>
        <ChartCard title="Monthly Attendance by AG Group (Last Month)">
          <div className="h-64">
            <Bar data={monthByAgGroupBarChart} options={barOptions} />
          </div>
        </ChartCard>
        </div>

        <div>
          <h1>Last 6 month's Attendance</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
        <ChartCard title="Last 6 Months-Total Members Attendance">
          <div className="h-64">
            <Pie data={lastSixMonthPieChart} />
          </div>
        </ChartCard>

        <ChartCard title="Last 6 months Attendance by Gender">
          <div className="h-64">
            <Doughnut data={lastSixMonthGenderDonutChart} />
          </div>
        </ChartCard>
        </div>

        <div className="mt-4">
        <ChartCard title="Monthly Attendance by AG Group (Last 6 Months)">
          <div className="h-64">
            <Bar data={lastSixMonthsByAgGroupBarChart} options={barOptions} />
          </div>
        </ChartCard>
        </div>

        <div>
          <h1>This year's Attendance</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
        <ChartCard title="Last 12 Months-Total Members Attendance">
          <div className="h-64">
            <Pie data={pastOneYearPieChart} />
          </div>
        </ChartCard>

        <ChartCard title="Last 12 months Attendance by Gender">
          <div className="h-64">
            <Doughnut data={pastOneYearGenderDonutChart} />
          </div>
        </ChartCard>
        </div>

        <div className="mt-4">
        <ChartCard title="Yearly Attendance by AG Group (Last 12 Months)">
          <div className="h-64">
            <Bar data={pastOneYearByAgGroupBarChart} options={barOptions} />
          </div>
        </ChartCard>
        </div>
    </div>
  );
}

export default Analytics;
