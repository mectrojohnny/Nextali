import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { logger } from '@/utils/logger';
import slugify from 'slugify';

interface PostData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  coverImage?: string;
  author?: {
    name: string;
    avatar: string;
  };
  publishedAt?: Timestamp;
  date?: string;
  tags?: string[];
  category?: string[];
  status?: string;
  isTrending?: boolean;
  trendingOrder?: number;
  updatedAt?: Timestamp;
}

// Validation helper
const validatePostData = (data: PostData) => {
  try {
    logger.debug('Starting post data validation:', {
      receivedFields: Object.keys(data),
      dataType: typeof data,
      isNull: data === null,
      isUndefined: data === undefined
    });

    if (!data) {
      logger.error('Validation failed: Post data is null or undefined');
      return ['Post data is required'];
    }

    const errors: string[] = [];
    
    // Check for required fields with proper typing
    if (!data.title?.trim()) {
      errors.push('title is required');
      logger.debug('Missing required field: title');
    }
    if (!data.content?.trim()) {
      errors.push('content is required');
      logger.debug('Missing required field: content');
    }
    if (!data.excerpt?.trim()) {
      errors.push('excerpt is required');
      logger.debug('Missing required field: excerpt');
    }

    // Validate data types
    if (data.tags && !Array.isArray(data.tags)) {
      errors.push('tags must be an array');
      logger.debug('Invalid tags format:', { 
        receivedType: typeof data.tags,
        value: data.tags 
      });
    }

    if (data.category && !Array.isArray(data.category)) {
      errors.push('category must be an array');
      logger.debug('Invalid category format:', { 
        receivedType: typeof data.category,
        value: data.category 
      });
    }

    // Log validation results
    if (errors.length > 0) {
      logger.info('Post validation failed:', { 
        errors,
        receivedData: {
          hasTitle: !!data.title,
          hasContent: !!data.content,
          hasExcerpt: !!data.excerpt,
          fieldsPresent: Object.keys(data)
        }
      });
    } else {
      logger.debug('Post validation passed:', {
        fieldsPresent: Object.keys(data)
      });
    }

    return errors;
  } catch (error) {
    logger.error('Error during post validation:', {
      error: error instanceof Error ? error.message : 'Unknown validation error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return ['Internal validation error occurred'];
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  logger.info('Starting GET request for post:', { 
    requestId,
    id: params.id,
    url: request.url,
    timestamp: new Date().toISOString()
  });

  try {
    if (!params.id) {
      logger.error('Missing post ID/slug in request', {
        requestId,
        params,
        url: request.url
      });
      return NextResponse.json({ error: 'Post ID or slug is required' }, { status: 400 });
    }

    // Try finding by slug first
    const slugQuery = query(
      collection(db, 'blog_posts'),
      where('slug', '==', params.id)
    );
    
    const slugSnapshot = await getDocs(slugQuery);
    
    if (!slugSnapshot.empty) {
      const postDoc = slugSnapshot.docs[0];
      const postData = postDoc.data();
      
      logger.info('Post found by slug:', { 
        requestId,
        id: postDoc.id,
        slug: params.id,
        dataSize: JSON.stringify(postData).length,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        id: postDoc.id,
        ...postData,
        publishedAt: postData.publishedAt?.toDate().toISOString(),
        updatedAt: postData.updatedAt?.toDate().toISOString()
      });
    }

    // If not found by slug, try direct ID lookup
    const postRef = doc(db, 'blog_posts', params.id);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const postData = postSnap.data();
      logger.info('Post found by ID:', { 
        requestId,
        id: params.id,
        dataSize: JSON.stringify(postData).length,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        id: postSnap.id,
        ...postData,
        publishedAt: postData.publishedAt?.toDate().toISOString(),
        updatedAt: postData.updatedAt?.toDate().toISOString()
      });
    }

    logger.warn('Post not found:', { 
      requestId,
      id: params.id,
      checkedCollections: ['blog_posts'],
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  } catch (error) {
    const errorDetails = {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      id: params.id,
      url: request.url,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    };
    
    logger.error('Critical error fetching post:', errorDetails);
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorDetails },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  logger.info('Starting PUT request for post:', { 
    id: params.id,
    url: request.url,
    timestamp: new Date().toISOString()
  });

  try {
    const currentUser = auth.currentUser;
    logger.debug('Checking authentication:', {
      isAuthenticated: !!currentUser,
      userEmail: currentUser?.email,
      timestamp: new Date().toISOString()
    });

    if (!currentUser?.email) {
      logger.info('Unauthorized PUT attempt:', {
        id: params.id,
        url: request.url
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!params.id) {
      logger.error('Missing post ID in PUT request', {
        params,
        url: request.url
      });
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const body = await request.json();
    logger.debug('Received PUT request body:', {
      fields: Object.keys(body),
      id: params.id
    });

    const validationErrors = validatePostData(body);
    if (validationErrors.length > 0) {
      logger.info('PUT validation failed:', {
        errors: validationErrors,
        id: params.id
      });
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }

    const { title, excerpt, content, coverImage, author, tags, category, status } = body;

    // Generate slug from title
    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    });

    const docRef = doc(db, 'blog_posts', params.id);
    const existingDoc = await getDoc(docRef);
    
    if (!existingDoc.exists()) {
      logger.info('Attempted to update non-existent post:', {
        id: params.id,
        collection: 'blog_posts'
      });
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updateData = {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      tags,
      category,
      status,
      updatedAt: Timestamp.now(),
    };

    logger.debug('Updating post with data:', {
      id: params.id,
      updateFields: Object.keys(updateData)
    });

    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    logger.info('Post updated successfully:', {
      id: params.id,
      duration: Date.now() - startTime
    });

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
      publishedAt: updatedDoc.data()?.publishedAt?.toDate().toISOString(),
      updatedAt: updatedDoc.data()?.updatedAt?.toDate().toISOString()
    });
  } catch (error) {
    const errorDetails = {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      id: params.id,
      duration: Date.now() - startTime
    };
    
    logger.error('Critical error updating post:', errorDetails);
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorDetails },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  logger.info('Starting DELETE request for post:', { 
    id: params.id,
    url: request.url,
    timestamp: new Date().toISOString()
  });

  try {
    const currentUser = auth.currentUser;
    logger.debug('Checking authentication for DELETE:', {
      isAuthenticated: !!currentUser,
      userEmail: currentUser?.email
    });

    if (!currentUser?.email) {
      logger.info('Unauthorized DELETE attempt:', {
        id: params.id,
        url: request.url
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!params.id) {
      logger.error('Missing post ID in DELETE request', {
        params,
        url: request.url
      });
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const docRef = doc(db, 'blog_posts', params.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      logger.info('Attempted to delete non-existent post:', {
        id: params.id,
        collection: 'blog_posts'
      });
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await deleteDoc(docRef);
    logger.info('Post deleted successfully:', {
      id: params.id,
      duration: Date.now() - startTime
    });

    return NextResponse.json({ 
      message: 'Post deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const errorDetails = {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      id: params.id,
      duration: Date.now() - startTime
    };
    
    logger.error('Critical error deleting post:', errorDetails);
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorDetails },
      { status: 500 }
    );
  }
} 