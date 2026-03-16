import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users } from 'lucide-react'

function EventsList({ darkMode }) {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('current')
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)

    const allEvents = [
        {
            id: "edb8c1bf-5dad-4439-ba61-b160210845ba",
            image: "https://res.cloudinary.com/donshmlbl/image/upload/v1742286162/Vault_covrr_photo_resize-01_a3opzo.png",
            event_name: "Exchange Conference 2025",
            description: "Rooted to Rise! All the Way Up",
            start_date: "2025-04-15",
            end_date: "2025-04-19",
            location: "Vault Church, Destiny Grounds",
            attendees: "1000+ attendees expectation"
        },
        {
            id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            image: "https://res.cloudinary.com/donshmlbl/image/upload/v1771936441/exchangesn6-logo_rqnc6n.png",
            event_name: "Exchange Conference SN6",
            description: "Season 6 - Transform Your World",
            start_date: "2026-04-14",
            end_date: "2026-04-18",
            location: "Vault Church, Destiny Grounds",
            attendees: "1500+ attendees expected"
        },
    ]

    const fetchEvents = (tabType) => {
        setLoading(true)
        const today = new Date().toISOString().split('T')[0]
        
        let filteredEvents = []
        if (tabType === 'current') {
            filteredEvents = allEvents.filter(event => event.start_date <= today && event.end_date >= today)
        } else if (tabType === 'upcoming') {
            filteredEvents = allEvents.filter(event => event.start_date > today)
        } else if (tabType === 'past') {
            filteredEvents = allEvents.filter(event => event.end_date < today)
        }
        
        // Simulate API call delay
        setTimeout(() => {
            setEvents(filteredEvents)
            setLoading(false)
        }, 300)
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        fetchEvents(tab)
    }

    // Load current events on component mount
    React.useEffect(() => {
        fetchEvents('current')
    }, [])

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {[
                    { key: 'current', label: 'Current Events' },
                    { key: 'upcoming', label: 'Upcoming Events' },
                    { key: 'past', label: 'Past Events' }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === tab.key
                                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                        onClick={() => handleTabChange(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} darkMode={darkMode} navigate={navigate} />
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p className="text-lg">No {activeTab} events found.</p>
                        <p className="text-sm mt-2">
                            {activeTab === 'current' && 'There are no events happening right now.'}
                            {activeTab === 'upcoming' && 'No events are scheduled for the future.'}
                            {activeTab === 'past' && 'No past events to display.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

function EventCard({ event, darkMode, navigate }) {
    return (
        <div 
            className={`bg-indigo-500 text-white rounded-xl shadow-lg overflow-hidden w-full cursor-pointer hover:scale-105 transition-transform duration-300`}
            onClick={() => navigate(`/vaultevents/${event.id}`)}
        >
            <img src={event.image} alt={event.event_name} className="w-full max-h-[400px] object-contain bg-black p-2" />

            <div className="p-4">
                <h3 className="text-xl font-semibold">{event.event_name}</h3>
                <p className="text-sm text-gray-200">{event.description}</p>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} /> {event.start_date} to {event.end_date}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} /> {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                        <Users size={16} /> {event.attendees}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventsList
