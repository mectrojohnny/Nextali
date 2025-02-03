import React from 'react';

const FeaturesGrid = () => {
  return (
    <section className="px-3 sm:px-6 py-12 sm:py-20 lg:px-8 bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Resource Card */}
          <div className="card bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-10 w-10 sm:h-14 sm:w-14 bg-[#803C9A]/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#803C9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Educational Resources</h3>
            <p className="text-sm sm:text-base text-gray-300">Access comprehensive guides and articles about managing fibromyalgia and CFS/ME.</p>
          </div>

          {/* Community Card */}
          <div className="card bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-10 w-10 sm:h-14 sm:w-14 bg-[#FA4B99]/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#FA4B99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Support Community</h3>
            <p className="text-sm sm:text-base text-gray-300">Connect with others who understand your journey in our supportive community.</p>
          </div>

          {/* Tools Card */}
          <div className="card bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-10 w-10 sm:h-14 sm:w-14 bg-[#803C9A]/20 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#803C9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">Personal Insights</h3>
            <p className="text-sm sm:text-base text-gray-300">Share experiences and connect with Dr. Dolly for personalized guidance and understanding.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid; 