'use client';

import type { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Comments from './Comments';
import { formatDate } from '@/utils/date';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface BlogPostContentProps {
  post: BlogPost;
}

interface AuthorProfile {
  displayName: string;
  bio: string;
  socialLink: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      setIsLoading(true);
      try {
        // First try to find the user profile by email
        if (post.author.email) {
          const usersRef = collection(db, 'user_profiles');
          const q = query(usersRef, where('email', '==', post.author.email));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const authorData = querySnapshot.docs[0].data();
            setAuthorProfile({
              displayName: authorData.displayName || post.author.name,
              bio: authorData.bio || '',
              socialLink: authorData.socialLink || '',
              email: authorData.email,
              createdAt: authorData.createdAt,
              updatedAt: authorData.updatedAt
            });
            
            // Check if this is the current user
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.email === authorData.email) {
              setIsCurrentUser(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching author profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorProfile();
  }, [post.author.email, post.author.name]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative min-h-[85vh] w-full flex items-end bg-gray-900">
          {(post.coverImage || post.featuredImage) && (
            <>
              {/* Blurred background for aesthetic effect */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={post.coverImage || post.featuredImage}
                  alt=""
                  fill
                  className="object-cover blur-sm scale-105 opacity-40"
                  priority
                />
              </div>
              {/* Main hero image */}
              <div className="absolute inset-0 md:inset-24 md:rounded-3xl overflow-hidden">
                <Image
                  src={post.coverImage || post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </>
          )}
          
          {/* Gradient overlays for better text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70" />
          
          {/* Content */}
          <div className="relative w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
              <div className="max-w-4xl">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {post.category.map((cat) => (
                    <Link
                      key={cat}
                      href={`/posts/category/${cat.toLowerCase()}`}
                      className="group relative px-6 py-2 text-sm md:text-base font-medium rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                    >
                      <span className="relative z-10 text-white">{cat}</span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#803C9A] to-[#FA4B99] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ))}
                </div>

                {/* Title with enhanced visibility */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight drop-shadow-lg">
                  <span className="text-white bg-gradient-to-r from-white to-white/90 bg-clip-text">
                    {post.title}
                  </span>
                </h1>

                {/* Metadata section with improved sizing */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 text-white/90">
                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-[#FA4B99]/30 backdrop-blur-sm">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-xl">{post.author.name}</div>
                      <div className="text-lg text-white/70">
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block h-12 w-px bg-white/20" />

                  {/* Reading time */}
                  <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-[#FA4B99] text-2xl">schedule</span>
                    <span className="text-base">5 min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-white/20" />
          </div>
        </div>

        {/* Content Section with improved typography */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12">
                {/* Excerpt with refined styling */}
                <div className="text-2xl md:text-3xl text-gray-600 mb-12 font-serif italic border-l-4 border-[#751731] pl-8 leading-relaxed bg-gray-50 py-6 rounded-r-lg">
                  {post.excerpt}
                </div>

                {/* Featured Image (if different from cover) */}
                {post.featuredImage && post.featuredImage !== post.coverImage && (
                  <div className="relative w-full h-[400px] mb-12 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Main Content with improved typography */}
                <div 
                  className="max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <style jsx global>{`
                  article p {
                    font-size: 18px !important;
                    line-height: 1.8 !important;
                    margin-bottom: 1.75rem !important;
                    color: #374151 !important;
                    max-width: 75ch !important;
                  }
                  
                  article h1 {
                    font-size: 28px !important;
                    font-weight: bold !important;
                    margin: 2.5rem 0 1.5rem !important;
                    color: #111827 !important;
                    letter-spacing: -0.02em !important;
                  }
                  
                  article h2 {
                    font-size: 24px !important;
                    font-weight: bold !important;
                    margin: 2rem 0 1.25rem !important;
                    color: #111827 !important;
                    letter-spacing: -0.01em !important;
                  }
                  
                  article h3 {
                    font-size: 20px !important;
                    font-weight: bold !important;
                    margin: 1.75rem 0 1rem !important;
                    color: #111827 !important;
                  }
                  
                  article ul, article ol {
                    font-size: 18px !important;
                    line-height: 1.8 !important;
                    margin: 1.5rem 0 2rem !important;
                    padding-left: 1.25rem !important;
                    color: #374151 !important;
                  }
                  
                  article li {
                    margin-bottom: 0.75rem !important;
                    padding-left: 0.5rem !important;
                  }
                  
                  article blockquote {
                    font-size: 18px !important;
                    line-height: 1.8 !important;
                    font-style: italic !important;
                    border-left: 4px solid #751731 !important;
                    padding: 1rem 0 1rem 1.5rem !important;
                    margin: 2rem 0 !important;
                    color: #4B5563 !important;
                    background-color: #F9FAFB !important;
                    border-radius: 0 0.5rem 0.5rem 0 !important;
                  }
                  
                  article a {
                    color: #751731 !important;
                    text-decoration: none !important;
                    border-bottom: 1px solid transparent !important;
                    transition: border-color 0.2s ease !important;
                  }
                  
                  article a:hover {
                    border-bottom-color: #751731 !important;
                  }
                  
                  article strong {
                    font-weight: 600 !important;
                    color: #111827 !important;
                  }
                  
                  article img {
                    border-radius: 1rem !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                    margin: 2rem auto !important;
                    display: block !important;
                    max-width: 100% !important;
                    height: auto !important;
                  }

                  article > * + * {
                    margin-top: 1.5rem !important;
                  }

                  article h2::before, article h3::before {
                    content: "";
                    display: block;
                    height: 2rem;
                  }

                  @media (min-width: 768px) {
                    article p {
                      font-size: 19px !important;
                    }
                    
                    article h1 {
                      font-size: 32px !important;
                    }
                    
                    article h2 {
                      font-size: 28px !important;
                    }
                    
                    article h3 {
                      font-size: 24px !important;
                    }
                    
                    article ul, article ol {
                      font-size: 19px !important;
                    }
                    
                    article blockquote {
                      font-size: 19px !important;
                      padding: 1.5rem 2rem !important;
                      margin: 2.5rem 0 !important;
                    }
                  }
                `}</style>

                {/* Tags with refined design */}
                <div className="mt-16 pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Topics</h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/posts/tag/${tag.toLowerCase()}`}
                        className="px-5 py-2 text-base rounded-full bg-gray-50 text-[#803C9A] hover:bg-[#803C9A] hover:text-white transition-all duration-300 border border-[#803C9A]/10"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <Comments postId={post.id} />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Author Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                {/* Author Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-[#751731]/20">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {authorProfile?.displayName || post.author.name}
                    </h3>
                    <p className="text-[#751731] font-medium">
                      {isLoading ? (
                        <span className="inline-block w-20 h-4 bg-gray-200 animate-pulse rounded"></span>
                      ) : (
                        isCurrentUser ? 'Author' : 'Contributor'
                      )}
                    </p>
                  </div>
                </div>

                {/* Author Bio */}
                <div className="mb-6">
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                    </div>
                  ) : (
                    <p className="text-base text-gray-600 leading-relaxed">
                      {authorProfile?.bio || 'Author has not added a bio yet.'}
                    </p>
                  )}
                </div>

                {/* Social Media Link */}
                {!isLoading && authorProfile?.socialLink && (
                  <div className="flex justify-center mb-6 py-4 border-y border-gray-100">
                    <a
                      href={`https://${authorProfile.socialLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#751731] transition-colors duration-200 rounded-full hover:bg-[#751731]/5"
                    >
                      <span className="material-icons-outlined text-lg">link</span>
                      <span className="text-sm font-medium">Connect with {authorProfile.displayName || post.author.name}</span>
                    </a>
                  </div>
                )}

                {/* Newsletter Signup - Fixed height container */}
                <div className="mt-6">
                  <div className="bg-gradient-to-br from-[#751731] to-[#F4D165] rounded-xl shadow-md">
                    <div className="px-6 py-8 relative">
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20" />
                        <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-white/20" />
                      </div>
                      
                      {/* Content */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
                        <p className="text-sm text-white/90 mb-4">
                          Get the latest articles and resources delivered straight to your inbox.
                        </p>
                        
                        {/* Form */}
                        <form className="space-y-3">
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                          />
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-white text-[#751731] rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                          >
                            Subscribe
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 