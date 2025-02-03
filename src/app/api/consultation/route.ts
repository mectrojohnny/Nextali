import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate the input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Store in Firebase
    const consultationsRef = collection(db, 'consultations');
    await addDoc(consultationsRef, {
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting consultation:', error);
    return NextResponse.json(
      { error: 'Failed to submit consultation request' },
      { status: 500 }
    );
  }
} 