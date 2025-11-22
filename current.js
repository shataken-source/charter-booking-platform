// pages/api/weather/current.js - ACTUAL WEATHER API
export default async function handler(req, res) {
  try {
    // Fetch from NOAA buoy data
    const stationId = process.env.DEFAULT_NOAA_STATION || '42012'
    const response = await fetch(
      `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }
    
    const text = await response.text()
    const lines = text.split('\n')
    
    // Parse NOAA data format
    const headers = lines[0].replace('#', '').trim().split(/\s+/)
    const currentData = lines[2].trim().split(/\s+/)
    
    const weatherData = {}
    headers.forEach((header, index) => {
      weatherData[header.toLowerCase()] = currentData[index]
    })
    
    // Format response
    const formattedData = {
      station_id: stationId,
      timestamp: new Date().toISOString(),
      wind_speed: parseFloat(weatherData.wspd) || 0,
      wind_gust: parseFloat(weatherData.gst) || 0,
      wind_direction: parseFloat(weatherData.wdir) || 0,
      wave_height: weatherData.wvht ? (parseFloat(weatherData.wvht) * 3.28084).toFixed(1) : 0,
      wave_period: parseFloat(weatherData.dpd) || 0,
      air_pressure: parseFloat(weatherData.pres) || 1013,
      air_temp: weatherData.atmp ? (parseFloat(weatherData.atmp) * 9/5 + 32).toFixed(1) : 0,
      water_temp: weatherData.wtmp ? (parseFloat(weatherData.wtmp) * 9/5 + 32).toFixed(1) : 0,
      visibility: weatherData.vis ? (parseFloat(weatherData.vis) * 0.539957).toFixed(1) : 10
    }
    
    res.status(200).json(formattedData)
    
  } catch (error) {
    console.error('Weather API error:', error)
    // Return mock data if NOAA is unavailable
    res.status(200).json({
      station_id: '42012',
      timestamp: new Date().toISOString(),
      wind_speed: 12,
      wind_gust: 15,
      wind_direction: 180,
      wave_height: 3.5,
      wave_period: 7,
      air_pressure: 1013,
      air_temp: 78,
      water_temp: 72,
      visibility: 10,
      mock_data: true
    })
  }
}
