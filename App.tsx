import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { User } from './types.ts';
import * as db from './services/dbService.ts';

import Navbar from './components/layout/Navbar.tsx';

import ChatModal from './components/modals/ChatModal.tsx';
import WelcomeModal from './components/modals/WelcomeModal.tsx';

import AuthPage from './pages/AuthPage.tsx';
import CreateTeam from './pages/CreateTeam.tsx';
import Dashboard from './pages/Dashboard.tsx';
import EditTeam from './pages/EditTeam.tsx';
import TeamProfile from './pages/TeamProfile.tsx';
import VerificationPage from './pages/VerificationPage.tsx';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [showWelcome, setShowWelcome] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 🔔 CONTROLE DE ATUALIZAÇÃO DE NOTIFICAÇÕES
  const [notificationVersion, setNotificationVersion] = useState(0);

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

  // Chat State
  const [chatTarget, setChatTarget] = useState<string | null>(null);

  useEffect(() => {
    // Force logout on initial load for visual review as requested previously
    db.logoutUser();
    setUser(null);
    setLoading(false);
  }, []);

  const openChat = async (teamId: string) => {
    if (!user || !user.teamId) return;

    // 1️⃣ Marca mensagens como lidas
    await db.markConversationRead(user.teamId, teamId);

    // 2️⃣ Marca notificações dessa equipe como lidas
    await db.markMessageNotificationsFromTeamRead(user.uid, teamId);

    // 3️⃣ Força Navbar a recarregar notificações
    setNotificationVersion((v) => v + 1);

    // 4️⃣ Abre o chat
    setChatTarget(teamId);
  };

  const closeChat = () => {
    setChatTarget(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen app-background flex items-center justify-center text-[#21ff21]">Carregando...</div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen app-background text-gray-100 font-sans selection:bg-[#21ff21]/30">
        <Navbar
          user={user}
          onOpenChat={openChat}
          notificationVersion={notificationVersion}
          onRequestLogout={() => setShowLogoutConfirm(true)}
        />

        <Routes>
          {/* Default Route: Check Auth. If logged in, Show Dashboard. If not, Login. */}
          <Route path="/" element={user ? <Dashboard user={user} onOpenChat={openChat} /> : <Navigate to="/login" replace />} />

          {/* Auth Routes: If logged in, Redirect to Home. */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage type="login" setUser={setUser} />} />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <AuthPage type="register" setUser={setUser} />}
          />

          <Route
            path="/verify"
            element={user && !user.phoneVerified ? <VerificationPage user={user} setUser={setUser} /> : <Navigate to="/" />}
          />

          <Route
            path="/create-team"
            element={
              user ? (user.teamId ? <Navigate to={`/team/${user.teamId}`} /> : <CreateTeam user={user} setUser={setUser} />) : <Navigate to="/login" />
            }
          />

          <Route path="/edit-team/:id" element={user && user.teamId ? <EditTeam user={user} /> : <Navigate to="/login" />} />

          <Route path="/team/:id" element={<TeamProfile user={user} onOpenChat={openChat} />} />
          <Route path="/my-team" element={user?.teamId ? <Navigate to={`/team/${user.teamId}`} /> : <Navigate to="/" />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Global Chat Modal */}
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
                    // 1. DESTRAVA O SCROLL MANUALMENTE (O mais importante)
                    document.body.style.overflow = 'unset';
                    document.documentElement.style.overflow = 'unset';
                    document.body.style.position = 'static';

                    // 2. Lógica de Logout
                    db.logoutUser();
                    setUser(null);
                    setShowLogoutConfirm(false);

                    // 3. Redireciona e garante o topo
                    window.location.hash = '#/login';
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
    </HashRouter>
  );
};

export default App;
