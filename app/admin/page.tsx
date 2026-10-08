'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth') === 'true';
    if (isAuth) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-5xl mb-4">🍛</div>
        <p className="text-muted">Redirecting...</p>
      </div>
    </div>
  );
}
