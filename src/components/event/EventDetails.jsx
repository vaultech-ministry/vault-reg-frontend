import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EventDashboard from './EventDashboard';
import EventAttendees from './EventAttendees';
import EventAttendance from './EventAttendance';

function EventDetails({ darkMode }) {
    const { eventId } = useParams();
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="p-6 w-full">
            <div className="flex space-x-4 border-b pb-2">
                {['dashboard', 'attendees', 'organisers', 'attendance'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 text-sm font-semibold ${
                            activeTab === tab ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-600'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="mt-4">
                {activeTab === 'dashboard' && <EventDashboard eventId={eventId} darkMode={darkMode}/>}
                {activeTab === 'attendees' && <EventAttendees eventId={eventId} darkMode={darkMode}/>}
                {activeTab === 'organisers' && <EventOrganisers eventId={eventId} />}
                {activeTab === 'attendance' && <EventAttendance eventId={eventId} darkMode={darkMode}/>}
            </div>
        </div>
    );
}

// const EventDashboard = ({ eventId }) => <div>Dashboard for event</div>;
// const EventAttendees = ({ eventId }) => <div>Attendees list for event {eventId}</div>;
// const EventAttendance = ({ eventId }) => <div>Attendance records for event</div>;
const EventOrganisers = ({ eventId }) => <div>Organisers list for event</div>;

export default EventDetails;
