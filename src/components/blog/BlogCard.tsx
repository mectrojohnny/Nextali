'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { getValidImageSrc } from '@/utils/imageUtils';
import type { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

const SafeImage = ({ src, alt, className = '', priority = false, fill = false, width, height }: SafeImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = useCallback(() => {
    console.error(`Error loading image: ${src}`);
    setError(true);
    setLoading(false);
  }, [src]);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="material-icons-outlined text-gray-400 text-4xl">image_not_supported</span>
      </div>
    );
  }

  const imageProps = {
    src: getValidImageSrc(src),
    alt,
    className: `${className} ${loading ? 'opacity-0' : 'opacity-100'}`,
    priority,
    onError: handleError,
    onLoad: handleLoad,
    ...(fill ? { fill: true } : { width, height }),
  };

  return (
    <>
      {loading && (
        <div className={`flex items-center justify-center bg-gray-50 ${className}`}>
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        </div>
      )}
      <Image {...imageProps} />
    </>
  );
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <Link href={`/posts/${post.slug}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <SafeImage
            src={post.featuredImage}
            alt={post.title || 'Blog post featured image'}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#751731]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.category.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#751731] to-[#F4D165] text-white rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#751731] transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#751731]/10">
                <SafeImage
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-[#751731]">{post.author.name}</span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 