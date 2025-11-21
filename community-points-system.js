// Community Platform with Points System
// File: /api/community.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Points configuration
const POINTS_CONFIG = {
  // Content creation
  CREATE_FISHING_REPORT: 25,
  CREATE_FISHING_REPORT_WITH_PHOTO: 35,
  CREATE_FISHING_REPORT_WITH_VIDEO: 50,
  CREATE_SPOT_PIN: 15,
  CREATE_VERIFIED_SPOT: 30,
  
  // Engagement
  COMMENT_ON_POST: 5,
  HELPFUL_COMMENT: 10,
  UPVOTE_RECEIVED: 2,
  ANSWER_QUESTION: 15,
  BEST_ANSWER_SELECTED: 50,
  
  // Community help
  HELP_NEW_CAPTAIN: 25,
  MENTOR_SESSION: 100,
  VERIFY_SPOT: 20,
  REPORT_HAZARD: 30,
  SAFETY_TIP: 15,
  
  // Consistency bonuses
  DAILY_CHECK_IN: 3,
  WEEKLY_STREAK_3: 25,
  WEEKLY_STREAK_5: 50,
  WEEKLY_STREAK_10: 100,
  MONTHLY_ACTIVE_30_DAYS: 200,
  
  // Quality bonuses
  POPULAR_POST_100_VIEWS: 10,
  POPULAR_POST_500_VIEWS: 25,
  POPULAR_POST_1000_VIEWS: 50,
  FEATURED_POST: 100,
  
  // Training & certifications
  COMPLETE_TRAINING_COURSE: 75,
  EARN_CERTIFICATION: 100,
  RENEW_LICENSE_EARLY: 50,
  
  // Penalties (negative points)
  FLAGGED_CONTENT: -25,
  REMOVED_POST: -50,
  WARNING_ISSUED: -100,
  SPAM_VIOLATION: -200
};

// Badge definitions
const BADGES = {
  // Engagement badges
  FIRST_POST: {
    id: 'first_post',
    name: 'Breaking the Ice',
    description: 'Posted your first fishing report',
    icon: '🎣',
    points_required: 0,
    trigger: 'first_post'
  },
  REPORTER_10: {
    id: 'reporter_10',
    name: 'Reporter',
    description: 'Posted 10 fishing reports',
    icon: '📝',
    posts_required: 10
  },
  CHRONICLER_50: {
    id: 'chronicler_50',
    name: 'Chronicler',
    description: 'Posted 50 fishing reports',
    icon: '📚',
    posts_required: 50
  },
  LEGEND_200: {
    id: 'legend_200',
    name: 'Legend',
    description: 'Posted 200 fishing reports',
    icon: '🏆',
    posts_required: 200
  },
  
  // Helpful badges
  HELPER_25: {
    id: 'helper_25',
    name: 'Helper',
    description: 'Received 25 helpful votes',
    icon: '🤝',
    helpful_votes_required: 25
  },
  GUIDE_100: {
    id: 'guide_100',
    name: 'Guide',
    description: 'Received 100 helpful votes',
    icon: '🎯',
    helpful_votes_required: 100
  },
  MENTOR_500: {
    id: 'mentor_500',
    name: 'Mentor',
    description: 'Received 500 helpful votes',
    icon: '👨‍🏫',
    helpful_votes_required: 500
  },
  
  // Community badges
  ACTIVE_30: {
    id: 'active_30',
    name: 'Active Member',
    description: 'Active for 30 consecutive days',
    icon: '⭐',
    days_active: 30
  },
  VETERAN_180: {
    id: 'veteran_180',
    name: 'Community Veteran',
    description: 'Active for 180 consecutive days',
    icon: '👑',
    days_active: 180
  },
  OG_365: {
    id: 'og_365',
    name: 'OG Captain',
    description: 'Active for 365 consecutive days',
    icon: '🎖️',
    days_active: 365
  },
  
  // Points milestones
  POINTS_100: {
    id: 'points_100',
    name: 'Getting Started',
    description: 'Earned 100 points',
    icon: '🌟',
    points_required: 100
  },
  POINTS_500: {
    id: 'points_500',
    name: 'Contributor',
    description: 'Earned 500 points',
    icon: '💫',
    points_required: 500
  },
  POINTS_1000: {
    id: 'points_1000',
    name: 'Expert',
    description: 'Earned 1,000 points',
    icon: '⭐',
    points_required: 1000
  },
  POINTS_5000: {
    id: 'points_5000',
    name: 'Master Captain',
    description: 'Earned 5,000 points',
    icon: '🏅',
    points_required: 5000
  },
  POINTS_10000: {
    id: 'points_10000',
    name: 'Elite',
    description: 'Earned 10,000 points',
    icon: '👑',
    points_required: 10000
  },
  
  // Special badges
  SAFETY_HERO: {
    id: 'safety_hero',
    name: 'Safety Hero',
    description: 'Reported 10 hazards to keep the community safe',
    icon: '🦸',
    hazards_reported: 10
  },
  SPOT_MASTER: {
    id: 'spot_master',
    name: 'Spot Master',
    description: 'Saved 100 fishing spots',
    icon: '📍',
    spots_saved: 100
  },
  TEACHER: {
    id: 'teacher',
    name: 'Teacher',
    description: 'Answered 50 questions',
    icon: '🎓',
    questions_answered: 50
  }
};

