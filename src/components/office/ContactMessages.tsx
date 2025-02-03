'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'responded' | 'archived';
  response?: string;
  createdAt: string;
  respondedAt?: string;
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const q = query(
        collection(db, 'contact_messages'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[];
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setResponseText(message.response || '');
    setError(null);
  };

  const handleSubmitResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/messages/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          response: responseText,
          messageType: 'contact',
          recipientEmail: selectedMessage.email,
          recipientName: selectedMessage.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send response');
      }

      // Update local state
      setMessages(messages.map(msg =>
        msg.id === selectedMessage.id
          ? { ...msg, status: 'responded', response: responseText, respondedAt: new Date().toISOString() }
          : msg
      ));
      setSelectedMessage(null);
      setResponseText('');
    } catch (error) {
      console.error('Error submitting response:', error);
      setError('Failed to send response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 p-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/2 bg-white rounded-lg shadow-lg p-6 overflow-auto"
      >
        <h2 className="text-2xl font-semibold mb-6">Contact Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages found</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleSelectMessage(message)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{message.name}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    message.status === 'responded'
                      ? 'bg-green-100 text-green-800'
                      : message.status === 'archived'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{message.email}</p>
                <p className="text-sm">{message.message.substring(0, 100)}...</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(message.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-1/2 bg-white rounded-lg shadow-lg p-6"
      >
        {selectedMessage ? (
          <>
            <h2 className="text-2xl font-semibold mb-6">Respond to Message</h2>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">{selectedMessage.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{selectedMessage.email}</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p>{selectedMessage.message}</p>
              </div>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Type your response here..."
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setResponseText('');
                    setError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={submitting || !responseText.trim()}
                  className={`px-4 py-2 bg-purple-600 text-white rounded-lg ${
                    submitting || !responseText.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-purple-700'
                  }`}
                >
                  {submitting ? 'Sending...' : 'Send Response'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a message to respond
          </div>
        )}
      </motion.div>
    </div>
  );
} 