'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

interface Stats {
  consultations: {
    total: number;
    pending: number;
    responded: number;
    archived: number;
  };
  contacts: {
    total: number;
    pending: number;
    responded: number;
    archived: number;
  };
  responseTime: {
    average: number;
    fastest: number;
    slowest: number;
  };
}

export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    consultations: { total: 0, pending: 0, responded: 0, archived: 0 },
    contacts: { total: 0, pending: 0, responded: 0, archived: 0 },
    responseTime: { average: 0, fastest: 0, slowest: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch consultation stats
      const consultationsRef = collection(db, 'consultations');
      const consultationsSnapshot = await getDocs(consultationsRef);
      const consultationDocs = consultationsSnapshot.docs.map(doc => doc.data());

      // Fetch contact stats
      const contactsRef = collection(db, 'contact_messages');
      const contactsSnapshot = await getDocs(contactsRef);
      const contactDocs = contactsSnapshot.docs.map(doc => doc.data());

      // Calculate response times for both types
      const responseTimes: number[] = [];
      [...consultationDocs, ...contactDocs].forEach(doc => {
        if (doc.respondedAt && doc.createdAt) {
          const responseTime = new Date(doc.respondedAt).getTime() - new Date(doc.createdAt).getTime();
          responseTimes.push(responseTime);
        }
      });

      setStats({
        consultations: {
          total: consultationDocs.length,
          pending: consultationDocs.filter(doc => doc.status === 'pending').length,
          responded: consultationDocs.filter(doc => doc.status === 'responded').length,
          archived: consultationDocs.filter(doc => doc.status === 'archived').length,
        },
        contacts: {
          total: contactDocs.length,
          pending: contactDocs.filter(doc => doc.status === 'pending').length,
          responded: contactDocs.filter(doc => doc.status === 'responded').length,
          archived: contactDocs.filter(doc => doc.status === 'archived').length,
        },
        responseTime: {
          average: responseTimes.length ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0,
          fastest: responseTimes.length ? Math.min(...responseTimes) : 0,
          slowest: responseTimes.length ? Math.max(...responseTimes) : 0,
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    if (ms === 0) return 'N/A';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consultation Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 border border-purple-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Consultation Requests</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-[#803C9A]">{stats.consultations.total}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.consultations.pending}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Responded</p>
              <p className="text-2xl font-semibold text-green-600">{stats.consultations.responded}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Archived</p>
              <p className="text-2xl font-semibold text-gray-600">{stats.consultations.archived}</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 border border-purple-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Messages</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-[#803C9A]">{stats.contacts.total}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.contacts.pending}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Responded</p>
              <p className="text-2xl font-semibold text-green-600">{stats.contacts.responded}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Archived</p>
              <p className="text-2xl font-semibold text-gray-600">{stats.contacts.archived}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Response Time Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6 border border-purple-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Response Times</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <p className="text-sm text-gray-600">Average Response Time</p>
            <p className="text-2xl font-semibold text-[#803C9A]">{formatDuration(stats.responseTime.average)}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600">Fastest Response</p>
            <p className="text-2xl font-semibold text-green-600">{formatDuration(stats.responseTime.fastest)}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Slowest Response</p>
            <p className="text-2xl font-semibold text-orange-600">{formatDuration(stats.responseTime.slowest)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 