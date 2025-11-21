// Location Sharing Component with Map
// File: /components/LocationSharing.jsx

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Share2, Users, Lock, Globe, Eye, EyeOff, Navigation } from 'lucide-react';

const LocationSharing = ({ userId, userType = 'user' }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [sharingEnabled, setShareingEnabled] = useState(false);
  const [sharingMode, setSharingMode] = useState('private'); // private, friends, public
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    loadSavedLocations();
    if (sharingEnabled) {
      startLocationTracking();
    }
    return () => stopLocationTracking();
  }, [sharingEnabled]);

  // Start tracking user location
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        
        setUserLocation(location);
        updateLocationOnServer(location);
        
        if (mapRef.current) {
          centerMapOnLocation(location);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Stop tracking
  const stopLocationTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Update location on server
  const updateLocationOnServer = async (location) => {
    try {
      await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateLocation',
          userId,
          location: {
            ...location,
            sharingMode,
            userType
          }
        })
      });

      // Fetch nearby users if sharing publicly
      if (sharingMode !== 'private') {
        fetchNearbyUsers(location);
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // Fetch nearby users
  const fetchNearbyUsers = async (location) => {
    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getNearbyUsers',
          latitude: location.latitude,
          longitude: location.longitude,
          radius: 50, // nautical miles
          userType
        })
      });
      
      const data = await response.json();
      setNearbyUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    }
  };

  // Pin current location
  const pinCurrentLocation = async () => {
    if (!userLocation) {
      alert('Location not available');
      return;
    }

    const name = prompt('Name this location:');
    if (!name) return;

    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pinLocation',
          userId,
          pin: {
            name,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            type: 'favorite',
            notes: '',
            private: true
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setSavedLocations([...savedLocations, data.pin]);
        alert('Location pinned successfully!');
      }
    } catch (error) {
      console.error('Error pinning location:', error);
      alert('Failed to pin location');
    }
  };

  // Load saved locations
  const loadSavedLocations = async () => {
    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getSavedLocations',
          userId
        })
      });

      const data = await response.json();
      setSavedLocations(data.locations || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  // Share location with others
  const shareLocation = async () => {
    if (!userLocation) return;

    const shareUrl = `https://gulfcoastcharters.com/map?lat=${userLocation.latitude}&lon=${userLocation.longitude}&user=${userId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Location',
          text: `Check out my location on Gulf Coast Charters`,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Location link copied to clipboard!');
    }
  };

  // Toggle sharing
  const toggleSharing = () => {
    setShareingEnabled(!sharingEnabled);
    if (!sharingEnabled) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  };

  // Center map on location
  const centerMapOnLocation = (location) => {
    // This would integrate with actual map library (Mapbox, Google Maps, etc.)
    console.log('Centering map on:', location);
  };

  // Handle location error
  const handleLocationError = (error) => {
    const errors = {
      1: 'Permission denied. Please enable location access.',
      2: 'Position unavailable. Check your device settings.',
      3: 'Request timeout. Please try again.'
    };
    alert(errors[error.code] || 'An error occurred getting your location.');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Location Sharing
              </h2>
              <p className="text-gray-600">
                {userType === 'captain' 
                  ? 'Share your location with crew and customers'
                  : 'Share your location with friends and family'
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleSharing}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              sharingEnabled
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {sharingEnabled ? (
              <>
                <EyeOff className="w-5 h-5 inline mr-2" />
                Stop Sharing
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 inline mr-2" />
                Start Sharing
              </>
            )}
          </button>
        </div>

        {/* Sharing Mode */}
        {sharingEnabled && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium">Visibility:</span>
            <button
              onClick={() => setSharingMode('private')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                sharingMode === 'private'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Private</span>
            </button>
            <button
              onClick={() => setSharingMode('friends')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                sharingMode === 'friends'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Friends</span>
            </button>
            <button
              onClick={() => setSharingMode('public')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                sharingMode === 'public'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Public</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-[600px] relative">
            {/* Map container */}
            <div ref={mapRef} className="w-full h-full bg-gray-200">
              {/* Actual map would be rendered here using Mapbox/Google Maps */}
              <div className="flex items-center justify-center h-full">
                {userLocation ? (
                  <div className="text-center space-y-4">
                    <MapPin className="w-16 h-16 text-blue-500 mx-auto" />
                    <div>
                      <p className="text-lg font-semibold">Your Location</p>
                      <p className="text-gray-600">
                        {userLocation.latitude.toFixed(6)}°N,{' '}
                        {Math.abs(userLocation.longitude).toFixed(6)}°W
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Accuracy: ±{userLocation.accuracy.toFixed(0)}m
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Navigation className="w-16 h-16 mx-auto mb-4" />
                    <p>Enable location sharing to see the map</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map controls */}
            {userLocation && (
              <div className="absolute bottom-4 right-4 space-y-2">
                <button
                  onClick={pinCurrentLocation}
                  className="bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-lg shadow-lg"
                  title="Pin current location"
                >
                  <MapPin className="w-5 h-5" />
                </button>
                <button
                  onClick={shareLocation}
                  className="bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-lg shadow-lg"
                  title="Share location"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Location Info */}
          {userLocation && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Current Position</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitude:</span>
                  <span className="font-mono">{userLocation.latitude.toFixed(6)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitude:</span>
                  <span className="font-mono">{userLocation.longitude.toFixed(6)}°</span>
                </div>
                {userLocation.speed && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-mono">
                      {(userLocation.speed * 1.94384).toFixed(1)} kt
                    </span>
                  </div>
                )}
                {userLocation.heading && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heading:</span>
                    <span className="font-mono">{userLocation.heading.toFixed(0)}°</span>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <button
                    onClick={shareLocation}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Location</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nearby Users */}
          {sharingMode !== 'private' && nearbyUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Nearby {userType === 'captain' ? 'Captains' : 'Users'} ({nearbyUsers.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {nearbyUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => setSelectedLocation(user.location)}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          {user.distance.toFixed(1)} nm away
                        </p>
                      </div>
                    </div>
                    {user.lastUpdate && (
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(user.lastUpdate)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Locations */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Saved Locations ({savedLocations.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedLocations.map((location) => (
                <div
                  key={location.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{location.name}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
                      </p>
                      {location.notes && (
                        <p className="text-xs text-gray-600 mt-1">{location.notes}</p>
                      )}
                    </div>
                    {location.private && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
              {savedLocations.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No saved locations yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time ago
const formatTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export default LocationSharing;
