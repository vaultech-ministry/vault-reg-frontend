import { useEffect, useState } from 'react';
import {     
    Bus,
    Calendar,
    GraduationCap,
    Home,
    UserCog,
    Users,
    UsersRound,
    Lightbulb,
    Rocket,
    Target,
    Flame,
    Hammer,
    Star,
    Eye,
    Layers,
    XCircle,
    Clock3,} from 'lucide-react';

function EventStatsCard({ eventId, darkMode }) {
    const [eventStats, setEventStats] = useState({});
    const [loading, setLoading] = useState(false);
    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchEventStats();
    }, []);

    const fetchEventStats = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${api}eventstats?event_id=${eventId}`);
            const data = await response.json();
            if (response.ok) {
                setEventStats(data);
            }
        } catch (error) {
            console.error('Error fetching event stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { icon: Users, category: 'Attendees', label: 'Registered Attendees', value: eventStats.registered_attendees || 0 },
        { icon: Users, category: 'Gender', label: 'Male/Female', value: eventStats.male_female || "0/0" },
        { icon: UsersRound, category: 'Membership', label: 'Members/Visitors', value: eventStats.members_visitors || "0/0" },
        { icon: Calendar, category: 'Age Groups', label: '🔞/18-25/26-30', value: eventStats.age_groups || "0/0/0" },
        { icon: GraduationCap, category: 'Education', label: 'Uni/HighSch/CBC', value: eventStats.school_types || "0/0/0" },
        { icon: UserCog, category: 'Occupation', label: 'Working/Chilling', value: eventStats.working_chilling || "0/0" },
        { icon: Bus, category: 'Transport', label: 'Nairobi/Limuru', value: eventStats.pickup_locations || "0/0" },
        { icon: Clock3, category: 'Availability', label: 'All days/Some days', value: eventStats.availability || "0/0"},
    ];

    const agIcons = {
        transformers: Lightbulb,
        relentless: Rocket,
        pacesetters: Target,
        ignition: Flame,
        innovators: Hammer,
        gifted: Star,
        visionaries: Eye,
        elevated: Layers,
        none: XCircle,
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`p-6 rounded-xl shadow-sm border ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                    }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-50'} p-2 rounded-lg`}>
                            <stat.icon className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-indigo-600'}`} />
                        </div>
                        <span className={`text-xl font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {stat.category}
                        </span>
                    </div>

                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>
                        {loading ? 'Loading...' : stat.value}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{stat.label}</p>
                </div>
            ))}
            </div>

            <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3`}>
                Attendees by AG Group
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
            {eventStats.ag_groups &&
                Object.entries(eventStats.ag_groups)
                    .filter(([group]) => group.trim() !== "")
                    .sort(([a], [b]) => (a === "none" ? 1 : b === "none" ? -1 : 0))
                    .map(([group, count]) => {
                        const Icon = agIcons[group] || Users;
                        return (
                            <div
                                key={group}
                                className={`p-4 rounded-lg shadow-sm border text-center ${
                                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex justify-center mb-2">
                                    <Icon className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-indigo-600'}`} />
                                </div>
                                <h4 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                    {loading ? '...' : count}
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{group}</p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default EventStatsCard;
