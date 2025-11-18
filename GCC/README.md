# Gulf Coast Charter Finder 🚤

Enterprise-grade charter booking platform with comprehensive admin tools, captain management, and user analytics.

## 🌟 Features

### For Users
- **Advanced Search**: Find charters by location, date, price, and amenities
- **Real-time Booking**: Instant booking confirmation with calendar integration
- **Reviews & Ratings**: Read and write reviews for charters
- **Live Chat**: Message captains directly
- **Trip Planning**: Save favorites and plan your perfect trip

### For Captains
- **Captain Dashboard**: Manage bookings, earnings, and availability
- **Fleet Management**: Track boats, maintenance, and documentation
- **Weather Alerts**: Real-time weather notifications for your area
- **Analytics**: View booking trends and revenue reports
- **Certification Tracking**: Monitor license and insurance expiration

### For Admins
- **User Management**: Full CRUD operations for all users
- **Analytics Dashboard**: Comprehensive user activity metrics
- **Content Moderation**: Review and approve listings
- **Email Campaigns**: Send targeted marketing emails
- **Security Tools**: 2FA management, session monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gulf-charter-finder.git
cd gulf-charter-finder
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔒 Security Setup (CRITICAL)

**Before deploying to production**, complete these security steps:

1. **Environment Variables**: Move all credentials to `.env`
2. **Row Level Security**: Enable RLS on all database tables
3. **Rate Limiting**: Configure in Supabase dashboard
4. **2FA**: Enable for all admin accounts

See [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) for complete checklist.

## 🧪 Testing

```bash
# Run all tests
npm test

# Test admin functionality
npm run test:admin

# Test captain functionality
npm run test:captain

# Security audit
npm run audit:security
```

## 📦 Deployment

### Deploy to Vercel
```bash
npm run deploy:vercel
```

### Deploy to Netlify
```bash
npm run deploy:netlify
```

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete guide.

## 📚 Documentation

- [Critical Setup Instructions](./CRITICAL_SETUP_INSTRUCTIONS.md)
- [Security Audit](./SECURITY_AUDIT.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Testing Guide](./TESTING_GUIDE.md)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **UI**: Radix UI + shadcn/ui

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── admin/       # Admin panel components
│   ├── analytics/   # Analytics charts
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and config
├── pages/           # Route pages
└── stores/          # Zustand state stores
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- **Documentation**: See docs/ folder
- **Issues**: GitHub Issues
- **Security**: security@yourdomain.com
- **General**: support@yourdomain.com
