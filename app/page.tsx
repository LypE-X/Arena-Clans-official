'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../components/layout/AppShell';
import Dashboard from './dashboard/page';

export default function HomePage() {
  const { user } = useAppContext();
  const router = useRouter();

  if (!user) {
    router.push('/auth');
    return null;
  }

  return <Dashboard />;
}


