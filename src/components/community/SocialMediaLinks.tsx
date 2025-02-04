'use client';

import React, { useState, useEffect } from 'react';
import { FaTiktok, FaInstagram, FaFacebookSquare, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  bgHover: string;
  gradient: string;
}

export default function SocialMediaLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to ensure URLs are direct and properly formatted
  const formatSocialUrl = (url: string, platform: string): string => {
    if (!url) return '';
    
    // Remove any relative paths
    url = url.replace(/^\//, '');
    
    // Ensure URL has proper protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Handle x.com/twitter.com URLs
    if (platform.toLowerCase() === 'twitter' && (url.includes('x.com') || url.includes('twitter.com'))) {
      const username = url.split('/').pop();
      if (username) {
        return `https://x.com/${username}`;
      }
    }
    
    return url;
  };

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const docRef = doc(db, 'settings', 'socialLinks');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const links = docSnap.data().links;
          // Format all URLs before setting state
          const formattedLinks = links.map((link: SocialLink) => ({
            ...link,
            url: formatSocialUrl(link.url, link.name)
          }));
          setSocialLinks(formattedLinks);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  if (loading) {
    return null;
  }

  if (!socialLinks.length) {
    return null;
  }

  const getIcon = (name: string) => {
    switch (name) {
      case 'TikTok':
        return FaTiktok;
      case 'Instagram':
        return FaInstagram;
      case 'Facebook':
        return FaFacebookSquare;
      case 'Twitter':
        return FaTwitter;
      default:
        return FaTiktok;
    }
  };

  return (
    <div className="relative w-full mb-4">
      <div className="absolute inset-0 bg-gradient-to-r from-[#751731] to-[#F4D165] rounded-lg opacity-10" />
      <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-[#751731]/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-[#751731]/70 font-medium">Join Our Business Network</span>
              <span className="h-[1px] flex-1 bg-gradient-to-r from-[#751731]/20 to-transparent hidden sm:block" />
            </div>
            <h3 className="text-base font-semibold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">
              ✨ Stay Connected with Africa&apos;s Business Leaders
            </h3>
            <p className="text-sm text-gray-600">
              Get exclusive insights, success stories, and business opportunities from our thriving entrepreneurial community
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline mt-1 sm:mt-0 text-[#751731] font-medium">
                Join us in building Africa&apos;s next generation of successful businesses 🌍
              </span>
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {socialLinks.filter(social => social.url && social.url.trim() !== '').map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${social.bgHover}`}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${social.gradient} bg-opacity-5 group-hover:bg-opacity-10 transition-all duration-300`}>
                  {React.createElement(getIcon(social.name), {
                    className: `w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-colors duration-300 ${social.color}`
                  })}
                </div>
                <span className={`text-xs text-gray-500 font-medium transition-colors duration-300 ${social.color}`}>
                  {social.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 