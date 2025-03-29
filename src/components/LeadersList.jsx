import React, { useEffect, useState } from 'react'
import { Trash2, Pencil, UserPlus} from 'lucide-react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import LeadersAddModal from './LeadersAddModal';
import LoadingSpinner from './LoadingSpinner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function LeadersList({ darkMode }) {
    const [leaders, setLeaders] = useState([])
    const [selectedLeader, setSelectedLeader] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [showLeaderAddModal, setLeaderAddModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const api = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchLeaders()
    }, [])

    const fetchLeaders = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${api}leaders`)
            if (response.ok) {
                const data = await response.json()
                setLeaders(data)
            } else {
                toast.error('Something went wrong')
            }

        } catch (error) {
            console.error('Error ', error)
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = async (leader) => {
        setSelectedLeader(leader)
        setLeaderAddModal(true)
    }

    const fetchDeleteLeader = async (leaderId) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${api}leader/${leaderId}`, {
                method: "DELETE",
            })
            if (response.ok) {
                toast.success('Deleted Successfully')
                fetchLeaders()
            }
        } catch (error) {
            console.error('Error ', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredLeaders = leaders.filter((leader) => 
        `${leader.member.first_name} ${leader.member.last_name} ${leader.member.sur_name || ""} ${leader.member.gender} ${leader.member.phone} ${leader.member.alt_phone} ${leader.department}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )  
    
    // if (isLoading) return <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}><LoadingSpinner /></p>;

  return (
    <div className='p-4'>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <input
                type="text"
                placeholder="Search leaders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`}
            />
            </div>
        <div className='flex justify-end p-4'>
            <button
                onClick={() => setLeaderAddModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                <UserPlus />
                Add Leader
            </button>
        </div>
      <div className='overflow-x-auto'>
        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Alt Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            {isLoading ? (
                <LeadersLoadingSkeleton darkMode={darkMode} />
            ) : (
                <tbody>
                {filteredLeaders.map((leader) => (
                    <tr key={leader.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {leader.member.first_name} {leader.member.second_name} {leader.member.sur_name ? leader.member.sur_name : ''}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {leader.department}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {leader.member.gender}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {leader.member.phone ? leader.member.phone : 'N/A'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {leader.member.alt_phone ? leader.member.alt_phone : 'N/A'}
                            </div>
                        </td>

                        <td className="flex px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => handleEdit(leader)}
                                className={`mr-4 ${darkMode ? 'text-indigo-400 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-900'}`}
                                data-tooltip-id='editor'
                            >
                            <Tooltip id='editor' place='left' content='Edit' />
                            <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                data-tooltip-id='delete-btn'
                                onClick={() => 
                                    toast(
                                        (t) => (
                                        <div className='flex items-center w-full px-4 py-2 text-gray-900 hover:text-red-500 gap-2'>
                                            <span>This action cannot be undone</span>
                                            <p className='text-sm'>{`Delete ${leader.member.first_name}`} </p>
                                            <div className='flex gap-2'>
                                            <button 
                                                onClick={() => {
                                                fetchDeleteLeader(leader.id)
                                                toast.dismiss(t.id)
                                                }}
                                                className='bg-red-600 text-white px-4 py-2 rounded-md'
                                            >
                                                Yes, Delete
                                            </button>
                                            <button
                                                onClick={() => toast.dismiss(t.id)}
                                                className='bg-indigo-500 text-white px-4 py-2 rounded-md'
                                            >
                                                Cancel
                                            </button>
                                            </div>
                                        </div>
                                        ),
                                        {
                                        duration: 10000
                                        }
                                    )
                                    }
                            >
                                <Tooltip id='delete-btn' place='top' content='Delete' />
                                <Trash2 className="w-4 h-4 text-red-500"/>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            )}
        </table>
      </div>

      {showLeaderAddModal && (
        <LeadersAddModal 
            initialData={selectedLeader || undefined}
            onSuccess={(updatedLeader) => {
                setLeaders(leaders.map(l => (l.id === updatedLeader.id ? updatedLeader : l)))
                setLeaderAddModal(false)
                setSelectedLeader(null)
            }}
            leadersApi={() => fetchLeaders()}
            darkMode={darkMode}
            onClose={() => setLeaderAddModal(false)}
    />
      )}
    </div>
  )
}

export default LeadersList

function LeadersLoadingSkeleton({ darkMode }) {
    return (
        <SkeletonTheme baseColor={darkMode ? "#2D2F33" : "#E0E0E0"} highlightColor={darkMode ? "#3A3C40" : "#F5F5F5"}>
            <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {[...Array(6)].map((_, rowIndex) => (
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