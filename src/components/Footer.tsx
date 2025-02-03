'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src="/logo.jpg"
                alt="Rest Revive Thrive"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <h3 className="ml-3 text-lg font-semibold bg-gradient-to-r from-[#803C9A] to-[#FF5757] bg-clip-text text-transparent">
                Rest Revive Thrive
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Supporting your journey with fibromyalgia and CFS/ME through understanding, community, and personalized guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-[#803C9A]">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-[#803C9A]">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-600 hover:text-[#803C9A]">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/book-consultation" className="text-gray-600 hover:text-[#803C9A]">
                  Connect with Dr. Dolly
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-[#803C9A]">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#803C9A]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#803C9A]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#803C9A]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Rest Revive Thrive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 