'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllBlogPosts, deleteBlogPost } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import { logger } from '@/utils/logger';
import { formatDate } from '@/utils/date';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getAllBlogPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      logger.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deleteBlogPost(post.id);
      await fetchPosts();
    } catch (error) {
      logger.error('Error deleting post:', error);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <button
            onClick={() => router.push('/admin/posts/new')}
            className="px-4 py-2 bg-gradient-to-r from-[#803C9A] to-[#FA4B99] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Create New Post
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id}>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {post.title}
                    </h3>
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">
                        {formatDate(post.publishedAt)} • {post.author.name} • {post.status}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.category.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-1 text-xs rounded-full bg-purple-100 text-[#803C9A]"
                          >
                            {cat}
                          </span>
                        ))}
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push(`/admin/posts/edit/${post.slug}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 