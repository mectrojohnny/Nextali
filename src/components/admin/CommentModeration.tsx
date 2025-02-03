'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Comment {
  id: string;
  postId: string;
  postTitle: string;
  postType: 'blog' | 'community';
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export default function CommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [source, setSource] = useState<'all' | 'blog' | 'community'>('all');

  useEffect(() => {
    fetchComments();
  }, [filter, source]);

  const fetchComments = async () => {
    try {
      // Fetch blog post comments
      const blogPostsRef = collection(db, 'blog_posts');
      const blogPostsQuery = query(blogPostsRef);
      const blogPostsSnapshot = await getDocs(blogPostsQuery);
      
      let allComments: Comment[] = [];

      // Process blog comments
      for (const postDoc of blogPostsSnapshot.docs) {
        const postData = postDoc.data();
        const comments = postData.comments || [];
        const processedComments = comments.map((comment: any) => ({
          ...comment,
          postId: postDoc.id,
          postTitle: postData.title,
          postType: 'blog' as const,
          timestamp: comment.timestamp.toDate(),
        }));
        allComments = [...allComments, ...processedComments];
      }

      // Fetch community post comments
      const communityPostsRef = collection(db, 'posts');
      const communityPostsQuery = query(communityPostsRef);
      const communityPostsSnapshot = await getDocs(communityPostsQuery);

      // Process community comments
      for (const postDoc of communityPostsSnapshot.docs) {
        const postData = postDoc.data();
        const comments = postData.comments || [];
        const processedComments = comments.map((comment: any) => ({
          ...comment,
          postId: postDoc.id,
          postTitle: postData.content.slice(0, 50) + '...',
          postType: 'community' as const,
          timestamp: comment.timestamp.toDate(),
        }));
        allComments = [...allComments, ...processedComments];
      }

      // Filter comments based on current filters
      let filteredComments = allComments;
      
      if (filter !== 'all') {
        filteredComments = filteredComments.filter(comment => comment.status === filter);
      }
      
      if (source !== 'all') {
        filteredComments = filteredComments.filter(comment => comment.postType === source);
      }

      // Sort by timestamp
      filteredComments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setComments(filteredComments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (comment: Comment, newStatus: 'approved' | 'rejected') => {
    try {
      const collectionName = comment.postType === 'blog' ? 'blog_posts' : 'community_posts';
      const postRef = doc(db, collectionName, comment.postId);
      
      // Get current post data
      const postDoc = await getDocs(query(collection(db, collectionName), where('id', '==', comment.postId)));
      const post = postDoc.docs[0];
      
      if (post) {
        const updatedComments = post.data().comments.map((c: any) => 
          c.id === comment.id ? { ...c, status: newStatus } : c
        );

        await updateDoc(postRef, { comments: updatedComments });
        
        // Update local state
        setComments(prevComments => 
          prevComments.map(c => 
            c.id === comment.id ? { ...c, status: newStatus } : c
          )
        );
      }
    } catch (error) {
      console.error('Error updating comment status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="blog">Blog Posts</option>
            <option value="community">Community Posts</option>
          </select>
        </div>

        <p className="text-sm text-gray-600">
          {comments.length} comment{comments.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          >
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {comment.author.name}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{new Date(comment.timestamp).toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      comment.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : comment.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comment.status}
                    </span>
                  </div>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs ${
                comment.postType === 'blog'
                  ? 'bg-[#803C9A]/10 text-[#803C9A]'
                  : 'bg-[#FF5757]/10 text-[#FF5757]'
              }`}>
                {comment.postType === 'blog' ? 'Blog Post' : 'Community Post'}
              </span>
            </div>

            {/* Post Reference */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">On post: </span>
                {comment.postTitle}
              </p>
            </div>

            {/* Comment Content */}
            <p className="text-gray-800 mb-6">{comment.content}</p>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              {comment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(comment, 'rejected')}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(comment, 'approved')}
                    className="px-4 py-2 bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    Approve
                  </button>
                </>
              )}
              {comment.status === 'approved' && (
                <button
                  onClick={() => handleUpdateStatus(comment, 'rejected')}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
              {comment.status === 'rejected' && (
                <button
                  onClick={() => handleUpdateStatus(comment, 'approved')}
                  className="px-4 py-2 bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white rounded-lg hover:shadow-md transition-shadow"
                >
                  Restore
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {comments.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons-outlined text-6xl text-gray-300 mb-4">
              comment
            </span>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No comments found
            </h3>
            <p className="text-gray-600">
              {filter === 'pending'
                ? 'No comments waiting for moderation'
                : `No ${filter} comments ${
                    source !== 'all' ? `in ${source} posts` : ''
                  }`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 