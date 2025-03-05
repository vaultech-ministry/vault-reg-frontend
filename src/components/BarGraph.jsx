import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarGraph({ attendanceTrends = [], darkMode }) {
  if (!attendanceTrends || attendanceTrends.length === 0) {
    return <p className="text-center text-lg">No attendance trend data available</p>;
  }

  const data = {
    labels: attendanceTrends.map((trend) => trend.date),
    datasets: [
      {
        label: "Attendance Percentage",
        data: attendanceTrends.map((trend) => trend.percentage),
        backgroundColor: darkMode ? "#90caf9" : "#2196f3",
      },
    ],
  };

  return (
    <div className={`w-full p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h3 className="text-center text-lg font-bold mb-4">Attendance Trends</h3>
      <Bar data={data} />
    </div>
  );
}

export default BarGraph;
