import React, { useEffect, useState } from 'react'
import { Trash2, Pencil, UserPlus} from 'lucide-react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import VisitorAddModal from './VisitorAddModal';
import { format } from 'date-fns';

function VisitorsList({ darkMode }) {
    const [visitors, setVisitors] = useState([])
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [showVisitorAddModal, setVisitorAddModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortField, setSortField] = useState("first_name");
    const [sortOrder, setSortOrder] = useState("asc")
    const api = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchVisitors()
    }, [])

    const fetchVisitors = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${api}visitors`)
            if (response.ok) {
                const data = await response.json()
                setVisitors(data)
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

    const handleEdit = async (visitor) => {
        setSelectedVisitor(visitor)
        setVisitorAddModal(true)
    }

    const fetchDeleteVisitor = async (visitorId) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${api}visitor/${visitorId}`, {
                method: "DELETE",
            })
            if (response.ok) {
                toast.success('Visitor Deleted Successfully')
                fetchVisitors()
            }
        } catch (error) {
            console.error('Error ', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredVisitors = visitors.filter((visitor) => 
        `${visitor.first_name} ${visitor.last_name} ${visitor.sur_name || ""} ${visitor.location} ${visitor.gender} ${visitor.phone} ${visitor.church}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )

    const sortedVisitors = [...filteredVisitors].sort((a, b) => {
        const valueA = a[sortField] ? a[sortField].toString().toLowerCase() : ""
        const valueB = b[sortField] ? b[sortField].toString().toLowerCase() : ""

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0
    })
    

  return (
    <div className='p-4'>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <input
                type="text"
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`}
            />

            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className={`border px-4 py-2 rounded-lg transition ${
                        darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                >
                    <option value="first_name">Name</option>
                    <option value="location">Location</option>
                    <option value="gender">Gender</option>
                    <option value="phone">Phone</option>
                    <option value="church">Church</option>
                    <option value="created_at">Date Joined</option>
                </select>

                
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    {sortOrder === "asc" ? "⬆️ Ascending" : "⬇️ Descending"}
                </button>
            </div>
            </div>
        <div className='flex justify-end p-4'>
            <button
                onClick={() => setVisitorAddModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                <UserPlus />
                Add Visitor
            </button>
        </div>
      <div className='overflow-x-auto'>
        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
            <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Church</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody>
                {sortedVisitors.map((visitor) => (
                    <tr key={visitor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {visitor.first_name} {visitor.last_name} {visitor.sur_name ? visitor.sur_name : ''}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {visitor.location}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {visitor.gender}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {visitor.phone ? visitor.phone : 'N/A'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {visitor.church ? visitor.church : 'N/A'}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {format(new Date(visitor.created_at), 'MMM d, yyyy')}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => handleEdit(visitor)}
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
                                            <p className='text-sm'>{`Delete ${visitor.first_name}`} </p>
                                            <div className='flex gap-2'>
                                            <button 
                                                onClick={() => {
                                                fetchDeleteVisitor(visitor.id)
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
        </table>
      </div>

      {showVisitorAddModal && (
        <VisitorAddModal 
            initialData={selectedVisitor || undefined}
            onSuccess={(updatedVisitor) => {
                setVisitors(visitors.map(v => (v.id === updatedVisitor.id ? updatedVisitor : v)))
                setVisitorAddModal(false)
                setSelectedVisitor(null)
            }}
            visitorsApi={() => fetchVisitors()}
            darkMode={darkMode}
            onClose={() => setVisitorAddModal(false)}
    />
      )}
    </div>
  )
}

export default VisitorsList
