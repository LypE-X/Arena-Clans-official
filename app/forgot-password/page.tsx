'use client';

import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.arenaclans.com/reset-password'
    });

    if (error) {
      setMessage('Erro: ' + error.message);
    } else {
      setMessage('Email enviado! Verifique sua caixa de entrada 📩');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSendEmail} className="space-y-4">
        <h1 className="text-xl font-bold text-center">
          Recuperar senha
        </h1>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#21ff21] text-black p-3 rounded"
        >
          {loading ? 'Enviando...' : 'Enviar link'}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-300">
            {message}
          </p>
        )}

        <Link href="/auth" className="block text-center text-sm text-gray-400">
          Voltar para login
        </Link>
      </form>
    </div>
  );
}