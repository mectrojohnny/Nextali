'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getBlogPost, createBlogPost, updateBlogPost } from '@/lib/blog';
import type { BlogPost, BlogFormData } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/types/blog';
import { logger } from '@/utils/logger';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const initialFormData: BlogFormData = {
  title: '',
  content: '',
  excerpt: '',
  featuredImage: '',
  category: [],
  tags: [],
  status: 'draft',
  layout: 'classic'
};

export default function BlogPostForm() {
  const router = useRouter();
  const params = useParams();
  const isEditing = params.action === 'edit';

  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEditing && params.slug) {
      fetchPost(params.slug as string);
    }
  }, [isEditing, params.slug]);

  const fetchPost = async (slug: string) => {
    try {
      const post = await getBlogPost(slug);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        category: post.category,
        tags: post.tags,
        status: post.status,
        layout: post.layout
      });
    } catch (error) {
      logger.error('Error fetching post:', error);
      router.push('/admin/posts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && params.slug) {
        await updateBlogPost(params.slug as string, formData);
      } else {
        await createBlogPost(formData);
      }
      router.push('/admin/posts');
    } catch (error) {
      logger.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
              required
            />
          </div>

          {/* Layout */}
          <div>
            <label htmlFor="layout" className="block text-sm font-medium text-gray-700">
              Layout Template
            </label>
            <select
              id="layout"
              value={formData.layout}
              onChange={(e) => setFormData(prev => ({ ...prev, layout: e.target.value as BlogPost['layout'] }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="magazine">Magazine</option>
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
              required
            />
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
              Featured Image URL
            </label>
            <input
              type="url"
              id="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
              required
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    const newCategories = formData.category.includes(category)
                      ? formData.category.filter(c => c !== category)
                      : [...formData.category, category];
                    setFormData(prev => ({ ...prev, category: newCategories }));
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.category.includes(category)
                      ? 'bg-[#803C9A] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Press Enter to add tags"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-[#803C9A]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-[#803C9A] hover:text-[#FA4B99]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="mt-1">
              <ReactQuill
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                className="h-64 mb-12"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-[#803C9A] to-[#FA4B99] text-white rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 