// Weather Alert System with Email Notifications
// File: /api/weather-alerts.js

import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Weather alert thresholds
const ALERT_THRESHOLDS = {
  CRITICAL: {
    windSpeed: 35, // knots
    waveHeight: 8, // feet
    pressureDrop: -5, // hPa per 3 hours
    visibility: 1, // nautical miles
    severity: 'critical',
    color: '#DC2626',
    icon: '🚨'
  },
  HIGH: {
    windSpeed: 25,
    waveHeight: 5,
    pressureDrop: -3,
    visibility: 2,
    severity: 'high',
    color: '#EA580C',
    icon: '⚠️'
  },
  MEDIUM: {
    windSpeed: 20,
    waveHeight: 3,
    pressureDrop: -2,
    visibility: 3,
    severity: 'medium',
    color: '#F59E0B',
    icon: '⚡'
  },
  LOW: {
    windSpeed: 15,
    waveHeight: 2,
    pressureDrop: -1,
    visibility: 5,
    severity: 'low',
    color: '#3B82F6',
    icon: 'ℹ️'
  }
};

class WeatherAlertService {
  constructor() {
    this.noaaBaseUrl = 'https://www.ndbc.noaa.gov/data/realtime2';
    this.nwsBaseUrl = 'https://api.weather.gov';
  }

  // Main handler for weather alerts
  async checkWeatherAlerts() {
    try {
      console.log('🌊 Starting weather alert check...');

      // Get all users with trips scheduled
      const users = await this.getUsersWithUpcomingTrips();
      
      // Get all captains operating today
      const captains = await this.getActiveCaptains();

      // Check weather for each user destination
      const userAlerts = await this.checkUserDestinations(users);
      
      // Check weather for captain locations
      const captainAlerts = await this.checkCaptainLocations(captains);

      // Send email notifications
      await this.sendAlertEmails(userAlerts, 'user');
      await this.sendAlertEmails(captainAlerts, 'captain');

      // Send push notifications
      await this.sendPushNotifications(userAlerts, 'user');
      await this.sendPushNotifications(captainAlerts, 'captain');

      console.log(`✅ Weather alerts processed: ${userAlerts.length} users, ${captainAlerts.length} captains`);

      return {
        success: true,
        userAlerts: userAlerts.length,
        captainAlerts: captainAlerts.length
      };
    } catch (error) {
      console.error('❌ Weather alert error:', error);
      throw error;
    }
  }

