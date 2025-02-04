'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FaTiktok, FaInstagram, FaFacebookSquare, FaTwitter } from 'react-icons/fa';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  bgHover: string;
  gradient: string;
}

export default function SocialMediaManagement() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const defaultLinks = [
    {
      name: 'TikTok',
      icon: 'FaTiktok',
      url: '',
      color: 'hover:text-[#000000]',
      bgHover: 'hover:bg-[#00f2ea]/10',
      gradient: 'from-black to-[#00f2ea]'
    },
    {
      name: 'Instagram',
      icon: 'FaInstagram',
      url: '',
      color: 'hover:text-[#E4405F]',
      bgHover: 'hover:bg-[#E4405F]/10',
      gradient: 'from-[#833AB4] to-[#E4405F]'
    },
    {
      name: 'Facebook',
      icon: 'FaFacebookSquare',
      url: '',
      color: 'hover:text-[#1877F2]',
      bgHover: 'hover:bg-[#1877F2]/10',
      gradient: 'from-[#1877F2] to-[#0099FF]'
    },
    {
      name: 'Twitter',
      icon: 'FaTwitter',
      url: '',
      color: 'hover:text-[#1DA1F2]',
      bgHover: 'hover:bg-[#1DA1F2]/10',
      gradient: 'from-[#1DA1F2] to-[#66B2FF]'
    }
  ];

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const docRef = doc(db, 'settings', 'socialLinks');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setLinks(docSnap.data().links);
        } else {
          setLinks(defaultLinks);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
        setMessage({ type: 'error', text: 'Failed to load social media links' });
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

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

  const handleSave = async () => {
    try {
      setLoading(true);
      // Format all URLs before saving
      const formattedLinks = links.map(link => ({
        ...link,
        url: formatSocialUrl(link.url, link.name)
      }));
      const docRef = doc(db, 'settings', 'socialLinks');
      await setDoc(docRef, { links: formattedLinks }, { merge: true });
      setLinks(formattedLinks); // Update state with formatted URLs
      setMessage({ type: 'success', text: 'Social media links updated successfully!' });
    } catch (error) {
      console.error('Error saving social links:', error);
      setMessage({ type: 'error', text: 'Failed to save social media links' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...links];
    // Format URL immediately when changed
    if (field === 'url') {
      value = formatSocialUrl(value, newLinks[index].name);
    }
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media Links</h2>
        <p className="text-gray-600">Manage your social media presence by updating the links and styles below.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {links.map((link, index) => (
          <div key={link.name} className="space-y-4 p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
                {link.name === 'TikTok' && <FaTiktok className="w-5 h-5" />}
                {link.name === 'Instagram' && <FaInstagram className="w-5 h-5" />}
                {link.name === 'Facebook' && <FaFacebookSquare className="w-5 h-5" />}
                {link.name === 'Twitter' && <FaTwitter className="w-5 h-5" />}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{link.name} Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${link.name}-url`} className="block text-sm font-medium text-gray-700 mb-1">
                  Profile URL
                </label>
                <input
                  type="url"
                  id={`${link.name}-url`}
                  value={link.url}
                  onChange={(e) => handleChange(index, 'url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                  placeholder={`Enter your ${link.name} profile URL`}
                />
              </div>

              <div>
                <label htmlFor={`${link.name}-color`} className="block text-sm font-medium text-gray-700 mb-1">
                  Hover Color
                </label>
                <input
                  type="text"
                  id={`${link.name}-color`}
                  value={link.color}
                  onChange={(e) => handleChange(index, 'color', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                  placeholder="hover:text-[#000000]"
                />
              </div>

              <div>
                <label htmlFor={`${link.name}-bgHover`} className="block text-sm font-medium text-gray-700 mb-1">
                  Background Hover
                </label>
                <input
                  type="text"
                  id={`${link.name}-bgHover`}
                  value={link.bgHover}
                  onChange={(e) => handleChange(index, 'bgHover', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                  placeholder="hover:bg-[#00f2ea]/10"
                />
              </div>

              <div>
                <label htmlFor={`${link.name}-gradient`} className="block text-sm font-medium text-gray-700 mb-1">
                  Gradient
                </label>
                <input
                  type="text"
                  id={`${link.name}-gradient`}
                  value={link.gradient}
                  onChange={(e) => handleChange(index, 'gradient', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                  placeholder="from-black to-[#00f2ea]"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-500">Preview:</div>
              <div className={`mt-2 inline-flex items-center space-x-2 p-2 rounded-lg ${link.bgHover}`}>
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${link.gradient} bg-opacity-5`}>
                  {link.name === 'TikTok' && <FaTiktok className={`w-5 h-5 ${link.color}`} />}
                  {link.name === 'Instagram' && <FaInstagram className={`w-5 h-5 ${link.color}`} />}
                  {link.name === 'Facebook' && <FaFacebookSquare className={`w-5 h-5 ${link.color}`} />}
                  {link.name === 'Twitter' && <FaTwitter className={`w-5 h-5 ${link.color}`} />}
                </div>
                <span className={`text-sm font-medium ${link.color}`}>{link.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-[#803C9A] to-[#FA4B99] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </motion.div>
  );
} 