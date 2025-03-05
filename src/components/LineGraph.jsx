import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function LineGraph({ attendanceTrends = [], darkMode }) {
  if (!attendanceTrends || attendanceTrends.length === 0) {
    return <p className="text-center text-lg">No attendance trend data available</p>;
  }

  console.log(attendanceTrends)

  const data = {
    labels: attendanceTrends.map((trend) => trend.date),
    datasets: [
      {
        label: "Attendance Percentage",
        data: attendanceTrends.map((trend) => trend.percentage),
        borderColor: darkMode ? "#90caf9" : "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        pointBackgroundColor: darkMode ? "#90caf9" : "#2196f3",
      },
    ],
  };

  return (
    <div className={`w-full p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h3 className="text-center text-lg font-bold mb-4">Attendance Trends</h3>
      <Line data={data} />
    </div>
  );
}

export default LineGraph;
