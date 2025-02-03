'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPublicBlogPosts } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from './BlogCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogCategory, BLOG_CATEGORIES } from '@/types/types';

// Use the type directly from types.ts
type CategoryWithAll = BlogCategory | 'All';
const allCategories: CategoryWithAll[] = ['All', ...BLOG_CATEGORIES];

interface BlogPageProps {
  initialCategory?: CategoryWithAll;
  initialTag?: string;
  initialSearch?: string;
}

export default function BlogPage({ 
  initialCategory = 'All',
  initialTag = '',
  initialSearch = ''
}: BlogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithAll>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const options: Parameters<typeof getPublicBlogPosts>[0] = {
          limit: 50
        };

        if (selectedCategory !== 'All') {
          options.category = selectedCategory;
        }

        if (initialTag) {
          options.tag = initialTag;
        }

        const fetchedPosts = await getPublicBlogPosts(options);
        
        // Filter by search query if present
        const filteredPosts = searchQuery
          ? fetchedPosts.filter(post =>
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
              post.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
            )
          : fetchedPosts;

        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, searchQuery, initialTag]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/posts${newUrl}`, { scroll: false });
  }, [selectedCategory, searchQuery, router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-16"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent mb-4">
              Our Blog
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Discover insights, stories, and expert advice on empowering African businesses
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between px-4 sm:px-0">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 pl-9 sm:pl-10 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-transparent"
                />
                <span className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 material-icons-outlined text-gray-400 text-base sm:text-lg">
                  search
                </span>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-[#751731] to-[#F4D165] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#751731] to-[#F4D165] text-white rounded-lg hover:opacity-90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#751731]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-0">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <span className="material-icons-outlined text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4">
                article
              </span>
              <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-1 sm:mb-2">No posts found</h3>
              <p className="text-sm sm:text-base text-gray-500">
                {searchQuery
                  ? `No posts matching "${searchQuery}"`
                  : selectedCategory === 'All'
                  ? 'No posts available'
                  : `No posts in ${selectedCategory}`}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 