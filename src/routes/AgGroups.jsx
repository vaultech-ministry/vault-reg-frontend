import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AgGroupModal from '../components/AgGroupModal'
import LoadingSpinner from '../components/LoadingSpinner'

function AgGroups({ darkMode }) {
  const [groups, setGroups] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null) 
  const [loading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchAgGroups()
  }, [])

  const fetchAgGroups = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${api}group`)
      if (response.ok) {
        const data = await response.json()

        const groupsWithMembers = await Promise.all(
          data.map(async (group) => {
            const membersResponse = await fetch(`${api}member?group_id=${group.id}`)
            const membersData = membersResponse.ok ? await membersResponse.json() : []
            return { ...group, membersCount: membersData.length }
          })
        )

        setGroups(groupsWithMembers)
      }
    } catch (error) {
        console.error('Error', error)
    } finally {
        setIsLoading(false)
    }
  }

  const fetchCreateAgGroups = async (groupInfo) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${api}group`, {
        method: "POST",
        headers: {},
        body: groupInfo
      })
      if (response.ok) {
        toast.success('AgGroup created Successfully')
        setShowModal(false)
        fetchAgGroups()
      } else {
          toast.error('Error creating AG group')
      }
    } catch (error) {
        console.error('Error', error)
    } finally {
        setIsLoading(false)
        fetchAgGroups()
    }
  }

  const fetchUpdateAgGroup = async (groupId, groupInfo) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${api}group/${groupId}/`, {
        method: "PATCH",
        headers: {},
        body: groupInfo
      })
      if (response.ok) {
        toast.success('AgGroup updated successfully')
        fetchAgGroups()
      }
    } catch (error) {
        console.error('Error: ',error)
    } finally {
        setIsLoading(false)
    }
  }

  const fetchDeleteAgGroup = async (groupId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${api}group/${groupId}/`, {
        method: "DELETE", 
      })
      if (response.ok) {
        toast.success('AgGroup Deleted')
        fetchAgGroups()
      }
    } catch (error) {
        console.error('Error: ',error)
    } finally {
        setIsLoading(false)
    }
  }

  const handleEdit = (group) => {
    setSelectedGroup(group)
    setShowModal(true)
  }

  const handleDelete = (groupId) =>{
      fetchDeleteAgGroup(groupId)
 }

 if (loading) return <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}><LoadingSpinner /></p>;

  return (
    <div className={`p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Accountability Groups</h1>
      </div>
      <div className='flex justify-end m-4'>
        {/* <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Add Group</button> */}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {groups.map((group, index) => (
            <div 
              key={index}
              className={`relative p-6 rounded-xl shadow-sm border overflow-hidden ${
              darkMode ? 'bg-gray-800 border-gray-700': 'bg-white border-gray-100'
            } h-44 flex flex-col justify-between cursor-pointer`}
            onClick={() => navigate(`/group/${group.id}/`)}
            >
            <div className='absolute top-2 right-2 z-20 flex space-x-2 py-2'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(group)
                }}
                className="text-white hover:text-indigo-600">
                <Pencil size={14}/>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                    toast((t) => (
                    <div className='flex items-center w-full px-4 py-2 text-gray-500 hover:text-red-500 gap-2'>
                      <p>This Action cannot be undone</p>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => {
                            handleDelete(group.id)
                            toast.dismiss(t.id)
                          }}
                          className='bg-red-600 text-white px-4 py-2 rounded-md'
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => {
                            toast.dismiss(t.id)
                          }}
                          className='bg-gray-600 text-white px-4 py-2 rounded-md'
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ),
                  {
                    duration: 10000
                  })
                }}
                >
                <Trash2 className="text-red-600 hover:text-red-800" size={14}/>
              </button>
            </div>

              <div  
                className='absolute inset-0 bg-cover bg-center'
                style={{
                  backgroundImage: `url(${group.image || '/placeholder.jpg'})`
                }}
              >
              </div>

              <div className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm'></div>
            
                <div className='relative z-10 flex flex-col h-full justify-center items-center text-white'>
                  <h2 className='text-xl font-medium'>{group.group_name}</h2>
                  <p className='text-sm opacity-90'>{group.membersCount} members</p>
              </div>
            </div>
        ))}
      </div>
        {showModal && (
          <AgGroupModal
            onClose={() => setShowModal(false)}
            onSubmit={selectedGroup ? fetchUpdateAgGroup : fetchCreateAgGroups}
            initialData={selectedGroup}
          />
        )}
      
    </div>
  )
}

export default AgGroups
