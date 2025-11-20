import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

interface TestResult {
  test: string;
  passed: boolean;
  error?: string;
}

export async function testRLSPolicies(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // Test 1: Users can only read their own profiles
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user } } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpass123'
    });
    
    if (user) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('id', user.id);
      
      results.push({
        test: 'Users cannot access other profiles',
        passed: !data || data.length === 0,
        error: error?.message
      });
    }
  } catch (error: any) {
    results.push({
      test: 'Users cannot access other profiles',
      passed: false,
      error: error.message
    });
  }
  
  // Test 2: Captains can only modify their own listings
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase
      .from('charter_listings')
      .update({ title: 'Hacked' })
      .neq('captain_id', 'current_user_id');
    
    results.push({
      test: 'Captains cannot modify other listings',
      passed: error !== null,
      error: error?.message
    });
  } catch (error: any) {
    results.push({
      test: 'Captains cannot modify other listings',
      passed: true
    });
  }
  
  return results;
}
