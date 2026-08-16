'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (token) {
        // quick check local redirect to dashboard
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    } catch (e) {
      router.replace('/admin/login');
    }
  }, [router]);

  return null;
}
