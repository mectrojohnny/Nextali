import { Suspense } from 'react';
import { getBlogPost } from '@/lib/blog';
import BlogPostContent from '@/components/blog/BlogPost';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { logger } from '@/utils/logger';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: BlogPostPageProps
): Promise<Metadata> {
  try {
    if (!params.slug) {
      logger.warn('No slug provided for metadata generation');
      return {
        title: 'Blog Post | Rest Revive Thrive',
      };
    }

    logger.debug('Fetching post for metadata:', { slug: params.slug });
    const post = await getBlogPost(params.slug);

    if (!post) {
      logger.warn('Post not found for metadata:', { slug: params.slug });
      return {
        title: 'Blog Post | Rest Revive Thrive',
      };
    }

    logger.debug('Generating metadata for post:', { 
      slug: params.slug,
      title: post.title
    });

    return {
      title: `${post.title} | Rest Revive Thrive`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
        type: 'article',
        publishedTime: post.publishedAt.toISOString(),
        authors: [post.author.name],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
    };
  } catch (error) {
    logger.error('Error generating metadata:', {
      slug: params.slug,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return {
      title: 'Blog Post | Rest Revive Thrive',
      description: 'Discover insights and stories about living well with fibromyalgia and CFS/ME',
    };
  }
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
    </div>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!params.slug) {
    logger.warn('No slug provided');
    notFound();
  }

  try {
    logger.debug('Fetching blog post:', { slug: params.slug });
    const post = await getBlogPost(params.slug);
    
    if (!post) {
      logger.warn('Post not found:', { slug: params.slug });
      notFound();
    }
    
    if (post.status !== 'published') {
      logger.warn('Post is not published:', { 
        slug: params.slug,
        status: post.status,
        title: post.title
      });
      notFound();
    }
    
    logger.debug('Rendering blog post:', { 
      slug: params.slug,
      title: post.title,
      status: post.status
    });
    
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <BlogPostContent post={post} />
        </Suspense>
      </ErrorBoundary>
    );
  } catch (error) {
    logger.error('Error loading blog post:', { 
      slug: params.slug,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    notFound();
  }
} 