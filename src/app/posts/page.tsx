import { Suspense } from 'react';
import BlogPage from '@/components/blog/BlogPage';
import { Metadata } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Blog | Rest Revive Thrive',
  description: 'Discover insights, stories, and expert advice on living well with fibromyalgia and CFS/ME',
  openGraph: {
    title: 'Blog | Rest Revive Thrive',
    description: 'Discover insights, stories, and expert advice on living well with fibromyalgia and CFS/ME',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Rest Revive Thrive',
    description: 'Discover insights, stories, and expert advice on living well with fibromyalgia and CFS/ME',
  },
};

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
    </div>
  );
}

interface PostsPageProps {
  searchParams?: {
    category?: string;
    tag?: string;
    q?: string;
  };
}

export default function PostsPage({ searchParams }: PostsPageProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <BlogPage 
          initialCategory={searchParams?.category}
          initialTag={searchParams?.tag}
          initialSearch={searchParams?.q}
        />
      </Suspense>
    </ErrorBoundary>
  );
} 