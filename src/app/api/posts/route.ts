import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, orderBy, query, where, Timestamp } from 'firebase/firestore';
import slugify from 'slugify';
import { auth } from '@/lib/firebase';
import { logger } from '@/utils/logger';

export async function GET() {
  try {
    const postsQuery = query(
      collection(db, 'blog_posts'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc')
    );
    
    const snapshot = await getDocs(postsQuery);
    
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString()
    }));

    return NextResponse.json(posts);
  } catch (error) {
    logger.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, featuredImage, author, tags, category, status = 'draft' } = body;

    // Generate slug from title
    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    });

    // Check if slug already exists
    const slugQuery = query(
      collection(db, 'blog_posts'),
      where('slug', '==', slug)
    );
    
    const slugSnapshot = await getDocs(slugQuery);
    
    if (!slugSnapshot.empty) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      );
    }

    const postsRef = collection(db, 'blog_posts');
    const now = Timestamp.now();

    const docRef = await addDoc(postsRef, {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      author: author || {
        name: 'Dr. Dolly',
        avatar: '/images/avatars/drdolly.jpg',
      },
      tags: tags || [],
      category: category || [],
      status,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      layout: 'classic'
    });

    logger.info('Post created successfully:', {
      id: docRef.id,
      slug,
      title
    });

    return NextResponse.json({
      id: docRef.id,
      slug,
      title,
      excerpt,
      content,
      featuredImage,
      author,
      tags,
      category,
      status,
      publishedAt: now.toDate().toISOString(),
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    });
  } catch (error) {
    logger.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error creating post' },
      { status: 500 }
    );
  }
} 