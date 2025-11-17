import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { Shield, Users, Database, Phone, Download, Upload, Mail, BarChart, GitMerge, Clock, Trophy, KeyRound, FileCheck, Send, List, MessageSquare, UserCog, LineChart, ShoppingBag, TrendingUp, Settings } from 'lucide-react';









import { useNavigate } from 'react-router-dom';


import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeduplicationTool from './DeduplicationTool';
import EmailNotificationManager from './EmailNotificationManager';
import { ReminderSchedulerPanel } from './ReminderSchedulerPanel';
import PhotoContestVoteAnalytics from './PhotoContestVoteAnalytics';





export default function AdminPanel() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Array<{ email: string; level: number }>>([]);

  const [newEmail, setNewEmail] = useState('');
  const [newLevel, setNewLevel] = useState(10);
  const [loading, setLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  
  // Backup states
  const [backupPhone, setBackupPhone] = useState('');
  const [backupSchedule, setBackupSchedule] = useState('manual');
  const [backupLoading, setBackupLoading] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);


  
  // Weekly report states
  const [reportLoading, setReportLoading] = useState(false);
  const [lastReportDate, setLastReportDate] = useState<string | null>(null);



  useEffect(() => {
    if (user?.level === 1) {
      loadUsers();
      loadBackups();
    }
  }, [user]);


  const loadUsers = async () => {
    try {
      const { data } = await supabase.functions.invoke('user-level-manager', {
        body: { action: 'list', requestorEmail: user?.email }
      });
      if (data?.users) setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const updateLevel = async (email: string, level: number) => {
    setLoading(true);
    try {
      await supabase.functions.invoke('user-level-manager', {
        body: { action: 'set', email, level, requestorEmail: user?.email }
      });
      await loadUsers();
    } catch (error) {
      console.error('Failed to update level:', error);
    }
    setLoading(false);
  };

  const loadBackups = async () => {
    try {
      const { data } = await supabase.functions.invoke('database-backup', {
        body: { action: 'list' }
      });
      if (data?.backups) setBackups(data.backups);
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const triggerBackup = async () => {
    if (!backupPhone) {
      toast({ title: 'Phone number required', description: 'Please enter a phone number for notifications', variant: 'destructive' });
      return;
    }
    
    setBackupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('database-backup', {
        body: { action: 'backup', phone: backupPhone, schedule: backupSchedule }
      });
      
      if (error) throw error;
      
      toast({ title: 'Backup completed', description: `${data.recordCount} records backed up successfully` });
      loadBackups();
    } catch (error) {
      console.error('Backup failed:', error);
      toast({ title: 'Backup failed', description: 'Failed to complete backup', variant: 'destructive' });
    }
    setBackupLoading(false);
  };

  const downloadBackup = async (fileName: string) => {
    try {
      const { data } = await supabase.storage.from('database-backups').download(fileName);
      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: 'Download started', description: 'Backup file is downloading' });
      }
    } catch (error) {
      toast({ title: 'Download failed', description: 'Failed to download backup', variant: 'destructive' });
    }
  };

  const restoreBackup = async (fileName: string) => {
    if (!confirm('Are you sure you want to restore this backup? This will overwrite current data.')) return;
    
    setRestoreLoading(true);
    try {
      const { data: fileData } = await supabase.storage.from('database-backups').download(fileName);
      if (fileData) {
        const text = await fileData.text();
        const backupData = JSON.parse(text);
        
        const { data, error } = await supabase.functions.invoke('database-backup', {
          body: { action: 'restore', backupData }
        });
        
        if (error) throw error;
        
        toast({ title: 'Restore completed', description: `${data.restoredCount} records restored` });
      }
    } catch (error) {
      toast({ title: 'Restore failed', description: 'Failed to restore backup', variant: 'destructive' });
    }
    setRestoreLoading(false);
  };

  const triggerWeeklyReport = async () => {
    setReportLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('weekly-admin-report');
      
      if (error) throw error;
      
      setLastReportDate(new Date().toISOString());
      toast({ 
        title: 'Weekly report sent', 
        description: `Report with ${data.metrics.totalBookings} bookings sent to jason@gulfcoastcharters.com` 
      });
    } catch (error) {
      console.error('Report failed:', error);
      toast({ title: 'Report failed', description: 'Failed to generate and send report', variant: 'destructive' });
    }
    setReportLoading(false);
  };




  if (user?.level !== 1) return null;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Admin Panel - User Level Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" />
            Current Users
          </h3>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.email} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">{u.email}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Level: {u.level}</span>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={u.level}
                    onChange={(e) => updateLevel(u.email, parseInt(e.target.value))}
                    className="w-20"
                    disabled={loading}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold">Add/Update User Level</h3>
          <div className="grid gap-4">
            <div>
              <Label>Email</Label>
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label>Level (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={newLevel}
                onChange={(e) => setNewLevel(parseInt(e.target.value))}
              />
            </div>
            <Button onClick={() => updateLevel(newEmail, newLevel)} disabled={loading}>
              Set Level
            </Button>
          </div>
        </div>


        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            OAuth Configuration
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Configure Authentication Providers</p>
                <p className="text-sm text-green-700 mt-1">
                  Set up Google and GitHub OAuth authentication with step-by-step guidance and validation tests
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/oauth-setup')} 
            className="w-full"
            variant="default"
          >
            Open OAuth Setup Wizard
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database Backup
          </h3>
          <div className="grid gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                SMS Notification Number
              </Label>
              <Input
                type="tel"
                value={backupPhone}
                onChange={(e) => setBackupPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label>Backup Schedule</Label>
              <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Only</SelectItem>
                  <SelectItem value="daily">Daily at 2 AM</SelectItem>
                  <SelectItem value="weekly">Weekly (Sunday 2 AM)</SelectItem>
                  <SelectItem value="monthly">Monthly (1st at 2 AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={triggerBackup} disabled={backupLoading}>
              {backupLoading ? 'Processing...' : 'Trigger Backup Now'}
            </Button>

            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Available Backups</h4>
              <div className="space-y-2">
                {backups.length === 0 ? (
                  <p className="text-sm text-gray-500">No backups available</p>
                ) : (
                  backups.map((backup) => (
                    <div key={backup.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{backup.name}</p>
                        <p className="text-xs text-gray-500">{new Date(backup.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => downloadBackup(backup.name)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => restoreBackup(backup.name)} disabled={restoreLoading}>
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Weekly Analytics Report
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Automated Weekly Reports</p>
                <p className="text-sm text-blue-700 mt-1">
                  Every Monday at 9:00 AM, a comprehensive analytics report is automatically sent to jason@gulfcoastcharters.com
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Report includes: booking summaries, revenue data, top destinations, captain performance, and user activity metrics
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {lastReportDate && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                Last report sent: {new Date(lastReportDate).toLocaleString()}
              </div>
            )}
            <Button onClick={triggerWeeklyReport} disabled={reportLoading} className="w-full">
              {reportLoading ? 'Generating Report...' : 'Send Weekly Report Now'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Click to manually trigger the weekly report email
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <GitMerge className="w-4 h-4" />
            Duplicate Listings Management
          </h3>
          <DeduplicationTool />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Notification System
          </h3>
          <EmailNotificationManager />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Photo Contest Analytics
          </h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-purple-700">
              View voting statistics and performance metrics for all photo contests across events
            </p>
          </div>
          <div className="space-y-4">
            <Input 
              type="text" 
              placeholder="Enter Event ID to view contest analytics" 
              id="contestEventId"
            />
            <Button 
              onClick={() => {
                const eventId = (document.getElementById('contestEventId') as HTMLInputElement)?.value;
                if (eventId) {
                  const analyticsDiv = document.getElementById('contest-analytics-display');
                  if (analyticsDiv) analyticsDiv.style.display = 'block';
                }
              }}
            >
              Load Contest Analytics
            </Button>
            <div id="contest-analytics-display" style={{ display: 'none' }}>
              <PhotoContestVoteAnalytics eventId={(document.getElementById('contestEventId') as HTMLInputElement)?.value || 'default'} />
            </div>
          </div>
        </div>


        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Automated Booking Reminders
          </h3>
          <ReminderSchedulerPanel />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <Send className="w-4 h-4" />
            Email Campaign Manager
          </h3>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Send className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="font-medium text-indigo-900">Automated Captain Marketing Campaigns</p>
                <p className="text-sm text-indigo-700 mt-1">
                  Send targeted email campaigns to captain leads with A/B testing, open/click tracking, and automated follow-up sequences
                </p>
                <p className="text-xs text-indigo-600 mt-2">
                  Features: Lead management, campaign analytics, behavioral triggers, conversion tracking
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/email-campaigns')} 
            className="w-full"
            variant="default"
          >
            Open Campaign Manager
          </Button>

        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <List className="w-4 h-4" />
            Mailing List Manager
          </h3>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <List className="w-5 h-5 text-teal-600 mt-0.5" />
              <div>
                <p className="font-medium text-teal-900">Subscriber Management</p>
                <p className="text-sm text-teal-700 mt-1">
                  Manage newsletter subscribers who signed up via email or phone. Moderate, export, and communicate with your mailing list.
                </p>
                <p className="text-xs text-teal-600 mt-2">
                  Features: Subscriber moderation, CSV export, status management, contact preferences
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/mailing-list')} 
            className="w-full"
            variant="default"
          >
            Manage Mailing List
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            SMS Campaign Manager
          </h3>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Bulk SMS Campaigns</p>
                <p className="text-sm text-orange-700 mt-1">
                  Send targeted SMS campaigns to mailing list subscribers who opted in for text messages. Track delivery, clicks, and opt-outs.
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Features: Message templates, scheduling, link shortening, delivery analytics, opt-out tracking
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/sms-campaigns')} 
            className="w-full"
            variant="default"
          >
            Manage SMS Campaigns
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <UserCog className="w-4 h-4" />
            User Management System
          </h3>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <UserCog className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div>
                <p className="font-medium text-cyan-900">Complete User Administration</p>
                <p className="text-sm text-cyan-700 mt-1">
                  View all registered users, reset passwords, enable/disable accounts, manage roles and permissions, and view login history.
                </p>
                <p className="text-xs text-cyan-600 mt-2">
                  Features: User search, bulk actions, role assignment, permission management, account status control
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/user-management')} 
            className="w-full"
            variant="default"
          >
            Open User Management Panel
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            User Activity Analytics Dashboard
          </h3>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <LineChart className="w-5 h-5 text-violet-600 mt-0.5" />
              <div>
                <p className="font-medium text-violet-900">Comprehensive Analytics & Reporting</p>
                <p className="text-sm text-violet-700 mt-1">
                  View detailed metrics on daily/weekly/monthly active users, registration trends, user retention rates, session duration, and feature usage statistics.
                </p>
                <p className="text-xs text-violet-600 mt-2">
                  Features: Interactive charts, date range filters, top users by activity, export to CSV/PDF, retention cohort analysis
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/analytics')} 
            className="w-full"
            variant="default"
          >
            Open Analytics Dashboard
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Marine Products Management
          </h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-900">Manage Marine Gear Shop Products</p>
                <p className="text-sm text-emerald-700 mt-1">
                  Add, edit, and manage marine products with affiliate links to Amazon, BoatUS, and Walmart. Configure pricing, categories, and inventory.
                </p>
                <p className="text-xs text-emerald-600 mt-2">
                  Features: Product CRUD operations, affiliate link management, category assignment, pricing controls, stock management
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/marine-products')} 
            className="w-full"
            variant="default"
          >
            Manage Marine Products
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Affiliate Analytics Dashboard
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Track Affiliate Performance & Revenue</p>
                <p className="text-sm text-amber-700 mt-1">
                  Monitor affiliate link clicks, conversions, commission earnings by retailer (Amazon, BoatUS, Walmart), top-performing products, and revenue trends with export functionality.
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  Features: Real-time analytics, revenue charts, retailer comparison, product performance, CSV export, API credential management
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/affiliate-analytics')} 
            className="w-full"
            variant="default"
          >
            Open Affiliate Analytics
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Site Settings & Links Manager
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-slate-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Manage All Site Links & Contact Info</p>
                <p className="text-sm text-slate-700 mt-1">
                  Configure company name, tagline, contact information (email, phone, address), and all social media links (Facebook, Twitter, Instagram, LinkedIn, YouTube) used throughout the site.
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Features: Company branding, contact details, social media URLs - all configurable from one place
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/site-settings')} 
            className="w-full"
            variant="default"
          >
            Manage Site Settings
            Manage Site Settings
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Photo Gallery Moderation
          </h3>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <FileCheck className="w-5 h-5 text-rose-600 mt-0.5" />
              <div>
                <p className="font-medium text-rose-900">Trip Photo Gallery Moderation System</p>
                <p className="text-sm text-rose-700 mt-1">
                  Review and moderate user-uploaded fishing trip photos. Approve, reject, or flag content with automated quality checks, duplicate detection, and user reporting.
                </p>
                <p className="text-xs text-rose-600 mt-2">
                  Features: Moderation queue, bulk actions, quality scoring, duplicate detection, user reports, photo guidelines, automated notifications
                </p>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/admin/photo-moderation')} 
            className="w-full"
            variant="default"
          >
            Open Photo Moderation Panel
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
