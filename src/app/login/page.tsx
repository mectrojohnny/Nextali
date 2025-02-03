'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(redirect);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#803C9A] to-[#FF5757] bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-gray-600">
          Sign in to access your account and manage your resources
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm text-center">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#803C9A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-t-2 border-b-2 border-gray-600 rounded-full animate-spin"></div>
            Signing in...
          </div>
        ) : (
          <>
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </>
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
} 