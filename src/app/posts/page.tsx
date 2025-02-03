'use client';

import { Suspense } from 'react';
import BlogPage from '@/components/blog/BlogPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BlogCategory } from '@/types/types';

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
    </div>
  );
}

interface PostsPageProps {
  searchParams?: {
    category?: BlogCategory | 'All';
    tag?: string;
    q?: string;
  };
}

export default function PostsPage({ searchParams }: PostsPageProps) {
  return (
    <ErrorBoundary>
      <div className="w-full">
        <Suspense fallback={<LoadingSpinner />}>
          <BlogPage 
            initialCategory={searchParams?.category}
            initialTag={searchParams?.tag}
            initialSearch={searchParams?.q}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
} 