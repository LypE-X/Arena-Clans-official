'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Review, Team, TeamMessage } from '../../../types';
import * as db from '../../../services/dbService';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import { Icons } from '../../../components/ui/Icons';
import ReviewModal from '../../../components/modals/ReviewModal';
import CommentsModal from '../../../components/modals/CommentsModal';
import InboxModal from '../../../components/modals/InboxModal';
import ReportModal from '../../../components/modals/ReportModal';
import { useAppContext } from '../../../components/layout/AppShell';
import { supabase } from '../../../services/supabaseClient';

const TeamProfilePage = () => {
  const { user, openChat } = useAppContext();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const BUCKET_URL = "https://supabase.co";

  const [team, setTeam] = useState<Team | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inbox, setInbox] = useState<{ otherTeam: Team; lastMessage: TeamMessage }[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
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

    // esperar o trigger do supabase terminar
    await new Promise(r => setTimeout(r, 300));

    const t = await db.getTeamById(id as string);
    setTeam(t || null);

    const r = await db.getReviews(id as string);
    setReviews(r);

    if (user?.teamId) {
      const already = r.find((rv) => rv.authorTeamId === user.teamId);
      setMyReview(already || null);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (id) {
        const t = await db.getTeamById(id as string);
        setTeam(t || null);

        const r = await db.getReviews(id as string);
        setReviews(r);

        if (user?.teamId) {
          const already = r.find((rv) => rv.authorTeamId === user.teamId);
          setMyReview(already || null);
        }

        if (isMyTeam) {
          const msgs = await db.getInbox(id as string);
          setInbox(msgs);
        }
      }
    };
    load();
  }, [id, user, isMyTeam]);

  useEffect(() => {
    if (!user?.teamId) return;

    const channel = supabase
      .channel('inbox-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_messages'
        },
        async (payload) => {
          const msg = payload.new;

          // 🔥 só atualiza se for mensagem relacionada ao usuário
          if (
            msg.from_team_id === user.teamId ||
            msg.to_team_id === user.teamId
          ) {
            await refreshInbox();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (user?.teamId) {
      const already = reviews.find((rv) => rv.authorTeamId === user.teamId);
      setMyReview(already || null);
    }
  }, [reviews, user]);



  const total = reviews.length;
  const avgConduta = total ? reviews.reduce((acc, r) => acc + r.boaConduta, 0) / total : 0;
  const avgComunicacao = total ? reviews.reduce((acc, r) => acc + r.comunicacao, 0) / total : 0;
  const avgPontualidade = total ? reviews.reduce((acc, r) => acc + r.pontualidade, 0) / total : 0;

  if (!team) return <div className="text-center py-20">Equipe não encontrada.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-dark-800/50 rounded-2xl p-8 border border-dark-700 relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#21ff21] to-[#16cc16]"></div>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <img
            src={
              !team.photoUrl
                ? '/logo.png'
                : team.photoUrl.startsWith('data:image')
                  ? team.photoUrl
                  : `https://cdhwjnecglzfetmvyrwk.supabase.co/storage/v1/object/public/perfil_img/${team.photoUrl}`
            }
            alt={team.name}
            className="w-16 h-16 rounded-lg object-cover bg-dark-900"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">{team.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <Badge color="blue">{team.game}</Badge>
              <Badge color="gray">
                {team.region.state}
              </Badge>
              <div className="flex items-center gap-1 text-[#21ff21]">
                <Icons.Star fill />
                <span className="font-bold text-yellow-400">
                  {/* O "|| 0" garante que se o rating for null/undefined, ele mostre 0.0 */}
                  {Number(team.rating || 0).toFixed(1)}
                </span>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl">{team.description}</p>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {isMyTeam ? (
              <>
                <Button
                  className="!bg-[#21ff21] !text-black hover:!bg-[#16cc16] w-full font-black uppercase text-[10px] tracking-widest !border-none shadow-[0_0_15px_rgba(33,255,33,0.3)] flex items-center justify-center gap-2 group"
                  onClick={() => router.push(`/edit-team/${team.id}`)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 transition-transform group-hover:rotate-12">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  EDITAR PERFIL
                </Button>

                <Button
                  className="!bg-[#21ff21] !text-black hover:!bg-[#16cc16] w-full font-black uppercase text-[10px] tracking-widest !border-none shadow-[0_0_15px_rgba(33,255,33,0.3)] flex items-center justify-center gap-2"
                  onClick={() => setShowInbox(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  VER MENSAGENS
                </Button>
              </>
            ) : (
              <>
                {user?.teamId && (
                  <Button
                    onClick={() => openChat(team.id)}
                    className="!bg-[#21ff21] !text-black hover:!bg-[#16cc16] w-full font-black uppercase text-[10px] tracking-widest !border-none shadow-[0_0_15px_rgba(33,255,33,0.3)] flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.5 8.5 0 0 1 4.7 1.4L22 3l-1.5 6.5z" />
                    </svg>
                    ENVIAR MENSAGEM
                  </Button>
                )}

                {user?.teamId && (
                  <Button
                    className="!bg-[#21ff21] !text-black hover:!bg-[#16cc16] w-full font-black uppercase text-[10px] tracking-widest !border-none shadow-[0_0_15px_rgba(33,255,33,0.3)] flex items-center justify-center gap-2"
                    onClick={() => setShowReview(true)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {myReview ? 'EDITAR AVALIAÇÃO' : 'AVALIAR EQUIPE'}
                  </Button>
                )}
              </>
            )}

            {!isMyTeam && user?.teamId && (
              <Button
                className="!bg-red-600 !text-white hover:!bg-red-500 w-full font-black uppercase text-[10px] tracking-widest !border-none shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 mt-4"
                onClick={() => setShowReport(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                REPORTAR EQUIPE
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

      {showComments && <CommentsModal open={showComments} onClose={() => setShowComments(false)} reviews={reviews} />}

      {showInbox && user?.teamId && (
        <InboxModal
          open={showInbox}
          onClose={() => setShowInbox(false)}
          inbox={inbox}
          myTeamId={user.teamId}
          onOpenChat={openChat}
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
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Reputação</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#21ff21]"> {Number(team.rating).toFixed(1)}</span>
                <div className="flex flex-col items-end">
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                  <span className="text-xs text-gray-400">{reviews.length} avaliações</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Boa conduta</span>
                  <span className="text-sm text-[#21ff21] font-bold">{avgConduta.toFixed(1)}</span>
                </div>
                <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#21ff21] transition-all duration-500 ease-out"
                    style={{ width: `${avgConduta * 20}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Comunicação</span>
                  <span className="text-sm text-[#21ff21] font-bold">{avgComunicacao.toFixed(1)}</span>
                </div>
                <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#21ff21] transition-all duration-500 ease-out"
                    style={{ width: `${avgComunicacao * 20}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-300">Pontualidade</span>
                  <span className="text-sm text-[#21ff21] font-bold">{avgPontualidade.toFixed(1)}</span>
                </div>
                <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#21ff21] transition-all duration-500 ease-out"
                    style={{ width: `${avgPontualidade * 20}%` }}
                  />
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
    </div>
  );
};

export default TeamProfilePage;

