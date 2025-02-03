'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ConnectPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#803C9A] to-[#FF5757] bg-clip-text text-transparent mb-6">
            Connect With Us
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Join our community and connect with others on their journey to better health and well-being.
          </p>
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <a
              href="/community"
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-[#803C9A] mb-2">Community Forum</h2>
              <p className="text-gray-600">Join discussions and share experiences with others</p>
            </a>
            <a
              href="/book-consultation"
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-[#803C9A] mb-2">Book a Consultation</h2>
              <p className="text-gray-600">Schedule a one-on-one session with our experts</p>
            </a>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
} 