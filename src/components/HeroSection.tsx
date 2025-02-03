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
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log('Setting up mouse move effect...');
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.05,
        y: (e.clientY - window.innerHeight / 2) * 0.05,
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
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const words = "Reclaim Your Wellbeing".split(" ");

  return (
    <section className="hero-wrapper min-h-screen relative overflow-hidden bg-gradient-to-b from-white to-purple-50">
      {/* Decorative Butterflies */}
      <motion.div 
        className="absolute top-20 right-[10%] w-16 h-16 md:w-20 md:h-20"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/logo.jpg"
            alt="Decorative Butterfly"
            fill
            className="object-contain animate-butterfly-1 opacity-50"
          />
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-32 left-[5%] w-12 h-12 md:w-16 md:h-16"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/logo.jpg"
            alt="Decorative Butterfly"
            fill
            className="object-contain animate-butterfly-2 opacity-30"
          />
        </div>
      </motion.div>

      {/* Additional Butterflies */}
      <motion.div 
        className="absolute top-[40%] right-[5%] w-10 h-10 md:w-14 md:h-14"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/logo.jpg"
            alt="Decorative Butterfly"
            fill
            className="object-contain animate-butterfly-3 opacity-40"
          />
        </div>
      </motion.div>

      <motion.div 
        className="absolute top-[30%] left-[8%] w-8 h-8 md:w-12 md:h-12"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/logo.jpg"
            alt="Decorative Butterfly"
            fill
            className="object-contain animate-butterfly-1 opacity-25"
          />
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-[40%] right-[15%] w-6 h-6 md:w-10 md:h-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/logo.jpg"
            alt="Decorative Butterfly"
            fill
            className="object-contain animate-butterfly-2 opacity-20"
          />
        </div>
      </motion.div>

      {/* Existing Background Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y, opacity }}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.5 }}
          className="blob blob-1"
          style={{
            x: mousePosition.x * -1,
            y: mousePosition.y * -1,
          }}
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="blob blob-2"
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
        />
        
        {/* Enhanced Animated Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`particle particle-${(i % 4) + 1}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              y: [-20, 20, -20],
              x: [-10, 10, -10],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            style={{
              top: `${15 + i * 8}%`,
              left: i % 2 === 0 ? `${10 + i * 8}%` : undefined,
              right: i % 2 !== 0 ? `${10 + i * 8}%` : undefined,
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative w-full px-4 py-8 sm:py-20 sm:px-6 lg:px-8 flex items-center min-h-[75vh] sm:min-h-screen">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            <motion.h1 
              className="hero-content text-3xl sm:text-5xl font-bold tracking-tight sm:text-7xl mb-3 sm:mb-8"
              variants={titleVariants}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap sm:flex-nowrap justify-center gap-1 sm:gap-2 sm:gap-4 mb-1 sm:mb-4">
                  {words.map((word, i) => (
                    <motion.span
                      key={i}
                      className="gradient-text inline-block"
                      variants={letterVariants}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
              <motion.span 
                className="block mt-1 sm:mt-2 text-2xl sm:text-4xl sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
                variants={letterVariants}
              >
                Rest • Revive • Thrive
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="hero-description mx-auto mt-2 sm:mt-8 max-w-2xl text-base sm:text-xl sm:text-2xl text-gray-800 font-medium text-shadow leading-relaxed px-3 sm:px-0"
              variants={titleVariants}
            >
              You&apos;re not alone on this journey. As someone living with fibromyalgia and CFS, 
              I&apos;m here to guide and support you with both heart and medical expertise. Let&apos;s build 
              a community where invisible illnesses are understood, validated, and treated with care.
            </motion.p>

            <motion.p 
              className="mt-4 mx-auto max-w-2xl text-sm sm:text-lg text-gray-600 font-medium px-3 sm:px-0"
              variants={titleVariants}
            >
              Join our caring community, backed by 20+ years of medical wisdom and 5 years as a GP who truly understands
            </motion.p>

       

            <motion.div 
              className="hero-buttons mt-4 sm:mt-12 flex flex-row gap-2 sm:gap-6 justify-center items-center px-2 sm:px-0"
              variants={titleVariants}
            >
              <Link href="/start" className="sm:w-auto">
                <motion.button 
                  className="btn-primary text-xs sm:text-lg group relative overflow-hidden px-3 sm:px-8 py-2 sm:py-4 min-w-[120px] sm:min-w-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                    initial={false}
                    whileHover={{ scale: 1.5 }}
                  />
                  <span className="ml-1 sm:ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                </motion.button>
              </Link>
              <Link href="/community" className="sm:w-auto">
                <motion.button 
                  className="group relative overflow-hidden px-3 sm:px-8 py-2 sm:py-4 border-[1.5px] sm:border-2 border-[#803C9A] text-[#803C9A] rounded-lg hover:text-white transition-all duration-300 text-xs sm:text-lg min-w-[120px] sm:min-w-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Join Community</span>
                  <motion.div 
                    className="absolute inset-0 bg-[#803C9A] opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    whileHover={{ scale: 1.5 }}
                  />
                  <span className="ml-1 sm:ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 