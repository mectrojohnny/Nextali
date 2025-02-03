'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/firebase'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthMenu, setShowAuthMenu] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const authMenuRef = useRef<HTMLDivElement>(null)
  const authButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authMenuRef.current && 
        authButtonRef.current && 
        !authMenuRef.current.contains(event.target as Node) &&
        !authButtonRef.current.contains(event.target as Node)
      ) {
        setShowAuthMenu(false)
        setShowProfileEdit(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      setShowAuthMenu(false)
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setShowAuthMenu(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user || !newDisplayName.trim()) return;
    try {
      await updateProfile(user, {
        displayName: newDisplayName.trim()
      });
      setShowProfileEdit(false);
      setNewDisplayName('');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <header className="fixed w-full bg-white z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white overflow-hidden p-1 transition-all duration-300 group-hover:scale-105 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-[#803C9A]/10 to-[#FA4B99]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                <Image
                  src="/logo.jpg"
                  alt="Rest Revive and Thrive Logo"
                  fill
                  className="object-contain rounded-full transform transition-transform duration-700 group-hover:scale-110 animate-butterfly"
                  sizes="(max-width: 640px) 48px, 56px"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text whitespace-nowrap">
                Rest Revive Thrive
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            <Link href="/resources" className="text-gray-700 hover:text-[#803C9A] px-3 py-2 text-base font-medium">
              Resources
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-[#803C9A] px-3 py-2 text-base font-medium">
              Community
            </Link>
            <Link href="/posts" className="text-gray-700 hover:text-[#803C9A] px-3 py-2 text-base font-medium">
              Blog
            </Link>
            {user?.email === 'admin@example.com' && (
              <Link href="/admin" className="text-gray-700 hover:text-[#803C9A] px-3 py-2 text-base font-medium">
                Admin Dashboard
              </Link>
            )}

            {/* Auth Section */}
            <div className="relative">
              {user ? (
                <div className="flex items-center">
                  <button
                    ref={authButtonRef}
                    onClick={() => setShowAuthMenu(!showAuthMenu)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#803C9A]/5 hover:bg-[#803C9A]/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#803C9A] to-[#FF5757] flex items-center justify-center">
                      <span className="text-base font-semibold text-white">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.displayName?.split(' ')[0] || 'User'}
                    </span>
                  </button>

                  {showAuthMenu && (
                    <div 
                      ref={authMenuRef}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-100"
                    >
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#803C9A]/5 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  ref={authButtonRef}
                  onClick={handleGoogleSignIn}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white hover:shadow-md transition-all"
                >
                  <span className="material-icons-outlined text-lg">login</span>
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Auth Button */}
            {user ? (
              <button
                ref={authButtonRef}
                onClick={() => setShowAuthMenu(!showAuthMenu)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#803C9A] to-[#FF5757] flex items-center justify-center">
                  <span className="text-base font-semibold text-white">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
              </button>
            ) : (
              <button
                ref={authButtonRef}
                onClick={handleGoogleSignIn}
                className="p-2 rounded-full bg-gradient-to-r from-[#803C9A] to-[#FF5757] text-white"
              >
                <span className="material-icons-outlined">login</span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-[#803C9A] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#803C9A] touch-manipulation"
              aria-expanded={isOpen}
              aria-label="Open main menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100 shadow-lg`}
        onClick={() => setIsOpen(false)}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/resources" className="text-gray-700 hover:text-[#803C9A] block px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50">
            Resources
          </Link>
          <Link href="/community" className="text-gray-700 hover:text-[#803C9A] block px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50">
            Community
          </Link>
          <Link href="/posts" className="text-gray-700 hover:text-[#803C9A] block px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50">
            Blog
          </Link>
          {user?.email === 'admin@example.com' && (
            <Link href="/admin" className="text-gray-700 hover:text-[#803C9A] block px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50">
              Admin Dashboard
            </Link>
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className="w-full text-left text-gray-700 hover:text-[#803C9A] px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Auth Menu */}
      {showAuthMenu && user && (
        <div 
          ref={authMenuRef}
          className="absolute right-4 top-20 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-100"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#803C9A] to-[#FF5757] flex items-center justify-center">
                <span className="text-xl font-semibold text-white">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {showProfileEdit ? (
            <div className="px-4 py-3">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder={user.displayName || 'Enter display name'}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowProfileEdit(false)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-[#803C9A] to-[#FF5757] rounded-md hover:shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#803C9A]/5 transition-colors flex items-center"
              >
                <span className="material-icons-outlined text-lg mr-2">person</span>
                Edit Profile
              </button>
              <div className="px-4 py-2 text-xs text-gray-500">
                <p>User ID: {user.uid.slice(0, 8)}...</p>
                <p>Email verified: {user.emailVerified ? 'Yes' : 'No'}</p>
              </div>
              <div className="border-t border-gray-100 mt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#803C9A]/5 transition-colors flex items-center"
                >
                  <span className="material-icons-outlined text-lg mr-2">logout</span>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  )
} 