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
  addDoc,
  updateDoc,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaYoutube, FaComments, FaBlog, FaNewspaper, FaBullhorn } from 'react-icons/fa';
import { getValidImageSrc, isValidUrl } from '@/utils/imageUtils';

interface TrendingItem {
  id: string;
  type: 'blog' | 'youtube' | 'social' | 'news' | 'announcement';
  title: string;
  description: string;
  image: string;
  link: string;
  date: Date;
  views?: number;
  likes?: number;
  isTrending: boolean;
  order?: number;
  author?: {
    name: string;
    avatar: string;
  };
}

interface NewItemForm {
  type: TrendingItem['type'];
  title: string;
  description: string;
  image: string;
  link: string;
  author: {
    name: string;
    avatar: string;
  };
}

const INITIAL_FORM: NewItemForm = {
  type: 'news',
  title: '',
  description: '',
  image: '',
  link: '',
  author: {
    name: '',
    avatar: ''
  }
};

export default function TrendingManagement() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [newItem, setNewItem] = useState<NewItemForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      // Fetch blog posts
      const postsRef = collection(db, 'blog_posts');
      const postsQuery = query(postsRef, orderBy('publishedAt', 'desc'));
      const postsSnapshot = await getDocs(postsQuery);
      
      const blogPosts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'blog' as const,
        title: doc.data().title || 'Untitled Post',
        description: doc.data().excerpt || '',
        image: getValidImageSrc(doc.data().featuredImage),
        link: `/posts/${doc.id}`,
        date: doc.data().publishedAt?.toDate() || new Date(),
        views: doc.data().views || 0,
        likes: doc.data().likes || 0,
        isTrending: doc.data().isTrending || false,
        order: doc.data().trendingOrder,
        author: {
          name: doc.data().author?.name || 'Anonymous',
          avatar: getValidImageSrc(doc.data().author?.avatar || '/images/placeholder.jpg')
        },
      }));

      // Fetch YouTube videos
      const youtubeRef = collection(db, 'youtube_videos');
      const youtubeQuery = query(youtubeRef, orderBy('publishedAt', 'desc'));
      const youtubeSnapshot = await getDocs(youtubeQuery);

      const youtubeVideos = youtubeSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'youtube' as const,
        title: doc.data().title || 'Untitled Video',
        description: doc.data().description || '',
        image: getValidImageSrc(doc.data().thumbnail),
        link: doc.data().videoUrl || '#',
        date: doc.data().publishedAt?.toDate() || new Date(),
        views: doc.data().views || 0,
        isTrending: doc.data().isTrending || false,
        order: doc.data().trendingOrder,
        author: {
          name: 'Dr. Dolly',
          avatar: getValidImageSrc('/images/avatars/drdolly.jpg')
        },
      }));

      // Add fetching for news and announcements
      const newsRef = collection(db, 'news');
      const newsQuery = query(newsRef, orderBy('publishedAt', 'desc'));
      const newsSnapshot = await getDocs(newsQuery);

      const newsItems = newsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'news' as const,
        title: doc.data().title || 'Untitled News',
        description: doc.data().content || '',
        image: getValidImageSrc(doc.data().image),
        link: doc.data().link || '#',
        date: doc.data().publishedAt?.toDate() || new Date(),
        views: doc.data().views || 0,
        isTrending: doc.data().isTrending || false,
        order: doc.data().trendingOrder,
        author: {
          name: doc.data().author?.name || 'Anonymous',
          avatar: getValidImageSrc(doc.data().author?.avatar || '/images/placeholder.jpg')
        },
      }));

      const announcementsRef = collection(db, 'announcements');
      const announcementsQuery = query(announcementsRef, orderBy('publishedAt', 'desc'));
      const announcementsSnapshot = await getDocs(announcementsQuery);

      const announcements = announcementsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'announcement' as const,
        title: doc.data().title || 'Untitled Announcement',
        description: doc.data().content || '',
        image: getValidImageSrc(doc.data().image),
        link: doc.data().link || '#',
        date: doc.data().publishedAt?.toDate() || new Date(),
        views: doc.data().views || 0,
        isTrending: doc.data().isTrending || false,
        order: doc.data().trendingOrder,
        author: {
          name: doc.data().author?.name || 'Anonymous',
          avatar: getValidImageSrc(doc.data().author?.avatar || '/images/placeholder.jpg')
        },
      }));

      // Combine all content types
      const allContent = [...blogPosts, ...youtubeVideos, ...newsItems, ...announcements].sort((a, b) => {
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        if (a.isTrending && b.isTrending) {
          return (a.order ?? 0) - (b.order ?? 0);
        }
        return b.date.getTime() - a.date.getTime();
      });

      setItems(allContent);
      
      // Set initially selected items
      const initialSelected = new Set(
        allContent.filter(item => item.isTrending).map(item => item.id)
      );
      setSelectedItems(initialSelected);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const handleNewItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Validate required fields
      if (!newItem.title || !newItem.description || !newItem.image) {
        throw new Error('Please fill in all required fields');
      }

      // Validate image URL
      if (!isValidUrl(newItem.image)) {
        throw new Error('Please enter a valid image URL');
      }

      // Determine collection based on type
      let collectionName: string;
      switch (newItem.type) {
        case 'news':
          collectionName = 'news';
          break;
        case 'announcement':
          collectionName = 'announcements';
          break;
        case 'youtube':
          collectionName = 'youtube_videos';
          break;
        case 'social':
          collectionName = 'social_posts';
          break;
        default:
          throw new Error('Invalid content type');
      }

      // Create the new item
      const itemData = {
        title: newItem.title,
        description: newItem.type === 'news' || newItem.type === 'announcement' ? newItem.description : '',
        content: newItem.type === 'news' || newItem.type === 'announcement' ? newItem.description : '',
        excerpt: '',
        image: newItem.image,
        thumbnail: newItem.type === 'youtube' ? newItem.image : undefined,
        link: newItem.link,
        videoUrl: newItem.type === 'youtube' ? newItem.link : undefined,
        publishedAt: Timestamp.now(),
        author: newItem.author,
        isTrending: true,
        trendingOrder: selectedItems.size,
        views: 0,
        likes: 0,
        updatedAt: Timestamp.now()
      };

      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, itemData);

      // Update the items list
      setItems(prev => [...prev, {
        id: docRef.id,
        type: newItem.type,
        title: newItem.title,
        description: newItem.description,
        image: newItem.image,
        link: newItem.link,
        date: new Date(),
        views: 0,
        likes: 0,
        isTrending: true,
        order: selectedItems.size,
        author: newItem.author
      }]);

      // Reset form
      setNewItem(INITIAL_FORM);
      setShowNewItemForm(false);
      await fetchAllContent(); // Refresh the list
    } catch (error) {
      console.error('Error creating new item:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleItemSelection = async (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      if (newSelected.size >= 5) {
        alert('You can only select up to 5 trending items');
        return;
      }
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);

    // Update item's trending status in Firestore
    const item = items.find(i => i.id === itemId);
    if (item) {
      try {
        const collectionName = item.type === 'blog' ? 'blog_posts' : 'youtube_videos';
        const itemRef = doc(db, collectionName, itemId);
        await updateDoc(itemRef, {
          isTrending: newSelected.has(itemId),
          trendingOrder: newSelected.has(itemId) ? Array.from(newSelected).indexOf(itemId) : null,
          updatedAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Error updating trending status:', error);
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <FaYoutube className="w-6 h-6 text-red-500" />;
      case 'social':
        return <FaComments className="w-6 h-6 text-[#803C9A]" />;
      case 'news':
        return <FaNewspaper className="w-6 h-6 text-blue-500" />;
      case 'announcement':
        return <FaBullhorn className="w-6 h-6 text-yellow-500" />;
      default:
        return <FaBlog className="w-6 h-6 text-[#FA4B99]" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-purple-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
                Manage Trending Content
              </h1>
              <p className="text-gray-600 mt-2">
                Select up to 5 items to display in the trending section
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-full shadow-md">
                <span className="text-[#803C9A] font-medium">
                  {selectedItems.size} / 5 selected
                </span>
              </div>
              <button
                onClick={() => setShowNewItemForm(true)}
                className="bg-[#FA4B99] text-white px-6 py-2 rounded-full hover:bg-[#803C9A] transition-colors"
              >
                Add New Item
              </button>
            </div>
          </motion.div>
        </div>

        {/* New Item Form Modal */}
        {showNewItemForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4"
            >
              <h2 className="text-2xl font-bold mb-6">Add New Trending Item</h2>
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleNewItemSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as TrendingItem['type'] }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
                  >
                    <option value="news">News</option>
                    <option value="announcement">Announcement</option>
                    <option value="youtube">YouTube Video</option>
                    <option value="social">Social Media Post</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={newItem.image}
                    onChange={(e) => setNewItem(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link {newItem.type === 'youtube' ? '(YouTube URL) *' : ''}
                  </label>
                  <input
                    type="url"
                    value={newItem.link}
                    onChange={(e) => setNewItem(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
                    required={newItem.type === 'youtube'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={newItem.author.name}
                    onChange={(e) => setNewItem(prev => ({ 
                      ...prev, 
                      author: { ...prev.author, name: e.target.value }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author Avatar URL
                  </label>
                  <input
                    type="url"
                    value={newItem.author.avatar}
                    onChange={(e) => setNewItem(prev => ({ 
                      ...prev, 
                      author: { ...prev.author, avatar: e.target.value }
                    }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewItemForm(false)}
                    className="px-6 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#FA4B99] text-white hover:bg-[#803C9A] transition-colors disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Existing Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-xl overflow-hidden shadow-md transition-all ${
                selectedItems.has(item.id)
                  ? 'ring-2 ring-[#FA4B99] transform scale-[1.02]'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className="relative h-48">
                <Image
                  src={getValidImageSrc(item.image)}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {getTypeIcon(item.type)}
                  <span className="text-white text-sm">
                    {item.type === 'youtube' ? 'YouTube' : 
                     item.type === 'social' ? 'Community' : 'Blog Post'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={getValidImageSrc(item.author?.avatar || '/images/placeholder.jpg')}
                      alt={item.author?.name || 'Author'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.author?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {item.views && (
                      <div className="flex items-center">
                        <span className="material-icons-outlined text-sm mr-1">visibility</span>
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                    )}
                    {item.likes && (
                      <div className="flex items-center">
                        <span className="material-icons-outlined text-sm mr-1">favorite</span>
                        <span>{item.likes.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleItemSelection(item.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedItems.has(item.id)
                        ? 'bg-[#FA4B99] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {selectedItems.has(item.id) ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 