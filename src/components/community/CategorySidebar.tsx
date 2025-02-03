"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed bottom-6 left-6 z-30 bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white p-3 rounded-full shadow-lg"
      >
        <span className="material-icons-outlined">category</span>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        className={`fixed left-0 top-16 bottom-0 w-[280px] z-20 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-[#803C9A]/20 dark:border-[#803C9A]/40">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: theme === 'dark' ? '#803C9A40 transparent' : '#803C9A20 transparent'
            }}
          >
            <div className="p-4 sm:p-6">
              <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm pt-2 pb-4 -mt-2 -mx-2 px-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-[#803C9A] to-[#FF5757] bg-clip-text text-transparent">
                    Categories
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="material-icons-outlined text-lg sm:text-xl">
                        {theme === 'light' ? 'dark_mode' : 'light_mode'}
                      </span>
                    </button>
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="material-icons-outlined text-lg">close</span>
                    </button>
                  </div>
                </div>
              </div>
              <nav className="space-y-1 sm:space-y-2 pb-24">
                <motion.button
                  onClick={() => handleCategorySelect('all')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white shadow-md'
                      : 'hover:bg-[#803C9A]/10 dark:hover:bg-[#803C9A]/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="material-icons-outlined text-base sm:text-lg mr-3">dashboard</span>
                    <span className="font-medium text-xs sm:text-sm">All Posts</span>
                  </div>
                </motion.button>
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white shadow-md'
                        : 'hover:bg-[#803C9A]/10 dark:hover:bg-[#803C9A]/20 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center">
                        <span className="material-icons-outlined text-base sm:text-lg mr-3">{category.icon}</span>
                        <span className="font-medium text-xs sm:text-sm">{category.name}</span>
                      </div>
                      <span className={`text-xs ${
                        selectedCategory === category.id
                          ? 'text-white'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-[#803C9A] dark:group-hover:text-[#FF5757]'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
} 