import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Clock, Send, CheckCircle, AlertCircle, Calendar, MessageSquare, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ReminderSchedulerPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<any>(null);
  const { toast } = useToast();

  const triggerScheduler = async () => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('booking-reminder-scheduler');
      
      if (error) throw error;

      setLastRun(data);
      toast({
        title: 'Reminders Sent',
        description: `Successfully sent ${data.emailsSent} emails and ${data.smsSent} SMS`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Automated Reminder System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Automatically sends email and SMS reminders to customers at key points in their booking journey.
          </p>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="email">Email Stats</TabsTrigger>
              <TabsTrigger value="sms">SMS Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                    <h3 className="font-semibold">1 Week Before</h3>
                    <p className="text-sm text-gray-600">Preparation reminder</p>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50">
                  <CardContent className="p-4">
                    <Clock className="w-8 h-8 text-amber-600 mb-2" />
                    <h3 className="font-semibold">24 Hours Before</h3>
                    <p className="text-sm text-gray-600">Final checklist + SMS</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50">
                  <CardContent className="p-4">
                    <Send className="w-8 h-8 text-green-600 mb-2" />
                    <h3 className="font-semibold">After Trip</h3>
                    <p className="text-sm text-gray-600">Review request</p>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={triggerScheduler} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? 'Running...' : 'Trigger Scheduler Now'}
              </Button>

              {lastRun && (
                <Card className="bg-gray-50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">Last Run Results</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span><strong>Emails:</strong> {lastRun.emailsSent || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span><strong>SMS:</strong> {lastRun.smsSent || 0}</span>
                      </div>
                    </div>
                    {lastRun.errors > 0 && (
                      <p className="text-sm text-red-600"><strong>Errors:</strong> {lastRun.errors}</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">Email Delivery Stats</h3>
                  </div>
                  {lastRun?.emailDetails ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>Week Before:</strong> {lastRun.emailDetails.weekBefore || 0} sent</p>
                      <p><strong>24h Before:</strong> {lastRun.emailDetails.dayBefore || 0} sent</p>
                      <p><strong>Follow-ups:</strong> {lastRun.emailDetails.followUp || 0} sent</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Run scheduler to see stats</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold">SMS Delivery Stats</h3>
                  </div>
                  {lastRun?.smsDetails ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>24h Reminders:</strong> {lastRun.smsDetails.sent || 0} sent</p>
                      <p><strong>Opted In:</strong> {lastRun.smsDetails.optedIn || 0} users</p>
                      <p><strong>Delivery Rate:</strong> {lastRun.smsDetails.deliveryRate || '0%'}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Run scheduler to see stats</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Automated Scheduling</p>
                  <p className="text-gray-700">
                    Set up a cron job to run this scheduler every 6 hours. 
                    See REMINDER_SYSTEM_SETUP.md for instructions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

