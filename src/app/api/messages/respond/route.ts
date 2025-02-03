import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';

// Create a transporter using custom SMTP settings
const transporter = nodemailer.createTransport({
  host: 'restrevivethrive.com',
  port: 465,
  secure: true, // use SSL/TLS
  auth: {
    user: 'drdolly@restrevivethrive.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messageId, response, messageType, recipientEmail, recipientName } = body;

    if (!messageId || !response || !messageType || !recipientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the message status in Firestore
    const collectionName = messageType === 'consultation' ? 'consultations' : 'contact_messages';
    const messageRef = doc(db, collectionName, messageId);
    
    await updateDoc(messageRef, {
      status: 'responded',
      response,
      respondedAt: new Date().toISOString()
    });

    // Send email to the recipient
    const emailSubject = messageType === 'consultation' 
      ? 'Response to Your Consultation Request - Rest Revive Thrive'
      : 'Response to Your Message - Rest Revive Thrive';

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #803C9A, #FA4B99); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Rest Revive Thrive</h1>
        </div>
        
        <div style="padding: 20px; background-color: #fff; border-radius: 0 0 8px 8px;">
          <p>Dear ${recipientName},</p>
          
          <p>Thank you for reaching out to Rest Revive Thrive. Here's our response to your message:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            ${response.replace(/\n/g, '<br>')}
          </div>
          
          <p>If you have any further questions, please don't hesitate to reach out to us again.</p>
          
          <p>Best regards,<br>Dr. Dolly<br>Rest Revive Thrive</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Dr. Dolly" <drdolly@restrevivethrive.com>',
      to: recipientEmail,
      subject: emailSubject,
      html: emailTemplate,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending response:', error);
    return NextResponse.json(
      { error: 'Failed to send response' },
      { status: 500 }
    );
  }
} 