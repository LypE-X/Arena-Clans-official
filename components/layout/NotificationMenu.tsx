'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../ui/Icons';
import * as db from '@/services/dbService';
import { supabase } from '@/services/supabaseClient';
import { markNotificationAsReadAction } from "@/services/actions";


// Adicione onOpenChat nas Props
export default function NotificationMenu({
    userId,
    onOpenChat
}: {
    userId: string;
    onOpenChat: (teamId: string) => void
}) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const data = await db.getNotifications(userId);
            setNotifications(data);
        };
        load();

        const channel = supabase
            .channel('realtime-notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const totalUnread = notifications.filter(n => !n.read).length;

    // Função de clique com roteamento inteligente
    const handleNotificationClick = async (n: any) => {
        // 2. Chame a Action que ignora o RLS e grava de verdade no banco
        await markNotificationAsReadAction(n.id);

        // 3. Atualiza o estado local para sumir a bolinha na hora
        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));

        setIsOpen(false);

        if (n.type === 'message' && n.related_team_id) {
            onOpenChat(n.related_team_id);
        } else {
            router.push('/my-team');
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-400 hover:text-[#21ff21] transition">
                <Icons.Bell />
                {totalUnread > 0 && (
                    <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full animate-pulse">
                        {totalUnread}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-[100] max-h-[400px] overflow-y-auto">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0f0f0f]">
                        <h3 className="font-bold text-white text-sm">Notificações</h3>
                        <span className="text-xs text-gray-500">{totalUnread} novas</span>
                    </div>

                    {notifications.length === 0 ? (
                        <p className="p-8 text-center text-gray-500 text-sm italic">Silêncio por aqui...</p>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => handleNotificationClick(n)} // Passa o objeto completo
                                className={`p-4 border-b border-white/5 flex gap-3 hover:bg-white/10 cursor-pointer transition ${!n.read ? 'bg-[#21ff21]/5' : ''}`}
                            >
                                <div className="mt-1 flex-shrink-0">
                                    {n.type === 'message' ? (
                                        <div className="text-blue-400"><Icons.Message /></div>
                                    ) : (
                                        <div className="text-yellow-400"><Icons.Star fill={true} /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-semibold text-gray-100 truncate">{n.title}</p>
                                    <p className="text-xs text-gray-400 leading-relaxed">{n.message}</p>
                                    <span className="text-[10px] text-gray-600 block mt-1">
                                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {!n.read && (
                                    <div className="self-center flex-shrink-0">
                                        <div className="w-2 h-2 bg-[#21ff21] rounded-full shadow-[0_0_8px_#21ff21]" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}