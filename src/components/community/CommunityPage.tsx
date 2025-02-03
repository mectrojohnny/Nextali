"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommentSection from './CommentSection';
import CategorySidebar from './CategorySidebar';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Avatar from '@/components/Avatar';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp, 
  getDoc,
  setDoc
} from 'firebase/firestore';
import { logger } from '@/utils/logger';
import SocialMediaLinks from './SocialMediaLinks';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isAdmin: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  isPinned?: boolean;
  category: string;
}

interface Comment {
  id: string;
  author: {
    name: string; 
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

interface UserDetails {
  name: string;
  email: string;
  isAnonymous: boolean;
}

interface FirebasePost extends Omit<Post, 'timestamp'> {
  timestamp: Timestamp;
}

const categories = [
  { id: 'innovation', name: 'Business Innovation', icon: 'lightbulb', count: 24 },
  { id: 'african-enterprise', name: 'African Enterprise', icon: 'business', count: 18 },
  { id: 'technology', name: 'Technology', icon: 'computer', count: 15 },
  { id: 'research', name: 'Research & Insights', icon: 'analytics', count: 12 },
  { id: 'success', name: 'Success Stories', icon: 'stars', count: 9 },
  { id: 'skills', name: 'Skills Development', icon: 'school', count: 14 },
  { id: 'market', name: 'Market Insights', icon: 'trending_up', count: 16 },
  { id: 'community', name: 'Community', icon: 'people', count: 20 },
];

const defaultPinnedPost: Post = {
  id: 'pinned',
  author: {
    name: 'Chena G.',
    avatar: 'nextali-logo.jpg',
    isAdmin: true,
  },
  content: `Welcome to NextHub! This is your space to connect, collaborate, and grow with Africa&apos;s most innovative entrepreneurs and SMEs. Share your business insights, seek guidance, and be part of building Africa&apos;s next generation of successful businesses. 🌍✨`,
  timestamp: new Date(),
  likes: 156,
  isLiked: false,
  comments: [],
  isPinned: true,
  category: 'all',
};

export default function CommunityPage() {
  const { theme } = useTheme();
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    isAnonymous: false
  });
  const [posts, setPosts] = useState<Post[]>([defaultPinnedPost]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const initializePosts = async () => {
      try {
        // Fetch all posts except pinned
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedPosts = querySnapshot.docs.map(doc => {
          const data = doc.data() as FirebasePost;
          return {
            ...data,
            id: doc.id,
            timestamp: data.timestamp.toDate(),
          } as Post;
        }).filter(post => post.id !== 'pinned'); // Exclude any pinned post from database

        setPosts([defaultPinnedPost, ...fetchedPosts]);
      } catch (error) {
        console.error('Error initializing posts:', error);
      }
    };

    initializePosts();
  }, []);

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    if (!userDetails.isAnonymous && (!userDetails.name || !userDetails.email)) {
      setShowUserDetails(true);
      return;
    }

    try {
      const post = {
        author: {
          name: userDetails.isAnonymous ? 'Anonymous User' : userDetails.name,
          avatar: '/avatars/default.jpg',
          isAdmin: false,
        },
        content: newPost,
        timestamp: Timestamp.now(),
        likes: 0,
        isLiked: false,
        comments: [],
        category: selectedCategory === 'all' ? 'support' : selectedCategory,
      };

      const docRef = await addDoc(collection(db, 'posts'), post);
      
      setPosts(prevPosts => [{
        ...post,
        id: docRef.id,
        timestamp: post.timestamp.toDate(),
      } as Post, ...prevPosts]);

      setNewPost('');
      setShowUserDetails(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
      await updateDoc(postRef, {
        likes: newLikes,
        isLiked: !post.isLiked,
      });

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: newLikes,
            isLiked: !post.isLiked,
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newComment = {
        id: Date.now().toString(),
        author: {
          name: 'Current User',
          avatar: '/avatars/default.jpg',
        },
        content,
        timestamp: Timestamp.now(),
        likes: 0,
        isLiked: false,
      };

      await updateDoc(postRef, {
        comments: [...post.comments, newComment],
      });

      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              ...newComment,
              timestamp: newComment.timestamp.toDate(),
            }],
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (postId: string, commentId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const updatedComments = post.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        return comment;
      });

      await updateDoc(postRef, {
        comments: updatedComments,
      });

      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: updatedComments };
        }
        return p;
      }));
    } catch (error) {
      console.error('Error updating comment like:', error);
    }
  };

  const filteredPosts = posts.filter(post => 
    (selectedCategory === 'all' || post.category === selectedCategory || post.isPinned) &&
    (post.isPinned || isSameDay(post.timestamp, selectedDate))
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const pinnedPost = sortedPosts.find(post => post.isPinned);
  const regularPosts = sortedPosts.filter(post => !post.isPinned);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex">
        {/* Sidebar */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col min-h-0">
          <main className={`flex-grow transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-gradient-to-b from-gray-900 via-[#751731]/30 to-gray-900' 
              : 'bg-gradient-to-b from-white via-[#751731]/5 to-white'
          }`}>
            {/* Main Content */}
            <div className="ml-0 md:ml-80 flex-1">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Header Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8 sm:mb-12 pt-8 sm:pt-16"
                >
                  <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">
                    NextHub
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                    Connect, collaborate, and grow with Africa's next generation of successful entrepreneurs
                  </p>
                </motion.div>

                {/* Posts Feed */}
                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-16">
                  {/* Date, Category, and Pinned Post Section */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-[#751731]/20 dark:border-[#751731]/40 mb-4 sm:mb-8">
                    {/* Social Media Links - Moved to top */}
                    <SocialMediaLinks />

                    {/* Pinned Message */}
                    {pinnedPost && (
                      <div className="mt-4 border-t border-[#751731]/20 dark:border-[#751731]/40 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                          <div className="flex items-center">
                            <Avatar 
                              src={`/images/avatars/${pinnedPost.author.avatar}`}
                              alt={pinnedPost.author.name}
                              size="md"
                            />
                            <div className="ml-3 sm:ml-4">
                              <div className="flex items-center">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                                  {pinnedPost.author.name}
                                </h3>
                              </div>
                              <p className="text-xs sm:text-sm text-[#751731] dark:text-[#F4D165] font-medium">
                                Nextali Founder
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-[#751731] dark:text-[#F4D165] text-sm sm:text-base">
                            <span className="material-icons-outlined mr-1 sm:mr-2">push_pin</span>
                            <span className="font-medium">Pinned Message</span>
                          </div>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-lg leading-relaxed">
                          {pinnedPost.content}
                        </p>
                      </div>
                    )}

                    <div className="text-center mb-4 sm:mb-6">
                      <div className="flex items-center justify-center mb-2 sm:mb-3">
                        <span className="material-icons-outlined text-2xl sm:text-3xl bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent mr-2">
                          {selectedCategory === 'all' ? 'forum' : categories.find(c => c.id === selectedCategory)?.icon || 'forum'}
                        </span>
                        <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">
                          {selectedCategory === 'all' ? 'All Community Stories' : categories.find(c => c.id === selectedCategory)?.name || 'Community Stories'}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
                        {selectedCategory === 'all' 
                          ? 'Explore insights and experiences shared by African entrepreneurs and business leaders'
                          : `Browse posts about ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase() || '&apos;business topics&apos;'}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const prevDate = new Date(selectedDate);
                          prevDate.setDate(prevDate.getDate() - 1);
                          setSelectedDate(prevDate);
                        }}
                        className="p-2 rounded-full bg-[#751731]/10 dark:bg-[#751731]/30 hover:bg-[#751731]/20 dark:hover:bg-[#751731]/40 transition-all text-[#751731] dark:text-[#F4D165]"
                      >
                        <span className="material-icons-outlined text-sm sm:text-base">chevron_left</span>
                      </motion.button>

                      <div className="bg-[#751731]/10 dark:bg-[#751731]/30 rounded-xl px-3 sm:px-6 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3">
                        <span className="material-icons-outlined text-[#751731] dark:text-[#F4D165] text-sm sm:text-base">
                          calendar_today
                        </span>
                        <input
                          type="date"
                          value={selectedDate.toISOString().split('T')[0]}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value);
                            if (newDate <= new Date()) {
                              setSelectedDate(newDate);
                            }
                          }}
                          max={new Date().toISOString().split('T')[0]}
                          className="bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-100 font-medium text-sm sm:text-base w-[120px] sm:w-auto"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const nextDate = new Date(selectedDate);
                          nextDate.setDate(nextDate.getDate() + 1);
                          if (nextDate <= new Date()) {
                            setSelectedDate(nextDate);
                          }
                        }}
                        disabled={selectedDate.toDateString() === new Date().toDateString()}
                        className={`p-2 rounded-full transition-all ${
                          selectedDate.toDateString() === new Date().toDateString()
                            ? 'bg-[#751731]/5 dark:bg-[#751731]/10 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'bg-[#751731]/10 dark:bg-[#751731]/30 hover:bg-[#751731]/20 dark:hover:bg-[#751731]/40 text-[#751731] dark:text-[#F4D165]'
                        }`}
                      >
                        <span className="material-icons-outlined text-sm sm:text-base">chevron_right</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(new Date())}
                        className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-[#751731] to-[#F4D165] text-white font-medium text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        Today&apos;s Posts
                      </motion.button>
                    </div>

                    <div className="text-center">
                      <p className="text-xs sm:text-base font-medium text-[#751731] dark:text-[#F4D165]">
                        {selectedDate.toLocaleDateString() === new Date().toLocaleDateString() 
                          ? `Viewing today's ${selectedCategory === 'all' ? 'community posts' : categories.find(c => c.id === selectedCategory)?.name.toLowerCase() || 'posts'}`
                          : `Viewing ${selectedCategory === 'all' ? 'community posts' : categories.find(c => c.id === selectedCategory)?.name.toLowerCase() || 'posts'} from ${selectedDate.toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  {/* Regular Posts */}
                  {regularPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-[#751731]/20 dark:border-[#751731]/40"
                    >
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#751731] to-[#F4D165] flex items-center justify-center text-white text-sm sm:text-base">
                          {post.author.name[0]}
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                              {post.author.name}
                            </h3>
                            {post.author.isAdmin && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-[#751731]/10 dark:bg-[#751731]/30 text-[#751731] dark:text-[#F4D165] rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <span>{post.timestamp.toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span className="text-[#751731] dark:text-[#F4D165]">
                              {categories.find(c => c.id === post.category)?.name || 'General'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 text-sm sm:text-base">{post.content}</p>

                      <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        <motion.button
                          onClick={() => handleLikePost(post.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`flex items-center space-x-1 sm:space-x-2 ${
                            post.isLiked ? 'text-[#751731] dark:text-[#F4D165]' : ''
                          }`}
                        >
                          <span className="material-icons-outlined text-sm sm:text-base">
                            {post.isLiked ? 'favorite' : 'favorite_border'}
                          </span>
                          <span>{post.likes}</span>
                        </motion.button>
                        <motion.button 
                          className="flex items-center space-x-1 sm:space-x-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="material-icons-outlined text-sm sm:text-base">chat_bubble_outline</span>
                          <span>{post.comments.length}</span>
                        </motion.button>
                      </div>

                      {/* Comment Section */}
                      <CommentSection
                        comments={post.comments}
                        postId={post.id}
                        onAddComment={handleAddComment}
                        onLikeComment={handleLikeComment}
                      />
                    </motion.div>
                  ))}

                  {/* Create Post Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-[#751731]/20 dark:border-[#751731]/40 mb-4 sm:mb-8 mt-6 sm:mt-12"
                  >
                    {showUserDetails ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#751731]/5 dark:bg-[#751731]/10 rounded-lg"
                      >
                        <h3 className="text-base sm:text-lg font-medium text-[#751731] dark:text-[#F4D165] mb-3 sm:mb-4">
                          Your Details
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={userDetails.name}
                              onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-[#751731]/20 dark:border-[#751731]/40 rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-transparent bg-transparent dark:bg-gray-700/50 dark:text-white text-sm sm:text-base"
                              placeholder="Your name"
                              disabled={userDetails.isAnonymous}
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={userDetails.email}
                              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-[#751731]/20 dark:border-[#751731]/40 rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-transparent bg-transparent dark:bg-gray-700/50 dark:text-white text-sm sm:text-base"
                              placeholder="Your email"
                              disabled={userDetails.isAnonymous}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userDetails.isAnonymous}
                                onChange={(e) => setUserDetails({ 
                                  ...userDetails, 
                                  isAnonymous: e.target.checked,
                                  name: e.target.checked ? '' : userDetails.name,
                                  email: e.target.checked ? '' : userDetails.email
                                })}
                                className="form-checkbox h-3 w-3 sm:h-4 sm:w-4 text-[#751731] rounded border-[#751731]/20"
                              />
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Post anonymously</span>
                            </label>
                            <button
                              onClick={() => setShowUserDetails(false)}
                              className="text-xs sm:text-sm text-[#751731] dark:text-[#F4D165] hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#751731] to-[#F4D165] flex items-center justify-center text-white text-sm sm:text-base">
                          {userDetails.isAnonymous ? 'A' : (userDetails.name ? userDetails.name[0] : 'C')}
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {userDetails.isAnonymous ? 'Anonymous User' : (userDetails.name || 'Create a Post')}
                          </h3>
                          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <p>Share your thoughts and expertise in </p>
                            <span className="mx-1 text-[#751731] dark:text-[#F4D165] font-medium">
                              {selectedCategory === 'all' ? 'Support & Encouragement' : categories.find(c => c.id === selectedCategory)?.name || 'Support & Encouragement'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="w-full p-3 sm:p-4 border border-[#751731]/20 dark:border-[#751731]/40 rounded-xl focus:ring-2 focus:ring-[#751731] focus:border-transparent resize-none bg-transparent dark:bg-gray-700/50 dark:text-white text-sm sm:text-base"
                      placeholder="Share your business insights, ask questions, or connect with fellow entrepreneurs in our growing community..."
                      rows={3}
                    />
                    <div className="mt-3 sm:mt-4 flex justify-end items-center">
                      <motion.button 
                        onClick={handleCreatePost}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-[#751731] to-[#F4D165] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                      >
                        <span className="material-icons-outlined text-sm sm:text-base">send</span>
                        <span>Share Post</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </main>
          <div className="ml-0 md:ml-80">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
} 