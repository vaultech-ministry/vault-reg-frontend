import {useEffect, useState} from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion'
import StatsCard from '../components/StatsCard';
import AttendanceCard from '../components/AttendanceCard';

const Dashboard = ({ darkMode }) => {
  const [members, setMembers] = useState([]);
  const [dashboardData, setDashboardData] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = import.meta.env.VITE_API_URL


  useEffect(() => {
    fetchMembers();
    fetchDashboardData();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${api}recent-members`); 
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message)
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${api}dashboardata`)
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      } else {
        toast.error('Failed to fetch members')
      }
    } catch (error) {
        console.error('Error', error)
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className={`p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Dashboard</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back, track your ministry's growth</p>
        </div>
        <Link 
          to={'/attendance'}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Take Attendance
        </Link>
      </div>

      <StatsCard darkMode={darkMode}/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm`}>
          <h2 className="text-lg font-semibold mb-4 text-gray-100">Attendance Trends Today</h2>
          {isLoading ? (
            <AttendanceSkeleton darkMode={darkMode} />
          ) : (
            <AttendanceCard darkMode={darkMode} />
          )}
          

        </div>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm`}>
          <h2 className="text-lg font-semibold mb-4 text-gray-100">Recent Members</h2>

          {isLoading ? (
            <RecentMembersSkeleton darkMode={darkMode} />
          ) : (
            <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
              <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">AG-Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">DOB</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {member.first_name} {member.second_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.ag_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {member.gender || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.location || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{format(new Date(member.date_of_birth), 'MMM d, yyyy') || 'N/A'}</div>
                    </td>
    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className={`w-full md:w-1/2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm`}>
            <h2 className="text-lg font-semibold mb-4 text-gray-100">This week's Birthdays</h2>

            {isLoading ? (
              <BirthdaysSkeleton darkMode={darkMode}/>
            ) : (
              <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Day</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Turnings</th>
                  </tr>
                </thead>

                <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {dashboardData.birthdays_this_week?.length > 0 ? (
                  dashboardData.birthdays_this_week.map((birthday, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {birthday.name}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {birthday.day}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {birthday.age_after_birthday}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No birthdays this week
                    </td>
                  </tr>
                )}
                  </tbody>
              </table>
            </div>
            )}

          </div>

          <div className={`w-full md:w-1/2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm`}>
            <h2 className="text-lg font-semibold mb-4 text-gray-100">This Month's Birthdays</h2>

            {isLoading ? (
              <BirthdaysSkeleton darkMode={darkMode}/>
            ) : (
               <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Day</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Turnings</th>
                  </tr>
                </thead>

                <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {dashboardData.birthdays_this_month?.length > 0 ? (
                  dashboardData.birthdays_this_month.map((birthday, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {birthday.name}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {birthday.day}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {birthday.age_after_birthday}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      No birthdays this Month
                    </td>
                  </tr>
                )}
                  </tbody>
              </table>
            </div>
            )}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

function AttendanceSkeleton({ darkMode }) {
  return (
    <SkeletonTheme baseColor={darkMode ? "#2D2F33" : "#E0E0E0"} highlightColor={darkMode ? "#3A3C40" : "#F5F5F5"}>
    <div className="p-4 rounded-lg shadow-sm">
      <Skeleton height={30} width={200} />
      <Skeleton height={150} className="mt-4" />
    </div>
  </SkeletonTheme>
  )
}

function RecentMembersSkeleton({ darkMode }) {
  return (
    <SkeletonTheme baseColor={darkMode ? "#2D2F33" : "#E0E0E0"} highlightColor={darkMode ? "#3A3C40" : "#F5F5F5"}>
    <div className="p-4 rounded-lg shadow-sm">
      <Skeleton height={30} width={200} />
      <div className="mt-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} height={40} className="mb-2" />
        ))}
      </div>
    </div>
  </SkeletonTheme>
  )
}

function BirthdaysSkeleton({ darkMode }) {
  return (
  <SkeletonTheme baseColor={darkMode ? "#2D2F33" : "#E0E0E0"} highlightColor={darkMode ? "#3A3C40" : "#F5F5F5"}>
  <div className="p-4 rounded-lg shadow-sm">
    <Skeleton height={30} width={200} />
    <div className="mt-4">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} height={40} className="mb-2" />
      ))}
    </div>
  </div>
  </SkeletonTheme>
  )
}