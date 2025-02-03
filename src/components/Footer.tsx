'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-[#751731]/5">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-full bg-white overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Nextali"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent">
                  Nextali
                </h3>
                <p className="text-sm text-gray-600">Empowering African Business</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Transforming African enterprises through innovative technology solutions, research-driven insights, and community-powered growth.
            </p>
          </div>

          {/* Platforms */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[#751731] font-semibold mb-4">Our Platforms</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://suite.nextali.com" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Business Suite
                </a>
              </li>
              <li>
                <a href="https://exchangehub.nextali.com" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Exchange Hub
                </a>
              </li>
              <li>
                <a href="https://nextentrepreneur.org" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  NEP Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[#751731] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[#751731] font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[#751731] font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#751731] transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#751731]/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Nextali. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Powered by</span>
              <div className="flex items-center space-x-3">
                <a href="https://suite.nextali.com" target="_blank" rel="noopener noreferrer" 
                   className="text-sm font-medium bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  BILL
                </a>
                <span className="text-gray-300">|</span>
                <a href="https://exchangehub.nextali.com" target="_blank" rel="noopener noreferrer" 
                   className="text-sm font-medium bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  TEA
                </a>
                <span className="text-gray-300">|</span>
                <a href="https://nextentrepreneur.org" target="_blank" rel="noopener noreferrer" 
                   className="text-sm font-medium bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  NEP
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 