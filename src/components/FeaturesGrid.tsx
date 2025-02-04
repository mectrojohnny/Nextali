'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeaturesGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="px-3 sm:px-6 py-12 sm:py-20 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div 
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Business Suite Card */}
          <motion.div variants={cardVariants} className="group">
            <div className="card bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg sm:rounded-xl hover:bg-gray-700/90 transition-all duration-300 transform hover:-translate-y-2 border border-[#751731]/10 hover:border-[#F4D165] flex flex-col h-full hover:shadow-[0_0_30px_rgba(244,209,101,0.15)]">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-[#751731]/30 to-[#F4D165]/30 rounded-2xl flex items-center justify-center group-hover:from-[#751731]/50 group-hover:to-[#F4D165]/50 transition-all duration-300 group-hover:scale-110 transform shadow-lg">
                  <svg className="w-9 h-9 sm:w-10 sm:h-10 text-[#F4D165] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white group-hover:text-[#F4D165] transition-colors duration-300">Nextali Business Suite</h3>
              <p className="text-base sm:text-lg text-gray-300 mb-6 flex-grow">Comprehensive business tools and services designed to propel your business towards growth and success. Access powerful analytics, management tools, and business insights.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="https://suite.nextali.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-[#751731] text-white rounded-lg hover:bg-[#F4D165] transition-all duration-300 text-sm sm:text-base font-medium">
                  Launch Suite
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/business-suite" className="inline-flex items-center justify-center px-6 py-3 border border-[#751731] text-[#F4D165] rounded-lg hover:bg-[#751731]/10 transition-all duration-300 text-sm sm:text-base font-medium">
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Exchange Platform Card */}
          <motion.div variants={cardVariants} className="group">
            <div className="card bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg sm:rounded-xl hover:bg-gray-700/90 transition-all duration-300 transform hover:-translate-y-2 border border-[#F4D165]/10 hover:border-[#751731] flex flex-col h-full hover:shadow-[0_0_30px_rgba(117,23,49,0.15)]">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-[#F4D165]/30 to-[#751731]/30 rounded-2xl flex items-center justify-center group-hover:from-[#F4D165]/50 group-hover:to-[#751731]/50 transition-all duration-300 group-hover:scale-110 transform shadow-lg">
                  <svg className="w-9 h-9 sm:w-10 sm:h-10 text-[#F4D165] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white group-hover:text-[#F4D165] transition-colors duration-300">Nextali Exchange Hub</h3>
              <p className="text-base sm:text-lg text-gray-300 mb-6 flex-grow">Dynamic marketplace for exchanging products, services, and skills. Connect with partners, access new markets, and grow your business through our innovative exchange platform.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="https://exchangehub.nextali.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-[#F4D165] text-gray-900 rounded-lg hover:bg-[#751731] hover:text-white transition-all duration-300 text-sm sm:text-base font-medium">
                  Visit Exchange
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/exchange-hub" className="inline-flex items-center justify-center px-6 py-3 border border-[#F4D165] text-[#F4D165] rounded-lg hover:bg-[#F4D165]/10 transition-all duration-300 text-sm sm:text-base font-medium">
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Next Entrepreneur Platform Card */}
          <motion.div variants={cardVariants} className="group">
            <div className="card bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-lg sm:rounded-xl hover:bg-gray-700/90 transition-all duration-300 transform hover:-translate-y-2 border border-[#751731]/10 hover:border-[#F4D165] flex flex-col h-full hover:shadow-[0_0_30px_rgba(244,209,101,0.15)]">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-[#751731]/30 to-[#F4D165]/30 rounded-2xl flex items-center justify-center group-hover:from-[#751731]/50 group-hover:to-[#F4D165]/50 transition-all duration-300 group-hover:scale-110 transform shadow-lg">
                  <svg className="w-9 h-9 sm:w-10 sm:h-10 text-[#F4D165] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-white group-hover:text-[#F4D165] transition-colors duration-300">Next Entrepreneur Platform</h3>
              <p className="text-base sm:text-lg text-gray-300 mb-6 flex-grow">Your gateway to entrepreneurial success. Access grants, training resources, mentorship opportunities, and connect with a thriving community of innovators.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="https://nextentrepreneur.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-[#751731] text-white rounded-lg hover:bg-[#F4D165] transition-all duration-300 text-sm sm:text-base font-medium">
                  Join Platform
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/entrepreneur-platform" className="inline-flex items-center justify-center px-6 py-3 border border-[#751731] text-[#F4D165] rounded-lg hover:bg-[#751731]/10 transition-all duration-300 text-sm sm:text-base font-medium">
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturesGrid; 