'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10 sm:w-12 sm:h-12',
  lg: 'w-12 h-12 sm:w-16 sm:h-16'
};

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const [error, setError] = useState(false);
  const sizeClass = sizes[size];
  
  return (
    <div className={`relative ${sizeClass} rounded-full bg-gradient-to-r from-[#803C9A] to-[#FF5757] p-[2px] ${className}`}>
      <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
        <img
          src={error ? '/images/default-avatar.svg' : src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
} 