  // Get users with upcoming trips
  async getUsersWithUpcomingTrips() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        user:users!inner(*),
        trip:trips!inner(
          *,
          location:locations(*)
        )
      `)
      .gte('trip_date', new Date().toISOString())
      .lte('trip_date', tomorrow.toISOString())
      .eq('status', 'confirmed')
      .not('user', 'is', null);

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return (bookings || []).map(booking => ({
      userId: booking.user.id,
      email: booking.user.email,
      name: booking.user.full_name,
      tripDate: booking.trip_date,
      location: booking.trip.location,
      tripTitle: booking.trip.title,
      preferences: booking.user.notification_preferences || {}
    }));
  }

  // Get active captains
  async getActiveCaptains() {
    const { data: captains, error } = await supabase
      .from('captains')
      .select(`
        *,
        user:users!inner(*),
        home_port:locations(*)
      `)
      .eq('status', 'active')
      .not('home_port', 'is', null);

    if (error) {
      console.error('Error fetching captains:', error);
      return [];
    }

    return (captains || []).map(captain => ({
      captainId: captain.id,
      email: captain.user.email,
      name: captain.user.full_name,
      location: captain.home_port,
      preferences: captain.user.notification_preferences || {}
    }));
  }

  // Check weather for user destinations
  async checkUserDestinations(users) {
    const alerts = [];

    for (const user of users) {
      try {
        // Skip if user disabled weather alerts
        if (user.preferences.weatherAlerts === false) continue;

        const { lat, lon } = user.location;
        
        // Get comprehensive weather data
        const [buoyData, nwsData, tideData] = await Promise.all([
          this.getNearestBuoyData(lat, lon),
          this.getNWSForecast(lat, lon),
          this.getTideData(lat, lon)
        ]);

        // Analyze conditions
        const analysis = this.analyzeWeather(buoyData, nwsData, tideData);

        // Create alerts if needed
        if (analysis.alerts.length > 0) {
          alerts.push({
            user,
            analysis,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Error checking weather for user ${user.userId}:`, error);
      }
    }

    return alerts;
  }

  // Check weather for captain locations
  async checkCaptainLocations(captains) {
    const alerts = [];

    for (const captain of captains) {
      try {
        if (captain.preferences.weatherAlerts === false) continue;

        const { lat, lon } = captain.location;
        
        const [buoyData, nwsData] = await Promise.all([
          this.getNearestBuoyData(lat, lon),
          this.getNWSForecast(lat, lon)
        ]);

        const analysis = this.analyzeWeather(buoyData, nwsData);

        if (analysis.alerts.length > 0) {
          alerts.push({
            captain,
            analysis,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Error checking weather for captain ${captain.captainId}:`, error);
      }
    }

    return alerts;
  }

  // Get nearest NOAA buoy data
  async getNearestBuoyData(lat, lon) {
    // Gulf Coast buoy stations
    const gulfBuoys = {
      '42039': { lat: 28.791, lon: -86.008, name: 'Pensacola' },
      '42040': { lat: 29.212, lon: -88.226, name: 'Luke Offshore' },
      '42012': { lat: 30.065, lon: -87.555, name: 'Orange Beach' },
      '42001': { lat: 25.897, lon: -89.668, name: 'Grand Isle' },
      '42019': { lat: 27.907, lon: -95.352, name: 'Freeport TX' },
      '42020': { lat: 26.968, lon: -96.695, name: 'Corpus Christi' }
    };

    // Find nearest buoy
    let nearestBuoy = null;
    let minDistance = Infinity;

    for (const [id, buoy] of Object.entries(gulfBuoys)) {
      const distance = this.calculateDistance(lat, lon, buoy.lat, buoy.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestBuoy = { id, ...buoy, distance };
      }
    }

    // Fetch buoy data
    try {
      const response = await fetch(`${this.noaaBaseUrl}/${nearestBuoy.id}.txt`);
      const text = await response.text();
      return this.parseBuoyData(text, nearestBuoy);
    } catch (error) {
      console.error(`Error fetching buoy ${nearestBuoy.id}:`, error);
      return null;
    }
  }

  // Parse NOAA buoy data
  parseBuoyData(text, buoyInfo) {
    const lines = text.split('\n');
    const headers = lines[0].split(/\s+/);
    const latest = lines[2].split(/\s+/);

    const data = {
      buoy: buoyInfo,
      timestamp: new Date(`${latest[0]}-${latest[1]}-${latest[2]}T${latest[3]}:${latest[4]}:00Z`),
      measurements: {}
    };

    headers.forEach((header, index) => {
      if (index > 4 && latest[index] !== 'MM' && latest[index] !== '999') {
        const value = parseFloat(latest[index]);
        data.measurements[header.toLowerCase()] = value;
      }
    });

    // Convert units
    if (data.measurements.wspd) {
      data.measurements.windSpeedKt = data.measurements.wspd * 1.94384; // m/s to knots
    }
    if (data.measurements.gst) {
      data.measurements.gustKt = data.measurements.gst * 1.94384;
    }
    if (data.measurements.wvht) {
      data.measurements.waveHeightFt = data.measurements.wvht * 3.28084; // m to feet
    }
    if (data.measurements.atmp) {
      data.measurements.airTempF = (data.measurements.atmp * 9/5) + 32; // C to F
    }
    if (data.measurements.wtmp) {
      data.measurements.waterTempF = (data.measurements.wtmp * 9/5) + 32;
    }

    return data;
  }

  // Get NWS forecast
  async getNWSForecast(lat, lon) {
    try {
      // Get point data
      const pointResponse = await fetch(`${this.nwsBaseUrl}/points/${lat},${lon}`);
      const pointData = await pointResponse.json();

      // Get forecast
      const forecastResponse = await fetch(pointData.properties.forecast);
      const forecastData = await forecastResponse.json();

      // Get active alerts
      const alertsResponse = await fetch(`${this.nwsBaseUrl}/alerts/active?point=${lat},${lon}`);
      const alertsData = await alertsResponse.json();

      return {
        forecast: forecastData.properties.periods,
        alerts: alertsData.features || []
      };
    } catch (error) {
      console.error('Error fetching NWS data:', error);
      return { forecast: [], alerts: [] };
    }
  }

  // Get tide data
  async getTideData(lat, lon) {
    // Find nearest tide station
    const stations = {
      '8728690': { lat: 30.404, lon: -87.211, name: 'Pensacola' },
      '8735180': { lat: 30.250, lon: -88.075, name: 'Dauphin Island' },
      '8761724': { lat: 29.263, lon: -89.957, name: 'Grand Isle' }
    };

    let nearestStation = null;
    let minDistance = Infinity;

    for (const [id, station] of Object.entries(stations)) {
      const distance = this.calculateDistance(lat, lon, station.lat, station.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = { id, ...station };
      }
    }

    try {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const params = new URLSearchParams({
        station: nearestStation.id,
        product: 'predictions',
        begin_date: this.formatDate(now),
        end_date: this.formatDate(tomorrow),
        datum: 'MLLW',
        time_zone: 'lst_ldt',
        interval: 'hilo',
        units: 'english',
        format: 'json',
        application: 'GulfCoastCharters'
      });

      const response = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${params}`);
      const data = await response.json();

      return {
        station: nearestStation,
        predictions: data.predictions || []
      };
    } catch (error) {
      console.error('Error fetching tide data:', error);
      return null;
    }
  }

  // Analyze weather conditions
  analyzeWeather(buoyData, nwsData, tideData) {
    const alerts = [];
    let maxSeverity = null;

    if (!buoyData) {
      return { alerts: [], severity: null, summary: 'Weather data unavailable' };
    }

    const { measurements } = buoyData;

    // Check wind speed
    if (measurements.windSpeedKt) {
      const severity = this.checkThreshold('wind', measurements.windSpeedKt);
      if (severity) {
        alerts.push({
          type: 'wind',
          severity: severity.severity,
          icon: severity.icon,
          message: `${severity.icon} ${severity.severity.toUpperCase()}: Sustained winds ${measurements.windSpeedKt.toFixed(0)} kt`,
          details: `Wind gusts reaching ${measurements.gustKt?.toFixed(0) || 'N/A'} kt from ${measurements.wdir || 'variable'} degrees. Dangerous conditions for small craft.`,
          recommendation: this.getWindRecommendation(measurements.windSpeedKt)
        });
        maxSeverity = this.compareSeverity(maxSeverity, severity.severity);
      }
    }

    // Check wave height
    if (measurements.waveHeightFt) {
      const severity = this.checkThreshold('wave', measurements.waveHeightFt);
      if (severity) {
        alerts.push({
          type: 'wave',
          severity: severity.severity,
          icon: severity.icon,
          message: `${severity.icon} ${severity.severity.toUpperCase()}: Wave height ${measurements.waveHeightFt.toFixed(1)} ft`,
          details: `Significant wave height with ${measurements.dpd || 'unknown'} second period. Rough seas expected.`,
          recommendation: this.getWaveRecommendation(measurements.waveHeightFt)
        });
        maxSeverity = this.compareSeverity(maxSeverity, severity.severity);
      }
    }

    // Check pressure trend (if we have historical data)
    if (measurements.pres) {
      // This would require storing historical pressure readings
      // For now, we'll check absolute pressure
      if (measurements.pres < 1000) {
        alerts.push({
          type: 'pressure',
          severity: 'medium',
          icon: '🌀',
          message: `⚡ MEDIUM: Low pressure system (${measurements.pres.toFixed(1)} hPa)`,
          details: 'Low pressure may indicate developing weather system. Monitor forecast closely.',
          recommendation: 'Check marine forecast frequently. Be prepared to cancel trip if conditions deteriorate.'
        });
        maxSeverity = this.compareSeverity(maxSeverity, 'medium');
      }
    }

    // Check NWS alerts
    if (nwsData && nwsData.alerts && nwsData.alerts.length > 0) {
      nwsData.alerts.forEach(alert => {
        const alertSeverity = this.mapNWSSeverity(alert.properties.severity);
        alerts.push({
          type: 'nws_alert',
          severity: alertSeverity,
          icon: '⚠️',
          message: `⚠️ ${alert.properties.event}`,
          details: alert.properties.headline,
          recommendation: alert.properties.instruction || 'Follow NWS guidance',
          expires: alert.properties.expires
        });
        maxSeverity = this.compareSeverity(maxSeverity, alertSeverity);
      });
    }

    // Generate summary
    const summary = this.generateSummary(alerts, buoyData, nwsData);

    return {
      alerts,
      severity: maxSeverity,
      summary,
      buoyData,
      nwsData,
      tideData
    };
  }

  // Check if value exceeds threshold
  checkThreshold(type, value) {
    const thresholds = {
      wind: { key: 'windSpeed', thresholds: ALERT_THRESHOLDS },
      wave: { key: 'waveHeight', thresholds: ALERT_THRESHOLDS }
    };

    const config = thresholds[type];
    if (!config) return null;

    // Check from most severe to least
    for (const [level, threshold] of Object.entries(config.thresholds)) {
      if (value >= threshold[config.key]) {
        return threshold;
      }
    }

    return null;
  }

  // Compare severity levels
  compareSeverity(current, newSeverity) {
    const levels = { critical: 4, high: 3, medium: 2, low: 1 };
    if (!current) return newSeverity;
    return levels[newSeverity] > levels[current] ? newSeverity : current;
  }

  // Map NWS severity to our system
  mapNWSSeverity(nwsSeverity) {
    const mapping = {
      'Extreme': 'critical',
      'Severe': 'high',
      'Moderate': 'medium',
      'Minor': 'low',
      'Unknown': 'medium'
    };
    return mapping[nwsSeverity] || 'medium';
  }

  // Generate human-readable summary
  generateSummary(alerts, buoyData, nwsData) {
    if (alerts.length === 0) {
      return 'Weather conditions are within normal parameters. Safe for boating.';
    }

    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const highAlerts = alerts.filter(a => a.severity === 'high');

    if (criticalAlerts.length > 0) {
      return `DANGEROUS CONDITIONS: ${criticalAlerts.map(a => a.message).join(', ')}. STRONGLY recommend canceling or postponing trip.`;
    }

    if (highAlerts.length > 0) {
      return `HAZARDOUS CONDITIONS: ${highAlerts.map(a => a.message).join(', ')}. Use extreme caution or consider rescheduling.`;
    }

    return `Moderate weather alerts in effect. ${alerts[0].message}. Review conditions carefully before departing.`;
  }

  // Get wind recommendations
  getWindRecommendation(windSpeed) {
    if (windSpeed >= 35) return 'DO NOT DEPART. Dangerous conditions. Cancel trip immediately.';
    if (windSpeed >= 25) return 'Strong winds. Small craft advisory. Only experienced captains in larger vessels.';
    if (windSpeed >= 20) return 'Choppy conditions expected. Brief customers on rough seas.';
    if (windSpeed >= 15) return 'Moderate winds. Good weather awareness required.';
    return 'Favorable wind conditions.';
  }

  // Get wave recommendations
  getWaveRecommendation(waveHeight) {
    if (waveHeight >= 8) return 'EXTREMELY ROUGH SEAS. Cancel trip. Unsafe for charter operations.';
    if (waveHeight >= 5) return 'Very rough seas. High risk of seasickness. Consider rescheduling.';
    if (waveHeight >= 3) return 'Choppy seas. Warn passengers about rough conditions.';
    if (waveHeight >= 2) return 'Moderate seas. Suitable for experienced boaters.';
    return 'Calm seas. Excellent boating conditions.';
  }

  // Send alert emails
  async sendAlertEmails(alerts, recipientType) {
    for (const alert of alerts) {
      try {
        const recipient = alert[recipientType] || alert.user || alert.captain;
        const emailHtml = this.generateAlertEmail(alert, recipientType);

        await emailTransporter.sendMail({
          from: '"Gulf Coast Charters Weather Alerts" <alerts@gulfcoastcharters.com>',
          to: recipient.email,
          subject: `${alert.analysis.severity?.toUpperCase() || 'WEATHER'} Alert: ${this.getAlertSubject(alert)}`,
          html: emailHtml
        });

        // Log email sent
        await supabase.from('notification_log').insert({
          user_id: recipient.userId || recipient.captainId,
          type: 'weather_alert',
          severity: alert.analysis.severity,
          channel: 'email',
          sent_at: new Date().toISOString()
        });

        console.log(`✅ Weather alert email sent to ${recipient.email}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${recipient.email}:`, error);
      }
    }
  }

  // Generate alert email HTML
  generateAlertEmail(alert, recipientType) {
    const recipient = alert[recipientType] || alert.user || alert.captain;
    const { analysis } = alert;
    const severityColor = this.getSeverityColor(analysis.severity);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px;">⚠️ Weather Alert</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Gulf Coast Charters</p>
            </td>
          </tr>

          <!-- Severity Badge -->
          <tr>
            <td style="padding: 20px; text-align: center; background-color: ${severityColor};">
              <h2 style="margin: 0; color: white; font-size: 24px; text-transform: uppercase;">
                ${analysis.severity || 'Weather'} ALERT
              </h2>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0; font-size: 16px; color: #374151;">
                Hi ${recipient.name},
              </p>
            </td>
          </tr>

          <!-- Summary -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; font-size: 16px; color: #92400e; font-weight: 600;">
                  ${analysis.summary}
                </p>
              </div>
            </td>
          </tr>

          <!-- Alerts -->
          ${analysis.alerts.map(a => `
            <tr>
              <td style="padding: 0 30px 15px 30px;">
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
                  <h3 style="margin: 0 0 10px 0; color: #111827; font-size: 18px;">
                    ${a.icon} ${a.message}
                  </h3>
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                    ${a.details}
                  </p>
                  <div style="background-color: #dbeafe; border-left: 3px solid #3b82f6; padding: 12px; border-radius: 4px;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 500;">
                      📋 Recommendation: ${a.recommendation}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          `).join('')}

          <!-- Current Conditions -->
          ${analysis.buoyData ? `
            <tr>
              <td style="padding: 20px 30px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">
                  📊 Current Conditions (${analysis.buoyData.buoy.name} Buoy)
                </h3>
                <table width="100%" cellpadding="8" style="border-collapse: collapse;">
                  ${analysis.buoyData.measurements.windSpeedKt ? `
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="color: #6b7280;">Wind:</td>
                      <td style="color: #111827; font-weight: 600; text-align: right;">
                        ${analysis.buoyData.measurements.windSpeedKt.toFixed(0)} kt 
                        (gusts ${analysis.buoyData.measurements.gustKt?.toFixed(0) || 'N/A'} kt)
                      </td>
                    </tr>
                  ` : ''}
                  ${analysis.buoyData.measurements.waveHeightFt ? `
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="color: #6b7280;">Waves:</td>
                      <td style="color: #111827; font-weight: 600; text-align: right;">
                        ${analysis.buoyData.measurements.waveHeightFt.toFixed(1)} ft
                      </td>
                    </tr>
                  ` : ''}
                  ${analysis.buoyData.measurements.pres ? `
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                      <td style="color: #6b7280;">Pressure:</td>
                      <td style="color: #111827; font-weight: 600; text-align: right;">
                        ${analysis.buoyData.measurements.pres.toFixed(1)} hPa
                      </td>
                    </tr>
                  ` : ''}
                  ${analysis.buoyData.measurements.waterTempF ? `
                    <tr>
                      <td style="color: #6b7280;">Water Temp:</td>
                      <td style="color: #111827; font-weight: 600; text-align: right;">
                        ${analysis.buoyData.measurements.waterTempF.toFixed(0)}°F
                      </td>
                    </tr>
                  ` : ''}
                </table>
              </td>
            </tr>
          ` : ''}

          <!-- Trip Info (for users) -->
          ${recipientType === 'user' && recipient.tripTitle ? `
            <tr>
              <td style="padding: 20px 30px; background-color: #f9fafb;">
                <h3 style="margin: 0 0 10px 0; color: #111827; font-size: 18px;">🎣 Your Upcoming Trip</h3>
                <p style="margin: 0 0 5px 0; color: #374151;">
                  <strong>${recipient.tripTitle}</strong>
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Scheduled for: ${new Date(recipient.tripDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </td>
            </tr>
          ` : ''}

          <!-- Action Buttons -->
          <tr>
            <td style="padding: 30px; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #0ea5e9; border-radius: 6px; padding: 12px 30px;">
                    <a href="https://gulfcoastcharters.com/weather" 
                       style="color: white; text-decoration: none; font-weight: 600; font-size: 16px;">
                      View Full Forecast
                    </a>
                  </td>
                </tr>
              </table>
              ${recipientType === 'user' ? `
                <p style="margin: 15px 0 0 0;">
                  <a href="https://gulfcoastcharters.com/bookings" 
                     style="color: #0ea5e9; text-decoration: none; font-size: 14px;">
                    Manage My Booking →
                  </a>
                </p>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-align: center;">
                This alert was automatically generated based on NOAA data.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center;">
                Gulf Coast Charters | Weather Alert System<br>
                <a href="https://gulfcoastcharters.com/settings/notifications" 
                   style="color: #0ea5e9; text-decoration: none;">
                  Update notification preferences
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  // Get alert subject line
  getAlertSubject(alert) {
    const recipient = alert.user || alert.captain;
    if (alert.analysis.severity === 'critical') {
      return 'DANGEROUS CONDITIONS - Trip Cancellation Recommended';
    }
    if (alert.analysis.severity === 'high') {
      return 'Hazardous Weather Expected for Your Trip';
    }
    return 'Weather Advisory for Your Upcoming Trip';
  }

  // Get severity color
  getSeverityColor(severity) {
    const colors = {
      critical: '#DC2626',
      high: '#EA580C',
      medium: '#F59E0B',
      low: '#3B82F6'
    };
    return colors[severity] || '#6B7280';
  }

  // Send push notifications
  async sendPushNotifications(alerts, recipientType) {
    // Implementation would depend on push notification service (FCM, OneSignal, etc.)
    console.log(`📱 Would send ${alerts.length} push notifications to ${recipientType}s`);
  }

  // Helper: Calculate distance between coordinates
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3440.065; // Earth radius in nautical miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Helper: Format date for NOAA API
  formatDate(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }
}

// Export handler for serverless function
export async function handler(req) {
  const weatherService = new WeatherAlertService();
  
  try {
    const result = await weatherService.checkWeatherAlerts();
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cron job configuration (run every hour)
// In Supabase: Create a pg_cron job or use Vercel Cron
// Schedule: 0 * * * * (every hour)

export default WeatherAlertService;
