# Captain's Bridge - Maritime Management System

## 🚢 Overview
A comprehensive Progressive Web App (PWA) designed for boat captains to manage Coast Guard inspections, navigation, documentation, and ship's logs with full offline capability.

## 🌟 Features

### 📄 Document Management
- Upload and store all Coast Guard required documents
- Quick access during inspections
- Offline viewing capability
- Support for PDFs, images, and other document formats

### 🗺️ Navigation & Mapping
- Real-time GPS location tracking
- Drop pins for important locations
- Mark Coast Guard stops with timestamp
- Offline map caching for use without internet

### 📝 Ship's Log
- Digital logbook with timestamps
- Weather and position recording
- Quick Coast Guard stop logging
- Export and backup capabilities

### ✅ Coast Guard Checklist
- Pre-inspection checklist
- Safety equipment verification
- Documentation checklist
- Vessel condition checks

## 🔧 Installation & Deployment

### Local Development
```bash
# 1. Clone or download all files to a directory
# 2. Serve the files using a local web server

# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### Production Deployment
```bash
# 1. Upload all files to your web server
# 2. Ensure HTTPS is enabled (required for PWA features)
# 3. Configure server to serve index.html for all routes
```

### Files to Deploy
- `index.html` - Main application
- `styles.css` - Styling
- `app.js` - Application logic
- `sw.js` - Service worker for offline
- `manifest.json` - PWA configuration
- `gift-cards.html` - Printable gift cards

## 📱 Offline Capabilities
- **100% Offline Operation**: All features work without internet
- **Local Storage**: Data saved to browser storage
- **PWA Installation**: Install as app on phone/tablet
- **Background Sync**: Syncs when connection restored

## 🎽 T-Shirt Company Recommendations

### 1. **Printful** ⭐⭐⭐⭐⭐
- **Best For**: High-quality on-demand printing
- **Pros**: 
  - No minimum orders
  - Integrates with e-commerce platforms
  - Global shipping
  - Excellent print quality
  - Wide range of products
- **Cons**: Higher per-unit cost
- **Website**: printful.com
- **Ideal For**: Custom maritime/boating designs, captain merchandise

### 2. **Custom Ink** ⭐⭐⭐⭐⭐
- **Best For**: Bulk orders and team/crew shirts
- **Pros**:
  - Free design assistance
  - Great bulk pricing
  - Fast turnaround
  - Excellent customer service
  - Free shipping on orders over $100
- **Cons**: Better pricing requires larger quantities
- **Website**: customink.com
- **Ideal For**: Crew uniforms, charter company shirts, marina merchandise

## 💾 Data Management

### Backup Data
```javascript
// In browser console:
localStorage.getItem('captainsBridgeData')
// Copy the output to save backup
```

### Restore Data
```javascript
// In browser console:
localStorage.setItem('captainsBridgeData', 'YOUR_BACKUP_JSON')
// Refresh page
```

### Clear All Data
```javascript
// In browser console:
localStorage.clear()
// Refresh page
```

## 🚨 Coast Guard Stop Features
1. **Quick Access Button**: Red emergency button on map
2. **Automatic Location Recording**: GPS coordinates saved
3. **Timestamp Documentation**: Exact time of stop
4. **Log Integration**: Automatically added to ship's log
5. **Offline Storage**: Works without internet connection

## 🖨️ Gift Card Printing

### How to Use Gift Cards
1. Open `gift-cards.html` in browser
2. Click on amounts/codes to customize
3. Print on cardstock paper (recommended)
4. Cut along edges
5. Optional: Laminate for durability

### Gift Card Features
- 4 different designs
- Editable amounts
- Unique codes auto-generated
- Professional gradient designs
- Print-optimized layout

## 🔐 Security Notes
- All data stored locally on device
- No cloud dependency
- Export/backup recommended regularly
- Use device security (PIN/biometric)

## 📋 Coast Guard Document Checklist

### Required Documents (US Waters)
- [ ] Certificate of Documentation/Registration
- [ ] Safety Equipment Certificate
- [ ] Insurance Policy
- [ ] Waste Management Plan
- [ ] Captain's License
- [ ] Crew List
- [ ] Float Plan (recommended)
- [ ] Radio License (if applicable)

## 🆘 Emergency Features
- **SOS Location Share**: Quick coordinate sharing
- **Emergency Contact List**: Stored offline
- **Coast Guard Contact**: Quick dial button
- **Mayday Checklist**: Step-by-step guide

## 🔄 Updates & Maintenance

### Current Version: 1.0.0
- Last Updated: November 2024
- Compatible with all modern browsers
- Mobile responsive design

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 📞 Support

For technical issues or feature requests:
1. Check browser console for errors
2. Ensure latest browser version
3. Clear cache if issues persist
4. Backup data before troubleshooting

## 🌊 Best Practices

### For Coast Guard Stops
1. Keep all documents up-to-date
2. Use checklist before departing
3. Test app offline before voyage
4. Keep device charged
5. Have paper backup for critical docs

### For Daily Use
1. Log entries daily
2. Update crew list regularly
3. Check document expiration dates
4. Test emergency features monthly
5. Backup data weekly

## 📄 License
Free to use for personal and commercial maritime operations.

---

## Quick Start Commands

```bash
# Start local server (choose one)
python3 -m http.server 8000
npx serve .
php -S localhost:8000

# Access application
# Open browser to: http://localhost:8000

# Install as PWA
# Click "Install App" in browser address bar
```

## Deployment Checklist
- [x] All files compiled and saved
- [x] Service worker configured
- [x] Offline functionality tested
- [x] Gift card templates ready
- [x] Documentation complete
- [x] T-shirt vendors researched
- [x] All data persistent offline
- [x] Coast Guard features implemented
- [x] Location services integrated
- [x] Export/backup functionality

---

**Ready for Production Use!** 🚢⚓
