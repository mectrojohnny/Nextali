'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
              Community Guidelines
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-[#803C9A]/10 shadow-lg space-y-4"
          >
            <p className="text-gray-600 leading-relaxed">
              Rest Revive Thrive is a community-driven platform focused on sharing health insights and support. We don&apos;t collect or store any personal data. Our Thrive Centre is a live social health community where users can freely share their tips, experiences, and insights.
            </p>
            <p className="text-gray-600 leading-relaxed">
              While participating in our community, we encourage respectful sharing and support. For any questions about our community guidelines, contact us at{" "}
              <a 
                href="mailto:info@restrevivethrive.com"
                className="text-[#803C9A] hover:text-[#FA4B99] transition-colors"
              >
                info@restrevivethrive.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
} 