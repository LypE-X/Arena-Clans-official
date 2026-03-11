'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useAppContext } from '../../components/layout/AppShell';

const MyTeamRedirectPage = () => {
  const { user } = useAppContext();
  const router = useRouter();

  React.useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (user.teamId) {
      router.replace(`/team/${user.teamId}`);
    } else {
      router.replace('/');
    }
  }, [user, router]);

  return null;
};

export default MyTeamRedirectPage;

