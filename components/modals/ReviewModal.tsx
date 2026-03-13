import React, { useEffect, useState } from 'react';

import { Team } from '../../types';
import * as db from '../../services/dbService';

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
  const [comment, setComment] = useState('');
  const [authorTeamName, setAuthorTeamName] = useState('');

  // Buscar nome real da equipe avaliadora
  // Carregar dados da equipe avaliadora + review existente
  useEffect(() => {
    const load = async () => {

      // pegar nome da equipe
      const t = await db.getTeamById(authorTeamId);
      if (t) setAuthorTeamName(t.name);

      // 🔎 buscar reviews da equipe alvo
      const reviews = await db.getReviews(targetTeam.id);

      // encontrar review feita por esta equipe
      const existing = reviews.find(
        r => r.authorTeamId === authorTeamId
      );

      // se existir, preencher os campos
      if (existing) {
        setBoaConduta(existing.boaConduta);
        setComunicacao(existing.comunicacao);
        setPontualidade(existing.pontualidade);
        setComment(existing.comment || "");
      }

    };

    load();
  }, [authorTeamId, targetTeam.id]);

  if (!open) return null;

  const setRating = (setter: any, value: number) => setter(value);

  const handleSubmit = async () => {
    if (!boaConduta || !comunicacao || !pontualidade) {
      alert('Selecione todas as notas antes de enviar.');
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

    // esperar o trigger do supabase atualizar o rating
    setTimeout(async () => {
      await onReviewSubmitted?.();
    }, 400);

    onClose();
  };

  const RatingStars = ({ value, setter }: { value: number; setter: (v: number) => void }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`cursor-pointer text-3xl transition-all ${n <= value ? 'text-yellow-400' : 'text-gray-600'}`}
          onClick={() => setRating(setter, n)}
        >
          ⭐
        </span>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-dark-900 w-full max-w-md rounded-2xl p-6 border border-[#21ff21]/40 shadow-xl shadow-[#21ff21]/20">
        {/* Título */}
        <h2 className="text-xl font-bold text-white mb-4 text-center">Avaliar {targetTeam.name}</h2>

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
            onChange={(e) => setComment(e.target.value)}
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

export default ReviewModal;

