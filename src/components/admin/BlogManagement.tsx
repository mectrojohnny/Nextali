'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  deleteDoc,
  addDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { uploadFile } from '@/lib/cloudinary';
import { BlogCategory, BLOG_CATEGORIES } from '@/types/types';

// Dynamic import of the rich text editor
const Editor = dynamic(() => import('@/components/Editor'), { 
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">Loading editor...</div>
});

// Import ImageGallery component
const ImageGallery = dynamic(() => import('./ImageGallery'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center">Loading gallery...</div>
});

const isValidImageUrl = (url: string) => {
  if (!url) return false;
  try {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  } catch {
    return false;
  }
};

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: BlogCategory[];
  tags: string[];
  status: 'draft' | 'published';
  publishedAt: Date;
  author: {
    name: string;
    avatar: string;
  };
  slug: string;
  coverImage?: string;
}

// Use the categories from types.ts
const CATEGORIES = BLOG_CATEGORIES;

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  coverImage: string;
  category: BlogCategory[];
  tags: string[];
  status: 'draft' | 'published';
}

const initialFormData: FormData = {
  title: '',
  content: '',
  excerpt: '',
  featuredImage: '',
  coverImage: '',
  category: [],
  tags: [],
  status: 'draft',
};

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [imageType, setImageType] = useState<'cover' | 'featured'>('featured');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, 'blog_posts');
      const q = query(postsRef, orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt.toDate(),
      })) as BlogPost[];

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string | undefined> => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      if (e.target) e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      if (e.target) e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      setImageError(false);
      
      const imageUrl = await uploadFile(file);
      
      if (!imageUrl || !imageUrl.startsWith('http')) {
        throw new Error('Invalid image URL returned from upload');
      }

      // Save to gallery
      await addDoc(collection(db, 'uploaded_images'), {
        url: imageUrl,
        title: file.name,
        uploadedAt: Timestamp.now(),
        fileType: file.type,
        fileSize: file.size,
      });

      return imageUrl;
    } catch (error) {
      console.error('Error handling image:', error);
      setImageError(true);
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
      return undefined;
    } finally {
      setUploading(false);
      // Clear the input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setUploading(false);
  };

  const handleGallerySelect = (url: string) => {
    if (imageType === 'cover') {
      setFormData(prev => ({ ...prev, coverImage: url }));
    } else {
      setFormData(prev => ({ ...prev, featuredImage: url }));
    }
    setShowGallery(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      if (!formData.title || !formData.content || !formData.excerpt) {
        throw new Error('Please fill in all required fields (title, content, and excerpt)');
      }

      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to create or edit posts');
      }

      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const postData = {
        ...formData,
        slug,
        publishedAt: editingPost?.publishedAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
        author: {
          name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          avatar: user.photoURL || '/images/avatars/default.jpg',
          email: user.email,
          uid: user.uid
        }
      };

      if (editingPost) {
        await updateDoc(doc(db, 'blog_posts', editingPost.id), postData);
      } else {
        await addDoc(collection(db, 'blog_posts'), postData);
      }

      await fetchPosts();
      resetForm();
      alert(editingPost ? 'Post updated successfully!' : 'Post created successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(error instanceof Error ? error.message : 'Failed to save post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

      try {
      await deleteDoc(doc(db, 'blog_posts', post.id));
        await fetchPosts();
      alert('Post deleted successfully!');
      } catch (error) {
        console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage || '',
      coverImage: post.coverImage || '',
      category: post.category as BlogCategory[],
      tags: post.tags,
      status: post.status,
    });
    setEditingPost(post);
    setShowEditor(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPost(null);
    setShowEditor(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#751731]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">Blog Posts</h1>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="px-4 py-2 bg-gradient-to-r from-[#751731] to-[#F4D165] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          {showEditor ? 'View All Posts' : 'Create New Post'}
        </button>
      </div>

      {showEditor ? (
        <div className="bg-white rounded-lg shadow-lg border border-[#751731]/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#751731]">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-[#751731]/30"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image Field */}
              <div>
                <label className="block text-sm font-medium text-[#751731]">Cover Image (Hero)</label>
                <p className="text-sm text-gray-500 mb-2">This image will be displayed as the hero image at the top of your blog post.</p>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const imageUrl = await handleImageUpload(e);
                        if (imageUrl) {
                          setFormData(prev => ({ ...prev, coverImage: imageUrl }));
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#751731]/5 file:text-[#751731]
                        hover:file:bg-[#751731]/10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageType('cover');
                        setShowGallery(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#751731] bg-[#751731]/5 rounded-full hover:bg-[#751731]/10 transition-colors duration-200"
                    >
                      Browse Gallery
                    </button>
                  </div>

                  {formData.coverImage && isValidImageUrl(formData.coverImage) && !imageError ? (
                    <div className="relative w-full h-40 overflow-hidden rounded-lg border border-gray-200">
                      <Image
                        src={formData.coverImage}
                        alt="Cover image preview"
                        fill
                        className="object-cover"
                        onError={handleImageError}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : formData.coverImage && (
                    <div className="text-sm text-red-500">
                      Failed to load cover image. Please try uploading again.
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image Field */}
              <div>
                <label className="block text-sm font-medium text-[#751731]">Featured Image (Content)</label>
                <p className="text-sm text-gray-500 mb-2">This image will be displayed within your blog post content.</p>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const imageUrl = await handleImageUpload(e);
                        if (imageUrl) {
                          setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
                        }
                      }}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#751731]/5 file:text-[#751731]
                        hover:file:bg-[#751731]/10"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageType('featured');
                        setShowGallery(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#751731] bg-[#751731]/5 rounded-full hover:bg-[#751731]/10 transition-colors duration-200"
                    >
                      Browse Gallery
                    </button>
                  </div>

                  {formData.featuredImage && isValidImageUrl(formData.featuredImage) && !imageError ? (
                    <div className="relative w-full h-40 overflow-hidden rounded-lg border border-gray-200">
                      <Image
                        src={formData.featuredImage}
                        alt="Featured image preview"
                        fill
                        className="object-cover"
                        onError={handleImageError}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : formData.featuredImage && (
                    <div className="text-sm text-red-500">
                      Failed to load featured image. Please try uploading again.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#751731]">Categories</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      const newCategories = formData.category.includes(category)
                        ? formData.category.filter((c) => c !== category)
                        : [...formData.category, category];
                      setFormData(prev => ({ ...prev, category: newCategories }));
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      formData.category.includes(category)
                        ? 'bg-gradient-to-r from-[#751731] to-[#F4D165] text-white shadow-md'
                        : 'bg-[#751731]/5 text-[#751731] hover:bg-[#751731]/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#751731]">Tags</label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                  setFormData(prev => ({ ...prev, tags }));
                }}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-[#751731]/30"
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#751731]">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-[#751731]/30"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#751731]">Content</label>
              <div className="mt-1">
                <Editor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#751731]">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-[#751731]/30"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-[#751731] hover:text-[#751731]/80 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-gradient-to-r from-[#751731] to-[#F4D165] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {uploading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg border border-[#751731]/10 hover:shadow-xl transition-all duration-300">
              <div className="flex gap-6">
                {post.featuredImage && isValidImageUrl(post.featuredImage) && (
                  <div className="relative flex-shrink-0 w-48 h-32 overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex-grow flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#751731]">{post.title}</h2>
                    <p className="text-gray-600 mt-2">{post.excerpt}</p>
                    <div className="mt-2 flex gap-2">
                      {post.category.map((cat) => (
                        <span key={cat} className="px-2 py-1 bg-[#751731]/5 text-[#751731] rounded-full text-sm">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-[#751731] hover:text-[#F4D165] transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery
          onSelect={handleGallerySelect}
          onClose={() => setShowGallery(false)}
        />
      )}

      {uploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#751731] border-t-transparent"></div>
              <span className="text-[#751731]">Uploading image...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 