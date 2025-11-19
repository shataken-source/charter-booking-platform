// Stress testing utilities for high traffic simulation
import { supabase } from '@/lib/supabase';

interface StressTestConfig {
  concurrentUsers: number;
  requestsPerUser: number;
  delayMs: number;
}

export class StressTester {
  private results: {
    successful: number;
    failed: number;
    avgResponseTime: number;
    errors: string[];
  } = {
    successful: 0,
    failed: 0,
    avgResponseTime: 0,
    errors: []
  };

  async testBookingFlow(config: StressTestConfig) {
    console.log(`Starting stress test: ${config.concurrentUsers} users, ${config.requestsPerUser} requests each`);
    
    const startTime = Date.now();
    const promises: Promise<void>[] = [];
    const responseTimes: number[] = [];

    for (let user = 0; user < config.concurrentUsers; user++) {
      promises.push(this.simulateUser(user, config, responseTimes));
    }

    await Promise.all(promises);

    const totalTime = Date.now() - startTime;
    this.results.avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

    console.log('Stress Test Results:', {
      ...this.results,
      totalTime: `${totalTime}ms`,
      throughput: `${(this.results.successful / (totalTime / 1000)).toFixed(2)} req/s`
    });

    return this.results;
  }

  private async simulateUser(
    userId: number, 
    config: StressTestConfig,
    responseTimes: number[]
  ) {
    for (let req = 0; req < config.requestsPerUser; req++) {
      const reqStart = Date.now();
      
      try {
        // Simulate booking creation
        await supabase.functions.invoke('captain-bookings', {
          body: {
            action: 'create',
            data: {
              captainId: `test-captain-${userId % 10}`,
              customerEmail: `test${userId}@example.com`,
              date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              guests: Math.floor(Math.random() * 6) + 1,
              price: Math.floor(Math.random() * 500) + 200
            }
          }
        });

        this.results.successful++;
        responseTimes.push(Date.now() - reqStart);
      } catch (error: any) {
        this.results.failed++;
        this.results.errors.push(error.message);
      }

      if (config.delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, config.delayMs));
      }
    }
  }

  async testMessaging(config: StressTestConfig) {
    console.log('Testing messaging system under load...');
    
    const promises: Promise<void>[] = [];

    for (let i = 0; i < config.concurrentUsers; i++) {
      promises.push(this.sendMessages(i, config.requestsPerUser));
    }

    await Promise.all(promises);
    console.log('Messaging test complete:', this.results);
  }

  private async sendMessages(userId: number, count: number) {
    for (let i = 0; i < count; i++) {
      try {
        await supabase.from('messages').insert({
          sender_id: `user${userId}`,
          recipient_id: `captain${userId % 10}`,
          content: `Test message ${i} from user ${userId}`
        });
        this.results.successful++;
      } catch (error) {
        this.results.failed++;
      }
    }
  }
}

// Quick test runners
export async function runQuickStressTest() {
  const tester = new StressTester();
  return await tester.testBookingFlow({
    concurrentUsers: 100,
    requestsPerUser: 10,
    delayMs: 100
  });
}

export async function runHighLoadTest() {
  const tester = new StressTester();
  return await tester.testBookingFlow({
    concurrentUsers: 1000,
    requestsPerUser: 5,
    delayMs: 50
  });
}
