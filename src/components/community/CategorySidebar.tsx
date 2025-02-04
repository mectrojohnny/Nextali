"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CommunityCategory } from '@/types/community';

interface CategorySidebarProps {
  categories: CommunityCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Categories - Horizontal Scrollable List */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-[#751731]/20 dark:border-[#751731]/40 z-[50] px-2">
        <div className="overflow-x-auto py-2 flex items-center gap-1.5 no-scrollbar">
          <motion.button
            onClick={() => onSelectCategory('all')}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center whitespace-nowrap px-2.5 py-1.5 rounded-lg text-xs transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#751731] to-[#F4D165] text-white shadow-md'
                : 'bg-[#751731]/10 dark:bg-[#751731]/20 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="material-icons-outlined text-sm mr-1">dashboard</span>
            <span className="font-medium">All</span>
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center whitespace-nowrap px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#751731] to-[#F4D165] text-white shadow-md'
                  : 'bg-[#751731]/10 dark:bg-[#751731]/20 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="material-icons-outlined text-sm mr-1">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
              <span className={`ml-1 ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {category.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-16 bottom-0 w-[280px] z-20 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-[#751731]/20 dark:border-[#751731]/40">
        <div className="h-full overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: theme === 'dark' ? '#75173140 transparent' : '#75173120 transparent'
          }}
        >
          <div className="p-4 sm:p-6">
            <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm pt-2 pb-4 -mt-2 -mx-2 px-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-[#751731] dark:text-[#9E2F4B]">
                  Categories
                </h2>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="material-icons-outlined text-lg sm:text-xl">
                    {theme === 'light' ? 'dark_mode' : 'light_mode'}
                  </span>
                </button>
              </div>
            </div>

            <nav className="space-y-2 pb-24">
              <motion.button
                onClick={() => onSelectCategory('all')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-[#751731] to-[#F4D165] text-white shadow-md'
                    : 'hover:bg-[#751731]/10 dark:hover:bg-[#9E2F4B]/20 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="material-icons-outlined text-xl mr-3">dashboard</span>
                  <span className="font-medium text-sm">All Posts</span>
                </div>
              </motion.button>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[#751731] to-[#F4D165] text-white shadow-md'
                      : 'hover:bg-[#751731]/10 dark:hover:bg-[#9E2F4B]/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center">
                      <span className="material-icons-outlined text-xl mr-3">{category.icon}</span>
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    <span className={`text-sm ${
                      selectedCategory === category.id
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-[#751731] dark:group-hover:text-[#9E2F4B]'
                    }`}>
                      {category.count}
                    </span>
                  </div>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
} 