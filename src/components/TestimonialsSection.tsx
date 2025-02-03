"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const cardVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 20
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const testimonials = [
  {
    id: 1,
    challenge: "Morning Stiffness & Fatigue",
    experience: "Getting out of bed is my biggest challenge. The morning stiffness can last for hours.",
    tip: "I use a heated blanket 15 minutes before getting up, and do gentle stretches while still in bed.",
    name: "Sarah",
    age: 34,
    duration: "Managing Fibro since 2018"
  },
  {
    id: 2,
    challenge: "Work & Brain Fog",
    experience: "I struggled with concentration and memory at work, especially during meetings.",
    tip: "I now take quick notes on my phone and use reminders. My workplace allows me flexible hours to work when I&apos;m most alert.",
    name: "Michael",
    age: 42,
    duration: "Managing Fibro since 2015"
  },
  {
    id: 3,
    challenge: "Sleep Quality",
    experience: "Unrefreshing sleep left me exhausted, no matter how long I slept.",
    tip: "Creating a strict sleep routine and using a sleep tracking app helped me identify better sleep patterns.",
    name: "Emma",
    age: 29,
    duration: "Managing Fibro since 2020"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="px-3 sm:px-4 py-12 sm:py-20 sm:px-6 lg:px-8 bg-gray-900 relative overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#751731]/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F4D165]/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="mx-auto max-w-7xl relative">
        <motion.div 
          className="text-center mb-8 sm:mb-16"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">
            Real Stories, Real Transformations
          </h2>
          <p className="text-lg sm:text-xl text-gray-300">
            Discover how our community members are rewriting their stories with fibromyalgia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#751731]/5 to-[#F4D165]/5 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#F4D165]" />
                    <h3 className="font-semibold text-[#F4D165] text-base sm:text-lg">
                      {testimonial.challenge}
                    </h3>
                  </div>
                  
                  <div className="mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                      {testimonial.experience}
                    </p>
                    <div className="bg-[#751731]/5 p-3 sm:p-6 rounded-md sm:rounded-lg border border-[#751731]/20">
                      <p className="text-xs sm:text-sm font-medium text-[#751731] mb-1 sm:mb-2">What Helps:</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {testimonial.tip}
                      </p>
                    </div>
                  </div>

                  <footer className="text-xs sm:text-sm border-t border-gray-200 pt-3 sm:pt-4">
                    <p className="font-semibold text-[#751731]">{testimonial.name}, {testimonial.age}</p>
                    <p className="text-gray-500">{testimonial.duration}</p>
                  </footer>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-8 sm:mt-16 space-y-4 sm:space-y-6"
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="/start"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#751731] to-[#F4D165] text-white rounded-lg hover:shadow-lg transition-all duration-300 text-base sm:text-lg font-medium group"
          >
            Book Your Discovery Session
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <p className="text-sm sm:text-base text-gray-400">
            Take the first step towards understanding and healing your invisible illness
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 