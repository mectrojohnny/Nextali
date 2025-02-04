'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

// Update placeholder image path
const PLACEHOLDER_IMAGE = '/placeholder.svg';

// Helper functions for URL validation
const isValidUrl = (urlString: string): boolean => {
  try {
    if (!urlString) return false;
    if (urlString.startsWith('/')) return true;
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
};

const getValidUrl = (url: string, type: string, id: string): string => {
  if (!url) {
    return type === 'blog' ? `/posts/${id}` : '#';
  }
  if (url.startsWith('/')) return url;
  if (isValidUrl(url)) return url;
  return type === 'blog' ? `/posts/${id}` : '#';
};

interface TrendingItem {
  id: string;
  type: string;
  trendingOrder?: number;
  title?: string;
  description?: string;
  featuredImage?: string;
  videoUrl?: string;
  author?: {
    name: string;
    avatar: string;
  };
  views?: number;
  likes?: number;
}

interface TodayItem {
  id: string;
  title: string;
  time: string;
  type: 'event' | 'live' | 'new';
  description: string;
  mediaUrl: string;
  link: string;
}

export default function TrendingSection() {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [todayItem, setTodayItem] = useState<TodayItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchTrendingItems(),
      fetchEvent()
    ]).then(() => {
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching data:', error);
      setError('Failed to load content. Please try again later.');
      setLoading(false);
    });
  }, []);

  const fetchEvent = async () => {
    console.log('Starting to fetch event data...');
    try {
      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Query events collection for today's events
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef,
        where('date', '>=', today),
        orderBy('date', 'asc'),
        limit(1)
      );

      console.log('Querying events for today:', today);
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const eventDoc = querySnapshot.docs[0];
        const eventData = eventDoc.data() as TodayItem;
        console.log('Found event for today:', eventData);
        setTodayItem(eventData);
      } else {
        console.log('No events found for today');
        setTodayItem(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Detailed error fetching event:', {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(`Failed to load event data: ${errorMessage}`);
      setTodayItem(null);
    }
  };

  const fetchTrendingItems = async () => {
    try {
      const blogQuery = query(
        collection(db, 'blog_posts'),
        where('isTrending', '==', true),
        orderBy('trendingOrder', 'asc'),
        limit(5)
      );
      const blogSnapshot = await getDocs(blogQuery);
      const blogItems = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'blog'
      })) as TrendingItem[];

      const youtubeQuery = query(
        collection(db, 'youtube_videos'),
        where('isTrending', '==', true),
        orderBy('trendingOrder', 'asc'),
        limit(5)
      );
      const youtubeSnapshot = await getDocs(youtubeQuery);
      const youtubeItems = youtubeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'youtube'
      })) as TrendingItem[];

      const allItems = [...blogItems, ...youtubeItems].sort((a, b) => (a.trendingOrder ?? 0) - (b.trendingOrder ?? 0));
      setTrendingItems(allItems);
    } catch (error) {
      console.error('Error fetching trending items:', error);
      setError('Failed to load trending content');
      setTrendingItems([]);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + trendingItems.length) % trendingItems.length);
  };

  const NoContentDisplay = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center">
      <span className="material-icons-outlined text-5xl text-[#751731]/20 mb-4">event_busy</span>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#751731] mb-3">No Content Available</h2>
      <p className="text-gray-600 mb-6">Check out our events page for upcoming content and activities</p>
      <Link 
        href="/events"
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#751731] to-[#F4D165] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center"
      >
        View All Events
        <span className="material-icons-outlined ml-2">calendar_month</span>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <section className="relative py-8 sm:py-16 px-3 sm:px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#751731]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-8 sm:py-16 px-3 sm:px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center">
            <span className="material-icons-outlined text-5xl text-red-500/20 mb-4">error_outline</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-3">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                Promise.all([fetchTrendingItems(), fetchEvent()])
                  .then(() => setLoading(false))
                  .catch((error) => {
                    console.error('Error retrying fetch:', error);
                    setError('Failed to load content. Please try again later.');
                    setLoading(false);
                  });
              }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#751731] to-[#F4D165] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center"
            >
              Try Again
              <span className="material-icons-outlined ml-2">refresh</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (trendingItems.length === 0) {
    return (
      <section className="relative py-8 sm:py-16 px-3 sm:px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl">
          <NoContentDisplay />
        </div>
      </section>
    );
  }

  const currentItem = trendingItems[currentIndex];
  const imageUrl = currentItem?.featuredImage || '';
  const avatarUrl = currentItem?.author?.avatar || '';
  const linkUrl = getValidUrl(currentItem?.videoUrl || '', currentItem?.type || '', currentItem?.id || '');

  return (
    <section className="relative py-8 sm:py-16 px-3 sm:px-6 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="absolute top-0 right-0">
        <div className="relative">
          <div className="absolute -top-2 -right-2 w-24 h-24 sm:w-32 sm:h-32 bg-[#751731]/10 rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-[#F4D165]/10 rounded-full blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-[#751731]/10 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-[#751731] shadow-sm">
            What&apos;s Hot 🔥
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">
          Trending Now
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Trending Content */}
          <div className="flex-grow">
            <div className="relative">
              <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                <div className="relative h-[300px] sm:h-[400px] w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <div className="relative h-full w-full">
                        {!imageUrl ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#751731]/5 to-[#F4D165]/5">
                            <span className="material-icons-outlined text-4xl text-[#751731]/20 mb-3">event_busy</span>
                            <p className="text-gray-600 font-medium">No content available</p>
                            <Link 
                              href="/events"
                              className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-[#751731] to-[#F4D165] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                            >
                              View All Events
                            </Link>
                          </div>
                        ) : (
                          <Image
                            src={imageUrl}
                            alt={currentItem?.title || 'Trending content'}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                            <div className="flex items-center gap-2 mb-2 sm:mb-4">
                              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full overflow-hidden relative">
                                {!avatarUrl ? (
                                  <div className="w-full h-full bg-[#751731]/10 flex items-center justify-center">
                                    <span className="material-icons-outlined text-sm text-[#751731]/40">person</span>
                                  </div>
                                ) : (
                                  <Image
                                    src={avatarUrl}
                                    alt={currentItem?.author?.name || 'Author'}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <span className="text-white/90 text-xs sm:text-sm font-medium">
                                {currentItem?.author?.name || 'Anonymous'}
                              </span>
                            </div>
                            <Link 
                              href={linkUrl}
                              target={currentItem?.type === 'youtube' ? '_blank' : '_self'}
                              className="group"
                            >
                              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4 group-hover:text-[#F4D165] transition-colors">
                                {currentItem?.title || 'Untitled'}
                              </h3>
                              <p className="text-sm sm:text-base text-white/80 line-clamp-2 sm:line-clamp-3">
                                {currentItem?.description || 'No description available'}
                              </p>
                            </Link>
                            <div className="flex items-center gap-3 mt-3 sm:mt-6">
                              <span className="text-white/60 text-xs sm:text-sm">
                                {currentItem?.views || 0} views
                              </span>
                              <span className="text-white/60 text-xs sm:text-sm">
                                {currentItem?.likes || 0} likes
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:text-[#751731] transition-colors shadow-lg"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:text-[#751731] transition-colors shadow-lg"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex justify-center mt-4 sm:mt-8 gap-1 sm:gap-2">
              {trendingItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-[#751731] w-4 sm:w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Happening Today Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#751731]/10 shadow-lg overflow-hidden">
              {!todayItem || !todayItem.title ? (
                <div className="p-8 text-center">
                  <span className="material-icons-outlined text-4xl text-[#751731]/20 mb-3">event_busy</span>
                  <p className="text-gray-600">No events scheduled for today.</p>
                  <p className="text-sm text-gray-500 mt-1 mb-4">Check out our upcoming events!</p>
                  <Link 
                    href="/events"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#751731] to-[#F4D165] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    View All Events
                    <span className="material-icons-outlined ml-2 text-sm">
                      calendar_month
                    </span>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="relative h-48">
                    <Image
                      src={todayItem.mediaUrl || PLACEHOLDER_IMAGE}
                      alt={todayItem.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = PLACEHOLDER_IMAGE;
                        // If placeholder also fails, use a fallback background
                        target.onerror = () => {
                          target.style.backgroundColor = '#f3f4f6';
                          target.style.display = 'none';
                        };
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#751731]/10 shadow-sm">
                        <span className={`material-icons-outlined text-lg ${
                          todayItem.type === 'live' ? 'text-red-500 animate-pulse' :
                          todayItem.type === 'event' ? 'text-[#751731]' :
                          'text-[#F4D165]'
                        }`}>
                          {todayItem.type === 'live' ? 'live_tv' :
                           todayItem.type === 'event' ? 'event' :
                           'fiber_new'}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          Latest Event
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">
                        {todayItem.title}
                      </h3>
                      <span className="text-sm font-medium text-[#751731]">
                        {todayItem.time}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {todayItem.description}
                    </p>
                    <Link 
                      href={todayItem.link}
                      className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#751731] to-[#F4D165] text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                      {todayItem.type === 'live' ? 'Join Live Session' :
                       todayItem.type === 'event' ? 'Join Event' :
                       'View Resource'}
                      <span className="material-icons-outlined ml-2 text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 