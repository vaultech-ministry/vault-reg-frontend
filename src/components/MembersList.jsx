import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import MemberForm from './MemberForm';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip'
import LoadingSpinner from './LoadingSpinner';


const MembersList = ({ darkMode }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    name: "",
    location: "",
    gender: "",
    school: "",
    phone: "",
    ag_name: "",
  });
  const [sortOrder, setSortOrder] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
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

  const handleSearch = (e, field) => {
    setSearchTerms({ ...searchTerms, [field]: e.target.value.toLowerCase() })
  }

  function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }
    return age;
  }

  function checkAgeGroup(dob, group) {
    const age = calculateAge(dob);
    if (group === "10-13") return age >= 10 && age <= 13;
    if (group === "14-18") return age >= 14 && age <= 18;
    if (group === "19-23") return age >= 19 && age <= 23;
    if (group === "24-28") return age >= 24 && age <= 28;
    if (group === "29 and above") return age >= 29;
    return true;
  }

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.first_name} ${member.second_name} ${member.sur_name || ""}`.toLowerCase();
    return (
      (!searchTerms.name || fullName.includes(searchTerms.name)) &&
      (!searchTerms.ag_name || member.ag_name?.toLowerCase().includes(searchTerms.ag_name)) &&
      (!searchTerms.location || member.location?.toLowerCase().includes(searchTerms.location)) &&
      (!searchTerms.gender || member.gender?.toLowerCase().includes(searchTerms.gender)) &&
      (!searchTerms.school || member.school?.toLowerCase().includes(searchTerms.school)) &&
      (!searchTerms.phone || member.phone?.includes(searchTerms.phone)) &&
      (!ageFilter || calculateAge(member.date_of_birth) === parseInt(ageFilter)) &&
      (!ageGroup || checkAgeGroup(member.date_of_birth, ageGroup))
    );
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (!sortOrder) return 0;
    const valueA = a.first_name.toLowerCase();
    const valueB = b.first_name.toLowerCase();
    return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });

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

  if (isLoading) return <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}><LoadingSpinner /></p>;

  return (
    <div>
      <div className='flex flex-col md:flex-row md:items-center justify-between p-4 gap-3'>
      <div className='flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto'>
      <input type="number" placeholder="Filter by Age" onChange={(e) => setAgeFilter(e.target.value)} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`} />

      <select onChange={(e) => setAgeGroup(e.target.value)} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`}>
          <option value="">Select Age Group</option>
          <option value="10-13">10-13</option>
          <option value="14-18">14-18</option>
          <option value="19-23">19-23</option>
          <option value="24-28">24-28</option>
          <option value="29 and above">29 and above</option>
      </select>

      <select onChange={(e) => setSortOrder(e.target.value)} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`}>
        <option value="">Sort by Name</option>
        <option value="asc">A → Z</option>
        <option value="desc">Z → A</option>
      </select>
      </div>
      <div className="flex justify-end p-4">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>
      </div>
      <div className="overflow-x-auto">
      <div className="flex flex-cols justify-between p-4 gap-3">
        <input type="text" placeholder="Search by Name" onChange={(e) => handleSearch(e, "name")} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`} />
        <input type="text" placeholder="Search by AG-Group" onChange={(e) => handleSearch(e, "ag_name")} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`} />
        <input type="text" placeholder="Search by Location" onChange={(e) => handleSearch(e, "location")} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`} />
        <input type="text" placeholder="Search by Gender" onChange={(e) => handleSearch(e, "gender")} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`} />
        <input type="text" placeholder="Search by Phone" onChange={(e) => handleSearch(e, "phone")} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`} />
        <input type="text" placeholder="Search by School" onChange={(e) => handleSearch(e, "school")} className={`border px-4 py-2 rounded-lg w-full md:w-1/3 transition ${
                    darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`} />
      </div>
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
            {sortedMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {member.first_name} {member.second_name} {member.sur_name ? member.sur_name : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.ag_name || 'N/A'}</div>
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