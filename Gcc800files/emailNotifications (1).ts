import { supabase } from '@/lib/supabase';
import { generateBookingConfirmationHTML } from '@/components/email-templates/BookingConfirmationEmail';
import { generateBookingReminderHTML } from '@/components/email-templates/BookingReminderEmail';
import { generateCancellationHTML } from '@/components/email-templates/CancellationEmail';
import { generateBookingUpdateHTML } from '@/components/email-templates/BookingUpdateEmail';

interface BookingData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  charterName: string;
  date: string;
  time: string;
  duration?: string;
  totalPrice?: string;
  captainName: string;
  captainEmail?: string;
  location: string;
  captainPhone?: string;
}

export const sendBookingConfirmation = async (booking: BookingData) => {
  const htmlContent = generateBookingConfirmationHTML({
    customerName: booking.customerName,
    bookingId: booking.bookingId,
    charterName: booking.charterName,
    date: booking.date,
    time: booking.time,
    duration: booking.duration || '4 hours',
    totalPrice: booking.totalPrice || '$500',
    captainName: booking.captainName,
    location: booking.location
  });

  return sendEmail({
    to: booking.customerEmail,
    subject: `Booking Confirmed - ${booking.charterName}`,
    htmlContent,
    trackOpens: true,
    trackClicks: true
  });
};

export const sendBookingReminder = async (booking: BookingData, hoursUntil: number) => {
  const htmlContent = generateBookingReminderHTML({
    customerName: booking.customerName,
    bookingId: booking.bookingId,
    charterName: booking.charterName,
    date: booking.date,
    time: booking.time,
    location: booking.location,
    captainName: booking.captainName,
    captainPhone: booking.captainPhone || '(555) 123-4567',
    hoursUntil
  });

  return sendEmail({
    to: booking.customerEmail,
    subject: `Reminder: Your ${booking.charterName} booking is in ${hoursUntil} hours`,
    htmlContent,
    trackOpens: true
  });
};

export const sendCancellationEmail = async (
  booking: BookingData,
  refundAmount: string,
  reason?: string
) => {
  const htmlContent = generateCancellationHTML({
    customerName: booking.customerName,
    bookingId: booking.bookingId,
    charterName: booking.charterName,
    date: booking.date,
    refundAmount,
    cancellationReason: reason
  });

  return sendEmail({
    to: booking.customerEmail,
    subject: `Booking Cancelled - ${booking.charterName}`,
    htmlContent
  });
};

export const sendBookingUpdate = async (
  booking: BookingData,
  updateType: 'date_change' | 'time_change' | 'captain_change' | 'location_change' | 'general',
  oldValue: string,
  newValue: string,
  message?: string
) => {
  const htmlContent = generateBookingUpdateHTML({
    customerName: booking.customerName,
    bookingId: booking.bookingId,
    charterName: booking.charterName,
    updateType,
    oldValue,
    newValue,
    message
  });

  return sendEmail({
    to: booking.customerEmail,
    subject: `Booking Update - ${booking.charterName}`,
    htmlContent,
    trackOpens: true
  });
};

const sendEmail = async (emailData: {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('mailjet-email-service', {
      body: {
        action: 'send',
        emailData
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
