// pages/api/community/points.js - ACTUAL POINTS API
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Point action values
const POINT_VALUES = {
  CREATE_FISHING_REPORT: 25,
  CREATE_FISHING_REPORT_WITH_PHOTO: 35,
  CREATE_FISHING_REPORT_WITH_VIDEO: 50,
  DAILY_CHECK_IN: 3,
  COMMENT_ON_POST: 5,
  HELPFUL_COMMENT: 10,
  BEST_ANSWER: 50,
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 200,
  FIRST_POST: 50,
  REFER_NEW_USER: 100
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { action, userId, metadata = {} } = req.body

  if (!action || !userId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!POINT_VALUES[action]) {
    return res.status(400).json({ error: 'Invalid action' })
  }

  try {
    const pointsToAward = POINT_VALUES[action]
    
    // Record transaction
    const { data: transaction, error: transError } = await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        action,
        points: pointsToAward,
        metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (transError) throw transError

    // Update user stats
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (statsError && statsError.code !== 'PGRST116') {
      throw statsError
    }

    const currentPoints = userStats?.total_points || 0
    const newTotal = currentPoints + pointsToAward

    // Update or insert user stats
    const { error: updateError } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        total_points: newTotal,
        points_this_week: (userStats?.points_this_week || 0) + pointsToAward,
        points_this_month: (userStats?.points_this_month || 0) + pointsToAward,
        updated_at: new Date().toISOString()
      })

    if (updateError) throw updateError

    // Check for new badges
    const badges = await checkBadges(userId, newTotal)

    res.status(200).json({
      success: true,
      pointsEarned: pointsToAward,
      totalPoints: newTotal,
      newBadges: badges,
      transaction
    })

  } catch (error) {
    console.error('Points API error:', error)
    res.status(500).json({ error: error.message })
  }
}

async function checkBadges(userId, totalPoints) {
  const badges = []
  
  // Check point-based badges
  const pointBadges = [
    { points: 100, id: 'rookie', name: '🎣 Rookie Angler' },
    { points: 500, id: 'regular', name: '⭐ Regular Fisher' },
    { points: 1000, id: 'expert', name: '🏆 Expert Angler' },
    { points: 5000, id: 'legend', name: '👑 Fishing Legend' }
  ]

  for (const badge of pointBadges) {
    if (totalPoints >= badge.points) {
      // Check if user already has this badge
      const { data: existing } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .single()

      if (!existing) {
        // Award badge
        await supabase
          .from('user_badges')
          .insert({
            user_id: userId,
            badge_id: badge.id,
            badge_name: badge.name,
            earned_at: new Date().toISOString()
          })
        
        badges.push(badge)
      }
    }
  }

  return badges
}
