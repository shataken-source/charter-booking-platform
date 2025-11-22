// pages/booking.js - ACTUAL BOOKING PAGE CODE
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Calendar, Users, Clock, DollarSign, Anchor, AlertCircle, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import FishyHelp from '../components/FishyHelp'

export default function BookingPage({ supabase, user }) {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Select Trip, 2: Details, 3: Payment
  const [loading, setLoading] = useState(false)
  const [trips, setTrips] = useState([])
  const [captains, setCaptains] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [bookingData, setBookingData] = useState({
    trip_date: '',
    departure_time: '06:00',
    passenger_count: 1,
    passengers: [],
    special_requests: '',
    is_private_charter: false
  })

  useEffect(() => {
    fetchTrips()
    fetchCaptains()
  }, [])

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          captains (
            business_name,
            dock_location,
            average_rating,
            total_reviews
          )
        `)
        .eq('active', true)
        .order('trip_name')

      if (error) throw error
      setTrips(data || [])
    } catch (error) {
      console.error('Error fetching trips:', error)
      // Use mock data if database not set up
      setTrips([
        {
          id: '1',
          trip_name: 'Half Day Deep Sea Fishing',
          trip_type: 'fishing',
          duration_hours: 4,
          max_passengers: 6,
          price_per_person: 150,
          price_private_charter: 800,
          departure_location: 'Orange Beach Marina',
          description: 'Perfect for beginners! Fish for red snapper, king mackerel, and more.',
          captains: {
            business_name: "Captain Mike's Charters",
            dock_location: 'Orange Beach Marina',
            average_rating: 4.8,
            total_reviews: 127
          }
        },
        {
          id: '2',
          trip_name: 'Full Day Offshore Adventure',
          trip_type: 'fishing',
          duration_hours: 8,
          max_passengers: 6,
          price_per_person: 275,
          price_private_charter: 1500,
          departure_location: 'Perdido Pass',
          description: 'Venture 20+ miles offshore for big game fishing!',
          captains: {
            business_name: "Reel Deal Charters",
            dock_location: 'Perdido Pass',
            average_rating: 4.9,
            total_reviews: 89
          }
        },
        {
          id: '3',
          trip_name: 'Sunset Dolphin Cruise',
          trip_type: 'cruise',
          duration_hours: 2,
          max_passengers: 12,
          price_per_person: 75,
          price_private_charter: 600,
          departure_location: 'Gulf Shores Marina',
          description: 'Family-friendly cruise with dolphin watching and sunset views.',
          captains: {
            business_name: "Sunset Sailing Co",
            dock_location: 'Gulf Shores Marina',
            average_rating: 4.7,
            total_reviews: 203
          }
        }
      ])
    }
  }

  const fetchCaptains = async () => {
    try {
      const { data, error } = await supabase
        .from('captains')
        .select('*')
        .eq('verification_status', 'verified')
        .eq('active', true)

      if (error) throw error
      setCaptains(data || [])
    } catch (error) {
      console.error('Error fetching captains:', error)
    }
  }

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip)
    setStep(2)
  }

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...bookingData.passengers]
    if (!updatedPassengers[index]) {
      updatedPassengers[index] = {}
    }
    updatedPassengers[index][field] = value
    setBookingData({ ...bookingData, passengers: updatedPassengers })
  }

  const calculateTotal = () => {
    if (!selectedTrip) return 0
    
    if (bookingData.is_private_charter) {
      return selectedTrip.price_private_charter || 0
    } else {
      return (selectedTrip.price_per_person || 0) * bookingData.passenger_count
    }
  }

  const handleSubmitBooking = async () => {
    if (!user) {
      toast.error('Please sign in to book a trip')
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      // Validate required fields
      if (!bookingData.trip_date) {
        throw new Error('Please select a date')
      }
      
      if (bookingData.passenger_count < 1) {
        throw new Error('Please add at least one passenger')
      }

      // Generate booking number
      const bookingNumber = 'GCC-' + Date.now().toString(36).toUpperCase()

      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          trip_id: selectedTrip.id,
          booking_number: bookingNumber,
          trip_date: bookingData.trip_date,
          departure_time: bookingData.departure_time,
          passenger_count: bookingData.passenger_count,
          is_private_charter: bookingData.is_private_charter,
          passengers: bookingData.passengers,
          special_requests: bookingData.special_requests,
          subtotal: calculateTotal(),
          total_amount: calculateTotal() * 1.08, // Add 8% tax
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Booking created successfully!')
      router.push(`/booking/confirmation?id=${data.id}`)
      
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      <FishyHelp 
        page="booking"
        title="Booking a Trip"
      />

      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Anchor className="mr-2 text-blue-600" />
              Book Your Charter
            </h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Home
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6">
            <StepIndicator number={1} label="Select Trip" active={step >= 1} complete={step > 1} />
            <ChevronRight className="text-gray-400 mx-2" />
            <StepIndicator number={2} label="Trip Details" active={step >= 2} complete={step > 2} />
            <ChevronRight className="text-gray-400 mx-2" />
            <StepIndicator number={3} label="Payment" active={step >= 3} complete={step > 3} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Step 1: Select Trip */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Choose Your Adventure</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleTripSelect(trip)}
                >
                  {/* Trip Image Placeholder */}
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                    <Anchor className="text-white" size={64} />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{trip.trip_name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{trip.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Clock className="mr-2" size={16} />
                        {trip.duration_hours} hours
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="mr-2" size={16} />
                        Up to {trip.max_passengers} passengers
                      </div>
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="mr-2" size={16} />
                        From ${trip.price_per_person}/person
                      </div>
                    </div>
                    
                    {trip.captains && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-700">
                          {trip.captains.business_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ⭐ {trip.captains.average_rating} ({trip.captains.total_reviews} reviews)
                        </p>
                      </div>
                    )}
                    
                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Select This Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Trip Details */}
        {step === 2 && selectedTrip && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Trip Details</h2>
            
            {/* Selected Trip Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-900">{selectedTrip.trip_name}</h3>
              <p className="text-blue-700 text-sm mt-1">{selectedTrip.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Date *
                </label>
                <input
                  type="date"
                  value={bookingData.trip_date}
                  onChange={(e) => setBookingData({ ...bookingData, trip_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Time *
                </label>
                <select
                  value={bookingData.departure_time}
                  onChange={(e) => setBookingData({ ...bookingData, departure_time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="06:00">6:00 AM - Morning</option>
                  <option value="08:00">8:00 AM - Mid-Morning</option>
                  <option value="12:00">12:00 PM - Afternoon</option>
                  <option value="16:00">4:00 PM - Late Afternoon</option>
                  <option value="18:00">6:00 PM - Evening (Sunset)</option>
                </select>
              </div>

              {/* Charter Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charter Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!bookingData.is_private_charter}
                      onChange={() => setBookingData({ ...bookingData, is_private_charter: false })}
                      className="mr-2"
                    />
                    <span>Per Person (${selectedTrip.price_per_person}/person)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={bookingData.is_private_charter}
                      onChange={() => setBookingData({ ...bookingData, is_private_charter: true })}
                      className="mr-2"
                    />
                    <span>Private Charter (${selectedTrip.price_private_charter})</span>
                  </label>
                </div>
              </div>

              {/* Passenger Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedTrip.max_passengers}
                  value={bookingData.passenger_count}
                  onChange={(e) => {
                    const count = parseInt(e.target.value) || 1
                    setBookingData({ ...bookingData, passenger_count: count })
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {selectedTrip.max_passengers} passengers
                </p>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-3">Passenger Information</h3>
              {[...Array(bookingData.passenger_count)].map((_, index) => (
                <div key={index} className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder={`Passenger ${index + 1} Name`}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    min="1"
                    max="100"
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <select
                    onChange={(e) => handlePassengerChange(index, 'experience', e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">Fishing Experience</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="experienced">Experienced</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Special Requests */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={bookingData.special_requests}
                onChange={(e) => setBookingData({ ...bookingData, special_requests: e.target.value })}
                rows="3"
                placeholder="Dietary restrictions, celebrations, specific fish targets, etc."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Summary */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-800">Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                * 50% deposit required to confirm booking
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Trip Selection
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Information</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="text-yellow-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-800">Test Mode Active</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Use test card: 4242 4242 4242 4242 with any future expiry date
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Form Placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">
                Stripe payment form would appear here
              </p>
              <p className="text-sm text-gray-500">
                In production, this integrates with Stripe for secure payments
              </p>
            </div>

            {/* Order Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Trip: {selectedTrip?.trip_name}</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t font-bold">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${(calculateTotal() * 1.08).toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-blue-600">
                    <span>Deposit Due Now (50%)</span>
                    <span>${(calculateTotal() * 1.08 * 0.5).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Details
              </button>
              <button
                onClick={handleSubmitBooking}
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Step Indicator Component
function StepIndicator({ number, label, active, complete }) {
  return (
    <div className="flex items-center">
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center font-bold
        ${complete ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
      `}>
        {complete ? '✓' : number}
      </div>
      <span className={`ml-2 ${active ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  )
}
