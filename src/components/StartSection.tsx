'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const StartSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F4D165]/10 pt-16 md:pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#751731]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#F4D165]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="inline-block mb-4 md:mb-6">
            <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-[#751731] to-[#F4D165] mx-auto mb-6 md:mb-8" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#751731] to-[#F4D165] leading-tight px-2">
              Transform Your Business Journey
            </h1>
            <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-[#F4D165] to-[#751731] mx-auto mt-6 md:mt-8" />
          </div>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
            Empowering African entrepreneurs and SMEs through innovative, research-driven solutions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 mb-8 md:mb-16 border border-white mx-4 md:mx-0"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
              Welcome to Nextali – a technology-driven organization dedicated to transforming how African 
              entrepreneurs and SMEs operate, grow, and succeed. Through our innovative platforms and 
              community-centered ecosystem, we&apos;re building Africa&apos;s next generation of successful businesses.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Let&apos;s work together to unlock your business potential and create sustainable growth through 
              technology, innovation, and community-driven solutions.
            </p>
          </div>
          
          {/* Consultation Button Section */}
          <div className="mt-8 md:mt-12 text-center">
            <div className="mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-[#751731] mb-2">For Consultation or Strategic Partnership?</h3>
              <p className="text-sm md:text-base text-gray-600">Connect with our experts for business consultation and collaboration</p>
            </div>
            <Link
              href="/book-consultation"
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-[#751731] to-[#F4D165] rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Reach Out to Us
              <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Resource Links */}
        <div className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
          <Link 
            href="/bill" 
            className="group bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl md:rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 border border-[#751731]/10 hover:border-[#751731]/30"
          >
            <h3 className="text-lg md:text-xl font-semibold text-[#751731] mb-2 md:mb-3">Nextali BILL</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">Business Innovation and Leadership Lab</p>
            <span className="inline-flex items-center text-[#751731] font-medium group-hover:text-[#F4D165] transition-colors text-sm md:text-base">
              Learn More
              <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          <Link 
            href="/tea" 
            className="group bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl md:rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 border border-[#F4D165]/10 hover:border-[#F4D165]/30"
          >
            <h3 className="text-lg md:text-xl font-semibold text-[#F4D165] mb-2 md:mb-3">Nextali TEA</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">Talent Exchange and Academy</p>
            <span className="inline-flex items-center text-[#F4D165] font-medium group-hover:text-[#751731] transition-colors text-sm md:text-base">
              Explore
              <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          <Link 
            href="/nep" 
            className="group bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl md:rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 border border-[#751731]/10 hover:border-[#751731]/30"
          >
            <h3 className="text-lg md:text-xl font-semibold text-[#751731] mb-2 md:mb-3">Nextali NEP</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">Next Entrepreneurs Platform</p>
            <span className="inline-flex items-center text-[#751731] font-medium group-hover:text-[#F4D165] transition-colors text-sm md:text-base">
              Get Started
              <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default StartSection; 