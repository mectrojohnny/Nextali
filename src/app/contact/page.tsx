'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement form submission logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#751731]/5 to-white dark:from-gray-900 dark:via-[#9E2F4B]/30 dark:to-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#751731] dark:text-[#F4D165] mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Have questions about our services? We&apos;re here to help you build and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 border border-[#751731]/20 dark:border-[#751731]/40 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="material-icons-outlined text-2xl text-[#751731] dark:text-[#F4D165]">
                  phone
                </span>
                <h3 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">Phone</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Call us at:{" "}
                <a 
                  href="tel:+2348163930033"
                  className="text-[#751731] dark:text-[#F4D165] hover:underline transition-colors"
                >
                  +234 816 393 0033
                </a>
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 border border-[#751731]/20 dark:border-[#751731]/40 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="material-icons-outlined text-2xl text-[#751731] dark:text-[#F4D165]">
                  email
                </span>
                <h3 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">Email</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Write to us:{" "}
                <a 
                  href="mailto:hello@nextlaihq"
                  className="text-[#751731] dark:text-[#F4D165] hover:underline transition-colors"
                >
                  hello@nextlaihq
                </a>
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 border border-[#751731]/20 dark:border-[#751731]/40 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="material-icons-outlined text-2xl text-[#751731] dark:text-[#F4D165]">
                  schedule
                </span>
                <h3 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">Response Time</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-[#751731]/20 dark:border-[#751731]/40">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-[#751731]/20 dark:border-[#751731]/40 rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-transparent transition-shadow dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-[#751731]/20 dark:border-[#751731]/40 rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-transparent transition-shadow dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-[#751731]/20 dark:border-[#751731]/40 rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-transparent transition-shadow dark:text-white"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support Request</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="business">Business Development</option>
                  <option value="investment">Investment Opportunities</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-[#751731]/20 dark:border-[#751731]/40 rounded-lg focus:ring-2 focus:ring-[#751731] focus:border-transparent transition-shadow resize-none dark:text-white"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 
                    ${isSubmitting 
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#751731] to-[#F4D165] hover:shadow-lg hover:scale-[1.02]'
                    }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                      Sending...
                    </div>
                  ) : 'Send Message'}
                </button>
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-center"
                >
                  Thank you for your message! We&apos;ll get back to you soon.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-center"
                >
                  Oops! Something went wrong. Please try again later.
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
} 