'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ConsultationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      router.push('/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-[#F4D165]/10 pt-20">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#751731]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#F4D165]/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-[#751731]/10"
          >
            <div className="text-center mb-10">
              <div className="h-1 w-20 bg-gradient-to-r from-[#751731] to-[#F4D165] mx-auto mb-8" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#751731] to-[#F4D165]">
                Start Your Business Journey
              </h1>
              <p className="text-gray-600 text-lg">
                Let's explore how Nextali can transform your business potential
              </p>
              <div className="h-1 w-20 bg-gradient-to-r from-[#F4D165] to-[#751731] mx-auto mt-8" />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#751731] focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Your business email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#751731] focus:border-transparent"
                  placeholder="you@company.com"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your business goals
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#751731] focus:border-transparent"
                  placeholder="Share your business challenges and what you'd like to achieve..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-block bg-gradient-to-r from-[#751731] to-[#F4D165] text-white px-10 py-4 rounded-lg font-medium hover:shadow-lg transition-all text-lg disabled:opacity-50 transform hover:-translate-y-1"
                >
                  {isSubmitting ? 'Sending...' : 'Start Transformation'}
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  Our team will get back to you within 24 hours
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultationPage; 