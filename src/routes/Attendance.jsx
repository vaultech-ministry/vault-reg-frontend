import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import debounce from 'lodash/debounce';

// Attendance component for marking member attendance with pagination and search
const Attendance = ({ darkMode }) => {
  const [attendance, setAttendance] = useState({}); // Attendance status map
  const [members, setMembers] = useState([]); // Current page of members
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [isLoadingMembers, setIsLoadingMembers] = useState(false); // Loading state for member fetch
  const [updatingMembers, setUpdatingMembers] = useState(new Set()); // Members being updated
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const api = import.meta.env.VITE_API_URL; // API base URL
  const pageSize = 15; // Members per page

  // Debounced function to fetch members with pagination and search
  const fetchMembers = useCallback(
    debounce(async (page = 1, search = "") => {
      setIsLoadingMembers(true);
      try {
        const url = new URL(`${api}member`);
        url.searchParams.append('page', page);
        url.searchParams.append('page_size', pageSize);
        if (search) {
          url.searchParams.append('search', search);
        }
        console.log('Fetching members with URL:', url.toString());
        const response = await fetch(url, {
          headers: { 'Accept': 'application/json' },
          timeout: 10000,
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Members fetched:', data);
          setMembers(data.results || []);
          setTotalPages(Math.ceil(data.count / pageSize) || 1);
          setCurrentPage(page);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to fetch members. Please try again.');
      } finally {
        setIsLoadingMembers(false);
      }
    }, 300),
    [api, pageSize]
  );

  // Fetch members on page or search change
  useEffect(() => {
    console.log('Triggering fetchMembers with page:', currentPage, 'search:', searchTerm);
    fetchMembers(currentPage, searchTerm);
    return () => fetchMembers.cancel(); // Cleanup debounce
  }, [currentPage, searchTerm, fetchMembers]);

  // Fetch attendance records for today
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(`${api}attendance?date=${today}`, {
          headers: { 'Accept': 'application/json' },
          timeout: 10000,
        });
        if (response.ok) {
          const data = await response.json();
          const attendanceMap = {};
          data.forEach((record) => {
            attendanceMap[record.member] = record.status;
          });
          setAttendance(attendanceMap);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    fetchAttendance();
  }, [api]);

  // Handle marking attendance for a member
  const handleAttendance = async (id, status) => {
    setUpdatingMembers((prev) => new Set([...prev, id]));
    try {
      const today = new Date().toISOString().split("T")[0];
      const checkResponse = await fetch(`${api}attendance?member=${id}&date=${today}`, {
        headers: { 'Accept': 'application/json' },
        timeout: 10000,
      });
      const existingData = await checkResponse.json();

      if (checkResponse.ok && existingData.length > 0) {
        const attendanceId = existingData[0].id;
        await fetch(`${api}attendance/${attendanceId}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
      } else {
        await fetch(`${api}attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ member: id, status }),
        });
      }
      toast.success('Marked successfully ☺️');
      setAttendance((prev) => ({ ...prev, [id]: status }));
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance.');
    } finally {
      setUpdatingMembers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value;
    console.log('Search term updated:', term);
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle pagination navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>
      <div className={`rounded-xl shadow-sm border overflow-hidden p-4 ${darkMode ? 'bg-gray-800 divide-gray-700 border-gray-700' : 'bg-white divide-gray-200 border-gray-100'}`}>
        <div className="mb-4 flex items-center">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearch}
            className={`p-2 ml-2 rounded border ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:ring-2 focus:ring-blue-500 w-full max-w-md`}
          />
        </div>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-800 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Attendance</th>
              </tr>
            </thead>
            {isLoadingMembers ? (
              <AttendanceLoadingSkeleton darkMode={darkMode} />
            ) : members.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'No members found matching your search.' : 'No members available.'}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {member.first_name} {member.second_name} {member.sur_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.ag_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.gender}</div>
                    </td>
                    <td className="flex gap-3 px-6 py-4 whitespace-nowrap text-sm font-medium items-center">
                      {updatingMembers.has(member.id) ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAttendance(member.id, 'Present')}
                            className={`${attendance[member.id] === 'Present' ? 'text-green-500' : 'text-gray-500'} flex items-center hover:text-green-400 transition-colors`}
                            disabled={updatingMembers.has(member.id)}
                          >
                            <CheckCircle className="w-5 h-5 mr-1" /> Present
                          </button>
                          <button
                            onClick={() => handleAttendance(member.id, 'Absent')}
                            className={`${attendance[member.id] === 'Absent' ? 'text-red-500' : 'text-gray-500'} flex items-center hover:text-red-400 transition-colors`}
                            disabled={updatingMembers.has(member.id)}
                          >
                            <XCircle className="w-5 h-5 mr-1" /> Absent
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        {!isLoadingMembers && totalPages > 1 && (
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition duration-200 ease-in-out ${
                currentPage === 1
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : darkMode
                    ? 'bg-indigo-800 text-white hover:bg-indigo-900'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Previous
            </button>
            <span className={`px-4 py-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition duration-200 ease-in-out ${
                currentPage === totalPages
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : darkMode
                    ? 'bg-indigo-800 text-white hover:bg-indigo-900'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for member list
function AttendanceLoadingSkeleton({ darkMode }) {
  return (
    <SkeletonTheme baseColor={darkMode ? '#2D2F33' : '#E0E0E0'} highlightColor={darkMode ? '#3A3C40' : '#F5F5F5'}>
      <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
        {[...Array(15)].map((_, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {[...Array(4)].map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                <Skeleton height={30} className="rounded-md" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </SkeletonTheme>
  );
}

export default Attendance;