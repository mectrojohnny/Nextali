'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { logger } from '@/utils/logger';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        logger.debug('Auth state changed:', { 
          isAuthenticated: !!user,
          email: user?.email 
        });

        if (!user || !user.email) {
          logger.debug('User not authenticated, redirecting to login');
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          setAuthorized(false);
          return;
        }

        // Check if user is admin
        const isAdmin = user.email === 'akalagborojohn@gmail.com' || 
                       user.email === 'dollymediateam@gmail.com';

        if (!isAdmin) {
          logger.debug('User not authorized:', { email: user.email });
          router.push('/');
          setAuthorized(false);
          return;
        }

        logger.debug('User authorized:', { email: user.email });
        setAuthorized(true);
      } catch (error) {
        logger.error('Error in auth check:', error);
        router.push('/login');
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
} 