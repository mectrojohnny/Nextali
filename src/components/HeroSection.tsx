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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const slides = ['/1.jpg', '/2.jpg', '/3.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('Setting up mouse move effect...');
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.02,
        y: (e.clientY - window.innerHeight / 2) * 0.02,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
          style={{
            x: mousePosition.x * -1,
            y: mousePosition.y * -1,
          }}
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-gradient-to-r from-[#F4D165]/20 to-[#751731]/20 blur-3xl"
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative w-full px-4 py-8 sm:py-20 sm:px-6 lg:px-8 flex items-center min-h-[75vh] sm:min-h-screen">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            className="text-center lg:text-left grid lg:grid-cols-2 gap-8 items-center"
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            {/* Left Column - Text Content */}
            <div className="flex flex-col gap-8">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
                variants={titleVariants}
              >
                <div className="overflow-hidden flex flex-col gap-2">
                  {mainTitle.map((line, i) => (
                    <div key={i} className="overflow-hidden">
                      <motion.span
                        className="bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent inline-block"
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
                className="space-y-6"
                variants={titleVariants}
              >
                <p className="text-xl md:text-2xl font-semibold text-[#751731] leading-relaxed">
                  Transform enterprises from vision to success.
                </p>
                <p className="text-lg md:text-xl text-[#751731]/80 leading-relaxed max-w-2xl">
                  Our innovative platforms - <span className="font-semibold">BILL</span>, <span className="font-semibold">TEA</span>, and <span className="font-semibold">NEP</span> - deliver comprehensive business support, 
                  skill development, and research-driven solutions for sustainable growth.
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 items-start"
                variants={titleVariants}
              >
                <Link href="/platforms" className="w-full sm:w-auto">
                  <motion.button 
                    className="w-full sm:w-auto bg-gradient-to-r from-[#751731] to-[#F4D165] text-white px-8 py-4 rounded-lg font-medium text-lg shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Our Ecosystem
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </motion.button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <motion.button 
                    className="w-full sm:w-auto border-2 border-[#F4D165] text-[#751731] px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#F4D165] hover:text-white hover:border-[#F4D165] transition-all duration-300 flex items-center justify-center group shadow-sm hover:shadow-xl"
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
                    <span className="font-semibold text-[#751731] block text-lg mb-1">{value.name}</span>
                    <span className="text-sm text-[#751731]/70">{value.desc}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Blob Slider */}
            <motion.div
              className="relative h-[300px] sm:h-[400px] lg:h-[550px] -mx-4 sm:mx-0 lg:-mr-24 xl:-mr-32 mt-8 lg:mt-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] mx-auto lg:ml-auto">
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: currentSlide === index ? 1 : 0,
                      scale: currentSlide === index ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#751731]/10 to-[#F4D165]/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob-slow"></div>
                      <Image
                        src={slide}
                        alt={`Slide ${index + 1}`}
                        fill
                        className="object-cover rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-blob"
                        style={{
                          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                        }}
                        priority={index === 0}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Slide Indicators */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-[#751731] w-4' 
                        : 'bg-[#751731]/30'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
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