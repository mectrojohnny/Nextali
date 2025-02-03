'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#803C9A] to-[#FF5757] bg-clip-text text-transparent mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your message has been received. We will get back to you shortly.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
} 