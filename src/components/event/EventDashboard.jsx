import React from 'react'
import EventStatsCard from './EventStatsCard'

function EventDashboard({ eventId, darkMode }) {
  return (
    <div className={`p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <EventStatsCard eventId={eventId} darkMode={darkMode}/>
    </div>
  )
}

export default EventDashboard
