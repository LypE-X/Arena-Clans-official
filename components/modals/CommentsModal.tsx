import React from 'react';

import { Review } from '../../types';
import Button from '../ui/Button';

const CommentsModal = ({
  open,
  onClose,
  reviews
}: {
  open: boolean;
  onClose: () => void;
  reviews: Review[];
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-[#21ff21]/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Comentários ({reviews.length})</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center italic">Nenhum comentário disponível.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-dark-800 p-4 rounded-xl border border-dark-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-[#21ff21] text-sm block">{r.authorTeamName}</span>
                    <span className="text-[10px] text-gray-500">{new Date(r.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white text-sm font-bold">{r.average}</span>
                  </div>
                </div>
                {r.comment && <p className="text-gray-300 text-sm mt-2 italic">"{r.comment}"</p>}
              </div>
            ))
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

export default CommentsModal;

