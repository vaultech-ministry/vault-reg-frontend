import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DonutChart({ genderAttendance = [], darkMode }) {
  if (!genderAttendance || genderAttendance.length === 0) {
    return <p className="text-center text-lg">No gender attendance data available</p>;
  }

  const data = {
    labels: genderAttendance.map((item) => item.gender),
    datasets: [
      {
        data: genderAttendance.map((item) => item.present),
        backgroundColor: darkMode ? ["#ffcc80", "#90caf9"] : ["#ff9800", "#2196f3"],
      },
    ],
  };

  return (
    <div className={`w-96 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h3 className="text-center text-lg font-bold mb-4">Attendance by Gender</h3>
      <Doughnut data={data} />
    </div>
  );
}

export default DonutChart;
