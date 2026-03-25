import React from 'react';

import { Team, TeamMessage } from '../../types';
import * as db from '../../services/dbService';
import Button from '../ui/Button';

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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">📨 Suas Conversas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="overflow-y-auto flex-1 pr-2 space-y-3">
          {inbox.length === 0 ? (
            <p className="text-gray-500 text-center mt-4 italic">Você ainda não tem conversas.</p>
          ) : (
            inbox.map(({ otherTeam, lastMessage }) => {
              if (!lastMessage) return null;

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
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${isUnread ? 'bg-dark-800/40 border-[#21ff21]/60' : 'bg-dark-800/20 border-dark-700'
                    } hover:bg-dark-800/60`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        !otherTeam.photoUrl
                          ? '/logo.png'
                          : otherTeam.photoUrl.startsWith('data:image')
                            ? otherTeam.photoUrl
                            : `https://cdhwjnecglzfetmvyrwk.supabase.co/storage/v1/object/public/perfil_img/${otherTeam.photoUrl}`
                      }
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-[#21ff21]/30"
                    />
                    <div>
                      <h3 className="text-white font-bold text-sm flex items-center gap-5">
                        {otherTeam.name}
                        {isUnread && (
                          <span className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                        )}
                      </h3>
                      <p className={`text-xs ${isUnread ? 'text-[#21ff21]' : 'text-gray-400'}`}>
                        {lastMessage.text.substring(0, 35)}
                        {lastMessage.text.length > 35 && '...'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[10px] text-gray-500 block">
                      {new Date(lastMessage.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-dark-800">
          <Button onClick={onClose} className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InboxModal;

