'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { auth, db } from '@/lib/firebase'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

interface UserProfile {
  displayName: string;
  bio: string;
  socialLink: string;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthMenu, setShowAuthMenu] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newBio, setNewBio] = useState('')
  const [newSocialLink, setNewSocialLink] = useState('')
  const [isSaving, setIsSaving] = useState(false)
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch user profile data when user signs in
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setNewDisplayName(userProfile.displayName || '');
          setNewBio(userProfile.bio || '');
          setNewSocialLink(userProfile.socialLink || '');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'user_profiles', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

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
    if (!user) return;
    setIsSaving(true);
    try {
      // Prepare the profile data first
      const profileData = {
        displayName: newDisplayName.trim(),
        bio: newBio.trim(),
        socialLink: newSocialLink.trim(),
        email: user.email || '',
        updatedAt: new Date().toISOString()
      };

      // Update profile in Firestore first
      const userDocRef = doc(db, 'user_profiles', user.uid);
      
      try {
        // Try to update existing document
        await updateDoc(userDocRef, profileData);
      } catch (error) {
        // If document doesn't exist, create it
        await setDoc(userDocRef, {
          ...profileData,
          createdAt: new Date().toISOString()
        });
      }

      // After Firestore update succeeds, update Firebase Auth profile
      if (newDisplayName.trim()) {
        await updateProfile(user, {
          displayName: newDisplayName.trim()
        });
      }

      // Update local state to reflect changes
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            displayName: newDisplayName.trim() || prevUser.displayName || ''
          } as User;
        }
        return prevUser;
      });
      
      // Show success animation
      setIsSaving(false);
      
      // Close the edit form after a short delay
      setTimeout(() => {
        setShowProfileEdit(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsSaving(false);
      // More specific error message
      if (error instanceof Error) {
        alert(`Failed to update profile: ${error.message}`);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm border-b border-[#751731]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white overflow-hidden p-1 transition-all duration-300 group-hover:scale-105 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-[#751731]/10 to-[#F4D165]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                <Image
                  src="/logo.png"
                  alt="Nextali Logo"
                  fill
                  className="object-contain rounded-full transform transition-transform duration-700 group-hover:scale-110 animate-butterfly"
                  sizes="(max-width: 640px) 48px, 56px"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#751731] to-[#F4D165] bg-clip-text text-transparent whitespace-nowrap">
                  Nextali
                </span>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Empowering African Business</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
            <Link href="/resources" className="text-gray-700 hover:text-[#751731] px-3 py-2 text-base font-medium">
              Resources
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-[#751731] px-3 py-2 text-base font-medium">
              Community
            </Link>
            <Link href="/posts" className="text-gray-700 hover:text-[#751731] px-3 py-2 text-base font-medium">
              Blog
            </Link>
            {user?.email === 'admin@example.com' && (
              <Link href="/admin" className="text-gray-700 hover:text-[#751731] px-3 py-2 text-base font-medium">
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#751731]/5 hover:bg-[#751731]/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#751731] to-[#F4D165] flex items-center justify-center shadow-md">
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
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 border border-[#751731]/10"
                    >
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#751731]/5 transition-colors"
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
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#751731] to-[#F4D165] text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#751731] to-[#F4D165] flex items-center justify-center shadow-md">
                  <span className="text-base font-semibold text-white">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </span>
                </div>
              </button>
            ) : (
              <button
                ref={authButtonRef}
                onClick={handleGoogleSignIn}
                className="p-2 rounded-full bg-gradient-to-r from-[#751731] to-[#F4D165] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="material-icons-outlined">login</span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-[#751731] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#751731] touch-manipulation"
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
          <Link href="/resources" className="text-gray-700 hover:text-[#751731] block px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50">
            Resources
          </Link>
          <Link href="/community" className="text-gray-700 hover:text-[#751731] block px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50">
            Community
          </Link>
          <Link href="/posts" className="text-gray-700 hover:text-[#751731] block px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50">
            Blog
          </Link>
          {user?.email === 'admin@example.com' && (
            <Link href="/admin" className="text-gray-700 hover:text-[#751731] block px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50">
              Admin Dashboard
            </Link>
          )}
          {user && (
            <button
              onClick={handleSignOut}
              className="w-full text-left text-gray-700 hover:text-[#751731] px-4 py-2.5 text-lg font-medium rounded-md active:bg-gray-50"
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
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#751731] to-[#F4D165] flex items-center justify-center">
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#751731] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Short Bio
                  </label>
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#751731] focus:border-transparent"
                    rows={3}
                    maxLength={200}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Social Media Link
                  </label>
                  <input
                    type="url"
                    value={newSocialLink}
                    onChange={(e) => setNewSocialLink(e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-[#751731] focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => {
                      setShowProfileEdit(false);
                      // Reset form values to current values
                      const userProfile = getUserProfile(user.uid).then(profile => {
                        if (profile) {
                          setNewDisplayName(profile.displayName || '');
                          setNewBio(profile.bio || '');
                          setNewSocialLink(profile.socialLink || '');
                        }
                      });
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                    className={`px-4 py-1.5 text-sm text-white bg-gradient-to-r from-[#751731] to-[#F4D165] rounded-md hover:shadow-md transition-all relative ${
                      isSaving ? 'cursor-not-allowed opacity-75' : ''
                    }`}
                  >
                    <span className={`transition-opacity duration-200 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>
                      Save Changes
                    </span>
                    {isSaving && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#751731]/5 transition-colors flex items-center"
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
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#751731]/5 transition-colors flex items-center"
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