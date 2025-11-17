# SECURITY AUDIT & HARDENING GUIDE

## 🔴 CRITICAL - Fix Immediately

### 1. Environment Variables
- [ ] Move all API keys to `.env` file
- [ ] Remove hardcoded credentials from `src/lib/supabase.ts`
- [ ] Add `.env` to `.gitignore` (already done)
- [ ] Use `import.meta.env` for all sensitive values

### 2. Row Level Security (RLS)
**Status**: ⚠️ NEEDS IMPLEMENTATION

Run in Supabase SQL Editor:
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE charters ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "users_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admin policies
CREATE POLICY "admins_all_access" ON profiles FOR ALL USING (
  (SELECT user_metadata->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
);
```

### 3. Input Validation
- [ ] Sanitize all user inputs before database queries
- [ ] Validate email formats
- [ ] Enforce password complexity (min 8 chars, uppercase, number, special)
- [ ] Prevent SQL injection with parameterized queries

## 🟡 HIGH PRIORITY

### 4. Authentication Security
- [ ] Enable 2FA for all admin accounts
- [ ] Implement session timeout (30 minutes)
- [ ] Add rate limiting on login attempts
- [ ] Use secure password hashing (bcrypt/argon2)

### 5. API Security
- [ ] Add rate limiting to all API endpoints
- [ ] Implement CORS properly
- [ ] Validate all request payloads
- [ ] Use HTTPS only in production

### 6. Data Protection
- [ ] Encrypt sensitive data at rest
- [ ] Use secure tokens for password resets
- [ ] Implement data retention policies
- [ ] Regular database backups

## 🟢 RECOMMENDED

### 7. Monitoring & Logging
- [ ] Log all authentication attempts
- [ ] Monitor for suspicious activity
- [ ] Set up error tracking (Sentry)
- [ ] Regular security audits

### 8. Code Security
- [ ] Keep dependencies updated
- [ ] Run `npm audit` regularly
- [ ] Remove unused dependencies
- [ ] Code review for security issues

## SECURITY CHECKLIST BY ROLE

### Admin Security
- [ ] 2FA required
- [ ] IP whitelist (optional)
- [ ] Audit logging enabled
- [ ] Limited session duration
- [ ] Strong password policy

### Captain Security
- [ ] Email verification required
- [ ] Background check integration
- [ ] License verification
- [ ] Insurance validation
- [ ] Activity monitoring

### User Security
- [ ] Email verification
- [ ] Password strength meter
- [ ] Account recovery options
- [ ] Privacy controls
- [ ] Data export capability

## COMPLIANCE

### GDPR (EU Users)
- [ ] Cookie consent banner
- [ ] Privacy policy page
- [ ] Data deletion requests
- [ ] Data portability
- [ ] Breach notification process

### CCPA (California Users)
- [ ] Do Not Sell option
- [ ] Data disclosure
- [ ] Opt-out mechanism

## PENETRATION TESTING

Run these tests regularly:
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for exposed secrets
git secrets --scan
```

## INCIDENT RESPONSE PLAN

1. **Detect**: Monitor logs for anomalies
2. **Contain**: Disable compromised accounts
3. **Investigate**: Review access logs
4. **Remediate**: Patch vulnerabilities
5. **Notify**: Inform affected users
6. **Document**: Record incident details

## SECURITY CONTACTS

- Security Issues: security@yourdomain.com
- Bug Bounty: bugbounty@yourdomain.com
- Emergency: +1-XXX-XXX-XXXX
