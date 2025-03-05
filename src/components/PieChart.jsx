import { Pie } from "react-chartjs-2";

function PieChart({ attendancePercentage, selectedDate, agAttendance, darkMode }) {
  const data = agAttendance
    ? {
        labels: agAttendance.map((item) => item.ag_name),
        datasets: [
          {
            data: agAttendance.map((item) => item.present),
            backgroundColor: ["#8e44ad", "#3498db", "#f1c40f", "#e74c3c"],
          },
        ],
      }
    : {
        labels: ["Present", "Absent"],
        datasets: [
          {
            data: [attendancePercentage, 100 - attendancePercentage],
            backgroundColor: ["#4caf50", "#f44336"],
          },
        ],
      };

  return (
    <div className={`w-96 p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h3 className="text-center text-lg font-bold mb-4">
        {agAttendance ? "AG Group Attendance" : `Attendance on ${selectedDate}`}
      </h3>
      <Pie data={data} />
    </div>
  );
}

export default PieChart;
