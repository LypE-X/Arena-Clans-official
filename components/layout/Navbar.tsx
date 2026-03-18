import React from 'react';
import Link from 'next/link';
import Image from "next/image";

import { User } from '../../types';
import NotificationMenu from './NotificationMenu'; // Certifique-se que o caminho está correto
import { Icons } from '../ui/Icons';

const Navbar = ({
  user,
  onOpenChat,
  onRequestLogout
}: {
  user: User | null;
  onOpenChat: (teamId: string) => void;
  notificationVersion: number;
  onRequestLogout: () => void;
}) => {

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#21ff21]/20 bg-black/70 backdrop-blur-xl shadow-[0_0_20px_rgba(33,255,33,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
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

          {/* Links e Ações */}
          <div className="flex items-center gap-4">
            {/* Link Início - Restaurado SVG Original */}
            <Link href="/" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
              <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-5 sm:h-5 mr-0 sm:mr-2 text-[#21ff21]">
                <path d="M3 9l9-7 9 7" />
                <path d="M9 22V12h6v10" />
              </svg>
              <span className="hidden sm:inline">Início</span>
            </Link>

            {/* Link Minha Equipe - Restaurado SVG Original */}
            {user.teamId ? (
              <Link href="/my-team" className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-5 sm:h-5 mr-0 sm:mr-2 text-[#21ff21]">
                  <circle cx="12" cy="8" r="4" /><path d="M6 20c0-3 2-5 6-5s6 2 6 5" />
                </svg>
                <span className="hidden sm:inline">Minha Equipe</span>
              </Link>
            ) : (
              <Link href="/create-team" className="text-sm text-[#21ff21] hover:text-[#16cc16]">
                Criar Equipe
              </Link>
            )}

            {/* ✅ O Menu de Notificações agora está isolado e não quebra os outros */}
            <NotificationMenu
              userId={user.uid}
              onOpenChat={onOpenChat}
            />

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