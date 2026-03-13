import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from "next/image"

import { Notification, User } from '../../types';
import * as db from '../../services/dbService';
import { Icons } from '../ui/Icons';


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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadTeamIds = new Set(
    notifications
      .filter((n) => !n.read && n.type === 'message' && n.relatedTeamId)
      .map((n) => n.relatedTeamId)
  );

  const unreadCount = unreadTeamIds.size;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await db.markNotificationRead(notification.id);
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    }

    if (notification.type === 'message' && notification.relatedTeamId) {
      onOpenChat(notification.relatedTeamId);
      setShowNotifications(false);
    }
  };

  if (!user) return null; // Hide Navbar if not logged in

  return (
    <nav className="sticky top-0 z-50 border-b border-[#21ff21]/20 bg-black/70 backdrop-blur-xl shadow-[0_0_20px_rgba(33,255,33,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Arena Clans Logo"
              width={64}
              height={64}
              className="object-contain drop-shadow-[0_0_6px_#21ff21] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_#21ff21]"
            />

            <span className="font-bold text-xl tracking-tight text-white transition-colors duration-300 group-hover:text-[#21ff21]">
              ARENA-<span className="text-[#21ff21]">CLANS</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 sm:w-5 sm:h-5 mr-0 sm:mr-2 text-[#21ff21]"
              >
                <path d="M3 9l9-7 9 7" />
                <path d="M9 22V12h6v10" />
              </svg>
              <span className="hidden sm:inline">Início</span>
            </Link>
            {user.teamId ? (
              <Link
                href="/my-team"
                className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 sm:w-5 sm:h-5 mr-0 sm:mr-2 text-[#21ff21]"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20c0-3 2-5 6-5s6 2 6 5" />
                </svg>
                <span className="hidden sm:inline">Minha Equipe</span>
              </Link>
            ) : (
              <Link href="/create-team" className="text-sm text-[#21ff21] hover:text-[#16cc16]">
                Criar Equipe
              </Link>
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
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 border-b border-dark-800 hover:bg-dark-800/50 cursor-pointer transition-colors ${!n.read ? 'bg-dark-800/30' : ''
                            }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-semibold text-white">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 bg-[#21ff21] rounded-full"></span>}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-gray-600 mt-2 block">
                            {new Date(n.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-dark-800 mx-2"></div>
            <button type="button" onClick={onRequestLogout} className="text-sm text-gray-400 hover:text-white">
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

