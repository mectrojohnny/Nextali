'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  deleteDoc,
  updateDoc,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CommunityPost {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    isAdmin: boolean;
  };
  category: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  status: 'active' | 'hidden' | 'flagged';
  isPinned?: boolean;
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
}

export default function CommunityManagement() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'hidden' | 'flagged'>('all');
  const [category, setCategory] = useState('all');

  const categories = [
    'Support & Encouragement',
    'Symptoms & Management',
    'Lifestyle & Wellness',
    'Research & News',
    'Success Stories',
  ];

  useEffect(() => {
    fetchPosts();
  }, [filter, category]);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      let q = query(postsRef, orderBy('timestamp', 'desc'));

      if (filter !== 'all') {
        q = query(q, where('status', '==', filter));
      }

      if (category !== 'all') {
        q = query(q, where('category', '==', category));
      }

      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as CommunityPost[];

      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (postId: string, newStatus: CommunityPost['status']) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { status: newStatus });
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleTogglePin = async (post: CommunityPost) => {
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, { isPinned: !post.isPinned });
      
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === post.id ? { ...p, isPinned: !p.isPinned } : p
        )
      );
    } catch (error) {
      console.error('Error toggling pin status:', error);
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
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
            <option value="flagged">Flagged</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-600">
          {posts.length} post{posts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-gray-900">
                      {post.author.name}
                    </p>
                    {post.author.isAdmin && (
                      <span className="ml-2 px-2 py-0.5 bg-[#803C9A]/10 text-[#803C9A] rounded-full text-xs">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{new Date(post.timestamp).toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      post.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : post.status === 'hidden'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTogglePin(post)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.isPinned
                      ? 'text-[#803C9A] bg-[#803C9A]/10'
                      : 'text-gray-400 hover:text-[#803C9A] hover:bg-[#803C9A]/10'
                  }`}
                >
                  <span className="material-icons-outlined">push_pin</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(post.id, post.status === 'active' ? 'hidden' : 'active')}
                  className="p-2 text-gray-400 hover:text-[#803C9A] hover:bg-[#803C9A]/10 rounded-lg transition-colors"
                >
                  <span className="material-icons-outlined">
                    {post.status === 'active' ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span className="material-icons-outlined">delete</span>
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-800">{post.content}</p>
            </div>

            {/* Post Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="material-icons-outlined text-base">favorite</span>
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="material-icons-outlined text-base">chat_bubble</span>
                  <span>{post.comments.length}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#803C9A]/10 text-[#803C9A] rounded-full text-xs">
                {post.category}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons-outlined text-6xl text-gray-300 mb-4">
              forum
            </span>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No community posts available'
                : `No ${filter} posts ${
                    category !== 'all' ? `in ${category}` : ''
                  }`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 