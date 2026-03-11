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

const TeamProfilePage = () => {
  const { user, openChat } = useAppContext();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

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
            src={team.photoUrl}
            alt={team.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-xl object-cover border border-[#21ff21] shadow-2xl bg-dark-950"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">{team.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
              <Badge color="blue">{team.game}</Badge>
              <Badge color="gray">
                {team.region.state} - {team.region.city}
              </Badge>
              <div className="flex items-center gap-1 text-[#21ff21]">
                <Icons.Star fill /> <span className="font-bold text-yellow-400">{team.rating}</span>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl">{team.description}</p>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
            {isMyTeam ? (
              <>
                <Button
                  className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
                  onClick={() => router.push(`/edit-team/${team.id}`)}
                >
                  ✏️ Editar Perfil
                </Button>
                <Button
                  className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
                  onClick={() => setShowInbox(true)}
                >
                  📨 Ver Mensagens
                </Button>
              </>
            ) : (
              <>
                {user?.teamId && (
                  <Button onClick={() => openChat(team.id)} className="w-full">
                    🥊 Enviar Mensagem
                  </Button>
                )}
                {user?.teamId && (
                  <Button
                    className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
                    onClick={() => setShowReview(true)}
                  >
                    {myReview ? '✏️ Editar Avaliação' : '⭐ Avaliar Equipe'}
                  </Button>
                )}
              </>
            )}

            {!isMyTeam && user?.teamId && (
              <Button
                className="bg-[#21ff21] text-black hover:bg-[#16cc16] w-full"
                onClick={() => setShowReport(true)}
              >
                🚨 Reportar Equipe
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
                <span className="text-4xl font-bold text-[#21ff21]">{team.rating}</span>
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

