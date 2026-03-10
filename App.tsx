import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { User, Team, GameType, Review, Notification, TeamMessage } from './types';
import * as db from './services/dbService';
import { generateTeamDescription } from './services/geminiService';

// --- Constants ---
const BRAZIL_STATES = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' }
];

// --- Icons (Lucide implementation) ---
const Icons = {
  Gamepad: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v23m0-2c0 1.105-.895 2-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2zM3 15a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4zm16-4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4a2 2 0 012-2h4z" /></svg>,
  Shield: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Star: ({ fill }: { fill?: boolean }) => <svg className={`w-5 h-5 ${fill ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363 1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  Lock: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Video: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  User: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Check: () => <svg className="w-6 h-6 text-[#21ff21]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Bell: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Message: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
};

// --- Reusable Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }: any) => {
  const base = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const styles = {
    primary: "bg-brand-500 text-black hover:bg-brand-600 shadow-lg shadow-[#21ff21]/50",
    secondary: "bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-700",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost: "text-gray-400 hover:text-white"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant as keyof typeof styles]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <input
      {...props}
      className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] focus:border-[#21ff21] outline-none transition-all placeholder-gray-600"
    />
  </div>
);

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-dark-800/50 border border-dark-800 backdrop-blur-sm rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'green' }: any) => {
  const colors: Record<string, string> = {
    green: "bg-[#21ff21]/30 text-[#21ff21] border-[#21ff21]",
    red: "bg-red-900/30 text-red-400 border-red-900",
    blue: "bg-blue-900/30 text-blue-400 border-blue-900",
    gray: "bg-gray-800 text-gray-400 border-gray-700"
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

// --- WelcomeModal ---

const WelcomeModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-[#21ff21]/40 rounded-2xl shadow-[0_0_25px_#21ff21]/20 p-8 max-w-md w-full text-center">

        {/* Logo */}
        <img
          src="https://i.imgur.com/N2ONXvq.png"
          alt="Arena Clans Logo"
          className="w-20 h-20 mx-auto mb-4 object-contain drop-shadow-[0_0_10px_#21ff21]"
        />

        {/* Título maior */}
        <h2 className="text-3xl font-bold text-white mb-4">
          Bem-vindo ao Arena-Clans!
        </h2>

        {/* Texto maior */}
        <p className="text-gray-300 text-base leading-relaxed mb-6">
          Aqui conectamos equipes com foco em treinos e amistosos reais,
          priorizando compromisso e evolução.
          <br /><br />
          – <span className="text-[#21ff21] font-semibold">Sem toxidade</span><br />
          – <span className="text-[#21ff21] font-semibold">Sem trollagens</span><br />
          – <span className="text-[#21ff21] font-semibold">Somente equipes dedicadas a evoluir</span>
          <br /><br />
          Mantenha o respeito, jogue com seriedade e aproveite a experiência.
        </p>

        {/* Botão */}
        <button
          onClick={onClose}
          className="w-full bg-[#21ff21] text-black font-semibold py-3 rounded-xl hover:bg-[#16cc16] transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// --- Chat Modal Component ---

const ChatModal = ({
  open,
  onClose,
  teamId,
  currentTeamId,
  userId,
  refreshNotifications
}: {
  open: boolean;
  onClose: () => void;
  teamId: string;
  currentTeamId: string;
  userId: string;
  refreshNotifications: () => void;
}) => {
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [text, setText] = useState('');
  const [otherTeam, setOtherTeam] = useState<Team | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load team + messages
  useEffect(() => {
    if (!open || !teamId || !userId) return;

    const load = async () => {
      // 1. Carrega equipe
      const team = await db.getTeamById(teamId);
      setOtherTeam(team || null);

      // 2. Carrega mensagens
      const msgs = await db.getConversation(currentTeamId, teamId);
      setMessages(msgs);

      // 3. Marca notificações dessa equipe como lidas
      await db.markMessageNotificationRead(userId, teamId);

      // 4. Atualiza Navbar
      refreshNotifications();

      // Scroll
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    load();
  }, [open, teamId, currentTeamId, userId]);

  const loadMessages = async () => {
    const msgs = await db.getConversation(currentTeamId, teamId);
    setMessages(msgs);

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const msg = await db.sendMessage(currentTeamId, teamId, text);
    setMessages(prev => [...prev, msg]);
    setText('');

    // Rola para baixo após enviar
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!open || !otherTeam) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className="
          w-full 
          max-w-lg 
          h-[85vh]
          sm:h-[85vh] sm:h-[600px]
          bg-dark-900 
          border border-[#21ff21] 
          rounded-2xl 
          shadow-2xl shadow-[#21ff21]/20 
          flex flex-col 
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            bg-dark-800 
            p-3 sm:p-4 
            border-b border-dark-700 
            flex items-center justify-between
          "
        >
          <div className="flex items-center gap-3">
            <img
              src={otherTeam.photoUrl}
              alt={otherTeam.name}
              className="w-10 h-10 rounded-full object-cover border border-[#21ff21]"
            />
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-sm sm:text-base">
                {otherTeam.name}
              </h3>
              <span className="text-[#21ff21] text-xs">Online</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          className="
            flex-1 
            overflow-y-auto 
            p-3 sm:p-4 
            space-y-4 
            bg-dark-950/40
          "
        >
          {messages.length === 0 && (
            <p className="text-center text-gray-500 text-sm mt-6">
              Comece a conversa!
            </p>
          )}

          {messages.map(m => {
            const isMe = m.fromTeamId === currentTeamId;
            return (
              <div
                key={m.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] 
                    rounded-xl 
                    p-3 
                    text-sm 
                    ${isMe
                      ? 'bg-[#21ff21] text-black rounded-tr-none'
                      : 'bg-dark-800 text-gray-200 border border-dark-700 rounded-tl-none'
                    }
                  `}
                >
                  <p>{m.text}</p>
                  <span
                    className={`
                      text-[10px] block text-right mt-1
                      ${isMe ? 'text-black/60' : 'text-gray-500'}
                    `}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {isMe && (m.read ? ' • Lida' : ' • Enviada')}
                  </span>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-dark-800 border-t border-dark-700 flex gap-2"
        >
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="
              flex-1 
              bg-dark-900 
              border border-dark-700 
              rounded-lg 
              px-4 py-2 
              text-white 
              focus:outline-none 
              focus:border-[#21ff21]
            "
          />
          <button
            type="submit"
            className="
              bg-[#21ff21] 
              text-black 
              p-2 
              rounded-lg 
              hover:bg-[#16cc16] 
              flex items-center justify-center
            "
          >
            <Icons.Message />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Comments Modal ---

const CommentsModal = ({
  open,
  onClose,
  reviews
}: {
  open: boolean;
  onClose: () => void;
  reviews: Review[];
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-[#21ff21]/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Comentários ({reviews.length})</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center italic">Nenhum comentário disponível.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-dark-800 p-4 rounded-xl border border-dark-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-[#21ff21] text-sm block">{r.authorTeamName}</span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(r.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white text-sm font-bold">{r.average}</span>
                  </div>
                </div>
                {r.comment && (
                  <p className="text-gray-300 text-sm mt-2 italic">"{r.comment}"</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-dark-800">
          <Button
            onClick={onClose}
            className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Inbox Modal ---
const InboxModal = ({
  open,
  onClose,
  inbox,
  onOpenChat,
  myTeamId,
  refreshInbox
}: {
  open: boolean;
  onClose: () => void;
  inbox: { otherTeam: Team; lastMessage: TeamMessage }[];
  onOpenChat: (teamId: string) => void;
  myTeamId: string;
  refreshInbox: () => Promise<void>;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-900 w-full max-w-lg rounded-2xl p-6 border border-[#21ff21]/40 shadow-xl shadow-[#21ff21]/20 max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📩 Suas Conversas
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="overflow-y-auto flex-1 pr-2 space-y-3">
          {inbox.length === 0 ? (
            <p className="text-gray-500 text-center mt-4 italic">
              Você ainda não tem conversas.
            </p>
          ) : (
            inbox.map(({ otherTeam, lastMessage }) => {
              const isUnread =
                !lastMessage.read && lastMessage.toTeamId === myTeamId;

              return (
                <div
                  key={otherTeam.id}
                  onClick={async () => {
                    await db.markConversationRead(myTeamId, otherTeam.id);
                    await refreshInbox();
                    onOpenChat(otherTeam.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${isUnread
                    ? "bg-dark-800/40 border-[#21ff21]/60"
                    : "bg-dark-800/20 border-dark-700"
                    } hover:bg-dark-800/60`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={otherTeam.photoUrl}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-[#21ff21]/30"
                    />
                    <div>
                      <h3 className="text-white font-bold text-sm">
                        {otherTeam.name}
                      </h3>
                      <p
                        className={`text-xs ${isUnread ? "text-[#21ff21]" : "text-gray-400"
                          }`}
                      >
                        {lastMessage.text.substring(0, 35)}
                        {lastMessage.text.length > 35 && "..."}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">
                      {new Date(lastMessage.timestamp).toLocaleDateString()}
                    </span>
                    {isUnread && (
                      <span className="text-[10px] bg-[#21ff21] text-black px-2 py-1 rounded font-bold">
                        NOVA
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-dark-800">
          <Button
            onClick={onClose}
            className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Layout ---

const Navbar = ({
  user,
  onOpenChat,
  notificationVersion,
  onRequestLogout
}: {
  user: User | null;
  onOpenChat: (teamId: string) => void;
  notificationVersion: number;
  onRequestLogout: () => void;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      db.getNotifications(user.uid).then(setNotifications);
    }
  }, [user, notificationVersion]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadTeamIds = new Set(
    notifications
      .filter(n => !n.read && n.type === "message" && n.relatedTeamId)
      .map(n => n.relatedTeamId)
  );

  const unreadCount = unreadTeamIds.size;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await db.markNotificationRead(notification.id);
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }

    if (notification.type === 'message' && notification.relatedTeamId) {
      onOpenChat(notification.relatedTeamId);
      setShowNotifications(false);
    }
  };

  if (!user) return null; // Hide Navbar if not logged in

  return (
    <nav className="sticky top-0 z-50 border-b border-dark-800 bg-dark-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://i.imgur.com/N2ONXvq.png"
              alt="Arena Clans Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-xl tracking-tight text-white">
              ARENA-<span className="text-[#21ff21]">CLANS</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-5 sm:h-5 mr-0 sm:mr-2 text-[#21ff21]">
                <path d="M3 9l9-7 9 7" />
                <path d="M9 22V12h6v10" />
              </svg>
              <span className="hidden sm:inline">Início</span>
            </Link>
            {user.teamId ? (
              <Link to="/my-team" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-5 sm:h-5 mr-0 sm:mr-2 text-[#21ff21]">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20c0-3 2-5 6-5s6 2 6 5" />
                </svg>
                <span className="hidden sm:inline">Minha Equipe</span>
              </Link>
            ) : (
              <Link to="/create-team" className="text-sm text-[#21ff21] hover:text-[#16cc16]">Criar Equipe</Link>
            )}

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-white relative"
              >
                <Icons.Bell />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-dark-950"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-dark-700 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white">Notificações</h3>
                    <span className="text-xs text-gray-500">{unreadCount} novas</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Sem notificações.</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 border-b border-dark-800 hover:bg-dark-800/50 cursor-pointer transition-colors ${!n.read ? 'bg-dark-800/30' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-semibold text-white">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 bg-[#21ff21] rounded-full"></span>}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-gray-600 mt-2 block">{new Date(n.timestamp).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-dark-800 mx-2"></div>
            <button
              type="button"
              onClick={onRequestLogout}
              className="text-sm text-gray-400 hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Pages ---

const AuthPage = ({ type, setUser }: { type: 'login' | 'register', setUser: (u: User) => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', cpf: '', phone: '', city: '', state: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let user;
      if (type === 'login') {
        user = await db.loginUser(formData.email, formData.password);
      } else {
        // Basic validation
        if (!formData.name || !formData.cpf || !formData.phone) throw new Error("Preencha todos os campos obrigatórios.");
        user = await db.registerUser(formData);
      }
      setUser(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo Imgur Image with Extracted ID */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Glow neon atrás do logo */}
        <div className="absolute w-40 h-40 rounded-full bg-[#21ff21]/30 blur-2xl animate-pulse"></div>

        {/* Logo */}
        <img
          src="https://i.imgur.com/N2ONXvq.png"
          alt="Arena Clans Logo"
          className="w-32 md:w-40 relative z-10 drop-shadow-[0_0_25px_#21ff21]"
        />
      </div>

      <Card className="w-full max-w-md border-dark-700 bg-dark-900 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">{type === 'login' ? 'Entrar na Arena' : 'Crie sua conta'}</h2>
          <p className="text-gray-400 text-sm mt-1">{type === 'login' ? 'Acesse para gerenciar sua equipe' : 'Conecte-se aos melhores times'}</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-900/20 border border-red-900 rounded text-red-200 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <>
              <Input label="Nome Completo" placeholder="Seu nome real" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="CPF" placeholder="000.000.000-00" value={formData.cpf} onChange={(e: any) => setFormData({ ...formData, cpf: e.target.value })} required />
                <Input label="WhatsApp" placeholder="(00) 00000-0000" value={formData.phone} onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })} required />
              </div>
            </>
          )}
          <Input label="E-mail" type="email" placeholder="seu@email.com" value={formData.email} onChange={(e: any) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Senha" type="password" placeholder="••••••••" value={formData.password} onChange={(e: any) => setFormData({ ...formData, password: e.target.value })} required />

          <Button
            type="submit"
            className="w-full !bg-[#21ff21] hover:!bg-[#16cc16] !text-black !shadow-[#21ff21]/50 !border-none text-black"
            disabled={loading}
          >
            {loading ? 'Processando...' : (type === 'login' ? 'Entrar' : 'Cadastrar')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {type === 'login' ? (
            <>Não tem conta? <Link to="/register" className="text-[#21ff21] hover:underline font-medium">Cadastre-se</Link></>
          ) : (
            <>Já tem conta? <Link to="/login" className="text-[#21ff21] hover:underline font-medium">Faça login</Link></>
          )}
        </div>
      </Card>

      <p className="mt-8 text-xs text-gray-600">MVP Demo • ARENA-CLANS</p>
    </div>
  );
};

const VerificationPage = ({ user, setUser }: { user: User, setUser: (u: User) => void }) => {
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    setLoading(true);
    await db.sendVerificationCode(user.phone);
    setSent(true);
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    const success = await db.verifyCode(user.uid, code);
    if (success) {
      setUser({ ...user, phoneVerified: true });
      navigate('/');
    } else {
      alert("Código incorreto");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <div className="mx-auto w-12 h-12 bg-[#21ff21]/30 rounded-full flex items-center justify-center mb-4">
          <Icons.Shield />
        </div>
        <h2 className="text-xl font-bold mb-2">Verifique seu WhatsApp</h2>
        <p className="text-gray-400 text-sm mb-6">Para garantir a segurança, enviamos um código para {user.phone}</p>

        {!sent ? (
          <Button onClick={handleSend} disabled={loading} className="w-full">
            {loading ? 'Enviando...' : 'Enviar Código SMS'}
          </Button>
        ) : (
          <div className="space-y-4">
            <Input label="Código de 6 dígitos" placeholder="1234" value={code} onChange={(e: any) => setCode(e.target.value)} />
            <Button onClick={handleVerify} disabled={loading} className="w-full">
              {loading ? 'Verificando...' : 'Confirmar'}
            </Button>
            <button onClick={() => setSent(false)} className="text-xs text-gray-500 underline">Reenviar código</button>
          </div>
        )}
        <div className="mt-4 p-2 bg-[#21ff21]/20 border border-[#21ff21]/50 rounded text-xs text-[#21ff21]">
          Simulação: O código é <b>1234</b>
        </div>
      </Card>
    </div>
  );
};

const Dashboard = ({ user, onOpenChat }: { user: User, onOpenChat: (teamId: string) => void }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filterGame, setFilterGame] = useState<GameType | 'ALL'>('ALL');
  const [filterState, setFilterState] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await db.getTeams({
        game: filterGame === 'ALL' ? undefined : filterGame,
        state: filterState,
        minRating: filterRating > 0 ? filterRating : undefined
      });
      setTeams(data);
      setLoading(false);
    };
    // Debounce state search lightly or just load on effect
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [filterGame, filterState, filterRating]);

  const handleChallenge = async (teamId: string) => {
    if (!user.teamId) {
      alert("Você precisa criar uma equipe para desafiar!");
      return;
    }
    // Auto send initial message logic
    const hasConvo = (await db.getConversation(user.teamId, teamId)).length > 0;
    if (!hasConvo) {
      await db.sendMessage(user.teamId, teamId, "Olá! Vamos marcar um treino?");
    }
    onOpenChat(teamId);
  }

  const clearFilters = () => {
    setFilterGame('ALL');
    setFilterState('');
    setFilterRating(0);
  };

  const filteredTeams = teams.filter(team => {
    if (!searchName) return true;
    return team.name.toLowerCase().includes(searchName.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero / Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="w-full">
          <h1 className="text-4xl font-extrabold text-white mb-2 text-center">Escolha uma equipe e desafie!</h1>
        </div>
      </div>

      <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700 mb-8 flex flex-col lg:flex-row gap-4 items-center">
        {/* Game Filter */}
        <div className="flex gap-2 bg-dark-900 p-1 rounded-lg self-start">
          {(['ALL', GameType.VALORANT, GameType.LOL] as const).map(g => (
            <button
              key={g}
              onClick={() => setFilterGame(g)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterGame === g ? 'bg-[#21ff21] text-black shadow' : 'text-gray-400 hover:text-white'}`}
            >
              {g === 'ALL' ? 'Todos' : g}
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Region Filter - Updated to Select */}
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] focus:border-[#21ff21] outline-none"
          >
            <option value="">Todos os Estados</option>
            {BRAZIL_STATES.map((s) => (
              <option key={s.uf} value={s.uf}>
                {s.uf} - {s.name}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] outline-none text-sm"
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
          >
            <option value={0}>Todas as Reputações</option>
            <option value={3}>⭐ 3+ Estrelas</option>
            <option value={4}>⭐ 4+ Estrelas</option>
            <option value={4.5}>⭐ 4.5+ Estrelas</option>
            <option value={5}>⭐ 5 Estrelas</option>
          </select>

          <input
            type="text"
            placeholder="Buscar equipe pelo nome..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="
    w-full lg:w-64
    bg-dark-900
    border border-dark-800
    rounded-lg
    px-3 py-2.5
    text-white
    placeholder-gray-500
    focus:ring-2 focus:ring-[#21ff21]
    outline-none
  "
          />
        </div>

        <button
          onClick={clearFilters}
          className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-[#21ff21] transition-colors whitespace-nowrap"
        >
          Limpar Filtros
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Carregando equipes...</div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-20 bg-dark-800/20 rounded-xl border border-dashed border-dark-700">
          <p className="text-gray-400 text-lg">Nenhuma equipe encontrada com esses filtros.</p>
          <button onClick={() => { setFilterGame('ALL'); setFilterState(''); setFilterRating(0) }} className="text-[#21ff21] hover:underline mt-2 text-sm">Limpar filtros</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => (
            <div key={team.id} className="group relative">
              <Link to={`/team/${team.id}`} className="block h-full">
                <Card className="h-full hover:border-[#21ff21]/50 transition-colors relative overflow-hidden pb-16">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={team.photoUrl} alt={team.name} className="w-16 h-16 rounded-lg object-cover bg-dark-900" />
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-[#21ff21] transition-colors">{team.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <Badge color="blue">{team.game}</Badge>
                        <span>{team.region.state}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">{team.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-dark-700/50 absolute bottom-4 left-6 right-6">
                    <div className="flex items-center gap-1">
                      <Icons.Star fill />
                      <span className="font-bold text-white">{team.rating}</span>
                      <span className="text-gray-600 text-xs">({team.totalReviews})</span>
                    </div>
                  </div>
                </Card>
              </Link>
              {user.teamId !== team.id && (
                <div className="absolute bottom-4 right-6 z-10">
                  <Button
                    className="bg-[#21ff21] text-black hover:bg-[#16cc16] text-xs py-1 px-3 shadow-none"
                    onClick={() => handleChallenge(team.id)}
                  >
                    💬 Desafiar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EditTeam = ({ user }: { user: User }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    game: GameType.VALORANT,
    region: { country: 'Brasil', state: '', city: '' },
    description: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      if (id) {
        const team = await db.getTeamById(id);
        if (team) {
          if (team.ownerUid !== user.uid) {
            alert("Você não tem permissão para editar esta equipe.");
            navigate('/');
            return;
          }
          setFormData({
            name: team.name,
            game: team.game,
            region: team.region,
            description: team.description,
            photoUrl: team.photoUrl
          });
        }
      }
      setLoading(false);
    };
    loadTeam();
  }, [id, user, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await db.updateTeam(id, formData);
        navigate(`/team/${id}`);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-[#21ff21]">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <h1 className="text-2xl font-bold mb-6">Editar Perfil da Equipe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Nome da Equipe" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Jogo</label>
            <select
              className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white"
              value={formData.game}
              onChange={(e) => setFormData({ ...formData, game: e.target.value as GameType })}
            >
              {Object.values(GameType).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Logo da Equipe</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-center overflow-hidden">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🛡️</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#21ff21] file:text-black hover:file:bg-[#16cc16]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Updated State Input to Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
              <select

                value={formData.region.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    region: { ...formData.region, state: e.target.value }
                  })
                }
                className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] focus:border-[#21ff21] outline-none"
                required
              >
                <option value="">Selecione um estado</option>
                {BRAZIL_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.uf} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Cidade" placeholder="São Paulo" value={formData.region.city} onChange={(e: any) => setFormData({ ...formData, region: { ...formData.region, city: e.target.value } })} required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Descrição / Bio</label>
            <textarea
              rows={3}
              className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

const CreateTeam = ({ user, setUser }: { user: User, setUser: (u: User) => void }) => {
  const navigate = useNavigate();
  const MAX_DESC = 300;
  const [formData, setFormData] = useState({
    name: '',
    game: GameType.VALORANT,
    region: { country: 'Brasil', state: '', city: '' },
    description: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateBio = async () => {
    if (!formData.name) return alert("Preencha o nome da equipe primeiro.");
    setGenerating(true);
    const bio = await generateTeamDescription(formData.name, formData.game, "Competitivo/Tryhard");
    setFormData(prev => ({ ...prev, description: bio }));
    setGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const team = await db.createTeam(user, formData);
      setUser({ ...user, teamId: team.id });
      navigate(`/team/${team.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <h1 className="text-2xl font-bold mb-6">Cadastrar Equipe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Nome da Equipe" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Jogo</label>
            <select
              className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white"
              value={formData.game}
              onChange={(e) => setFormData({ ...formData, game: e.target.value as GameType })}
            >
              {Object.values(GameType).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Logo da Equipe</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-center overflow-hidden">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🛡️</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#21ff21] file:text-black hover:file:bg-[#16cc16]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Updated State Input to Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
              <select
                value={formData.region.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    region: { ...formData.region, state: e.target.value }
                  })
                }
                className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] focus:border-[#21ff21] outline-none"
                required
              >
                <option value="">Selecione um estado</option>
                {BRAZIL_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.uf} - {s.name}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Cidade" placeholder="São Paulo" value={formData.region.city} onChange={(e: any) => setFormData({ ...formData, region: { ...formData.region, city: e.target.value } })} required />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-400">Descrição / Bio</label>
              <button type="button" onClick={handleGenerateBio} disabled={generating} className="text-xs text-[#21ff21] hover:text-[#16cc16] flex items-center gap-1">
              </button>
            </div>
            <textarea
              rows={3}
              maxLength={MAX_DESC}
              className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] outline-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.description.length}/{MAX_DESC}
            </div>

          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Finalizar Cadastro'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

//Report modal - sistema de Report --
type ReportModalProps = {
  open: boolean;
  onClose: () => void;
  targetTeamId: string;
  authorTeamId: string;
};

const ReportModal = ({
  open,
  onClose,
  targetTeamId,
  authorTeamId
}: ReportModalProps) => {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert("Descreva o motivo do report.");
      return;
    }

    let fileUrl: string | null = null;

    if (file) {
      fileUrl = URL.createObjectURL(file);
    }

    await db.addReport({
      id: crypto.randomUUID(),
      targetTeamId,
      authorTeamId,
      comment,
      fileUrl,
      createdAt: Date.now()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[300] p-4">
      <div className="bg-dark-900 w-full max-w-md rounded-2xl p-6 border border-red-500/40">

        <h2 className="text-lg font-bold text-white mb-4">
          Reportar Equipe
        </h2>

        <textarea
          placeholder="Descreva o problema"
          className="w-full h-24 p-3 bg-dark-800 rounded-lg border border-dark-700 text-white"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <input
          type="file"
          accept="image/*,video/*"
          className="mt-3 text-sm text-gray-400"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-dark-700 py-2 rounded-lg text-gray-300 hover:bg-dark-600"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-red-600 py-2 rounded-lg text-white hover:bg-red-500"
          >
            Enviar Report
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Review Modal (FINAL UNIFICADO E CORRIGIDO) ---
const ReviewModal = ({
  open,
  onClose,
  targetTeam,
  authorTeamId,
  onReviewSubmitted
}: {
  open: boolean;
  onClose: () => void;
  targetTeam: Team;
  authorTeamId: string;
  onReviewSubmitted?: () => Promise<void>;
}) => {

  const [boaConduta, setBoaConduta] = useState(0);
  const [comunicacao, setComunicacao] = useState(0);
  const [pontualidade, setPontualidade] = useState(0);
  const [comment, setComment] = useState("");
  const [authorTeamName, setAuthorTeamName] = useState("");

  // Buscar nome real da equipe avaliadora
  useEffect(() => {
    const load = async () => {
      const t = await db.getTeamById(authorTeamId);
      if (t) setAuthorTeamName(t.name);
    };
    load();
  }, [authorTeamId]);

  if (!open) return null;

  const setRating = (setter: any, value: number) => setter(value);

  const handleSubmit = async () => {
    if (!boaConduta || !comunicacao || !pontualidade) {
      alert("Selecione todas as notas antes de enviar.");
      return;
    }

    await db.addReview({
      targetTeamId: targetTeam.id,
      authorTeamId,
      authorTeamName,
      boaConduta,
      comunicacao,
      pontualidade,
      comment
    });

    // 🔄 avisa o TeamProfile para atualizar
    if (onReviewSubmitted) {
      await onReviewSubmitted();
    }

    onClose();
  };

  const RatingStars = ({
    value,
    setter
  }: {
    value: number;
    setter: (v: number) => void;
  }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          className={`cursor-pointer text-3xl transition-all ${n <= value ? "text-yellow-400" : "text-gray-600"
            }`}
          onClick={() => setRating(setter, n)}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-dark-900 w-full max-w-md rounded-2xl p-6 border border-[#21ff21]/40 shadow-xl shadow-[#21ff21]/20">

        {/* Título */}
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Avaliar {targetTeam.name}
        </h2>

        <div className="space-y-5">

          {/* Boa Conduta */}
          <div>
            <p className="text-gray-300 text-sm mb-1">Boa Conduta</p>
            <RatingStars value={boaConduta} setter={setBoaConduta} />
          </div>

          {/* Comunicação */}
          <div>
            <p className="text-gray-300 text-sm mb-1">Comunicação</p>
            <RatingStars value={comunicacao} setter={setComunicacao} />
          </div>

          {/* Pontualidade */}
          <div>
            <p className="text-gray-300 text-sm mb-1">Pontualidade</p>
            <RatingStars value={pontualidade} setter={setPontualidade} />
          </div>

          {/* Comentário */}
          <textarea
            placeholder="Comentário (opcional)"
            className="w-full h-24 p-3 bg-dark-800 rounded-lg border border-dark-700 text-white focus:border-[#21ff21] outline-none"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />

          {/* Botões */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#21ff21] text-black font-semibold py-2 rounded-xl hover:bg-[#16cc16] transition-colors"
          >
            Enviar Avaliação
          </button>

          <button
            onClick={onClose}
            className="w-full mt-2 bg-dark-700 text-gray-200 py-2 rounded-xl hover:bg-dark-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamProfile = ({ user, onOpenChat }: { user: User | null, onOpenChat: (teamId: string) => void }) => {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [inbox, setInbox] = useState<{ otherTeam: Team, lastMessage: TeamMessage }[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);

  const isMyTeam = user?.teamId === id;

  const refreshInbox = async () => {
    if (user?.teamId) {
      const updated = await db.getInbox(user.teamId);
      setInbox(updated);
    }
  };

  const refreshTeamData = async () => {
    if (!id) return;

    const t = await db.getTeamById(id);
    setTeam(t || null);

    const r = await db.getReviews(id);
    setReviews(r);

    if (user?.teamId) {
      const already = r.find(rv => rv.authorTeamId === user.teamId);
      setMyReview(already || null);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (id) {
        const t = await db.getTeamById(id);
        setTeam(t || null);

        const r = await db.getReviews(id);
        setReviews(r);

        // PASSO 2 — identifica se meu time já avaliou
        if (user?.teamId) {
          const already = r.find(rv => rv.authorTeamId === user.teamId);
          setMyReview(already || null);
        }

        const v = await db.getVideos(id);
        setVideos(v);

        if (isMyTeam) {
          const msgs = await db.getInbox(id);
          setInbox(msgs);
        }
      }
    };
    load();
  }, [id, user, isMyTeam]);

  // Calculate Averages for Reputation Panel
  const total = reviews.length;
  const avgConduta = total ? reviews.reduce((acc, r) => acc + r.boaConduta, 0) / total : 0;
  const avgComunicacao = total ? reviews.reduce((acc, r) => acc + r.comunicacao, 0) / total : 0;
  const avgPontualidade = total ? reviews.reduce((acc, r) => acc + r.pontualidade, 0) / total : 0;


  if (!team) return <div className="text-center py-20">Equipe não encontrada.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-dark-800/50 rounded-2xl p-8 border border-dark-700 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#21ff21] to-[#16cc16]"></div>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <img
            src={team.photoUrl}
            alt={team.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-xl object-cover border border-[#21ff21] shadow-2xl bg-dark-950"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">{team.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <Badge color="blue">{team.game}</Badge>
              <Badge color="gray">{team.region.state} - {team.region.city}</Badge>
              <div className="flex items-center gap-1 text-[#21ff21]">
                <Icons.Star fill /> <span className="font-bold text-yellow-400">{team.rating}</span>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl">{team.description}</p>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">

            {isMyTeam ? (
              <>
                {/* Botão Editar Perfil */}
                <Button
                  className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
                  onClick={() => navigate(`/edit-team/${team.id}`)}
                >
                  ✏️ Editar Perfil
                </Button>

                {/* Novo botão Ver Mensagens */}
                <Button
                  className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
                  onClick={() => setShowInbox(true)}
                >
                  📩 Ver Mensagens
                </Button>
              </>
            ) : (
              <>
                {/* Botão mensagem */}
                {user?.teamId && (
                  <Button onClick={() => onOpenChat(team.id)} className="w-full">
                    💬 Enviar Mensagem
                  </Button>
                )}

                {/* Botão Avaliar */}
                {user?.teamId && (
                  <Button
                    className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
                    onClick={() => setShowReview(true)}
                  >
                    {myReview ? "✏️ Editar Avaliação" : "⭐ Avaliar Equipe"}
                  </Button>
                )}
              </>
            )}

            {!isMyTeam && user?.teamId && (
              <Button
                className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
                onClick={() => setShowReport(true)}
              >
                🚩 Reportar Equipe
              </Button>
            )}

          </div>
        </div>
      </div>
      {showReview && user?.teamId && team && (
        <ReviewModal
          open={showReview}
          onClose={() => setShowReview(false)}
          targetTeam={team}
          authorTeamId={user.teamId}
          onReviewSubmitted={refreshTeamData}
        />
      )}

      {showComments && (
        <CommentsModal
          open={showComments}
          onClose={() => setShowComments(false)}
          reviews={reviews}
        />
      )}

      {showInbox && user?.teamId && (
        <InboxModal
          open={showInbox}
          onClose={() => setShowInbox(false)}
          inbox={inbox}
          myTeamId={user.teamId}
          onOpenChat={onOpenChat}
          refreshInbox={refreshInbox}
        />
      )}

      {showReport && user?.teamId && team && (
        <ReportModal
          open={showReport}
          onClose={() => setShowReport(false)}
          targetTeamId={team.id}
          authorTeamId={user.teamId}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Reviews / Messages */}
        <div className="lg:col-span-2 space-y-6">

          {/* New Reputation Panel */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Reputação</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#21ff21]">{team.rating}</span>
                <div className="flex flex-col items-end">
                  <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  <span className="text-xs text-gray-400">{reviews.length} avaliações</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Boa Conduta */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Boa conduta</span>
                  <span className="text-sm text-[#21ff21] font-bold">{avgConduta.toFixed(1)}</span>
                </div>
                <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#21ff21] transition-all duration-500 ease-out" style={{ width: `${avgConduta * 20}%` }} />
                </div>
              </div>

              {/* Comunicação */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Comunicação</span>
                  <span className="text-sm text-[#21ff21] font-bold">{avgComunicacao.toFixed(1)}</span>
                </div>
                <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#21ff21] transition-all duration-500 ease-out" style={{ width: `${avgComunicacao * 20}%` }} />
                </div>
              </div>

              {/* Pontualidade */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Pontualidade</span>
                  <span className="text-sm text-[#21ff21] font-bold">{avgPontualidade.toFixed(1)}</span>
                </div>
                <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#21ff21] transition-all duration-500 ease-out" style={{ width: `${avgPontualidade * 20}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-dark-700/50 pt-4">
              <Button
                onClick={() => setShowComments(true)}
                className="mt-6 bg-[#21ff21] text-black hover:bg-[#16cc16] w-48 mx-auto block py-2 rounded-lg font-semibold shadow-lg"
              >
                Ver comentários
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div >
  );
};

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [showWelcome, setShowWelcome] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 🔔 CONTROLE DE ATUALIZAÇÃO DE NOTIFICAÇÕES
  const [notificationVersion, setNotificationVersion] = useState(0);

  const refreshNotifications = () => {
    setNotificationVersion(v => v + 1);
  };

  useEffect(() => {
    if (!user) return;

    const key = `welcomeSeen_${user.uid}`;

    if (!localStorage.getItem(key)) {
      setShowWelcome(true);
      localStorage.setItem(key, "true");
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
    setNotificationVersion(v => v + 1);

    // 4️⃣ Abre o chat
    setChatTarget(teamId);
  };

  const closeChat = () => {
    setChatTarget(null);
  };

  if (loading) return <div className="min-h-screen app-background flex items-center justify-center text-[#21ff21]">Carregando...</div>;

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
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <AuthPage type="register" setUser={setUser} />} />

          <Route path="/verify" element={user && !user.phoneVerified ? <VerificationPage user={user} setUser={setUser} /> : <Navigate to="/" />} />

          <Route path="/create-team" element={
            user ? (user.teamId ? <Navigate to={`/team/${user.teamId}`} /> : <CreateTeam user={user} setUser={setUser} />)
              : <Navigate to="/login" />
          } />

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

        {showWelcome && (
          <WelcomeModal open={showWelcome} onClose={() => setShowWelcome(false)} />
        )}

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center p-4">
            <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 w-full max-w-sm text-center">
              <p className="text-white mb-6">
                Tem certeza que deseja sair da sua conta?
              </p>

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
                    window.location.hash = "#/login";
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
