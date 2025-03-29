import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

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
        const response = await fetch(`${api}memberlist`);
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

  // if (isLoading) return <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}><LoadingSpinner /></p>;

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
          className={`p-2 ml-2 rounded border ${
            darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"
          } focus:ring-2 focus:ring-blue-500`}
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
          {isLoading ? (
            <AttendanceLoadingSkeleton darkMode={darkMode} />
          ) : (
          <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {member.first_name} {member.second_name} {member.sur_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.ag_name ? member.ag_name : 'N/A'}</div>
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
          )}
        </table>
      </div>
    </div>
    </div>
  );
};
export default Attendance;

function AttendanceLoadingSkeleton({ darkMode }) {
  return (
    <SkeletonTheme baseColor={darkMode ? "#2D2F33" : "#E0E0E0"} highlightColor={darkMode ? "#3A3C40" : "#F5F5F5"}>
      <tbody className={`${darkMode ? "bg-gray-900 divide-gray-700" : "bg-white divide-gray-200"}`}>
        {[...Array(12)].map((_, rowIndex) => (
          <tr key={rowIndex} className='animate-pulse'>
            {[...Array(4)].map((_, colIndex) => (
              <td key={colIndex} className='px-6 py-4 whitespace-nowrap'>
                <Skeleton height={30} className='rounded-md'/>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </SkeletonTheme>
  )
}

// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types'
// import { CheckCircle, XCircle, Search } from 'lucide-react';
// import toast from 'react-hot-toast';
// import LoadingSpinner from '../components/LoadingSpinner';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

// const Attendance = ({ darkMode }) => {
//   const [attendance, setAttendance] = useState({});
//   const [members, setMembers] = useState([]);
//   const [allMembers, setAllMembers] = useState([])
//   const [filteredMembers, setFilteredMembers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const api = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     fetchAllMembers()
//     fetchPaginatedMembers();
//   }, []);

//   const fetchPaginatedMembers = async (page = 1) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${api}member?page=${page}&page_size=15`);
//       if (response.ok) {
//         const data = await response.json();
//         setMembers(data.results);
//         setFilteredMembers(data.results);
//         setTotalPages(Math.ceil(data.count / 15))
//         setCurrentPage(page)
//       }
//     } catch (error) {
//       console.error('Error: ', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//     const fetchAllMembers = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${api}memberlist`);
//         if (response.ok) {
//           const data = await response.json();
//           setAllMembers(data)
//           console.log(data.length)
//             }
//       } catch (error) {
//         console.error('Error: ', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const today = new Date().toISOString().split("T")[0];
//         const response = await fetch(`${api}attendance?date=${today}`);
//         if (response.ok) {
//           const data = await response.json();
//           const attendanceMap = {};
//           data.forEach((record) => {
//             attendanceMap[record.member] = record.status;
//           });
//           setAttendance(attendanceMap);
//         }
//       } catch (error) {
//         console.error("Error fetching attendance:", error);
//       }
//     };
//     fetchAttendance();
//   }, []);

//   const handleAttendance = async (id, status) => {
//     setIsLoading(true);
//     try {
//       const today = new Date().toISOString().split("T")[0];
//       const checkResponse = await fetch(`${api}attendance?member=${id}&date=${today}`);
//       const existingData = await checkResponse.json();

//       if (checkResponse.ok && existingData.length > 0) {
//         const attendanceId = existingData[0].id;
//         await fetch(`${api}attendance/${attendanceId}/`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status }),
//         });
//       } else {
//         await fetch(`${api}attendance`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             member: id,
//             status,
//           }),
//         });
//       }
//       toast.success('Marked successfully ☺️');
//       setAttendance((prev) => ({ ...prev, [id]: status }));
//     } catch (error) {
//       console.error('Error: ', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     if (term === "") {
//       setFilteredMembers(members)
//     } else {
//       const filtered = allMembers.filter((member) => 
//         `${member.first_name} ${member.second_name} ${member.sur_name}`.toLowerCase().includes(term)
//       )
//       setFilteredMembers(filtered);
//     }

//   };

//   // if (isLoading) return <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}><LoadingSpinner /></p>;

//   return (
//     <div className={`p-6 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
//       <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>

//       <div className="mb-4 flex items-center">
//         <Search className="w-5 h-5 text-gray-500" />
//         <input
//           type="text"
//           placeholder="Search members..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className={`p-2 ml-2 rounded border ${
//             darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"
//           } focus:ring-2 focus:ring-blue-500`}
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
//           <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Group</th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
//               <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Attendance</th>
//             </tr>
//           </thead>
//           {isLoading ? (
//             <AttendanceLoadingSkeleton darkMode={darkMode} />
//           ) : (
//             <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
//             {filteredMembers.map((member) => (
//               <tr key={member.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
//                     {member.first_name} {member.second_name} {member.sur_name}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.ag_name ? member.ag_name : 'N/A'}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.gender}</div>
//                 </td>
//                 <td className="flex gap-3 px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button onClick={() => handleAttendance(member.id, 'Present')} className={attendance[member.id] === 'Present' ? 'text-green-500' : 'text-gray-500'}>
//                     <CheckCircle className="w-5 h-5" /> Present
//                   </button>
//                   <button onClick={() => handleAttendance(member.id, 'Absent')} className={attendance[member.id] === 'Absent' ? 'text-red-500' : 'text-gray-500'}>
//                     <XCircle className="w-5 h-5" /> Absent
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           )}
//         </table>

//         <div className='flex justify-between m-4'>
//           <button
//             onClick={() => fetchPaginatedMembers(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-4 py-2 rounded-lg transition duration-200 ease-in-out ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed text-gray-200' : darkMode ?'bg-indigo-800 text-white hover:bg-indigo-900' 
//           : 'bg-indigo-600 text-white hover:bg-indigo-700' }`}
//           >
//             Previous
//           </button>

//           <span className={`px-4 py-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//             Page {currentPage} of {totalPages}
//           </span>

//           <button
//             onClick={() => fetchPaginatedMembers(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`px-4 py-2 rounded-lg transition duration-200 ease-in-out 
//               ${currentPage === totalPages 
//                 ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
//                 : darkMode 
//                   ? 'bg-indigo-800 text-white hover:bg-indigo-900' 
//                   : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
//           >
//             Next
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };
// export default Attendance;

// function AttendanceLoadingSkeleton({ darkMode }) {
//   return (
//     <SkeletonTheme baseColor={darkMode ? "#2D2F33" : "#E0E0E0"} highlightColor={darkMode ? "#3A3C40" : "#F5F5F5"}>
//       <tbody className={`${darkMode ? "bg-gray-900 divide-gray-700" : "bg-white divide-gray-200"}`}>
//         {[...Array(6)].map((_, rowIndex) => (
//           <tr key={rowIndex} className='animate-pulse'>
//             {[...Array(4)].map((_, colIndex) => (
//               <td key={colIndex} className='px-6 py-4 whitespace-nowrap'>
//                 <Skeleton height={20} className='rounded-md'/>
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </SkeletonTheme>
//   )
// }