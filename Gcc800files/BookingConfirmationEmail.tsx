interface BookingConfirmationProps {
  customerName: string;
  bookingId: string;
  charterName: string;
  date: string;
  time: string;
  duration: string;
  totalPrice: string;
  captainName: string;
  location: string;
}

export const generateBookingConfirmationHTML = (props: BookingConfirmationProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; }
    .content { background: #f9fafb; padding: 30px; }
    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .button { background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed!</h1>
      <p>Your charter adventure awaits</p>
    </div>
    <div class="content">
      <h2>Hello ${props.customerName},</h2>
      <p>Great news! Your booking has been confirmed. Get ready for an amazing experience!</p>
      
      <div class="booking-details">
        <h3>Booking Details</h3>
        <div class="detail-row"><strong>Booking ID:</strong><span>${props.bookingId}</span></div>
        <div class="detail-row"><strong>Charter:</strong><span>${props.charterName}</span></div>
        <div class="detail-row"><strong>Date:</strong><span>${props.date}</span></div>
        <div class="detail-row"><strong>Time:</strong><span>${props.time}</span></div>
        <div class="detail-row"><strong>Duration:</strong><span>${props.duration}</span></div>
        <div class="detail-row"><strong>Captain:</strong><span>${props.captainName}</span></div>
        <div class="detail-row"><strong>Location:</strong><span>${props.location}</span></div>
        <div class="detail-row"><strong>Total:</strong><span>${props.totalPrice}</span></div>
      </div>
      
      <p><strong>What to bring:</strong> Sunscreen, comfortable clothing, and your sense of adventure!</p>
      <a href="https://yourcharter.com/bookings/${props.bookingId}" class="button">View Booking Details</a>
    </div>
    <div class="footer">
      <p>Questions? Contact us at support@yourcharter.com</p>
      <p>&copy; 2025 Charter Booking. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
