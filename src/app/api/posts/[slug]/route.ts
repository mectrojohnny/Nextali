import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { logger } from '@/utils/logger';
import { auth } from '@/lib/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  
  try {
    logger.info(`Fetching blog post with slug: ${slug}`);
    
    // First try to find the post by slug
    const postsRef = collection(db, 'blog_posts');
    const q = query(postsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const postDoc = querySnapshot.docs[0];
      const postData = postDoc.data();
      
      // Log the post data for debugging
      logger.debug('Post found:', { 
        id: postDoc.id,
        slug: postData.slug,
        title: postData.title,
        status: postData.status
      });
      
      const post = {
        id: postDoc.id,
        ...postData,
        publishedAt: postData.publishedAt?.toDate().toISOString(),
        updatedAt: postData.updatedAt?.toDate().toISOString()
      };
      
      return NextResponse.json(post);
    }
    
    logger.warn(`Post not found with slug: ${slug}`);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error) {
    logger.error('Error fetching blog post:', { 
      slug,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const user = auth.currentUser;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Find the post by slug
    const postsRef = collection(db, 'blog_posts');
    const q = query(postsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const postDoc = querySnapshot.docs[0];
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(doc(db, 'blog_posts', postDoc.id), updateData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const user = auth.currentUser;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find the post by slug
    const postsRef = collection(db, 'blog_posts');
    const q = query(postsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const postDoc = querySnapshot.docs[0];
    await deleteDoc(doc(db, 'blog_posts', postDoc.id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
