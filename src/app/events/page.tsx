'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Event {
  id: string;
  title: string;
  time: string;
  type: 'event' | 'live' | 'new';
  description: string;
  mediaUrl: string;
  link: string;
}

const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsQuery = query(collection(db, 'events'), orderBy('time', 'desc'));
      const snapshot = await getDocs(eventsQuery);
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      setEvents(eventsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gradient-to-br from-white via-[#fff9f0] to-[#fff5e6] pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#751731]"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-white via-[#fff9f0] to-[#fff5e6] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent mb-4"
            >
              Events & Sessions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg"
            >
              Join our live sessions, events, and discover new resources
            </motion.p>
          </div>

          {/* Filters */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
              {['all', 'upcoming', 'past'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as typeof filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === type
                      ? 'bg-gradient-to-r from-[#751731] to-[#F4D165] text-white shadow-md'
                      : 'text-gray-600 hover:text-[#751731]'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons-outlined text-6xl text-[#751731]/20 mb-4">event_busy</span>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Events Found</h3>
              <p className="text-gray-500">Check back later for upcoming events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#751731]/10 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
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
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#751731]/10 shadow-sm">
                        <span className={`material-icons-outlined text-lg ${
                          event.type === 'live' ? 'text-red-500 animate-pulse' :
                          event.type === 'event' ? 'text-[#751731]' :
                          'text-[#F4D165]'
                        }`}>
                          {event.type === 'live' ? 'live_tv' :
                           event.type === 'event' ? 'event' :
                           'fiber_new'}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {event.type === 'live' ? 'Live Session' :
                           event.type === 'event' ? 'Event' :
                           'New Resource'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">
                        {event.title}
                      </h3>
                      <span className="text-sm font-medium text-[#751731]">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <Link 
                      href={event.link}
                      className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#751731] to-[#F4D165] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                      {event.type === 'live' ? 'Join Live Session' :
                       event.type === 'event' ? 'Join Event' :
                       'View Resource'}
                      <span className="material-icons-outlined ml-2 text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 