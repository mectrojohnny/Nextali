"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
}

export default function CommentSection({
  comments,
  postId,
  onAddComment,
  onLikeComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(postId, newComment);
      setNewComment('');
    }
  };

  const visibleComments = isExpanded ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <div className="mt-6 space-y-4">
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border border-[#803C9A]/20 dark:border-[#803C9A]/40 rounded-xl focus:ring-2 focus:ring-[#803C9A] focus:border-transparent resize-none bg-transparent dark:bg-gray-700/50 dark:text-white"
          placeholder="Add a comment..."
          rows={2}
        />
        <div className="flex justify-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
          >
            Comment
          </motion.button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {visibleComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#803C9A]/5 dark:bg-[#803C9A]/10 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#803C9A] to-[#FF5757] flex items-center justify-center text-white text-sm">
                {comment.author.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {comment.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <motion.button
                    onClick={() => onLikeComment(postId, comment.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center space-x-1 text-sm ${
                      comment.isLiked ? 'text-[#803C9A] dark:text-[#FF5757]' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <span className="material-icons-outlined text-sm">
                      {comment.isLiked ? 'favorite' : 'favorite_border'}
                    </span>
                    <span>{comment.likes}</span>
                  </motion.button>
                </div>
                <p className="text-gray-800 dark:text-gray-200 mt-1">{comment.content}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {hasMoreComments && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 text-[#803C9A] dark:text-[#FF5757] hover:text-[#FF5757] dark:hover:text-[#803C9A] transition-colors text-sm font-medium"
          >
            {isExpanded ? 'Show Less' : `Show ${comments.length - 3} More Comments`}
          </motion.button>
        )}
      </div>
    </div>
  );
} 