import React, { useState } from 'react';

import * as db from '../../services/dbService';

type ReportModalProps = {
  open: boolean;
  onClose: () => void;
  targetTeamId: string;
  authorTeamId: string;
};

const ReportModal = ({ open, onClose, targetTeamId, authorTeamId }: ReportModalProps) => {
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert('Descreva o motivo do report.');
      return;
    }

    let fileUrl: string | null = null;

    if (file) {
      fileUrl = URL.createObjectURL(file);
    }

    await db.addReport({
      id: crypto.randomUUID(),
      targetTeamId,
      authorTeamId,
      comment,
      fileUrl,
      createdAt: Date.now()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[300] p-4">
      <div className="bg-dark-900 w-full max-w-md rounded-2xl p-6 border border-red-500/40">
        <h2 className="text-lg font-bold text-white mb-4">Reportar Equipe</h2>

        <textarea
          placeholder="Descreva o problema"
          className="w-full h-24 p-3 bg-dark-800 rounded-lg border border-dark-700 text-white"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <input
          type="file"
          accept="image/*,video/*"
          className="mt-3 text-sm text-gray-400"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-dark-700 py-2 rounded-lg text-gray-300 hover:bg-dark-600"
          >
            Cancelar
          </button>

          <button onClick={handleSubmit} className="flex-1 bg-red-600 py-2 rounded-lg text-white hover:bg-red-500">
            Enviar Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;

