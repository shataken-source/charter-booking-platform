# Captain Weather Alert System Guide

## Overview
The Captain Weather Alert System allows captains to set custom thresholds for weather and marine conditions at specific NOAA buoy locations. When conditions exceed or fall below these thresholds, automated SMS and email notifications are sent.

## Features

### 1. Custom Alert Preferences
- **Per-Buoy Configuration**: Set different thresholds for each of 10 Gulf Coast buoys
- **Vessel Type Specific**: Configure alerts based on vessel type (Small Fishing Boat, Medium Charter, Large Charter, Sailboat, Catamaran, Yacht)
- **Multiple Thresholds**:
  - Maximum Wave Height (feet)
  - Maximum Wind Speed (knots)
  - Minimum Water Temperature (°F)
  - Maximum Water Temperature (°F)

### 2. Multi-Channel Notifications
- **Email Alerts**: Sent via Mailjet email service
- **SMS Alerts**: Sent via Sinch SMS service
- **Configurable**: Enable/disable each channel per alert preference

### 3. Alert History
- View all past alerts with timestamps
- See threshold vs actual values
- Track which notification methods were used
- Filter by buoy, date, or alert type

## Gulf Coast Buoy Stations

| Buoy ID | Location | Coverage Area |
|---------|----------|---------------|
| 42040 | Luke Offshore, LA | Louisiana Coast |
| 42039 | Pensacola, FL | Northwest Florida |
| 42036 | West Tampa, FL | West Central Florida |
| 42001 | Mid Gulf | Central Gulf of Mexico |
| 42002 | West Gulf | Western Gulf of Mexico |
| 42019 | Freeport, TX | Texas Coast |
| 42020 | Corpus Christi, TX | South Texas |
| 42035 | Galveston, TX | Upper Texas Coast |
| 42012 | Orange Beach, AL | Alabama Coast |
| 42007 | South Tampa, FL | Southwest Florida |

## Using the Alert System

### Setting Up Alerts

1. **Navigate to Captain Dashboard**
   - Go to `/captain-dashboard`
   - Click on the "Alerts" tab

2. **Add New Alert Preference**
   - Click "Add Alert" button
   - Select vessel type from dropdown
   - Choose buoy station
   - Set threshold values (only set thresholds you want to monitor)
   - Toggle email/SMS preferences
   - Click "Save Alert Preference"

3. **Manage Existing Alerts**
   - View all active alert preferences
   - Delete unwanted alerts with trash icon
   - Alerts are automatically checked every 5 minutes

### Alert Threshold Examples

**Small Fishing Boat (Cautious)**
- Max Wave Height: 3.0 ft
- Max Wind Speed: 15 kt
- Min Water Temp: 70°F

**Medium Charter (Moderate)**
- Max Wave Height: 5.0 ft
- Max Wind Speed: 25 kt
- Min Water Temp: 65°F

**Large Charter (Experienced)**
- Max Wave Height: 8.0 ft
- Max Wind Speed: 35 kt
- Min Water Temp: 60°F

## Edge Function: captain-weather-alerts

### API Actions

**Get Preferences**
```javascript
{
  action: 'getPreferences',
  captainId: 'captain-uuid'
}
```

**Save Preference**
```javascript
{
  action: 'savePreference',
  preference: {
    vesselType: 'Medium Charter',
    buoyId: '42040',
    maxWaveHeight: 5.0,
    maxWindSpeed: 25.0,
    alertViaEmail: true,
    alertViaSms: true
  }
}
```

**Delete Preference**
```javascript
{
  action: 'deletePreference',
  preferenceId: 'preference-uuid'
}
```

**Get Alert History**
```javascript
{
  action: 'getAlertHistory',
  captainId: 'captain-uuid'
}
```

**Check Conditions** (Automated)
```javascript
{
  action: 'checkConditions',
  buoyId: '42040',
  preference: { /* preference object */ }
}
```

## Automated Monitoring

### How It Works
1. Every 5 minutes, the system checks all active alert preferences
2. For each preference, it fetches real-time data from the specified NOAA buoy
3. Compares actual conditions against captain-defined thresholds
4. If any threshold is exceeded:
   - Creates alert history record
   - Sends email notification (if enabled)
   - Sends SMS notification (if enabled)
   - Logs the event

### Notification Content
Alerts include:
- Buoy location and ID
- Alert type (Wave Height, Wind Speed, Water Temperature)
- Threshold value vs actual value
- Timestamp
- Vessel type affected
- Safety recommendations

## Components

### CaptainAlertPreferences.tsx
- Form for creating/managing alert preferences
- Vessel type and buoy selection
- Threshold input fields
- Email/SMS toggle switches
- List of active preferences with delete option

### AlertHistoryPanel.tsx
- Displays chronological alert history
- Color-coded by alert type
- Shows notification methods used
- Threshold vs actual value comparison
- Timestamp for each alert

## Integration with Other Systems

### Weather API Integration
- Uses `noaa-buoy-data` edge function for real-time conditions
- Fetches wave height, wind speed, water temperature
- Updates every 5 minutes from NOAA servers

### Email Notifications
- Sent via `mailjet-email-service` edge function
- Professional HTML templates
- Includes safety recommendations
- Links to NOAA marine forecasts

### SMS Notifications
- Sent via `sms-booking-reminders` edge function
- Concise text messages
- Critical information only
- Links to detailed forecast

## Best Practices

1. **Set Realistic Thresholds**: Base on vessel capabilities and experience level
2. **Test Notifications**: Create a test alert to verify email/SMS delivery
3. **Monitor Multiple Buoys**: Set alerts for all buoys in your operating area
4. **Adjust Seasonally**: Update thresholds based on seasonal conditions
5. **Review History**: Learn from past alerts to refine thresholds

## Troubleshooting

**Not Receiving Alerts**
- Verify email/SMS toggles are enabled
- Check contact information in captain profile
- Ensure thresholds are set (empty = no monitoring)
- Confirm buoy is reporting data

**Too Many Alerts**
- Increase threshold values
- Disable alerts for distant buoys
- Adjust vessel type to more appropriate category

**Missing Alert History**
- History is retained for 90 days
- Check date filters
- Verify captain ID matches

## Future Enhancements
- Push notifications via mobile app
- Predictive alerts based on forecast trends
- Group alerts by charter booking
- Custom alert schedules (e.g., only during business hours)
- Integration with captain availability calendar
