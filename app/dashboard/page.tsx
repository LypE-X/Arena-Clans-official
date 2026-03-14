'use client';

import React from 'react';
import Link from 'next/link';

import { GameType, Team } from '../../types';
import * as db from '../../services/dbService';
import { BRAZIL_STATES } from '../../constants/brazilStates';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Icons } from '../../components/ui/Icons';
import { useAppContext } from '../../components/layout/AppShell';

const DashboardPage = () => {
  const { user, openChat } = useAppContext();
  const [teams, setTeams] = React.useState<any[]>([]);
  const [filterGame, setFilterGame] = React.useState<GameType | 'ALL'>('ALL');
  const [filterState, setFilterState] = React.useState('');
  const [filterRating, setFilterRating] = React.useState(0);
  const [searchName, setSearchName] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await db.getTeams({
          game: filterGame === 'ALL' ? undefined : filterGame,
          state: filterState,
          minRating: filterRating > 0 ? filterRating : undefined,
        });
        // IMPORTANTE: Se 'data' vier vazio, coloca um array []
        setTeams(data || []);
      } catch (err) {
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [filterGame, filterState, filterRating]);

  const handleChallenge = async (teamId: string) => {
    if (!user?.teamId) {
      alert('Você precisa criar uma equipe para desafiar!');
      return;
    }
    const hasConvo = (await db.getConversation(user.teamId, teamId)).length > 0;
    if (!hasConvo) {
      await db.sendMessage(user.teamId, teamId, 'Olá! Vamos marcar um treino?');
    }
    openChat(teamId);
  };

  const clearFilters = () => {
    setFilterGame('ALL');
    setFilterState('');
    setFilterRating(0);
  };

  const filteredTeams = (teams || []).filter((team) => {
    if (!searchName) return true;
    return team.name?.toLowerCase().includes(searchName.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="w-full">
          <h1 className="text-4xl font-extrabold text-white mb-2 text-center">Escolha uma equipe e desafie!</h1>
        </div>
      </div>

      <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700 mb-8 flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex gap-2 bg-dark-900 p-1 rounded-lg self-start">
          {(['ALL', GameType.VALORANT, GameType.LOL] as const).map((g) => (
            <button
              key={g}
              onClick={() => setFilterGame(g)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterGame === g ? 'bg-[#21ff21] text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
            >
              {g === 'ALL' ? 'Todos' : g}
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
            className="w-full lg:w-64 bg-dark-900 border border-dark-800 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#21ff21] outline-none"
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
          <button
            onClick={() => {
              setFilterGame('ALL');
              setFilterState('');
              setFilterRating(0);
            }}
            className="text-[#21ff21] hover:underline mt-2 text-sm"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="group relative">
              <Link href={`/team/${team.id}`} className="block h-full">
                <Card className="h-full hover:border-[#21ff21]/50 transition-colors relative overflow-hidden pb-16">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={team.photoUrl} alt={team.name} className="w-16 h-16 rounded-lg object-cover bg-dark-900" />
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-[#21ff21] transition-colors">
                        {team.name}
                      </h3>
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
              {user?.teamId !== team.id && (
                <div className="absolute bottom-4 right-6 z-10">
                  <Button
                    className="bg-[#21ff21] text-black hover:bg-[#16cc16] text-xs py-1 px-3 shadow-none"
                    onClick={() => handleChallenge(team.id)}
                  >
                    🥊 Desafiar
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

export default DashboardPage;

