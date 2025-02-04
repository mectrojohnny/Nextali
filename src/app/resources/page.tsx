'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc, increment } from 'firebase/firestore';
import { Resource } from '@/types/resource';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'error' | 'success') => {
    setNotification({ message, type });
  };

  const fetchResources = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'resources'), orderBy('createdAt', 'desc'))
      );
      
      const resourcesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      
      setResources(resourcesData);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(resourcesData.map(resource => resource.category))
      );
      setCategories(['all', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching resources:', error);
      showNotification('Failed to load resources', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (resource: Resource) => {
    try {
      await updateDoc(doc(db, 'resources', resource.id), {
        viewCount: increment(1)
      });
      
      if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank');
      }
    } catch (error) {
      console.error('Error updating view count:', error);
      showNotification('Failed to open resource', 'error');
    }
  };

  const handleDownload = async (resource: Resource) => {
    if (!resource.fileUrl) {
      showNotification('No file available for download', 'error');
      return;
    }

    try {
      await updateDoc(doc(db, 'resources', resource.id), {
        downloadCount: increment(1)
      });
      
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error updating download count:', error);
      showNotification('Failed to download resource', 'error');
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent mb-4">
            Business Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access our curated collection of resources designed to help African entrepreneurs and SMEs grow, innovate, and succeed in the global marketplace.
          </p>
        </motion.div>

        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#751731] text-white'
                    : 'bg-white text-gray-600 hover:bg-[#F4D165] hover:text-[#751731]'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#751731] focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#751731]"></div>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                variants={item}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                {resource.imageUrl ? (
                  <img
                    src={resource.imageUrl}
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-[#751731]/10 to-[#F4D165]/10 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">📚</span>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[#751731]">{resource.title}</h3>
                    <span className="px-3 py-1 bg-[#F4D165]/20 text-[#751731] text-sm rounded-full">
                      {resource.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>👁 {resource.viewCount || 0}</span>
                      {resource.isDownloadable && (
                        <span>⬇️ {resource.downloadCount || 0}</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(resource)}
                        className="px-4 py-2 bg-[#751731] text-white rounded-lg hover:bg-[#751731]/90 transition-colors"
                      >
                        View
                      </button>
                      {resource.isDownloadable && (
                        <button
                          onClick={() => handleDownload(resource)}
                          className="px-4 py-2 bg-[#F4D165] text-[#751731] font-medium rounded-lg hover:bg-[#F4D165]/90 transition-colors"
                        >
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No resources found matching your criteria.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 