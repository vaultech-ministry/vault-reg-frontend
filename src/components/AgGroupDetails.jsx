import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

function AgGroupDetails({ darkMode }) {
  const { id } = useParams()
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchGroupDetails()
    fetchGroupMembers()
  }, [id])

  const fetchGroupDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${api}group/${id}/`)
      if (response.ok) {
        const data = await response.json()
        setGroup(data)
      }
    } catch (error) {
      console.error('Error fetching group details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGroupMembers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${api}member?group_id=${id}`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching group members:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-center"><LoadingSpinner /></p>

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {group && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{group.group_name}</h1>
          <p className="text-gray-400">{group.description}</p>
        </div>
      )}
      
      {members.length === 0 ? (
        <p className='text-center text-xl text-gray-500'>No members in this Group 😱 </p>
      ) : (
        <div>
        <h2 className="text-2xl font-bold mb-4">Members</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Alt Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">School</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">E-Contact</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4">{member.first_name} {member.second_name}</td>
                  <td className="px-6 py-4">{member.gender}</td>
                  <td className="px-6 py-4">{member.location}</td>
                  <td className="px-6 py-4">{member.phone}</td>
                  <td className="px-6 py-4">{member.alt_phone ? member.alt_phone : 'N/A'}</td>
                  <td className="px-6 py-4">{format(new Date(member.date_of_birth), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4">{member.school ? member.school : 'N/A'}</td>
                  <td className="px-6 py-4">{member.contact_name ? `${member.contact_name} - ${member.contact_phone} (${member.relationship})` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

    </div>
  )
}

export default AgGroupDetails
