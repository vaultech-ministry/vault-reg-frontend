import React from 'react'
import EventsList from '../components/event/EventsList'

function Events({ darkMode }) {
  return (
    <div className={`p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Vault Events</h1>
      </div>

      <EventsList darkMode={darkMode}/>
    </div>
  )
}

export default Events
