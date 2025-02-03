'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ConsultationSection from './ConsultationSection';

const StartSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#803C9A]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FA4B99]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <div className="h-1 w-20 bg-gradient-to-r from-[#803C9A] to-[#FA4B99] mx-auto mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#803C9A] to-[#FA4B99] leading-tight">
              You&apos;re Not Alone in This
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-[#FA4B99] to-[#803C9A] mx-auto mt-8" />
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Living with invisible illness can feel isolating, but it doesn&apos;t have to be
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-white"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Hi, I&apos;m Dr. Dolly – bringing together 20 years of medical expertise with my personal journey 
              with fibromyalgia. Through functional medicine and modern medical approaches, I help people 
              with Fibromyalgia and CFS/ME find real solutions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Let&apos;s work together to understand your unique symptoms and create a path forward that works for you.
            </p>
          </div>
        </motion.div>

        {/* Consultation Section */}
        <ConsultationSection />

        {/* Resource Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/community" 
            className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 border border-[#803C9A]/10 hover:border-[#803C9A]/30"
          >
            <h3 className="text-xl font-semibold text-[#803C9A] mb-3">Join Our Community</h3>
            <p className="text-gray-600 mb-4">Connect with others who understand</p>
            <span className="inline-flex items-center text-[#803C9A] font-medium group-hover:text-[#FA4B99] transition-colors">
              Learn More
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          <Link 
            href="/resources" 
            className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 border border-[#FA4B99]/10 hover:border-[#FA4B99]/30"
          >
            <h3 className="text-xl font-semibold text-[#FA4B99] mb-3">Evidence-Based Resources</h3>
            <p className="text-gray-600 mb-4">Modern solutions for better health</p>
            <span className="inline-flex items-center text-[#FA4B99] font-medium group-hover:text-[#803C9A] transition-colors">
              Explore
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>

          <Link 
            href="/posts" 
            className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-1 border border-[#803C9A]/10 hover:border-[#803C9A]/30"
          >
            <h3 className="text-xl font-semibold text-[#803C9A] mb-3">Latest Insights</h3>
            <p className="text-gray-600 mb-4">Research and treatment updates</p>
            <span className="inline-flex items-center text-[#803C9A] font-medium group-hover:text-[#FA4B99] transition-colors">
              Read More
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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