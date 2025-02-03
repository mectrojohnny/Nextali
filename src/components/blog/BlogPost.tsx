'use client';

import type { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Comments from './Comments';
import { formatDate } from '@/utils/date';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface BlogPostContentProps {
  post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative min-h-[85vh] w-full flex items-end bg-gray-900">
          {post.featuredImage && (
            <>
              {/* Blurred background for aesthetic effect */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt=""
                  fill
                  className="object-cover blur-sm scale-105 opacity-40"
                  priority
                />
              </div>
              {/* Main featured image */}
              <div className="absolute inset-0 md:inset-24 md:rounded-3xl overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </>
          )}
          
          {/* Gradient overlays for better text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50" />
          
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
                      className="group relative px-6 py-2 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                    >
                      <span className="relative z-10 text-white">{cat}</span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#803C9A] to-[#FA4B99] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ))}
                </div>

                {/* Title with gradient text effect */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                    {post.title}
                  </span>
                </h1>

                {/* Metadata section */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 text-white/90">
                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-[#FA4B99]/30 backdrop-blur-sm">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-lg">{post.author.name}</div>
                      <div className="text-sm text-white/70">
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block h-8 w-px bg-white/20" />

                  {/* Reading time */}
                  <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-[#FA4B99]">schedule</span>
                    <span className="text-sm">5 min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-white/20" />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                {/* Excerpt */}
                <div className="text-xl text-gray-600 mb-8 font-serif italic border-l-4 border-[#803C9A] pl-6">
                  {post.excerpt}
                </div>

                {/* Main Content */}
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-p:text-gray-600 prose-p:leading-relaxed
                    prose-a:text-[#803C9A] prose-a:no-underline hover:prose-a:text-[#FA4B99]
                    prose-strong:text-gray-900
                    prose-ul:list-disc prose-ul:text-gray-600
                    prose-ol:text-gray-600
                    prose-blockquote:border-l-4 prose-blockquote:border-[#803C9A] prose-blockquote:pl-6 prose-blockquote:italic
                    prose-img:rounded-xl prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/posts/tag/${tag.toLowerCase()}`}
                        className="px-4 py-2 rounded-full bg-purple-50 text-[#803C9A] hover:bg-[#803C9A] hover:text-white transition-colors duration-300"
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
            <aside className="lg:col-span-4 space-y-8">
              {/* Author Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-[#FA4B99]">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{post.author.name}</h3>
                    <p className="text-[#803C9A]">Medical Professional</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Dedicated to helping people understand and manage Fibromyalgia and CFS/ME through evidence-based information and support.
                </p>
                <Link
                  href="/about"
                  className="block w-full py-3 px-6 text-center bg-gradient-to-r from-[#803C9A] to-[#FA4B99] text-white rounded-full hover:shadow-lg transition-shadow duration-300"
                >
                  More About {post.author.name}
                </Link>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-[#803C9A] to-[#FA4B99] rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                <p className="mb-6">Get the latest articles and resources delivered straight to your inbox.</p>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-white text-[#803C9A] rounded-full hover:shadow-lg transition-shadow duration-300 font-medium"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 