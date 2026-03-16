import React, { useEffect, useRef, useState } from 'react';

import { Team, TeamMessage } from '../../types';
import * as db from '../../services/dbService';
import { Icons } from '../ui/Icons';

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
      await db.markMessageNotificationsFromTeamRead(userId, teamId);

      // 4. Atualiza Navbar
      refreshNotifications();

      // Scroll
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    load();
  }, [open, teamId, currentTeamId, userId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const msg = await db.sendMessage(currentTeamId, teamId, text);
    setMessages((prev) => [...prev, msg]);
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
              src={otherTeam.photoUrl || '/logo.png'}
              alt={otherTeam.name}
              className="w-10 h-10 rounded-full object-cover border border-[#21ff21]"
            />
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-sm sm:text-base">{otherTeam.name}</h3>
              <span className="text-[#21ff21] text-xs">Online</span>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-300 hover:text-white text-xl leading-none">
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
            <p className="text-center text-gray-500 text-sm mt-6">Comece a conversa!</p>
          )}

          {messages.map((m) => {
            const isMe = m.fromTeamId === currentTeamId;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
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
                    {isMe && (m.read ? ' ✅ Lida' : ' ✅ Enviada')}
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
            onChange={(e) => setText(e.target.value)}
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

export default ChatModal;

