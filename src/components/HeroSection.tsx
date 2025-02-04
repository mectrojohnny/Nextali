"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  console.log('Rendering HeroSection...');
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { 
      image: '/1.jpg', 
      url: 'https://suite.nextali.com', 
      alt: 'Nextali Business Suite',
      message: 'Get more profit with  ou Business Tools',
      linkText: 'Visit Business Suite →'
    },
    { 
      image: '/2.jpg', 
      url: 'https://exchangehub.nextali.com', 
      alt: 'Nextali Exchange Hub',
      message: 'Exchange Skills  & Sevices ',
      linkText: 'Explore Exchange Hub →'
    },
    { 
      image: '/3.jpg', 
      url: 'https://nextentrepreneur.org', 
      alt: 'Next Entrepreneur Platform',
      message: 'Empower Your Journey',
      linkText: 'Join NEP Platform →'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const mainTitle = ["Empowering", "The Future of", "Business"];

  return (
    <section className="hero-wrapper min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-[#fff9f0] to-[#fff5e6]">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Abstract Shapes */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y, opacity }}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2 }}
          className="absolute top-20 right-[10%] w-96 h-96 rounded-full bg-gradient-to-r from-[#751731]/20 to-[#F4D165]/20 blur-3xl"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-gradient-to-r from-[#F4D165]/20 to-[#751731]/20 blur-3xl"
        />
      </motion.div>

      {/* Content */}
      <div className="relative w-full px-4 py-8 sm:py-20 sm:px-6 lg:px-8 flex items-center min-h-[75vh] sm:min-h-screen">
        <div className="mx-auto max-w-7xl pt-20 sm:pt-0">
          <motion.div 
            className="text-center lg:text-left grid lg:grid-cols-2 gap-8 items-center"
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            {/* Left Column - Text Content */}
            <div className="flex flex-col gap-8">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight"
                variants={titleVariants}
              >
                <div className="overflow-hidden flex flex-col gap-1 md:gap-2">
                  {mainTitle.map((line, i) => (
                    <div key={i} className="overflow-hidden">
                      <motion.span
                        className="bg-gradient-to-r from-[#751731] via-[#9E2F4B] to-[#F4D165] bg-clip-text text-transparent inline-block drop-shadow-sm"
                        variants={letterVariants}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                      >
                        {line}
                      </motion.span>
                    </div>
                  ))}
                </div>
              </motion.h1>
              
              <motion.div 
                className="space-y-4 md:space-y-6"
                variants={titleVariants}
              >
                <p className="text-lg md:text-xl font-bold text-[#751731] leading-relaxed">
                  Transform enterprises from vision to success.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
                  Our innovative tech-driven products and services - <span className="font-semibold text-[#751731]">BILL</span>, <span className="font-semibold text-[#751731]">TEA</span>, and <span className="font-semibold text-[#751731]">NEP</span> - deliver comprehensive business support, 
                  skill development, and research-driven solutions for sustainable growth.
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start gap-4"
                variants={titleVariants}
              >
                <Link href="/platforms" className="inline-block">
                  <motion.button 
                    className="bg-gradient-to-r from-[#751731] to-[#F4D165] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center group whitespace-nowrap"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Our Ecosystem
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </motion.button>
                </Link>
                <Link href="/contact" className="inline-block">
                  <motion.button 
                    className="border-2 border-[#751731] text-[#751731] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:bg-[#751731] hover:text-white transition-all duration-300 flex items-center justify-center group shadow-sm hover:shadow-xl whitespace-nowrap"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Your Journey
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Core Values Badges */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                variants={titleVariants}
              >
                {[
                  { name: 'Innovation', desc: 'Pioneering Solutions' },
                  { name: 'Community', desc: 'Supportive Network' },
                  { name: 'Excellence', desc: 'Highest Standards' },
                  { name: 'Sustainability', desc: 'Long-term Impact' }
                ].map((value) => (
                  <div 
                    key={value.name} 
                    className="px-6 py-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-[#F4D165]/20 group hover:border-[#751731]/20 transition-all duration-300 hover:shadow-md"
                  >
                    <span className="font-semibold text-gray-900 block text-lg mb-1">{value.name}</span>
                    <span className="text-sm text-gray-600">{value.desc}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Blob Slider */}
            <motion.div
              className="relative h-[250px] sm:h-[350px] lg:h-[500px] -mx-4 sm:mx-0 lg:-mr-24 xl:-mr-32 mt-8 lg:mt-0 mb-24 sm:mb-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[450px] lg:h-[450px] mx-auto lg:ml-auto">
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide.image}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: currentSlide === index ? 1 : 0,
                      scale: currentSlide === index ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.7 }}
                  >
                    <Link href={slide.url} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block group">
                      <div className="relative w-full h-full flex flex-col">
                        <div className="relative flex-grow">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#751731]/10 to-[#F4D165]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob-slow"></div>
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            className="object-cover rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob group-hover:scale-105 transition-transform duration-300"
                            priority={index === 0}
                          />
                        </div>
                        <div className="absolute sm:left-1/2 sm:-translate-x-1/2 sm:bottom-8 w-full sm:w-2/3 sm:max-w-[180px] p-3 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center text-center transform group-hover:scale-105 transition-all duration-300 border border-[#F4D165]/20
                          -bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2">
                          <p className="text-white font-semibold mb-1 text-base drop-shadow-lg">
                            {slide.message}
                          </p>
                          <span className="inline-flex items-center text-[#F4D165] text-base font-medium group-hover:text-white transition-colors duration-300">
                            {slide.linkText}
                            <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Slide Indicators */}
              <div className="absolute -bottom-32 sm:-bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-[#751731] w-4' 
                        : 'bg-[#751731]/30'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to ${slide.alt}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Add these styles to your global CSS or tailwind config
/*
@keyframes blob {
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}

.animate-blob {
  animation: blob 8s ease-in-out infinite;
}

.animate-blob-slow {
  animation: blob 12s ease-in-out infinite;
}
*/ 