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
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <Link href={`/posts/${post.slug}`}>
        <div className="relative h-40 sm:h-48 w-full">
          <SafeImage
            src={post.featuredImage}
            alt={post.title || 'Blog post featured image'}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {post.category.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 sm:py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] sm:text-xs font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
          <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                <SafeImage
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-600">{post.author.name}</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 