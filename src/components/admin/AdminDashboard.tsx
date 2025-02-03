'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogManagement from './BlogManagement';
import CommunityManagement from './CommunityManagement';
import CommentModeration from './CommentModeration';
import TrendingManagement from './TrendingManagement';
import SocialMediaManagement from './SocialMediaManagement';
import IntroVideoManagement from './IntroVideoManagement';
import TodayEventManagement from './TodayEventManagement';
import ResourcesManagement from './ResourcesManagement';

type AdminSection = 'posts' | 'community' | 'comments' | 'analytics' | 'trending' | 'social' | 'intro' | 'today' | 'resources';

const ADMIN_EMAILS = ['akalagborojohn@gmail.com', 'dollymediateam@gmail.com'];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>('posts');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = auth.currentUser;
        console.log('Current user:', user?.email);
        
        if (!user) {
          console.log('No user logged in');
          router.push('/login?redirect=/admin');
          return;
        }

        const isUserAdmin = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;
        console.log('Is admin?', isUserAdmin);

        setIsAdmin(isUserAdmin);
        setLoading(false);

        if (!isUserAdmin) {
          console.log('User is not admin');
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/');
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed. User:', user?.email);
      if (user) {
        checkAdminStatus();
      } else {
        router.push('/login?redirect=/admin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Router will handle redirect
  }

  const navigationGroups = [
    {
      title: "Content Management",
      items: [
        { id: 'posts', label: 'Blog Management', icon: 'article' },
        { id: 'trending', label: 'Trending Content', icon: 'trending_up' },
        { id: 'today', label: 'Happening Today', icon: 'today' },
        { id: 'resources', label: 'Resources', icon: 'library_books' }
      ]
    },
    {
      title: "Media",
      items: [
        { id: 'intro', label: 'Intro Video', icon: 'play_circle' },
      ]
    },
    {
      title: "Community",
      items: [
        { id: 'community', label: 'Community Management', icon: 'group' },
        { id: 'comments', label: 'Comment Moderation', icon: 'comment' },
      ]
    },
    {
      title: "Settings & Analytics",
      items: [
        { id: 'social', label: 'Social Media Links', icon: 'share' },
        { id: 'analytics', label: 'Analytics', icon: 'analytics' },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
      <Header />
      <main className="flex-grow pt-24 pb-16 flex">
        {/* Left Sidebar Navigation */}
        <div className="w-64 flex-shrink-0 pr-4 border-r border-purple-100">
          <div className="sticky top-24">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#803C9A]/10 via-[#9C27B0]/5 to-[#E91E63]/10 blur-xl rounded-2xl" />
              <h1 className="relative text-2xl font-bold bg-gradient-to-r from-[#803C9A] via-[#9C27B0] to-[#E91E63] bg-clip-text text-transparent px-4 mb-6">
                Admin Dashboard
              </h1>
            </div>
            <nav className="space-y-8">
              {navigationGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#803C9A]/5 to-transparent rounded-lg" />
                    <h2 className="relative text-sm font-semibold text-[#803C9A] uppercase tracking-wider px-4">
                      {group.title}
                    </h2>
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as AdminSection)}
                        className={`flex items-center w-full space-x-2 px-4 py-2.5 text-sm transition-all duration-300 ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-[#803C9A] via-[#9C27B0] to-[#E91E63] text-white shadow-lg shadow-purple-200'
                            : 'hover:bg-white/80 hover:shadow-md hover:scale-[1.02] text-gray-700'
                        } rounded-xl`}
                      >
                        <span className="material-icons-outlined text-[20px]">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow pl-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 rounded-2xl" />
            <div className="relative">
              {activeSection === 'posts' && <BlogManagement />}
              {activeSection === 'trending' && <TrendingManagement />}
              {activeSection === 'today' && <TodayEventManagement />}
              {activeSection === 'community' && <CommunityManagement />}
              {activeSection === 'comments' && <CommentModeration />}
              {activeSection === 'social' && <SocialMediaManagement />}
              {activeSection === 'intro' && <IntroVideoManagement />}
              {activeSection === 'resources' && <ResourcesManagement />}
              {activeSection === 'analytics' && (
                <div className="text-center py-12">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-[#803C9A]/5 via-[#9C27B0]/5 to-[#E91E63]/5 blur-xl rounded-full" />
                    <span className="relative material-icons-outlined text-6xl bg-gradient-to-br from-[#803C9A] to-[#E91E63] bg-clip-text text-transparent mb-4">
                      analytics
                    </span>
                  </div>
                  <h3 className="text-xl font-medium bg-gradient-to-r from-[#803C9A] to-[#E91E63] bg-clip-text text-transparent mb-2">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    This feature is currently under development.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 