// Trust levels
const TRUST_LEVELS = {
  1: { name: 'New Member', points: 0, privileges: ['post_with_moderation', 'comment', 'upvote'] },
  2: { name: 'Member', points: 100, privileges: ['post', 'comment', 'upvote', 'create_pins'] },
  3: { name: 'Regular', points: 500, privileges: ['post', 'comment', 'upvote', 'create_pins', 'edit_own_posts', 'flag_content'] },
  4: { name: 'Trusted', points: 2000, privileges: ['all', 'mentor', 'verify_spots', 'feature_posts'] },
  5: { name: 'Veteran', points: 5000, privileges: ['all', 'mentor', 'verify_spots', 'feature_posts', 'moderate_comments'] }
};

class CommunityService {
  
  // Award points for an action
  async awardPoints(userId, action, metadata = {}) {
    const pointsEarned = POINTS_CONFIG[action];
    if (!pointsEarned) {
      console.warn(`Unknown action: ${action}`);
      return { success: false, error: 'Invalid action' };
    }

    try {
      // Get current user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!userStats) {
        // Create new stats record
        await supabase.from('user_stats').insert({
          user_id: userId,
          total_points: 0,
          current_streak: 0,
          longest_streak: 0
        });
      }

      // Record points transaction
      const { data: transaction, error: txError } = await supabase
        .from('points_transactions')
        .insert({
          user_id: userId,
          action: action,
          points: pointsEarned,
          metadata: metadata
        })
        .select()
        .single();

      if (txError) throw txError;

      // Update user's total points
      const { data: updatedStats, error: updateError } = await supabase
        .rpc('add_points', {
          p_user_id: userId,
          p_points: pointsEarned
        });

      if (updateError) throw updateError;

      // Check for new badges
      const newBadges = await this.checkBadges(userId);

      // Check for level up
      const newLevel = this.calculateTrustLevel(updatedStats.total_points);
      const oldLevel = this.calculateTrustLevel(updatedStats.total_points - pointsEarned);
      
      let levelUp = null;
      if (newLevel > oldLevel) {
        levelUp = TRUST_LEVELS[newLevel];
        await this.notifyLevelUp(userId, levelUp);
      }

      // Notify user of points earned
      await this.notifyPointsEarned(userId, pointsEarned, action, newBadges, levelUp);

      return {
        success: true,
        pointsEarned,
        totalPoints: updatedStats.total_points,
        newBadges,
        levelUp,
        transaction
      };

    } catch (error) {
      console.error('Error awarding points:', error);
      return { success: false, error: error.message };
    }
  }

  // Check for new badges
  async checkBadges(userId) {
    const newBadges = [];

    try {
      // Get user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get already earned badges
      const { data: earned } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId);

      const earnedIds = new Set(earned?.map(b => b.badge_id) || []);

      // Check each badge
      for (const [key, badge] of Object.entries(BADGES)) {
        if (earnedIds.has(badge.id)) continue; // Already earned

        let qualifies = false;

        // Check qualification criteria
        if (badge.posts_required && stats.total_posts >= badge.posts_required) {
          qualifies = true;
        } else if (badge.helpful_votes_required && stats.helpful_votes >= badge.helpful_votes_required) {
          qualifies = true;
        } else if (badge.points_required && stats.total_points >= badge.points_required) {
          qualifies = true;
        } else if (badge.days_active && stats.current_streak >= badge.days_active) {
          qualifies = true;
        } else if (badge.hazards_reported && stats.hazards_reported >= badge.hazards_reported) {
          qualifies = true;
        } else if (badge.spots_saved && stats.spots_saved >= badge.spots_saved) {
          qualifies = true;
        } else if (badge.questions_answered && stats.questions_answered >= badge.questions_answered) {
          qualifies = true;
        }

        if (qualifies) {
          // Award badge
          await supabase.from('user_badges').insert({
            user_id: userId,
            badge_id: badge.id,
            earned_at: new Date().toISOString()
          });

          newBadges.push(badge);
        }
      }

      return newBadges;

    } catch (error) {
      console.error('Error checking badges:', error);
      return [];
    }
  }

  // Calculate trust level based on points
  calculateTrustLevel(points) {
    for (let level = 5; level >= 1; level--) {
      if (points >= TRUST_LEVELS[level].points) {
        return level;
      }
    }
    return 1;
  }

  // Notify user of points earned
  async notifyPointsEarned(userId, points, action, newBadges, levelUp) {
    // Create in-app notification
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'points_earned',
      title: `+${points} points earned!`,
      message: this.getPointsMessage(action),
      data: {
        points,
        action,
        newBadges: newBadges.map(b => b.id),
        levelUp: levelUp?.name
      }
    });

    // If badges earned or level up, send special notification
    if (newBadges.length > 0 || levelUp) {
      let message = '';
      if (newBadges.length > 0) {
        message += `🎉 New badge${newBadges.length > 1 ? 's' : ''} earned: ${newBadges.map(b => b.icon + ' ' + b.name).join(', ')}! `;
      }
      if (levelUp) {
        message += `🎊 Level up! You're now a ${levelUp.name}!`;
      }

      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'achievement',
        title: '🏆 Achievement Unlocked!',
        message,
        priority: 'high'
      });
    }
  }

  // Notify level up
  async notifyLevelUp(userId, level) {
    await supabase.from('notifications').insert({
      user_id: userId,
      type: 'level_up',
      title: '🎊 Level Up!',
      message: `Congratulations! You've reached ${level.name} status!`,
      data: {
        level: level.name,
        privileges: level.privileges
      },
      priority: 'high'
    });
  }

  // Get friendly message for points action
  getPointsMessage(action) {
    const messages = {
      CREATE_FISHING_REPORT: 'Great report! Thanks for sharing with the community.',
      CREATE_FISHING_REPORT_WITH_PHOTO: 'Awesome catch and photo!',
      CREATE_FISHING_REPORT_WITH_VIDEO: 'Amazing video report!',
      COMMENT_ON_POST: 'Thanks for engaging with the community!',
      ANSWER_QUESTION: 'Thanks for helping a fellow captain!',
      BEST_ANSWER_SELECTED: 'Your answer was chosen as the best!',
      DAILY_CHECK_IN: 'Daily check-in bonus!',
      COMPLETE_TRAINING_COURSE: 'Congratulations on completing your training!',
      EARN_CERTIFICATION: 'New certification earned!'
    };
    return messages[action] || 'Points earned!';
  }

  // Get leaderboard
  async getLeaderboard(period = 'all_time', limit = 100) {
    let query = supabase
      .from('user_stats')
      .select(`
        *,
        user:users!inner(
          id,
          full_name,
          avatar_url,
          captain:captains(captain_id, business_name)
        )
      `)
      .order('total_points', { ascending: false })
      .limit(limit);

    // Filter by period
    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('last_activity', weekAgo.toISOString());
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('last_activity', monthAgo.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data.map((row, index) => ({
      rank: index + 1,
      userId: row.user_id,
      name: row.user.full_name,
      avatar: row.user.avatar_url,
      isCaptain: !!row.user.captain,
      businessName: row.user.captain?.business_name,
      points: row.total_points,
      badges: row.badges_count || 0,
      level: this.calculateTrustLevel(row.total_points),
      levelName: TRUST_LEVELS[this.calculateTrustLevel(row.total_points)].name
    }));
  }

  // Get user's community profile
  async getCommunityProfile(userId) {
    try {
      // Get user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get badges
      const { data: badges } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get user rank
      const { data: rankData } = await supabase
        .rpc('get_user_rank', { p_user_id: userId });

      const level = this.calculateTrustLevel(stats?.total_points || 0);
      const currentLevel = TRUST_LEVELS[level];
      const nextLevel = TRUST_LEVELS[level + 1];

      return {
        stats: stats || {
          total_points: 0,
          total_posts: 0,
          helpful_votes: 0,
          current_streak: 0
        },
        badges: badges?.map(b => ({
          ...BADGES[Object.keys(BADGES).find(k => BADGES[k].id === b.badge_id)],
          earnedAt: b.earned_at
        })) || [],
        recentActivity: recentActivity || [],
        rank: rankData?.[0]?.rank || 0,
        level: level,
        levelName: currentLevel.name,
        privileges: currentLevel.privileges,
        nextLevel: nextLevel ? {
          name: nextLevel.name,
          pointsRequired: nextLevel.points,
          pointsToGo: nextLevel.points - (stats?.total_points || 0)
        } : null
      };
    } catch (error) {
      console.error('Error getting community profile:', error);
      return null;
    }
  }

  // Record user activity (for streak tracking)
  async recordDailyActivity(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Check if already checked in today
      const { data: existing } = await supabase
        .from('daily_check_ins')
        .select('*')
        .eq('user_id', userId)
        .eq('check_in_date', today)
        .single();

      if (existing) {
        return { alreadyCheckedIn: true };
      }

      // Record check-in
      await supabase.from('daily_check_ins').insert({
        user_id: userId,
        check_in_date: today
      });

      // Update streak
      const { data: stats } = await supabase
        .from('user_stats')
        .select('current_streak, longest_streak, last_activity')
        .eq('user_id', userId)
        .single();

      let newStreak = 1;
      if (stats?.last_activity) {
        const lastActivity = new Date(stats.last_activity);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
          newStreak = (stats.current_streak || 0) + 1;
        }
      }

      const newLongest = Math.max(newStreak, stats?.longest_streak || 0);

      await supabase
        .from('user_stats')
        .update({
          current_streak: newStreak,
          longest_streak: newLongest,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', userId);

      // Award points for daily check-in
      await this.awardPoints(userId, 'DAILY_CHECK_IN');

      // Check for streak bonuses
      if (newStreak === 3) {
        await this.awardPoints(userId, 'WEEKLY_STREAK_3');
      } else if (newStreak === 5) {
        await this.awardPoints(userId, 'WEEKLY_STREAK_5');
      } else if (newStreak === 10) {
        await this.awardPoints(userId, 'WEEKLY_STREAK_10');
      } else if (newStreak === 30) {
        await this.awardPoints(userId, 'MONTHLY_ACTIVE_30_DAYS');
      }

      return {
        success: true,
        streak: newStreak,
        isNewRecord: newStreak === newLongest && newStreak > 1
      };

    } catch (error) {
      console.error('Error recording daily activity:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle fishing report creation
  async handleFishingReportCreated(userId, reportId, hasPhoto, hasVideo) {
    let action = 'CREATE_FISHING_REPORT';
    if (hasVideo) {
      action = 'CREATE_FISHING_REPORT_WITH_VIDEO';
    } else if (hasPhoto) {
      action = 'CREATE_FISHING_REPORT_WITH_PHOTO';
    }

    // Award points
    await this.awardPoints(userId, action, { reportId });

    // Update post count
    await supabase.rpc('increment_stat', {
      p_user_id: userId,
      p_stat_name: 'total_posts'
    });

    // Record daily activity
    await this.recordDailyActivity(userId);
  }

  // Handle comment creation
  async handleCommentCreated(userId, commentId, postId) {
    await this.awardPoints(userId, 'COMMENT_ON_POST', { commentId, postId });
    await this.recordDailyActivity(userId);
  }

  // Handle helpful vote
  async handleHelpfulVote(voterId, recipientId, postId) {
    // Award points to recipient
    await this.awardPoints(recipientId, 'UPVOTE_RECEIVED', { voterId, postId });

    // Update helpful votes count
    await supabase.rpc('increment_stat', {
      p_user_id: recipientId,
      p_stat_name: 'helpful_votes'
    });
  }

  // Handle answer selection
  async handleAnswerSelected(answerId, authorId, questionId) {
    await this.awardPoints(authorId, 'BEST_ANSWER_SELECTED', { answerId, questionId });
    
    await supabase.rpc('increment_stat', {
      p_user_id: authorId,
      p_stat_name: 'questions_answered'
    });
  }
}

// API Handler
export async function handler(req) {
  const communityService = new CommunityService();
  
  try {
    const { action, ...params } = await req.json();

    switch (action) {
      case 'awardPoints':
        return await communityService.awardPoints(params.userId, params.pointsAction, params.metadata);
      
      case 'getLeaderboard':
        const leaderboard = await communityService.getLeaderboard(params.period, params.limit);
        return new Response(JSON.stringify({ leaderboard }), { status: 200 });
      
      case 'getCommunityProfile':
        const profile = await communityService.getCommunityProfile(params.userId);
        return new Response(JSON.stringify({ profile }), { status: 200 });
      
      case 'recordDailyActivity':
        const activity = await communityService.recordDailyActivity(params.userId);
        return new Response(JSON.stringify(activity), { status: 200 });
      
      case 'handleFishingReportCreated':
        await communityService.handleFishingReportCreated(
          params.userId,
          params.reportId,
          params.hasPhoto,
          params.hasVideo
        );
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      
      case 'handleCommentCreated':
        await communityService.handleCommentCreated(params.userId, params.commentId, params.postId);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      
      case 'handleHelpfulVote':
        await communityService.handleHelpfulVote(params.voterId, params.recipientId, params.postId);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }
  } catch (error) {
    console.error('Community API error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export default CommunityService;
export { POINTS_CONFIG, BADGES, TRUST_LEVELS };
