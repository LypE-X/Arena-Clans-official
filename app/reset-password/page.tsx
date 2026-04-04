'use client';

import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      setMessage('Erro: ' + error.message);
    } else {
      setMessage('Senha atualizada com sucesso 🎉');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <h1 className="text-xl font-bold text-center">
          Nova senha
        </h1>

        <input
          type="password"
          placeholder="Digite a nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#21ff21] text-black p-3 rounded"
        >
          {loading ? 'Atualizando...' : 'Atualizar senha'}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-300">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}