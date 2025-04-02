import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import toast from 'react-hot-toast'

function EventAttendance({ darkMode }) {
  const [attendance, setAttendance] = useState({})
  const [attendees, setAttendees] = useState([])
  const [filteredAttendees, setFilteredAttendees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const api = import.meta.env.VITE_API_URL

  // const today = new Date().toISOString().split("T")[0]
  const today = '2025-04-16'

  useEffect(() => {
    fetchAttendanceData()
  }, [api, today])

  const fetchEventMembers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${api}member-event`)
      if (response.ok) {
        const data = await response.json()
        setAttendees(data)
        setFilteredAttendees(data)
      }
    } catch (error) {
      console.error('Error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAttendanceData = async (date) => {
    if (!date) return

    setIsLoading(true)
    try{
      const response = await fetch(`${api}event-attendance?date=${date}`)
      if (response.ok) {
        const data = await response.json()

        if (Array.isArray(data)) {
          setAttendance(data)
          setFilteredAttendees(data)
        } else {
            setAttendance([])
            setFilteredAttendees([])
        }
      } else {
        toast.error("Failed to fetch attendance data")
      }
    } catch (error) {
      console.error('Error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAttendance = async (attendanceId) => {
    if (!selectedDate) {
      toast.error("Please select a date first!")
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`${api}event-attendance/${attendanceId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ present: true, date: selectedDate })
      })
      if (response.ok) {
        const data = await response.json()
        toast.success('Marked successfully')
        setAttendance((prev) => 
          prev.map((attendee) => 
            attendee.id = attendanceId
              ? { ...attendee, present: true, check_in_time: data.check_in_time }
              : attendee)
        )
      } else {
        toast.error('Failed to mark attendance!')
      }
    } catch (error) {
      console.error('Error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term)
    const filtered = attendance.filter((attendee) => 
    `${attendee.full_name.toLowerCase().includes(term)}`)
    setFilteredAttendees(filtered)
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
        <h2 className='text-2xl font-semibold mb-4'>Exchange 2025 Attendance</h2>
        <div className='mb-4 flex items-center space-x-4'>
          <label className='font-medium'>Select Date:</label>
          <input
            type='date'
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              fetchAttendanceData(e.target.value);
            }}
            className={`p-2 border rounded ${
              darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            } focus:ring-2`}
          />
        </div>
      <div className={`rounded-xl shadow-sm border overflow-hidden p-4 ${darkMode ? 'bg-gray-800 divide-gray-700 border-gray-700' : 'bg-white divide-gray-200 border-gray-100'}`}>
        <div className='mb-4 flex items-center'>
          <Search className='w-5 h-5 text-gray-500'/>
          <input
            type='text'
            placeholder='Search Attendees...'
            value={searchTerm}
            onChange={handleSearch}
            className={`p-2 ml-2 rounded border ${
              darkMode ?  'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className='overflow-x-auto'>
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800': 'bg-white divide-gray-200'}`}>
                <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                    <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Name</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Gender</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Member</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Ag-Group</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Check-in Time</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Actions</th>
                    </tr>
                </thead>
                {isLoading ? (
                  <EventAttendanceLoadingSkeleton darkMode={darkMode}/>) : (
                    <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                    {filteredAttendees.map((attendee, index) => (
                      <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap'>{attendee.full_name}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{attendee.gender}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{attendee.vault_member }</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{attendee.ag_group}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{attendee.check_in_time}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <button
                          onClick={() => handleAttendance(attendee.id)}
                          disabled={!selectedDate}
                          className={`px-4 py-2 rounded ${
                            !selectedDate
                             ? "bg-gray-400 cursor-not-allowed"
                             : "bg-green-500 hover: bg-blue-600"
                          } text-white`}
                        >
                          Mark Attendance
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
  )
}

export default EventAttendance

function EventAttendanceLoadingSkeleton({darkMode}) {
  return (
    <SkeletonTheme baseColor={darkMode ? "#2D2F33" : "#E0E0E0"} highlightColor={darkMode ? "#3A3C40" : "#F5F5F5"}>
      <tbody>
        {[...Array(12)].map((_, rowIndex) => (
          <tr key={rowIndex} className='animate-pulse'>
            {[...Array(6)].map((_, colIndex) => (
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
