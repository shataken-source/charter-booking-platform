# Row Level Security (RLS) Setup Guide

## Why RLS is Critical
Row Level Security ensures users can only access their own data, preventing unauthorized access to bookings, messages, and personal information.

## Setup Instructions

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Enable RLS on All Tables
Copy and paste this query, then click "Run":

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE charters ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

### Step 3: Create Profile Policies
```sql
-- Anyone can view profiles
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Step 4: Create Booking Policies
```sql
-- Users can only view their own bookings
CREATE POLICY "bookings_select_policy" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create bookings
CREATE POLICY "bookings_insert_policy" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "bookings_update_policy" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);
```

### Step 5: Create Review Policies
```sql
-- Anyone can view reviews
CREATE POLICY "reviews_select_policy" ON reviews
  FOR SELECT USING (true);

-- Only users with completed bookings can create reviews
CREATE POLICY "reviews_insert_policy" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM bookings 
      WHERE id = booking_id AND status = 'completed'
    )
  );
```

### Step 6: Create Charter Policies
```sql
-- Anyone can view charters
CREATE POLICY "charters_select_policy" ON charters
  FOR SELECT USING (true);

-- Only captains can manage their charters
CREATE POLICY "charters_all_policy" ON charters
  FOR ALL USING (
    auth.uid() = captain_id
  );
```

### Step 7: Create Message Policies
```sql
-- Users can only see their own messages
CREATE POLICY "messages_select_policy" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

-- Users can send messages
CREATE POLICY "messages_insert_policy" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
```

### Step 8: Create Loyalty & Referral Policies
```sql
-- Users can view their own loyalty points
CREATE POLICY "loyalty_select_policy" ON loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own referrals
CREATE POLICY "referrals_select_policy" ON referrals
  FOR SELECT USING (
    auth.uid() = referrer_id OR auth.uid() = referred_id
  );
```

## Verification

After running all queries, verify RLS is working:

1. Go to "Table Editor" in Supabase
2. Select any table (e.g., "bookings")
3. You should see a shield icon indicating RLS is enabled
4. Test by logging in as a user and trying to access another user's data

## Troubleshooting

**Issue**: Policies not working
- **Solution**: Make sure you're logged in when testing. RLS only applies to authenticated users.

**Issue**: Users can't see their own data
- **Solution**: Check that `auth.uid()` matches the user_id in your policies

**Issue**: "permission denied" errors
- **Solution**: Review policy conditions - they may be too restrictive

## Security Best Practices

1. ✅ Always enable RLS on tables with user data
2. ✅ Test policies with different user roles
3. ✅ Use `auth.uid()` for user-specific policies
4. ✅ Keep policies simple and readable
5. ✅ Document any complex policy logic
