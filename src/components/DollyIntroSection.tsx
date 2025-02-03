'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  bgHover: string;
  gradient: string;
}

interface IntroVideo {
  title: string;
  videoUrl: string;
  videoId: string;
}

const getYouTubeId = (url: string) => {
  if (!url) return null;
  
  // Handle youtu.be format
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return id || null;
  }
  
  // Handle youtube.com format
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function DollyIntroSection() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [introVideo, setIntroVideo] = useState<IntroVideo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch social links
        const socialDocRef = doc(db, 'settings', 'socialLinks');
        const socialDocSnap = await getDoc(socialDocRef);
        if (socialDocSnap.exists()) {
          setSocialLinks(socialDocSnap.data().links);
        }

        // Fetch intro video
        const introVideoRef = doc(db, 'settings', 'introVideo');
        const introVideoSnap = await getDoc(introVideoRef);
        if (introVideoSnap.exists()) {
          const data = introVideoSnap.data();
          const videoId = getYouTubeId(data.url);
          console.log('Video URL:', data.url);
          console.log('Extracted video ID:', videoId);
          if (videoId) {
            setIntroVideo({
              title: data.title,
              videoUrl: data.url,
              videoId: videoId
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'TikTok': return FaTiktok;
      case 'Instagram': return FaInstagram;
      case 'Facebook': return FaFacebook;
      case 'Twitter': return FaTwitter;
      case 'LinkedIn': return FaLinkedin;
      case 'YouTube': return FaYoutube;
      default: return FaInstagram;
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-white via-purple-50/30 to-white">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60rem] h-[60rem] bg-gradient-to-b from-purple-100/20 to-pink-100/20 rounded-full translate-x-1/3 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[60rem] h-[60rem] bg-gradient-to-t from-purple-100/20 to-pink-100/20 rounded-full -translate-x-1/3 translate-y-1/2 blur-3xl" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-12 lg:pt-20 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl xs:text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#803C9A] bg-clip-text text-transparent">
                Transform Your Life with Dr. Dolly
              </h1>
              <div className="space-y-3 mb-8">
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-800">
                  Your Guide to Reclaiming Joy & Vitality
                </h2>
                <h3 className="text-lg xs:text-xl sm:text-2xl text-[#803C9A] font-medium">
                  Breaking Through Fibromyalgia & CFS/ME Together
                </h3>
                <p className="text-base xs:text-lg text-gray-600 italic font-light">
                  From Surviving to Thriving - Your Journey Starts Here
                </p>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pb-12">
            {/* Left Column - Photo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
              className="lg:col-span-5"
            >
              {/* Photo */}
              <div className="relative max-w-[250px] sm:max-w-md mx-auto">
              <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -inset-3 bg-gradient-to-br from-[#E91E63]/20 via-[#9C27B0]/20 to-[#803C9A]/20 blur-xl rounded-[2rem]"
                />
              <motion.div
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-100 to-pink-50"
                  whileHover={{ rotate: -3, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/images/avatars/drdolly.jpg"
                    alt="Dr. Dolly"
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                      <h4 className="text-xl sm:text-2xl font-bold mb-1 text-white">Dr. Dolly</h4>
                      <p className="text-sm font-medium text-gray-200">Fibromyalgia Specialist & Advocate</p>
                    </div>
                  </div>
              </motion.div>
            </div>
            </motion.div>

            {/* Right Column - About & CTAs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-7 space-y-8"
            >
              {/* About */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#803C9A] to-[#E91E63] bg-clip-text text-transparent">
                  About Dr. Dolly
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Meet Dr. Dolly – not just another doctor, but someone who truly gets it. Living with fibromyalgia herself, she&apos;s turned her personal struggles into a mission to help others thrive. She combines her medical know-how with real-life experience to create solutions that actually work in your day-to-day life – no more one-size-fits-all approaches that leave you feeling frustrated.
                </p>
              </div>

              {/* Experience Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-purple-100">
                  <div className="text-xl sm:text-2xl font-bold text-[#803C9A]">20+ Years</div>
                  <div className="text-gray-600 font-medium">Medical Experience</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-pink-100">
                  <div className="text-xl sm:text-2xl font-bold text-[#E91E63]">5+ Years as GP (UK)</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/videos" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#803C9A] via-[#9C27B0] to-[#E91E63] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Watch Latest Videos
                    </motion.button>
                  </Link>
                  <Link href="/community" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 bg-white/80 backdrop-blur-sm text-[#E91E63] border-2 border-[#E91E63] rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Join Our Community
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quote and Video Section */}
          <div className="relative max-w-7xl mx-auto py-16 lg:py-24">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-0 w-[30rem] h-[30rem] bg-gradient-to-r from-purple-100/30 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
              <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-gradient-to-l from-pink-100/30 to-transparent rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#803C9A] via-[#9C27B0] to-[#E91E63] bg-clip-text text-transparent inline-block">
                Let&apos;s Connect
              </h2>
              <motion.div 
                className="h-1 w-24 mx-auto mt-4 bg-gradient-to-r from-[#803C9A] to-[#E91E63]"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 text-gray-600 text-lg"
              >
                Join our vibrant community across platforms
              </motion.div>
              <div className="flex justify-center gap-6 mt-4">
                {socialLinks.filter(social => social.url && social.url.trim() !== '').map((social) => (
                  <motion.a
                    key={social.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#803C9A] to-[#E91E63] rounded-lg opacity-0 group-hover:opacity-20 transition-opacity blur" />
                    <div className={`relative z-10 transition-all duration-300 ${social.color} hover:opacity-80`}>
                      {React.createElement(getIcon(social.name), {
                        className: "w-7 h-7 sm:w-8 sm:h-8"
                      })}
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sm whitespace-nowrap text-gray-600 font-medium">
                      {social.name}
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 px-4 sm:px-6 lg:px-8">
              {/* Left Side - Quote */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex items-center"
              >
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-lg border border-purple-100/50">
                  <div className="absolute -left-3 top-8 w-6 h-24 bg-gradient-to-b from-[#803C9A] via-[#9C27B0] to-[#E91E63] rounded-l-xl" />
                  <div className="relative">
                    <h3 className="text-xl lg:text-2xl font-bold mb-4 bg-gradient-to-r from-[#803C9A] to-[#E91E63] bg-clip-text text-transparent">
                      Your Partner in Healing
                    </h3>
                    <p className="text-gray-700 italic leading-relaxed">
                      I understand your struggles because I live them too. Together, we&apos;ll create a personalized roadmap to better days. No more feeling alone or unheard - let&apos;s unlock your body&apos;s natural healing potential and build a life full of possibility, despite fibromyalgia.
                    </p>
                    <div className="mt-6 flex justify-end">
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-[#803C9A] via-[#9C27B0] to-[#E91E63] flex items-center justify-center text-white"
                      >
                        <span className="text-2xl font-serif">&ldquo;</span>
                      </motion.div>
                    </div>
                  </div>
            </div>
          </motion.div>

              {/* Right Side - Video */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:flex lg:items-center"
              >
                <div className="relative w-full">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -inset-4 bg-gradient-to-br from-[#E91E63]/10 via-[#9C27B0]/10 to-[#803C9A]/10 rounded-3xl blur-xl"
                  />
                  <div className="mb-4 text-center">
                    <motion.h3 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#803C9A] to-[#E91E63] bg-clip-text text-transparent mb-4"
                    >
                      Welcome Video
                    </motion.h3>
                    {introVideo && introVideo.videoUrl && (
                      <div className="flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto lg:mx-0">
                        <div className="text-gray-600 text-sm mb-2">
                          Watch Dr. Dolly&apos;s welcome message
                        </div>
                      </div>
                    )}
                  </div>
                  <motion.div
                    className="relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-white/5 backdrop-blur-sm max-w-3xl mx-auto lg:mx-0"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {introVideo && introVideo.videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${introVideo.videoId}?autoplay=0&rel=0`}
                        title={introVideo.title || "Introduction Video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm flex flex-col items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4"
                        >
                          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.5933 7.20068C21.4192 6.57636 21.0897 6.00644 20.6416 5.54432C20.1935 5.0822 19.6399 4.74604 19.0333 4.56401C17.4667 4.00068 12 4.00068 12 4.00068C12 4.00068 6.53334 4.00068 4.96667 4.56401C4.36013 4.74604 3.80656 5.0822 3.35843 5.54432C2.91029 6.00644 2.58084 6.57636 2.40667 7.20068C2 8.86734 2 12.0007 2 12.0007C2 12.0007 2 15.134 2.40667 16.8007C2.58084 17.425 2.91029 17.9949 3.35843 18.457C3.80656 18.9191 4.36013 19.2553 4.96667 19.4373C6.53334 20.0007 12 20.0007 12 20.0007C12 20.0007 17.4667 20.0007 19.0333 19.4373C19.6399 19.2553 20.1935 18.9191 20.6416 18.457C21.0897 17.9949 21.4192 17.425 21.5933 16.8007C22 15.134 22 12.0007 22 12.0007C22 12.0007 22 8.86734 21.5933 7.20068Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 15.1339L15.3333 12.0006L10 8.86719V15.1339Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                        <p className="text-white/90 font-medium">Loading video...</p>
                      </div>
                    )}
                  </motion.div>
              </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 