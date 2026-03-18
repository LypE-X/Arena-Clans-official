import { useState } from 'react';
import { createReport } from "@/services/dbService"; // Verifique se o caminho está correto
import { toast } from "react-hot-toast";

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
      toast.error('Por favor, descreva o motivo da denúncia.');
      return;
    }

    try {
      // Usamos os nomes exatos das colunas do seu banco (target_team_id, etc)
      await createReport({
        target_team_id: targetTeamId,
        author_team_id: authorTeamId,
        comment: comment,
        file_url: null,
      });

      toast.success("Denúncia enviada com sucesso!");
      setComment('');
      onClose();

    } catch (error) {
      // Isso vai mostrar no seu console o erro real vindo do banco
      console.error("Erro ao salvar no Supabase:", error);
      toast.error("Erro ao enviar denúncia. Verifique sua conexão.");
    }
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

