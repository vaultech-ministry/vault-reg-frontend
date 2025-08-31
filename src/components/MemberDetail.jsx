import { ExternalLinkIcon, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const MemberDetails = ({ darkMode }) => {
    const [loading, setLoading] = useState(false)
    const [member, setMember] = useState([])
    const { memberId } = useParams()

    const api = import.meta.env.VITE_API_URL

    useEffect(() => {
      handleFetchMemberDetails()
    }, [])

    const handleFetchMemberDetails = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${api}member/${memberId}`)
            const data = await response.json()
            setMember(data)
        } catch (err) {
            toast.error('Error', err)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{member.first_name} {member.second_name} {member.sur_name}</h1>
         <p className="text-xl"><span className="font-medium">AG Name:</span> {member.ag_name}</p>
        {/* <div className="flex gap-2">
          <button className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition">
            Edit
          </button>
          <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition">
            Delete
          </button>
        </div> */}
      </div>

      {/* Personal & Contact Information */}
      <div className={`shadow rounded p-4 md:p-6 space-y-4 md:space-y-0 md:flex md:gap-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex-1 space-y-2">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Location:</span> {member.location}</p>
            <p><span className="font-medium">Gender:</span> {member.gender}</p>
            <p><span className="font-medium">Date of Birth:</span> {member.date_of_birth}</p>
            <p><span className="font-medium">School:</span> {member.school ?? "N/A"}</p>
            <p><span className="font-medium">Occupation:</span> {member.occupation}</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="text-lg font-semibold ">Contact Information</h2>
          <div className="text-smspace-y-1">
            <p>
              <span className="font-medium">Email:</span>{" "}
              <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                {member.email} <Mail className="w-4 h-4" />
              </a>
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                {member.phone} <Phone className="w-4 h-4" />
              </a>
            </p>
            <p><span className="font-medium">Alt Phone:</span> {member.alt_phone}</p>
            <p><span className="font-medium">Status:</span> {member.status}</p>
            <p><span className="font-medium">Member Since:</span> {new Date(member.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow rounded p-4 md:p-6 space-y-2`}>
        <h2 className="text-lg font-semibold">Emergency Contact</h2>
        <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
          <p><span className="font-medium">Name:</span> {member.contact_name}</p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            <a href={`tel:${member.contact_phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
              {member.contact_phone} <Phone className="w-4 h-4" />
            </a>
          </p>
          <p><span className="font-medium">Alt Phone:</span> {member.contact_alt_phone}</p>
          <p><span className="font-medium">Relationship:</span> {member.relationship}</p>
        </div>
      </div>

      {/* Activity Overview */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow rounded p-4 md:p-6`}>
        <h2 className="text-lg font-semibold">Activity Overview</h2>
        <p className="text-sm">Last Updated: {new Date(member.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MemberDetails;
