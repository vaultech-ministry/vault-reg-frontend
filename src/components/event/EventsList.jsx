import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users } from 'lucide-react'

function EventsList({ darkMode }) {
    const navigate = useNavigate()

    const events = [
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
    ]

    const today = new Date().toISOString().split('T')[0]

    const currentEvents = events.filter(event => event.start_date <= today && event.end_date >= today)
    const upcomingEvents = events.filter(event => event.start_date > today)

    return (
        <div className="">
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Current Events</h2>
                {currentEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentEvents.map(event => (
                            <EventCard key={event.id} event={event} darkMode={darkMode} navigate={navigate} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No ongoing events today.</p>
                )}

                {/* Check event anytime */}
                <h2 className="text-xl font-semibold mb-4">Current Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} darkMode={darkMode} navigate={navigate} />
                        ))}
                    </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map(event => (
                            <EventCard key={event.id} event={event} darkMode={darkMode} navigate={navigate} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No upcoming events scheduled.</p>
                )}
            </section>
        </div>
    )
}

function EventCard({ event, darkMode, navigate }) {
    return (
        <div 
            className={`bg-indigo-500 text-white rounded-xl shadow-lg overflow-hidden w-80 cursor-pointer hover:scale-105 transition-transform duration-300`}
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
