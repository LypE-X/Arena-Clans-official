import React, { useEffect, useRef, useState } from 'react';

import { Team, TeamMessage } from '../../types';
import * as db from '../../services/dbService';
import { supabase } from '@/services/supabaseClient';
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
  const [messagesCache, setMessagesCache] = useState<Record<string, any[]>>({});

  // Load team + messages
  useEffect(() => {
    if (!open || !currentTeamId || !teamId) return;

    const loadMessages = async () => {

      // ✅ 1. usa cache se já existir
      if (messagesCache[teamId]) {
        setMessages(messagesCache[teamId]);

        // ainda precisa carregar o time
        const team = await db.getTeamById(teamId);
        setOtherTeam(team);

        return;
      }

      // ✅ 2. busca tudo em paralelo
      const [msgs, team] = await Promise.all([
        db.getTeamMessages(currentTeamId, teamId),
        db.getTeamById(teamId)
      ]);

      setMessages(msgs);
      setOtherTeam(team);

      // ✅ 3. salva no cache
      setMessagesCache((prev) => ({
        ...prev,
        [teamId]: msgs
      }));
    };

    loadMessages();

    const channel = supabase
      .channel('chat-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_messages'
      }, (payload: any) => {
        const newMsg = payload.new;
        if (
          (newMsg.from_team_id === currentTeamId && newMsg.to_team_id === teamId) ||
          (newMsg.from_team_id === teamId && newMsg.to_team_id === currentTeamId)
        ) {
          setMessages((current) => [
            ...current,
            {
              id: newMsg.id,
              fromTeamId: newMsg.from_team_id,
              toTeamId: newMsg.to_team_id,
              text: newMsg.text,
              read: newMsg.read,
              timestamp: new Date(newMsg.timestamp).getTime()
            }
          ]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, currentTeamId, teamId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  useEffect(() => {
    if (!open) return;

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: 'auto'
      });
    }, 100);
  }, [open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      // 1. Envia para o banco de dados (o Realtime cuidará de mostrar na tela)
      await db.sendMessage(currentTeamId, teamId, text);

      // 2. Limpa o campo de texto
      setText('');

      // 3. Rola para baixo
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Não foi possível enviar a mensagem.");
    }
  };

  if (!open || !otherTeam) return null;
  const visibleMessages = messages.slice(-50);

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

          {visibleMessages.map((m) => {
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

