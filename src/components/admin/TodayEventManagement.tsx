'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageGallery from './ImageGallery';

interface TodayEvent {
  id: string;
  title: string;
  time: string;
  type: 'event' | 'live' | 'new';
  description: string;
  mediaUrl: string;
  link: string;
}

// Update placeholder image path
const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

export default function TodayEventManagement() {
  const [event, setEvent] = useState<TodayEvent>({
    id: 'today_event',
    title: '',
    time: '',
    type: 'event',
    description: '',
    mediaUrl: '',
    link: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    fetchTodayEvent();
  }, []);

  const fetchTodayEvent = async () => {
    try {
      const eventDoc = await getDoc(doc(db, 'today_event', 'today_event'));
      if (eventDoc.exists()) {
        setEvent(eventDoc.data() as TodayEvent);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching today event:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus('idle');

    try {
      await setDoc(doc(db, 'today_event', 'today_event'), event);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving today event:', error);
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
          Happening Today
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={event.title}
              onChange={(e) => setEvent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="text"
              value={event.time}
              onChange={(e) => setEvent(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
              placeholder="e.g., 2:00 PM"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={event.type}
            onChange={(e) => setEvent(prev => ({ ...prev, type: e.target.value as TodayEvent['type'] }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
            required
          >
            <option value="live">Live Session</option>
            <option value="event">Event</option>
            <option value="new">New Resource</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={event.description}
            onChange={(e) => setEvent(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Media URL (Image or Video)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={event.mediaUrl}
              onChange={(e) => setEvent(prev => ({ ...prev, mediaUrl: e.target.value }))}
              className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="px-4 py-2 bg-[#803C9A] text-white rounded-lg hover:bg-[#6A2F80] transition-colors"
            >
              <span className="material-icons-outlined">photo_library</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link
          </label>
          <input
            type="url"
            value={event.link}
            onChange={(e) => setEvent(prev => ({ ...prev, link: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
            required
          />
        </div>

        {/* Preview */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#803C9A]/10 shadow-lg overflow-hidden">
          <div className="relative h-48">
            <Image
              src={event.mediaUrl || PLACEHOLDER_IMAGE}
              alt={event.title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = PLACEHOLDER_IMAGE;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#803C9A]/10 shadow-sm">
                <span className={`material-icons-outlined text-lg ${
                  event.type === 'live' ? 'text-red-500 animate-pulse' :
                  event.type === 'event' ? 'text-[#803C9A]' :
                  'text-[#FA4B99]'
                }`}>
                  {event.type === 'live' ? 'live_tv' :
                   event.type === 'event' ? 'event' :
                   'fiber_new'}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  Happening Today
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
                {event.title || 'Event Title'}
              </h3>
              <span className="text-sm font-medium text-[#803C9A]">
                {event.time || 'Time'}
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {event.description || 'Event description will appear here'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-600"
            >
              Changes saved successfully!
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600"
            >
              Error saving changes. Please try again.
            </motion.p>
          )}
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#803C9A] to-[#FA4B99] hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {showGallery && (
        <ImageGallery
          onSelect={(url) => {
            setEvent(prev => ({ ...prev, mediaUrl: url }));
          }}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
} 