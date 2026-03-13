'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { User } from '../../types';
import * as db from '../../services/dbService';

import Navbar from './Navbar';
import ChatModal from '../modals/ChatModal';
import WelcomeModal from '../modals/WelcomeModal';
import { supabase } from '../../services/supabaseClient';

type AppContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  openChat: (teamId: string) => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppShell');
  }
  return ctx;
}

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [showWelcome, setShowWelcome] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [notificationVersion, setNotificationVersion] = useState(0);

  const [chatTarget, setChatTarget] = useState<string | null>(null);

  const router = useRouter();



  const refreshNotifications = () => {
    setNotificationVersion((v) => v + 1);
  };

  useEffect(() => {
    if (!user) return;

    const key = `welcomeSeen_${user.uid}`;

    if (!localStorage.getItem(key)) {
      setShowWelcome(true);
      localStorage.setItem(key, 'true');
    }
  }, [user]);

  // 1️⃣ carregar sessão inicial
  useEffect(() => {
    const loadUser = async () => {
      const user = await db.getCurrentUser();
      setUser(user);
      setLoading(false);
    };

    loadUser();
  }, []);



  const openChat = async (teamId: string) => {
    if (!user || !user.teamId) return;

    await db.markConversationRead(user.teamId, teamId);
    await db.markMessageNotificationsFromTeamRead(user.uid, teamId);

    setNotificationVersion((v) => v + 1);
    setChatTarget(teamId);
  };

  const closeChat = () => {
    setChatTarget(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen app-background flex items-center justify-center text-[#21ff21]">
        Carregando...
      </div>
    );
  }

  const contextValue: AppContextValue = {
    user,
    setUser,
    openChat,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen app-background text-gray-100 font-sans selection:bg-[#21ff21]/30">
        <Navbar
          user={user}
          onOpenChat={openChat}
          notificationVersion={notificationVersion}
          onRequestLogout={() => setShowLogoutConfirm(true)}
        />

        {children}

        {user?.teamId && chatTarget && (
          <ChatModal
            open={!!chatTarget}
            onClose={closeChat}
            teamId={chatTarget}
            currentTeamId={user.teamId}
            userId={user.uid}
            refreshNotifications={refreshNotifications}
          />
        )}

        {showWelcome && <WelcomeModal open={showWelcome} onClose={() => setShowWelcome(false)} />}

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 w-full max-w-sm text-center">
              <p className="text-white mb-6">Tem certeza que deseja sair da sua conta?</p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-dark-800 text-gray-300 hover:bg-dark-700"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    document.body.style.overflow = 'unset';
                    document.documentElement.style.overflow = 'unset';
                    document.body.style.position = 'static';

                    db.logoutUser();
                    setUser(null);
                    setShowLogoutConfirm(false);

                    router.push('/auth');
                    window.scrollTo(0, 0);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}

