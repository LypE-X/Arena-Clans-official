'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { User } from '../../types';
import * as db from '../../services/dbService';

import Navbar from './Navbar';
import ChatModal from '../modals/ChatModal';
import WelcomeModal from '../modals/WelcomeModal';
import { supabase } from '../../services/supabaseClient';
import NotificationModal from '../modals/NotificationModal';

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
  const [activeNotification, setActiveNotification] = useState<any>(null);

  const router = useRouter();

  const refreshNotifications = () => {
    setNotificationVersion((v) => v + 1);
  };

  // ✨ NOVA LÓGICA DE BOAS-VINDAS (Baseada no Banco de Dados)
  useEffect(() => {
    // Só dispara se o usuário estiver logado e a coluna welcome_sent for explicitamente false
    if (user && (user as any).welcome_sent === false) {
      setShowWelcome(true);
    }
  }, [user]);

  const handleCloseWelcome = async () => {
    setShowWelcome(false);

    if (user) {
      // 🛡️ Atualiza no banco para nunca mais mostrar, independente do PC ou Cache
      const { error } = await supabase
        .from('users')
        .update({ welcome_sent: true })
        .eq('uid', user.uid);

      if (!error) {
        // Atualiza o estado local do usuário para refletir a mudança
        setUser({ ...user, welcome_sent: true } as any);
      }
    }
  };

  const handleCloseNotification = async () => {
    if (activeNotification) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', activeNotification.id);
    }

    setActiveNotification(null);
  };

  useEffect(() => {
    if (!user?.uid) return;

    // 1. FUNÇÃO PARA BUSCAR NOTIFICAÇÕES NÃO LIDAS (O que já está no banco)
    const loadUnreadNotification = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.uid)
        .eq('read', false)
        .eq('type', 'moderation')
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle(); // Pega apenas uma ou null

      if (error) {
        // Isso vai forçar o erro a aparecer no console como texto
        console.error('ERRO SUPABASE:', JSON.stringify(error, null, 2));
        return;
      }

      if (error) {
        console.error('Erro ao buscar notificações:', error);
      } else if (data) {
        console.log('NOTIF ANTIGA ENCONTRADA:', data);
        setActiveNotification(data);
      }
    };

    // Executa a busca inicial
    loadUnreadNotification();

    // 2. CONFIGURA O REALTIME (Para o que chegar de agora em diante)
    const channel = supabase
      .channel(`user-notifs-${user.uid}`) // Canal único por usuário
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.uid}`, // Filtra no banco (mais seguro e performático)
        },
        (payload) => {
          console.log('NOVA NOTIFICAÇÃO REALTIME:', payload.new);
          if (payload.new.type === 'moderation') {
            setActiveNotification(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.uid]); // Dependência específica no UID para evitar loops

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

    // 1. Esperamos as duas atualizações no banco terminarem
    await Promise.all([
      db.markConversationRead(user.teamId, teamId),
      db.markMessageNotificationsFromTeamRead(user.uid, teamId)
    ]);

    // 2. SÓ DEPOIS aumentamos a versão para o sino dar o "refresh"
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

        {/* ✅ Modal agora usa a função handleCloseWelcome para salvar no banco */}
        {showWelcome && (
          <WelcomeModal open={showWelcome} onClose={handleCloseWelcome} />
        )}

        {activeNotification && (
          <NotificationModal
            open={!!activeNotification}
            notification={activeNotification}
            onClose={handleCloseNotification}
          />
        )}

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