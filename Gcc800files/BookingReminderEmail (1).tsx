interface BookingReminderProps {
  customerName: string;
  bookingId: string;
  charterName: string;
  date: string;
  time: string;
  location: string;
  captainName: string;
  captainPhone: string;
  hoursUntil: number;
}

export const generateBookingReminderHTML = (props: BookingReminderProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }
    .content { background: #fffbeb; padding: 30px; }
    .reminder-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .info-item { background: #fef3c7; padding: 15px; border-radius: 6px; }
    .button { background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reminder: Your Charter is Coming Up!</h1>
      <p>Only ${props.hoursUntil} hours to go</p>
    </div>
    <div class="content">
      <h2>Hi ${props.customerName},</h2>
      <p>This is a friendly reminder about your upcoming charter booking.</p>
      
      <div class="reminder-box">
        <h3>${props.charterName}</h3>
        <p><strong>Date:</strong> ${props.date} at ${props.time}</p>
        <p><strong>Meeting Location:</strong> ${props.location}</p>
      </div>
      
      <div class="info-grid">
        <div class="info-item">
          <strong>Your Captain</strong><br>
          ${props.captainName}<br>
          ${props.captainPhone}
        </div>
        <div class="info-item">
          <strong>Booking ID</strong><br>
          ${props.bookingId}
        </div>
      </div>
      
      <p><strong>Checklist:</strong></p>
      <ul>
        <li>Arrive 15 minutes early</li>
        <li>Bring valid ID</li>
        <li>Wear comfortable clothing</li>
        <li>Apply sunscreen</li>
      </ul>
      
      <a href="https://yourcharter.com/bookings/${props.bookingId}" class="button">View Full Details</a>
    </div>
    <div class="footer">
      <p>Need to make changes? Contact us at support@yourcharter.com</p>
      <p>&copy; 2025 Charter Booking. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
