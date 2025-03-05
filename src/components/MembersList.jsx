import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import MemberForm from './MemberForm';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip'


const MembersList = ({ darkMode }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false);
  const api = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${api}member`);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
        setIsLoading(false)
    }
  };

  const handleEdit = async (member) => {
    setSelectedMember(member)
    setShowForm(true)
  };

  const handleDelete = async (memberId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${api}member/${memberId}`, {
        method: "DELETE",
        
      })
      if (response.ok) {
        toast.success('Member has been deleted')
        setMembers(members.filter((member) => member.id !== memberId));
      }
    } catch (error) {
        console.error('Error deleting member: ', error)
        toast.error('Error deleting member')
    } finally {
      setIsLoading(false)
    }
  };

  // if (showForm) {
  //   return (
  //     <div className={`p-6 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
  //       <div className="flex justify-between items-center mb-6">
  //         <h2 className="text-xl font-semibold">
  //           {selectedMember ? 'Edit Member' : 'Add New Member'}
  //         </h2>
  //         <button
  //           onClick={() => {
  //             setShowForm(false);
  //             setSelectedMember(null);
  //           }}
  //           className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'}`}
  //         >
  //           Cancel
  //         </button>
  //       </div>
  //       <MemberForm
  //         initialData={selectedMember || undefined}
  //         onSuccess={(updatedMember) => {
  //           setMembers(members.map(m => (m.id === updatedMember.id ? updatedMember : m)))
  //           setShowForm(false)
  //           setSelectedMember(null)
  //         }}
  //         membersApi={() => fetchMembers()}
  //         darkMode={darkMode}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="flex justify-end p-4">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
          <thead className={`${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">AG-Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">DOB</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">E-Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {member.first_name} {member.second_name} {member.sur_name ? member.sur_name : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.ag_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {member.gender}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{format(new Date(member.date_of_birth), 'MMM d, yyyy')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {member.school ? member.school : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {member.contact_name
                  ? `${member.contact_name} - ${member.contact_phone} (${member.relationship})`
                  : 'N/A'}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(member)}
                    className={`mr-4 ${darkMode ? 'text-indigo-400 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-900'}`}
                    data-tooltip-id='editor'
                  >
                    <Tooltip id='editor' place='left' content='Edit' />
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className={`${darkMode ? 'text-red-400 hover:text-red-200' : 'text-red-600 hover:text-red-900'}`}
                    data-tooltip-id='delete-btn'
                    onClick={() => 
                      toast(
                        (t) => (
                          <div className='flex items-center w-full px-4 py-2 text-gray-900 hover:text-red-500 gap-2'>
                            <span>This action cannot be undone</span>
                            <p className='text-sm'>{`Delete ${member.first_name}`} </p>
                            <div className='flex gap-2'>
                              <button 
                                onClick={() => {
                                  handleDelete(member.id)
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
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <MemberForm
          initialData={selectedMember || undefined}
          onSuccess={(updatedMember) => {
            setMembers(members.map(m => (m.id === updatedMember.id ? updatedMember : m)))
            setShowForm(false)
            setSelectedMember(null)
          }}
          membersApi={() => fetchMembers()}
          darkMode={darkMode}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default MembersList;