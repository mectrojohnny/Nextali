'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ConsultationSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-[#FA4B99] to-[#803C9A] rounded-3xl overflow-hidden shadow-xl border border-white/20"
    >
      <div className="relative px-8 py-12 sm:px-12 backdrop-blur-sm bg-white/5">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/10 blur-3xl transform rotate-12" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-white/5 to-transparent blur-2xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/10 blur-3xl transform -rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-block">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Comprehensive Care That Works
                </h2>
                <div className="h-1 w-20 bg-white/30 mx-auto" />
              </div>
              <h3 className="text-2xl text-white/90 mb-6">
                Modern Medicine Meets Personal Experience
              </h3>
          
              <p className="text-lg text-white/90 max-w-xl mx-auto mb-8">
                Experience a unique blend of medical expertise and understanding 
                that addresses your specific needs.
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-6"
              >
                <Link 
                  href="/book-consultation"
                  className="inline-block text-center bg-white/20 border-2 border-white text-white px-12 py-4 rounded-xl font-medium hover:bg-white/30 transition-all text-lg group relative overflow-hidden"
                >
                  <span className="relative z-10">One-on-One Chat</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 relative z-10">→</span>
                </Link>
                <p className="text-white/70 text-sm mt-4">
                  Personalized care for your journey
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsultationSection; 