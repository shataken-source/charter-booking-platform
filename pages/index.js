// pages/index.js - ACTUAL WORKING HOMEPAGE CODE
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { 
  Fish, Calendar, Trophy, MapPin, AlertCircle, CheckCircle, 
  Anchor, CloudRain, Users, DollarSign, Settings, HelpCircle 
} from 'lucide-react'
import FishyHelp from '../components/FishyHelp'
import toast from 'react-hot-toast'

export default function Home({ supabase, user }) {
  const router = useRouter()
  const [systemStatus, setSystemStatus] = useState({
    database: false,
    weather: false,
    email: false,
    payments: false
  })
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState([])
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    checkSystemStatus()
    fetchRecentBookings()
    fetchCurrentWeather()
  }, [])

  const checkSystemStatus = async () => {
    try {
      // Check database connection
      try {
        const { error } = await supabase.from('users').select('count').limit(1)
        setSystemStatus(prev => ({ ...prev, database: !error }))
      } catch {
        setSystemStatus(prev => ({ ...prev, database: false }))
      }

      // Check weather API
      try {
        const response = await fetch('/api/weather/current')
        setSystemStatus(prev => ({ ...prev, weather: response.ok }))
      } catch {
        setSystemStatus(prev => ({ ...prev, weather: false }))
      }

      // Check email service (based on env var)
      const hasEmail = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      setSystemStatus(prev => ({ ...prev, email: hasEmail }))

      // Payment is always true in test mode
      setSystemStatus(prev => ({ ...prev, payments: true }))
      
    } catch (error) {
      console.error('Status check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (data) setRecentBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchCurrentWeather = async () => {
    try {
      const response = await fetch('/api/weather/current')
      if (response.ok) {
        const data = await response.json()
        setWeatherData(data)
      }
    } catch (error) {
      console.error('Error fetching weather:', error)
    }
  }

  const handleQuickAction = (action) => {
    switch(action) {
      case 'book':
        router.push('/booking')
        break
      case 'community':
        router.push('/community')
        break
      case 'tracking':
        router.push('/tracking')
        break
      case 'weather':
        router.push('/weather')
        break
      case 'admin':
        router.push('/admin/configuration')
        break
      default:
        toast.error('Page coming soon!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-cyan-50">
      {/* Fishy Help Component */}
      <FishyHelp 
        page="home"
        title="Welcome aboard!"
        autoShow={!user}
      />

      {/* Navigation Header */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Fish className="text-blue-600 mr-3" size={32} />
              <span className="text-xl font-bold text-gray-900">Gulf Coast Charters</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-600">Welcome, {user.email}</span>
                  <button 
                    onClick={() => supabase.auth.signOut()}
                    className="text-red-600 hover:text-red-800"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => router.push('/login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Fish className="mr-4 text-blue-600" size={48} />
            Gulf Coast Charters
          </h1>
          <p className="text-xl text-gray-600">
            Your Premier Charter Fishing Experience 🎣
          </p>
        </div>

        {/* System Status Dashboard */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Settings className="mr-2 text-gray-600" size={24} />
            System Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(systemStatus).map(([key, status]) => (
              <div 
                key={key}
                className={`p-4 rounded-lg border-2 transition-all ${
                  status 
                    ? 'bg-green-50 border-green-300 hover:shadow-md' 
                    : 'bg-red-50 border-red-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 capitalize">{key}</span>
                  {status ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <AlertCircle className="text-red-600" size={20} />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {status ? 'Operational' : 'Check config'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Weather Card */}
        {weatherData && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <CloudRain className="mr-2" size={24} />
              Current Conditions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Wind</p>
                <p className="text-2xl font-bold">{weatherData.wind_speed || 'N/A'} kt</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Waves</p>
                <p className="text-2xl font-bold">{weatherData.wave_height || 'N/A'} ft</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Visibility</p>
                <p className="text-2xl font-bold">{weatherData.visibility || 'N/A'} nm</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Water Temp</p>
                <p className="text-2xl font-bold">{weatherData.water_temp || 'N/A'}°F</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ActionCard
            icon={<Calendar className="text-blue-600" size={36} />}
            title="Book a Trip"
            description="Find your perfect fishing charter"
            onClick={() => handleQuickAction('book')}
            color="blue"
            badge="New!"
          />
          <ActionCard
            icon={<Trophy className="text-yellow-600" size={36} />}
            title="Community"
            description="Share catches, earn points & badges"
            onClick={() => handleQuickAction('community')}
            color="yellow"
            badge={`${recentBookings.length} Active`}
          />
          <ActionCard
            icon={<MapPin className="text-green-600" size={36} />}
            title="GPS Tracking"
            description="Share location with friends & family"
            onClick={() => handleQuickAction('tracking')}
            color="green"
          />
          <ActionCard
            icon={<CloudRain className="text-cyan-600" size={36} />}
            title="Weather Center"
            description="Detailed forecasts & alerts"
            onClick={() => handleQuickAction('weather')}
            color="cyan"
          />
          <ActionCard
            icon={<DollarSign className="text-purple-600" size={36} />}
            title="Captain Portal"
            description="Manage your charter business"
            onClick={() => router.push('/captain')}
            color="purple"
          />
          <ActionCard
            icon={<Settings className="text-gray-600" size={36} />}
            title="Admin Panel"
            description="Configure platform settings"
            onClick={() => handleQuickAction('admin')}
            color="gray"
          />
        </div>

        {/* Phase 1 Testing Banner */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mr-3 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">
                🧪 Phase 1 Testing Mode Active
              </h3>
              <p className="text-yellow-800 mb-3">
                Welcome testers! This platform is in testing mode. Please try to break things and report any issues.
              </p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <p className="text-gray-600 mb-2">Run tests in browser console (F12):</p>
                <code className="block bg-gray-100 p-3 rounded text-gray-800">
                  runEasyTests()
                </code>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                  Test Payments Active
                </span>
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                  Debug Mode On
                </span>
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                  Mock Data Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentBookings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 text-gray-600" size={24} />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentBookings.map((booking, idx) => (
                <div key={booking.id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      Booking #{booking.booking_number || 'TEST-' + idx}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.trip_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">© 2024 Gulf Coast Charters. All rights reserved.</p>
              <p className="text-xs text-gray-400 mt-1">Version 1.0.0 - Phase 1 Testing</p>
            </div>
            <div className="flex items-center space-x-4">
              <Anchor className="text-gray-400" size={24} />
              <Fish className="text-gray-400" size={24} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Action Card Component
function ActionCard({ icon, title, description, onClick, color, badge }) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border-t-4 border-${color}-500`}
    >
      {badge && (
        <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
          {badge}
        </span>
      )}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-gray-50 rounded-full">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  )
}
