import  {useEffect, useState} from 'react'
import { Users, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';

function StatsCard({darkMode}) {
    const [dashboardStats, setDashboardStats] = useState([])
    const [loading, setLoading] = useState(false)
    const api = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${api}dashboardata`)
            const data = await response.json()
            if (response.ok) {
                setDashboardStats(data)
            }
        } catch (error) {
            console.error('Error', error)
        } finally {
            setLoading(false)
        }
    }

    const stats = [
        { icon: Users, label: 'Total Members', value: [dashboardStats.total_members], change: '' },
        { icon: UserCheck, label: 'Present Today/Absent Today', value: `${[dashboardStats.present_today]} / ${[dashboardStats.absent_today]}`, change: '' },
        { icon: TrendingUp, label: 'Growth Rate', value: `${[dashboardStats.growth_rate]}%`, change: '' },
        { icon: AlertCircle, label: 'Active/Inactive Members', value: `${[dashboardStats.active_members]} / ${[dashboardStats.inactive_members]}`, change: '' }
      ];


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
                <div className="flex items-center justify-between mb-4">
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-indigo-50'} p-2 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-indigo-600'}`} />
                </div>
                <span
                    className={`text-sm font-medium ${
                    stat.change
                    }`}
                >
                    {stat.change}
                </span>
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>
                {loading ? 'Loading...' : stat.value}
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{stat.label}</p>
            </div>
            ))}
      </div>
    </div>
  )
}

export default StatsCard
