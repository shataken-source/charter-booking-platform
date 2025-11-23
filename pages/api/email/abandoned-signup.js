// pages/api/email/abandoned-signup.js - EMAIL REMINDER SYSTEM
// Sends reminders to users who started but did not finish signing up

const EMAIL_SEQUENCES = {
  // Regular user who entered email but did not complete signup
  customer: [
    {
      delay: '2 hours',
      subject: '🎣 You are one click away from joining 15,000+ anglers!',
      template: (email, name = 'Friend') => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0891b2, #0e7490); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; padding: 15px 40px; background: #10b981; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
    .benefits { background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .benefit-item { padding: 10px 0; border-bottom: 1px solid #e0f2fe; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎣 Complete Your Gulf Coast Charters Signup!</h1>
      <p style="font-size: 18px;">You are so close to joining the ultimate fishing community!</p>
    </div>
    
    <div class="content">
      <p>Hi ${name},</p>
      
      <p>We noticed you started creating your Gulf Coast Charters account but did not finish. <strong>Your account is waiting for you!</strong></p>
      
      <p style="font-size: 18px; color: #059669;"><strong>Here is what you are missing out on:</strong></p>
      
      <div class="benefits">
        <div class="benefit-item">
          <strong>🌍 Global Fishing Community</strong><br>
          Connect with 15,000+ anglers from 47 countries. Share catches, get tips, make fishing buddies worldwide!
        </div>
        
        <div class="benefit-item">
          <strong>⚓ Exclusive Gulf Coast Charters</strong><br>
          Instant booking with 100% verified captains from Texas to Florida. Every captain is USCG licensed and insured!
        </div>
        
        <div class="benefit-item">
          <strong>🏆 Points and Rewards System</strong><br>
          Earn points for every activity - booking charters, sharing catches, helping others. Redeem for free trips!
        </div>
        
        <div class="benefit-item">
          <strong>📍 Real-Time GPS Tracking</strong><br>
          Share your location with family during trips. They can follow your adventure live on their phones!
        </div>
        
        <div class="benefit-item">
          <strong>⛈️ Weather Alerts and Guarantees</strong><br>
          Real-time NOAA weather data. If weather cancels your trip, get 100% refund or reschedule free!
        </div>
        
        <div class="benefit-item">
          <strong>📸 Photo Gallery and Trophies</strong><br>
          Show off your catches! Get likes, comments, and compete on global leaderboards!
        </div>
      </div>
      
      <p style="font-size: 18px; text-align: center; color: #dc2626;"><strong>🎁 SPECIAL OFFER: Complete signup in the next 24 hours and get:</strong></p>
      
      <ul style="background: #fef3c7; padding: 20px 20px 20px 40px; border-radius: 10px;">
        <li><strong>$25 credit</strong> towards your first charter</li>
        <li><strong>500 bonus points</strong> to start</li>
        <li><strong>Free "Early Angler" badge</strong></li>
        <li><strong>Priority booking status</strong> for 30 days</li>
      </ul>
      
      <center>
        <a href="https://gulfcoastcharters.com/complete-signup?email=${email}&offer=welcome25" class="button">
          Complete My Signup Now →
        </a>
      </center>
      
      <p style="text-align: center; color: #6b7280; font-size: 14px;">
        Takes less than 60 seconds to finish!
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p><strong>What our members are saying:</strong></p>
      
      <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
        <em>"Best decision ever! Booked 3 charters already and made fishing friends from around the world!"</em><br>
        <strong>- Sarah M., Texas</strong> ⭐⭐⭐⭐⭐
      </div>
      
      <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
        <em>"The GPS tracking gave my wife peace of mind while I was offshore. Game changer!"</em><br>
        <strong>- Mike D., Florida</strong> ⭐⭐⭐⭐⭐
      </div>
      
      <p style="margin-top: 30px;">Ready to join the fishing revolution?</p>
      
      <center>
        <a href="https://gulfcoastcharters.com/complete-signup?email=${email}" class="button" style="background: #3b82f6;">
          Yes, Complete My Account!
        </a>
      </center>
      
      <p style="color: #6b7280; font-size: 14px;">
        Questions? Reply to this email or chat with us at support@gulfcoastcharters.com
      </p>
    </div>
    
    <div class="footer">
      <p>Gulf Coast Charters - Your Gateway to Fishing Adventure</p>
      <p>This email was sent because you started signing up at gulfcoastcharters.com</p>
      <p><a href="https://gulfcoastcharters.com/unsubscribe?email=${email}" style="color: #6b7280;">Unsubscribe</a> | 
         <a href="https://gulfcoastcharters.com/privacy" style="color: #6b7280;">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
      `
    },
    {
      delay: '24 hours',
      subject: '⏰ Last chance for your $25 welcome credit!',
      template: (email, name) => `
        <!-- Similar template with more urgency -->
        <h1>Your $25 credit expires in 24 hours!</h1>
        <p>Do not miss out on joining the fastest growing fishing community!</p>
      `
    },
    {
      delay: '3 days',
      subject: '🐟 Look what you are missing! (3 spots just opened up)',
      template: (email, name) => `
        <!-- Show recent activity and catches -->
        <h1>While you were away...</h1>
        <p>• John caught a 45-pound Red Snapper yesterday!</p>
        <p>• 3 charter spots just opened for this weekend</p>
        <p>• New captain joined with 5-star reviews</p>
      `
    },
    {
      delay: '7 days',
      subject: '🎁 We miss you! Here is 30% off to come back',
      template: (email, name) => `
        <!-- Final offer with bigger discount -->
        <h1>Special Comeback Offer - 30% Off!</h1>
        <p>We really want you in our community. Here is our best offer!</p>
      `
    }
  ],

  // Captain-specific abandoned signup sequence
  captain: [
    {
      delay: '2 hours',
      subject: '⚓ Captain, your charter listing is waiting!',
      template: (email, name = 'Captain') => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
    .button { display: inline-block; padding: 15px 40px; background: #dc2626; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
    .stats { background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .benefit { background: #f0fdf4; padding: 15px; margin: 10px 0; border-left: 4px solid #10b981; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚓ Captain ${name}, Your Charter Business Awaits!</h1>
      <p style="font-size: 18px;">Join 342+ verified captains already using Gulf Coast Charters</p>
    </div>
    
    <div class="content">
      <p>Captain ${name},</p>
      
      <p>You started setting up your captain account but did not finish. <strong>Your potential customers are waiting!</strong></p>
      
      <div class="stats">
        <h3 style="margin-top: 0;">📊 Current Platform Statistics:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong>15,234 active anglers</strong> looking for charters</li>
          <li><strong>$4.2 million</strong> in bookings this year</li>
          <li><strong>Average captain earning:</strong> $8,500 per month</li>
          <li><strong>Top captain earning:</strong> $22,000 last month</li>
          <li><strong>Average booking value:</strong> $650</li>
        </ul>
      </div>
      
      <h3>Here is what you get as a Gulf Coast Charters Captain:</h3>
      
      <div class="benefit">
        <strong>💰 Keep More Money</strong><br>
        Only 15% platform fee - you keep 85% of every booking! No hidden fees, no monthly charges, no setup costs.
      </div>
      
      <div class="benefit">
        <strong>📱 Instant Bookings 24/7</strong><br>
        Customers can book your charter instantly online. No more missed phone calls or lost bookings!
      </div>
      
      <div class="benefit">
        <strong>🌍 Global Exposure</strong><br>
        Your charter is visible to our 15,000+ member fishing community worldwide. International tourists love Gulf Coast fishing!
      </div>
      
      <div class="benefit">
        <strong>📅 Smart Calendar Management</strong><br>
        Automatic scheduling, no double bookings, integrated weather alerts, and customer reminders.
      </div>
      
      <div class="benefit">
        <strong>⭐ Build Your Reputation</strong><br>
        Verified reviews, captain badges, performance analytics, and marketing tools to grow your business.
      </div>
      
      <div class="benefit">
        <strong>🛡️ Full Protection</strong><br>
        Secure payments, customer screening, trip insurance options, and dispute resolution support.
      </div>
      
      <h3 style="color: #dc2626; text-align: center;">🎁 LIMITED TIME CAPTAIN OFFER:</h3>
      
      <div style="background: #fee2e2; padding: 20px; border-radius: 10px; text-align: center;">
        <p style="font-size: 18px; margin: 0;"><strong>Complete your captain signup today and get:</strong></p>
        <ul style="text-align: left; display: inline-block; margin: 15px 0;">
          <li><strong>ZERO platform fees</strong> for your first 3 months</li>
          <li><strong>Priority listing</strong> in search results</li>
          <li><strong>Free professional photo shoot</strong> for your boat</li>
          <li><strong>"Founding Captain" badge</strong> on your profile</li>
          <li><strong>$500 marketing credit</strong> for promoted listings</li>
        </ul>
      </div>
      
      <center>
        <a href="https://gulfcoastcharters.com/captain/complete-signup?email=${email}&offer=founder" class="button">
          Complete Captain Registration →
        </a>
      </center>
      
      <p style="text-align: center; color: #6b7280;">
        Takes only 5 minutes to complete setup!
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <h3>What other captains are saying:</h3>
      
      <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
        <em>"Doubled my bookings in the first month! The platform basically runs my business for me."</em><br>
        <strong>- Captain Mike, Orange Beach</strong> ⭐⭐⭐⭐⭐
      </div>
      
      <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
        <em>"Finally, a platform that understands charter fishing. The weather integration alone is worth it!"</em><br>
        <strong>- Captain Sarah, Destin</strong> ⭐⭐⭐⭐⭐
      </div>
      
      <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #10b981; margin: 15px 0;">
        <em>"Made $18,000 last month through the platform. Best decision for my charter business!"</em><br>
        <strong>- Captain Joe, Galveston</strong> ⭐⭐⭐⭐⭐
      </div>
      
      <p style="background: #fffbeb; padding: 15px; border-radius: 10px;">
        <strong>⚠️ Important:</strong> We only accept Gulf Coast charters (Texas to Florida, inland and offshore). 
        All captains must have valid USCG license and insurance.
      </p>
      
      <center>
        <a href="https://gulfcoastcharters.com/captain/complete-signup?email=${email}" class="button" style="background: #10b981;">
          Yes, I Want More Bookings!
        </a>
      </center>
      
      <p style="color: #6b7280; font-size: 14px;">
        Questions? Call our Captain Success Team: 1-800-FISHPRO<br>
        Or reply to this email for immediate assistance
      </p>
    </div>
    
    <div class="footer">
      <p>Gulf Coast Charters - Captain Partnership Program</p>
      <p>You received this because you started captain registration at gulfcoastcharters.com</p>
      <p><a href="https://gulfcoastcharters.com/unsubscribe?email=${email}" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
      `
    },
    {
      delay: '24 hours',
      subject: '📈 3 charters were just booked (you are missing out!)',
      template: (email, name) => `
        <h1>While you hesitated, other captains made money!</h1>
        <p>• Captain Mike just booked a $1,200 full day charter</p>
        <p>• Captain Sarah filled her entire weekend</p>
        <p>• 47 anglers searched for charters in your area today</p>
      `
    },
    {
      delay: '3 days', 
      subject: '💰 Your competitors are getting all the bookings',
      template: (email, name) => `
        <h1>Captain, your competition is winning!</h1>
        <p>This week alone, captains in your area booked $45,000 in charters through our platform.</p>
        <p>That could have been you!</p>
      `
    },
    {
      delay: '7 days',
      subject: '🚨 Final offer: 6 months ZERO fees (expires tonight)',
      template: (email, name) => `
        <h1>Captain, this is our BEST offer ever!</h1>
        <p>6 MONTHS with ZERO platform fees - keep 100% of your bookings!</p>
        <p>This offer expires at midnight and will not be repeated.</p>
      `
    }
  ]
}

// Main API handler
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const { action, email, userType = 'customer', sequenceIndex = 0 } = request.body

  switch (action) {
    case 'subscribe':
      return handleSubscribe(email, userType, response)
    case 'send':
      return handleSendEmail(email, userType, sequenceIndex, response)
    case 'unsubscribe':
      return handleUnsubscribe(email, response)
    default:
      return response.status(400).json({ error: 'Invalid action' })
  }
}

async function handleSubscribe(email, userType, response) {
  // Add email to abandoned signup list
  // Schedule first email for 2 hours from now
  
  try {
    // Store in database
    await database.abandonedSignups.create({
      email,
      userType,
      createdAt: new Date(),
      sequenceIndex: 0,
      status: 'pending'
    })

    // Schedule first email
    await scheduleEmail(email, userType, 0, '2 hours')

    return response.status(200).json({ 
      success: true, 
      message: 'Added to reminder sequence' 
    })
  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
}

async function handleSendEmail(email, userType, sequenceIndex, response) {
  const sequence = EMAIL_SEQUENCES[userType]
  
  if (!sequence || !sequence[sequenceIndex]) {
    return response.status(400).json({ error: 'Invalid sequence' })
  }

  const emailConfig = sequence[sequenceIndex]
  const htmlContent = emailConfig.template(email)

  try {
    // Send email using your email service
    await sendEmail({
      to: email,
      subject: emailConfig.subject,
      html: htmlContent
    })

    // Schedule next email if not last
    if (sequenceIndex < sequence.length - 1) {
      await scheduleEmail(email, userType, sequenceIndex + 1, sequence[sequenceIndex + 1].delay)
    }

    return response.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    })
  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
}

async function handleUnsubscribe(email, response) {
  try {
    // Remove from all sequences
    await database.abandonedSignups.update({
      where: { email },
      data: { status: 'unsubscribed' }
    })

    return response.status(200).json({ 
      success: true, 
      message: 'Unsubscribed successfully' 
    })
  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
}

async function scheduleEmail(email, userType, sequenceIndex, delay) {
  // Parse delay string (example: "2 hours", "24 hours", "3 days")
  const delayParts = delay.split(' ')
  const amount = parseInt(delayParts[0])
  const unit = delayParts[1]
  
  let delayMs = 0
  switch (unit) {
    case 'hours':
    case 'hour':
      delayMs = amount * 60 * 60 * 1000
      break
    case 'days':
    case 'day':
      delayMs = amount * 24 * 60 * 60 * 1000
      break
  }

  // Schedule the email to be sent
  setTimeout(() => {
    handleSendEmail(email, userType, sequenceIndex, null)
  }, delayMs)
}

// Helper function to send email (integrate with your email service)
async function sendEmail({ to, subject, html }) {
  // This would connect to SendGrid, AWS SES, or another email service
  console.log(`Sending email to ${to}: ${subject}`)
  
  // Example with SendGrid:
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // return sgMail.send({ to, from: 'noreply@gulfcoastcharters.com', subject, html })
}
