import { db } from './firebase';
import { collection, query, where, getDocs, getDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { CommunityCategory, COMMUNITY_CATEGORIES } from '@/types/community';

export async function getCategoryPostCounts(): Promise<CommunityCategory[]> {
  try {
    const postsRef = collection(db, 'posts');
    const categoryCounts = new Map<string, number>();

    // Initialize counts for all categories
    COMMUNITY_CATEGORIES.forEach(cat => {
      categoryCounts.set(cat.id, 0);
    });

    // Get all posts
    const querySnapshot = await getDocs(postsRef);
    
    // Count posts per category
    querySnapshot.forEach(doc => {
      const post = doc.data();
      if (post.category && categoryCounts.has(post.category)) {
        categoryCounts.set(post.category, (categoryCounts.get(post.category) || 0) + 1);
      }
    });

    // Combine with category metadata
    return COMMUNITY_CATEGORIES.map(cat => ({
      ...cat,
      count: categoryCounts.get(cat.id) || 0
    }));
  } catch (error) {
    console.error('Error fetching category counts:', error);
    // Return categories with 0 counts in case of error
    return COMMUNITY_CATEGORIES.map(cat => ({
      ...cat,
      count: 0
    }));
  }
}

export async function softDeletePost(postId: string, userId: string): Promise<boolean> {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const postData = postDoc.data();
    
    // Check if user is the author or admin
    if (postData.author.uid !== userId && !postData.author.isAdmin) {
      throw new Error('Unauthorized to delete this post');
    }

    await updateDoc(postRef, {
      isDeleted: true,
      deletedAt: Timestamp.now(),
      deletedBy: userId
    });

    return true;
  } catch (error) {
    console.error('Error soft deleting post:', error);
    return false;
  }
} 