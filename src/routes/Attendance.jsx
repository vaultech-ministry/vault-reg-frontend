import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = ({ darkMode }) => {
  const [attendance, setAttendance] = useState({});
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllMembers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${api}member`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
          setFilteredMembers(data);
        }
      } catch (error) {
        console.error('Error: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMembers();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(`${api}attendance?date=${today}`);
        if (response.ok) {
          const data = await response.json();
          const attendanceMap = {};
          data.forEach((record) => {
            attendanceMap[record.member] = record.status;
          });
          setAttendance(attendanceMap);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    fetchAttendance();
  }, []);

  const handleAttendance = async (id, status) => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const checkResponse = await fetch(`${api}attendance?member=${id}&date=${today}`);
      const existingData = await checkResponse.json();

      if (checkResponse.ok && existingData.length > 0) {
        const attendanceId = existingData[0].id;
        await fetch(`${api}attendance/${attendanceId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } else {
        await fetch(`${api}attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            member: id,
            status,
          }),
        });
      }
      toast.success('Marked successfully ☺️');
      setAttendance((prev) => ({ ...prev, [id]: status }));
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = members.filter((member) =>
      `${member.first_name} ${member.second_name} ${member.sur_name}`.toLowerCase().includes(term)
    );
    setFilteredMembers(filtered);
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>

      <div className="mb-4 flex items-center">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={handleSearch}
          className={`p-2 ml-2 rounded border ${
            darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
          <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Attendance</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {member.first_name} {member.second_name} {member.sur_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.ag_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.gender}</div>
                </td>
                <td className="flex gap-3 px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleAttendance(member.id, 'Present')} className={attendance[member.id] === 'Present' ? 'text-green-500' : 'text-gray-500'}>
                    <CheckCircle className="w-5 h-5" /> Present
                  </button>
                  <button onClick={() => handleAttendance(member.id, 'Absent')} className={attendance[member.id] === 'Absent' ? 'text-red-500' : 'text-gray-500'}>
                    <XCircle className="w-5 h-5" /> Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Attendance;
