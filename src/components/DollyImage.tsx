'use client';

import Image from 'next/image';

export default function DollyImage() {
  return (
    <div className="relative h-[250px] sm:h-[300px] w-[250px] sm:w-[300px] mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group transform hover:-rotate-2 transition-all duration-500">
      <Image
        src="/images/avatars/drdolly.jpg"
        alt="Dr. Dolly"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 250px, 300px"
        priority
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/placeholder.svg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-base sm:text-lg font-semibold">Dr. Dolly</p>
        <p className="text-xs sm:text-sm">Fibromyalgia Specialist & Advocate</p>
      </div>
    </div>
  );
} 