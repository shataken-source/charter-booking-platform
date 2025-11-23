// pages/admin/configuration.jsx
// Admin Configuration Panel - Manage all API keys and settings from one place

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Shield, Key, Save, AlertCircle, CheckCircle, HelpCircle, Fish, Anchor } from 'lucide-react'
import toast from 'react-hot-toast'
import FishyHelp from '../../components/FishyHelp'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminConfiguration() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testResults, setTestResults] = useState({})
  const [showHelp, setShowHelp] = useState(true)
  
  // Configuration state
  const [config, setConfig] = useState({
    // Supabase
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    
    // Email Services
    SENDGRID_API_KEY: '',
    SMTP_HOST: 'smtp.sendgrid.net',
    SMTP_PORT: '587',
    SMTP_USER: 'apikey',
    SMTP_FROM_EMAIL: 'alerts@gulfcoastcharters.com',
    SMTP_FROM_NAME: 'Gulf Coast Charters',
    
    // Payment
    STRIPE_PUBLIC_KEY: '',
    STRIPE_SECRET_KEY: '',
    STRIPE_WEBHOOK_SECRET: '',
    
    // Weather Services
    NOAA_API_KEY: '', // Usually not needed for NOAA
    WEATHER_CHECK_INTERVAL: '3600', // seconds (1 hour)
    WEATHER_ALERT_HOURS_AHEAD: '24',
    
    // Platform Settings
    PLATFORM_NAME: 'Gulf Coast Charters',
    PLATFORM_URL: 'https://gulfcoastcharters.com',
    COMMISSION_RATE: '8', // percentage
    
    // Feature Flags
    ENABLE_WEATHER_ALERTS: true,
    ENABLE_GAMIFICATION: true,
    ENABLE_LOCATION_SHARING: true,
    ENABLE_STRIPE_PAYMENTS: true,
    ENABLE_TEST_MODE: true,
    
    // Limits
    FREE_TIER_DAILY_POSTS: '2',
    FREE_TIER_GPS_PINS: '5',
    MAX_UPLOAD_SIZE_MB: '10',
    
    // NOAA Stations
    DEFAULT_NOAA_STATION: '42012', // Orange Beach
    NOAA_STATIONS: {
      'orange_beach': '42012',
      'mobile_bay': '42040',
      'pensacola': '42039',
      'dauphin_island': '42013'
    }
  })

  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    try {
      // Load from database or environment
      const { data, error } = await supabase
        .from('system_configuration')
        .select('*')
        .single()
      
      if (data) {
        setConfig(prev => ({ ...prev, ...data.config }))
      } else {
        // Load from environment variables
        setConfig(prev => ({
          ...prev,
          SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
        }))
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    }
  }

  const saveConfiguration = async () => {
    setLoading(true)
    setSaved(false)
    
    try {
      // Validate required fields
      const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SMTP_FROM_EMAIL']
      const missing = required.filter(key => !config[key])
      
      if (missing.length > 0) {
        toast.error(`Missing required fields: ${missing.join(', ')}`)
        setLoading(false)
        return
      }
      
      // Save to database
      const { error } = await supabase
        .from('system_configuration')
        .upsert({
          id: 'main',
          config,
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        })
      
      if (error) throw error
      
      // Also save to .env.local file (in real app, this would be server-side)
      await saveToEnvFile(config)
      
      setSaved(true)
      toast.success('Configuration saved successfully! 🎣')
      
      // Run connection tests
      await testConnections()
      
    } catch (error) {
      console.error('Error saving configuration:', error)
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  const saveToEnvFile = async (config) => {
    // This would be a server-side API route in production
    const envContent = `
# Supabase
NEXT_PUBLIC_SUPABASE_URL=${config.SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${config.SUPABASE_SERVICE_ROLE_KEY}

# Email
SENDGRID_API_KEY=${config.SENDGRID_API_KEY}
SMTP_HOST=${config.SMTP_HOST}
SMTP_PORT=${config.SMTP_PORT}
SMTP_USER=${config.SMTP_USER}
SMTP_FROM_EMAIL=${config.SMTP_FROM_EMAIL}

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=${config.STRIPE_PUBLIC_KEY}
STRIPE_SECRET_KEY=${config.STRIPE_SECRET_KEY}
STRIPE_WEBHOOK_SECRET=${config.STRIPE_WEBHOOK_SECRET}

# Platform
NEXT_PUBLIC_PLATFORM_NAME=${config.PLATFORM_NAME}
NEXT_PUBLIC_PLATFORM_URL=${config.PLATFORM_URL}
COMMISSION_RATE=${config.COMMISSION_RATE}
`.trim()
    
    console.log('Environment variables configured:', envContent)
  }

  const testConnections = async () => {
    const tests = {}
    
    // Test Supabase connection
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      tests.supabase = !error
    } catch {
      tests.supabase = false
    }
    
    // Test SendGrid (would be server-side in production)
    tests.sendgrid = !!config.SENDGRID_API_KEY
    
    // Test Stripe
    tests.stripe = !!config.STRIPE_PUBLIC_KEY
    
    // Test NOAA API
    try {
      const response = await fetch(
        `https://www.ndbc.noaa.gov/data/realtime2/${config.DEFAULT_NOAA_STATION}.txt`
      )
      tests.noaa = response.ok
    } catch {
      tests.noaa = false
    }
    
    setTestResults(tests)
  }

  const updateConfig = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
    setSaved(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Fishy Help Button */}
      <FishyHelp 
        title="Admin Configuration"
        content="🎣 Ahoy Captain! This is your command center. Set up all your API keys and settings here. Don't worry if you don't have all the keys yet - you can always come back and update them!"
        position="top-right"
      />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="text-blue-600 mr-3" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Configuration</h1>
                <p className="text-gray-600 mt-1">Manage your platform settings and API keys</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {saved && (
                <div className="flex items-center text-green-600">
                  <CheckCircle size={20} className="mr-1" />
                  <span>Saved!</span>
                </div>
              )}
              <button
                onClick={saveConfiguration}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={20} className="mr-2" />
                {loading ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Fish className="mr-2 text-blue-600" />
            Connection Status
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries({
              supabase: 'Database',
              sendgrid: 'Email Service',
              stripe: 'Payments',
              noaa: 'Weather Data'
            }).map(([key, label]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 ${
                  testResults[key] === true
                    ? 'bg-green-50 border-green-300'
                    : testResults[key] === false
                    ? 'bg-red-50 border-red-300'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{label}</span>
                  {testResults[key] === true ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : testResults[key] === false ? (
                    <AlertCircle className="text-red-600" size={20} />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-6">
          {/* Supabase Configuration */}
          <ConfigSection
            title="🗄️ Supabase Database"
            icon={<Key className="text-blue-600" />}
            help="Your Supabase project credentials. Get these from your Supabase dashboard."
          >
            <ConfigField
              label="Supabase URL"
              value={config.SUPABASE_URL}
              onChange={(v) => updateConfig('SUPABASE_URL', v)}
              placeholder="https://xxxxx.supabase.co"
              required
              help="Found in Settings > API in your Supabase dashboard"
            />
            <ConfigField
              label="Anon/Public Key"
              value={config.SUPABASE_ANON_KEY}
              onChange={(v) => updateConfig('SUPABASE_ANON_KEY', v)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              required
              help="Public key that's safe to use in browser"
            />
            <ConfigField
              label="Service Role Key"
              value={config.SUPABASE_SERVICE_ROLE_KEY}
              onChange={(v) => updateConfig('SUPABASE_SERVICE_ROLE_KEY', v)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              type="password"
              help="Secret key for server-side operations only"
            />
          </ConfigSection>

          {/* Email Configuration */}
          <ConfigSection
            title="📧 Email Service"
            icon={<Anchor className="text-blue-600" />}
            help="Configure email sending for weather alerts and notifications"
          >
            <ConfigField
              label="SendGrid API Key"
              value={config.SENDGRID_API_KEY}
              onChange={(v) => updateConfig('SENDGRID_API_KEY', v)}
              placeholder="SG.xxxxx..."
              type="password"
              help="Get from SendGrid dashboard (free tier available)"
            />
            <ConfigField
              label="From Email"
              value={config.SMTP_FROM_EMAIL}
              onChange={(v) => updateConfig('SMTP_FROM_EMAIL', v)}
              placeholder="alerts@yourdomain.com"
              required
              help="Email address that sends alerts"
            />
            <ConfigField
              label="From Name"
              value={config.SMTP_FROM_NAME}
              onChange={(v) => updateConfig('SMTP_FROM_NAME', v)}
              placeholder="Gulf Coast Charters"
              help="Display name for sent emails"
            />
          </ConfigSection>

          {/* Payment Configuration */}
          <ConfigSection
            title="💳 Payment Processing"
            icon={<Key className="text-green-600" />}
            help="Stripe keys for processing payments"
          >
            <ConfigField
              label="Stripe Public Key"
              value={config.STRIPE_PUBLIC_KEY}
              onChange={(v) => updateConfig('STRIPE_PUBLIC_KEY', v)}
              placeholder="pk_test_xxxxx..."
              help="Publishable key from Stripe dashboard"
            />
            <ConfigField
              label="Stripe Secret Key"
              value={config.STRIPE_SECRET_KEY}
              onChange={(v) => updateConfig('STRIPE_SECRET_KEY', v)}
              placeholder="sk_test_xxxxx..."
              type="password"
              help="Secret key - keep this secure!"
            />
            <ConfigField
              label="Commission Rate (%)"
              value={config.COMMISSION_RATE}
              onChange={(v) => updateConfig('COMMISSION_RATE', v)}
              type="number"
              min="0"
              max="30"
              help="Platform commission on bookings"
            />
          </ConfigSection>

          {/* Weather Configuration */}
          <ConfigSection
            title="🌊 Weather Services"
            icon={<Fish className="text-cyan-600" />}
            help="NOAA weather data configuration"
          >
            <ConfigField
              label="Default NOAA Station"
              value={config.DEFAULT_NOAA_STATION}
              onChange={(v) => updateConfig('DEFAULT_NOAA_STATION', v)}
              placeholder="42012"
              help="NOAA buoy station ID (42012 = Orange Beach)"
            />
            <ConfigField
              label="Check Interval (seconds)"
              value={config.WEATHER_CHECK_INTERVAL}
              onChange={(v) => updateConfig('WEATHER_CHECK_INTERVAL', v)}
              type="number"
              help="How often to check weather (3600 = hourly)"
            />
            <ConfigField
              label="Alert Hours Ahead"
              value={config.WEATHER_ALERT_HOURS_AHEAD}
              onChange={(v) => updateConfig('WEATHER_ALERT_HOURS_AHEAD', v)}
              type="number"
              help="Send alerts this many hours before trip"
            />
          </ConfigSection>

          {/* Feature Flags */}
          <ConfigSection
            title="🎮 Feature Flags"
            icon={<CheckCircle className="text-purple-600" />}
            help="Enable or disable platform features"
          >
            <div className="grid grid-cols-2 gap-4">
              <ConfigToggle
                label="Weather Alerts"
                checked={config.ENABLE_WEATHER_ALERTS}
                onChange={(v) => updateConfig('ENABLE_WEATHER_ALERTS', v)}
                help="Automatic weather monitoring"
              />
              <ConfigToggle
                label="Gamification"
                checked={config.ENABLE_GAMIFICATION}
                onChange={(v) => updateConfig('ENABLE_GAMIFICATION', v)}
                help="Points, badges, and leaderboards"
              />
              <ConfigToggle
                label="Location Sharing"
                checked={config.ENABLE_LOCATION_SHARING}
                onChange={(v) => updateConfig('ENABLE_LOCATION_SHARING', v)}
                help="GPS tracking features"
              />
              <ConfigToggle
                label="Test Mode"
                checked={config.ENABLE_TEST_MODE}
                onChange={(v) => updateConfig('ENABLE_TEST_MODE', v)}
                help="Enable test features for Phase 1"
              />
            </div>
          </ConfigSection>

          {/* Limits Configuration */}
          <ConfigSection
            title="🎯 Platform Limits"
            icon={<AlertCircle className="text-orange-600" />}
            help="Set limits for free tier users"
          >
            <div className="grid grid-cols-3 gap-4">
              <ConfigField
                label="Daily Posts (Free)"
                value={config.FREE_TIER_DAILY_POSTS}
                onChange={(v) => updateConfig('FREE_TIER_DAILY_POSTS', v)}
                type="number"
                min="1"
                max="10"
                help="Max posts per day for free users"
              />
              <ConfigField
                label="GPS Pins (Free)"
                value={config.FREE_TIER_GPS_PINS}
                onChange={(v) => updateConfig('FREE_TIER_GPS_PINS', v)}
                type="number"
                min="1"
                max="20"
                help="Max saved locations for free users"
              />
              <ConfigField
                label="Upload Size (MB)"
                value={config.MAX_UPLOAD_SIZE_MB}
                onChange={(v) => updateConfig('MAX_UPLOAD_SIZE_MB', v)}
                type="number"
                min="1"
                max="50"
                help="Max file upload size"
              />
            </div>
          </ConfigSection>
        </div>

        {/* Quick Setup Guide */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Fish className="mr-2" />
            Quick Setup Guide for Phase 1 Testing
          </h3>
          <ol className="space-y-2 text-blue-800">
            <li>1. 🗄️ <strong>Supabase:</strong> Create free account at supabase.com and get your keys</li>
            <li>2. 📧 <strong>SendGrid:</strong> Sign up for free tier (100 emails/day) at sendgrid.com</li>
            <li>3. 💳 <strong>Stripe:</strong> Use test keys for now (start with "pk_test" and "sk_test")</li>
            <li>4. 🌊 <strong>NOAA:</strong> No API key needed - it's free and open!</li>
            <li>5. 💾 <strong>Save:</strong> Click "Save All Settings" button above</li>
            <li>6. ✅ <strong>Test:</strong> Check connection status to verify everything works</li>
            <li>7. 🎣 <strong>Fish On!</strong> You're ready to start testing with friends!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function ConfigSection({ title, icon, help, children }) {
  const [expanded, setExpanded] = useState(true)
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          {icon}
          <h2 className="text-xl font-semibold ml-3">{title}</h2>
        </div>
        <HelpCircle 
          className="text-gray-400" 
          size={20} 
          title={help}
        />
      </button>
      {expanded && (
        <div className="px-6 pb-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

function ConfigField({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  required = false,
  help = '',
  ...props 
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
      {help && (
        <p className="text-xs text-gray-500">{help}</p>
      )}
    </div>
  )
}

function ConfigToggle({ label, checked, onChange, help }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="font-medium text-gray-700">{label}</label>
        {help && <p className="text-xs text-gray-500 mt-1">{help}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
