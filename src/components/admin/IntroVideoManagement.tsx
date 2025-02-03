'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface IntroVideo {
  url: string;
  title: string;
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

export default function IntroVideoManagement() {
  const [videoData, setVideoData] = useState<IntroVideo>({
    url: '',
    title: 'Welcome to Dr. Dolly\'s Channel'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const docRef = doc(db, 'settings', 'introVideo');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setVideoData(docSnap.data() as IntroVideo);
        }
      } catch (error) {
        console.error('Error fetching intro video data:', error);
        setMessage({ type: 'error', text: 'Failed to load intro video data' });
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const videoId = getYouTubeId(videoData.url);
      if (!videoId) {
        setMessage({ type: 'error', text: 'Invalid YouTube URL' });
        return;
      }
      const docRef = doc(db, 'settings', 'introVideo');
      await setDoc(docRef, videoData, { merge: true });
      setMessage({ type: 'success', text: 'Intro video settings updated successfully!' });
    } catch (error) {
      console.error('Error saving intro video data:', error);
      setMessage({ type: 'error', text: 'Failed to save intro video settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof IntroVideo, value: string) => {
    setVideoData(prev => ({ ...prev, [field]: value }));
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Intro Video Settings</h2>
        <p className="text-gray-600">Manage the intro video that appears on the homepage.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL
          </label>
          <input
            type="url"
            value={videoData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
            placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=abc123xyz)"
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter the full YouTube video URL or just the video ID
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Title
          </label>
          <input
            type="text"
            value={videoData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
            placeholder="Enter video title"
          />
        </div>

        {videoData.url && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(videoData.url)}?autoplay=0&rel=0`}
                title={videoData.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}
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