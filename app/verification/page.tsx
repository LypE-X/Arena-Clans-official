'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { User } from '../../types';
import * as db from '../../services/dbService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Icons } from '../../components/ui/Icons';
import { useAppContext } from '../../components/layout/AppShell';

const VerificationPage = () => {
  const { user, setUser } = useAppContext();
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleSend = async () => {
    setLoading(true);
    await db.sendVerificationCode(user.phone);
    setSent(true);
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    const success = await db.verifyCode(user.uid, code);
    if (success) {
      const updated: User = { ...user, phoneVerified: true };
      setUser(updated);
      router.push('/');
    } else {
      alert('Código incorreto');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <div className="mx-auto w-12 h-12 bg-[#21ff21]/30 rounded-full flex items-center justify-center mb-4">
          <Icons.Shield />
        </div>
        <h2 className="text-xl font-bold mb-2">Verifique seu WhatsApp</h2>
        <p className="text-gray-400 text-sm mb-6">
          Para garantir a segurança, enviamos um código para {user.phone}
        </p>

        {!sent ? (
          <Button onClick={handleSend} disabled={loading} className="w-full">
            {loading ? 'Enviando...' : 'Enviar Código SMS'}
          </Button>
        ) : (
          <div className="space-y-4">
            <Input
              label="Código de 6 dígitos"
              placeholder="1234"
              value={code}
              onChange={(e: any) => setCode(e.target.value)}
            />
            <Button onClick={handleVerify} disabled={loading} className="w-full">
              {loading ? 'Verificando...' : 'Confirmar'}
            </Button>
            <button onClick={() => setSent(false)} className="text-xs text-gray-500 underline">
              Reenviar código
            </button>
          </div>
        )}
        <div className="mt-4 p-2 bg-[#21ff21]/20 border border-[#21ff21]/50 rounded text-xs text-[#21ff21]">
          Simulação: O código é <b>1234</b>
        </div>
      </Card>
    </div>
  );
};

export default VerificationPage;

