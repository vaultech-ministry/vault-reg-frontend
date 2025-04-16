import React, { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import toast from 'react-hot-toast';

function EventAttendanceAnalytics({ darkMode }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [analytics, setAnalytics] = useState({
    total_checked_in: 0,
    gender_breakdown: { male: 0, female: 0 },
    age_group_breakdown: { 'Below 18': 0, '18-25': 0, '26-30': 0, Unknown: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setSelectedDate(today);
    fetchAnalytics(today);
  }, [api]);

  const fetchAnalytics = async (date) => {
    if (!date) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${api}attendance-analytics/?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        toast.error('Failed to fetch analytics data');
        setAnalytics({
          total_checked_in: 0,
          gender_breakdown: { male: 0, female: 0 },
          age_group_breakdown: { 'Below 18': 0, '18-25': 0, '26-30': 0, Unknown: 0 },
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error fetching analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <BarChart2 className="w-6 h-6 mr-2" />
        Attendance Analytics
      </h2>
      <div className="mb-6 flex items-center space-x-4">
        <label className="font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            const newDate = e.target.value;
            setSelectedDate(newDate);
            fetchAnalytics(newDate);
          }}
          className={`p-2 border rounded ${
            darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          } focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      {isLoading ? (
        <AnalyticsLoadingSkeleton darkMode={darkMode} />
      ) : (
        <div className="space-y-6">
          {/* Total Checked-In Card */}
          <div
            className={`p-4 rounded-xl shadow-sm border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <h3 className="text-lg font-medium mb-2">Total Checked-In Members</h3>
            <p className="text-3xl font-bold">122</p>
          </div>

          {/* Gender Breakdown */}
          <div
            className={`p-4 rounded-xl shadow-sm border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <h3 className="text-lg font-medium mb-4">Gender Breakdown</h3>
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {['male', 'female'].map((gender) => (
                  <tr key={gender}>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{analytics.gender_breakdown[gender] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Age Group Breakdown */}
          <div
            className={`p-4 rounded-xl shadow-sm border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <h3 className="text-lg font-medium mb-4">Age Group Breakdown</h3>
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Age Group</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {['Below 18', '18-25', '26-30', 'Unknown'].map((ageGroup) => (
                  <tr key={ageGroup}>
                    <td className="px-6 py-4 whitespace-nowrap">{ageGroup}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{analytics.age_group_breakdown[ageGroup] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventAttendanceAnalytics;

function AnalyticsLoadingSkeleton({ darkMode }) {
  return (
    <SkeletonTheme baseColor={darkMode ? '#2D2F33' : '#E0E0E0'} highlightColor={darkMode ? '#3A3C40' : '#F5F5F5'}>
      <div className="space-y-6">
        <div className="p-4 rounded-xl shadow-sm border">
          <Skeleton height={20} width={200} className="mb-2" />
          <Skeleton height={40} width={100} />
        </div>
        <div className="p-4 rounded-xl shadow-sm border">
          <Skeleton height={20} width={200} className="mb-4" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex space-x-4 mb-2">
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={50} />
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl shadow-sm border">
          <Skeleton height={20} width={200} className="mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex space-x-4 mb-2">
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={50} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}