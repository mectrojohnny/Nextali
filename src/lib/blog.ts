import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  where, 
  limit, 
  QueryConstraint,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { logger } from '@/utils/logger';
import type { BlogPost, BlogFormData } from '@/types/blog';

// Simple in-memory cache for blog posts
const postCache = new Map<string, { post: BlogPost; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedPost(key: string): BlogPost | null {
  const cached = postCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.post;
  }
  postCache.delete(key);
  return null;
}

function cachePost(key: string, post: BlogPost): void {
  postCache.set(key, { post, timestamp: Date.now() });
}

export async function getBlogPost(slugOrId: string): Promise<BlogPost> {
  try {
    if (!slugOrId) {
      throw new Error('Slug or ID is required');
    }

    logger.debug('Fetching blog post:', { slugOrId });
    
    // Check cache first
    const cached = getCachedPost(slugOrId);
    if (cached) {
      logger.debug('Post found in cache:', { slugOrId });
      return cached;
    }

    // Try finding by slug first
    const slugQuery = query(
      collection(db, 'blog_posts'),
      where('slug', '==', slugOrId),
      limit(1)
    );
    
    const slugSnapshot = await getDocs(slugQuery);
    
    if (!slugSnapshot.empty) {
      const postDoc = slugSnapshot.docs[0];
      const postData = postDoc.data();
      
      // Log the post data for debugging
      logger.debug('Post found by slug:', { 
        id: postDoc.id,
        slug: postData.slug,
        title: postData.title
      });
      
      const post = formatBlogPost(postDoc.id, postData);
      cachePost(slugOrId, post);
      return post;
    }

    // If not found by slug, try direct ID lookup
    const postRef = doc(db, 'blog_posts', slugOrId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const postData = postSnap.data();
      
      // Log the post data for debugging
      logger.debug('Post found by ID:', { 
        id: postSnap.id,
        slug: postData.slug,
        title: postData.title
      });
      
      const post = formatBlogPost(postSnap.id, postData);
      cachePost(slugOrId, post);
      return post;
    }

    logger.warn('Post not found:', { slugOrId });
    throw new Error('Post not found');
  } catch (error) {
    logger.error('Error fetching blog post:', { 
      slugOrId, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
}

export async function getPublicBlogPosts(options: {
  limit?: number;
  category?: string;
  tag?: string;
  trending?: boolean;
} = {}): Promise<BlogPost[]> {
  try {
    const constraints: QueryConstraint[] = [
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc')
    ];

    if (options.category && options.category !== 'All') {
      constraints.push(where('category', 'array-contains', options.category));
    }

    if (options.trending) {
      constraints.push(where('isTrending', '==', true));
      constraints.push(orderBy('trendingOrder', 'asc'));
    }

    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    const postsQuery = query(collection(db, 'blog_posts'), ...constraints);
    
    logger.debug('Fetching blog posts with query:', { 
      category: options.category,
      tag: options.tag,
      trending: options.trending,
      limit: options.limit
    });

    const snapshot = await getDocs(postsQuery);
    const posts = snapshot.docs.map(doc => formatBlogPost(doc.id, doc.data()));

    logger.debug('Fetched posts count:', posts.length);

    // If tag filter is applied, do it in memory since Firestore doesn't support
    // array-contains with multiple conditions
    if (options.tag) {
      return posts.filter(post => post.tags.includes(options.tag as string));
    }

    return posts;
  } catch (error) {
    logger.error('Error fetching public blog posts:', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      options 
    });
    throw error;
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const postsQuery = query(
      collection(db, 'blog_posts'),
      orderBy('publishedAt', 'desc')
    );
    
    const snapshot = await getDocs(postsQuery);
    return snapshot.docs.map(doc => formatBlogPost(doc.id, doc.data()));
  } catch (error) {
    logger.error('Error fetching all blog posts:', error);
    throw error;
  }
}

export async function createBlogPost(data: BlogFormData): Promise<BlogPost> {
  try {
    const now = Timestamp.now();
    const postData = {
      ...data,
      slug: generateSlug(data.title),
      publishedAt: now,
      updatedAt: now,
      author: data.author || {
        name: 'Anonymous',
        avatar: '/images/default-avatar.svg',
        email: '',
        uid: ''
      },
      isTrending: data.isTrending || false,
      trendingOrder: data.trendingOrder || 999
    };

    const docRef = await addDoc(collection(db, 'blog_posts'), postData);
    return formatBlogPost(docRef.id, postData);
  } catch (error) {
    logger.error('Error creating blog post:', error);
    throw error;
  }
}

export async function updateBlogPost(id: string, data: Partial<BlogFormData>): Promise<void> {
  try {
    const postRef = doc(db, 'blog_posts', id);
    const updateData = {
      ...data,
      ...(data.title && { slug: generateSlug(data.title) }),
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(postRef, updateData);
  } catch (error) {
    logger.error('Error updating blog post:', error);
    throw error;
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  try {
    const postRef = doc(db, 'blog_posts', id);
    await deleteDoc(postRef);
  } catch (error) {
    logger.error('Error deleting blog post:', error);
    throw error;
  }
}

function formatBlogPost(id: string, data: any): BlogPost {
  if (!data.title) {
    logger.warn('Blog post missing title:', { id });
  }

  return {
    id,
    slug: data.slug || generateSlug(data.title || 'untitled'),
    title: data.title || 'Untitled Post',
    content: data.content || '',
    excerpt: data.excerpt || '',
    featuredImage: data.featuredImage || '',
    coverImage: data.coverImage || '',
    category: Array.isArray(data.category) ? data.category : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status || 'draft',
    publishedAt: data.publishedAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate(),
    layout: data.layout || 'classic',
    author: {
      name: data.author?.name || 'Anonymous',
      avatar: data.author?.avatar || '/images/default-avatar.svg',
      email: data.author?.email || '',
      uid: data.author?.uid || ''
    },
    isTrending: data.isTrending || false,
    trendingOrder: data.trendingOrder || 999
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
} 