'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { getValidImageSrc } from '@/utils/imageUtils';

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    photoURL: string;
  };
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('Current user:', user);
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    setError(null);
    try {
      console.log('Fetching comments for post:', postId);
      const commentsRef = collection(db, 'blog_comments');
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const fetchedComments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Comment[];

      console.log('Fetched comments:', fetchedComments);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      setError('Please sign in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    if (submitting) {
      return;
    }

    setSubmitting(true);
    try {
      console.log('Preparing comment data...');
      const commentData = {
        postId,
        content: newComment.trim(),
        createdAt: serverTimestamp(),
        user: {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          photoURL: user.photoURL || '/images/default-avatar.svg',
        },
      };
      console.log('Comment data:', commentData);

      const docRef = await addDoc(collection(db, 'blog_comments'), commentData);
      console.log('Comment added with ID:', docRef.id);
      setNewComment('');
      await fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#803C9A]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8">Comments</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Image
                src={getValidImageSrc(user.photoURL || '/images/default-avatar.svg')}
                alt={user.displayName || 'User'}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent resize-none min-h-[120px] bg-gray-50"
                disabled={submitting}
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${
                    submitting || !newComment.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#803C9A] to-[#FF5757] hover:from-[#6A2F80] hover:to-[#E64D4D] shadow-sm'
                  }`}
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-purple-50 p-6 rounded-xl mb-10">
          <p className="text-sm text-[#803C9A] text-center">
            Please <a href="/login" className="font-medium underline hover:text-[#6A2F80]">sign in</a> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex-shrink-0">
                <Image
                  src={getValidImageSrc(comment.user.photoURL)}
                  alt={comment.user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{comment.user.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 