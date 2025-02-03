'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold gradient-text">
              RestReviv
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-8">
            <Link href="/resources" className="text-gray-700 hover:text-[#803C9A] px-3 py-2 text-sm font-medium">
              Resources
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-[#803C9A] px-3 py-2 text-sm font-medium">
              Community
            </Link>
            <Link href="/tools" className="text-gray-700 hover:text-[#803C9A] px-3 py-2 text-sm font-medium">
              Tools
            </Link>
            <Link href="/posts" className="text-gray-700 hover:text-[#803C9A] px-3 py-2 text-sm font-medium">
              Blog
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#803C9A] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#803C9A]"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/resources" className="text-gray-700 hover:text-[#803C9A] block px-3 py-2 text-base font-medium">
            Resources
          </Link>
          <Link href="/community" className="text-gray-700 hover:text-[#803C9A] block px-3 py-2 text-base font-medium">
            Community
          </Link>
          <Link href="/tools" className="text-gray-700 hover:text-[#803C9A] block px-3 py-2 text-base font-medium">
            Tools
          </Link>
          <Link href="/posts" className="text-gray-700 hover:text-[#803C9A] block px-3 py-2 text-base font-medium">
            Blog
          </Link>
        </div>
      </div>
    </nav>
  )
} 