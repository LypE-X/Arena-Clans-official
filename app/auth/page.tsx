'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { User } from '../../types';
import * as db from '../../services/dbService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAppContext } from '../../components/layout/AppShell';
import Image from "next/image"

const AuthPage = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const { setUser } = useAppContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: '',
  });
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const user = await db.loginUser(formData.email, formData.password);
        setUser(user);

        db.saveUserConsent({
          userId: user.uid,
          acceptedTerms: true,
          acceptedPrivacy: true,
          termsVersion: 'v1.0',
          privacyVersion: 'v1.0',
        });

        router.push('/');
      } else {
        if (!formData.name || !formData.phone) {
          throw new Error('Preencha todos os campos obrigatórios.');
        }
        if (formData.name.length > 50) {
          throw new Error('Nome deve ter no máximo 50 caracteres.');
        }
        if (!consents.terms || !consents.privacy) {
          throw new Error('Você precisa aceitar os termos e a política de privacidade.');
        }

        const authUser = await db.registerUser(formData);

        if (!authUser?.id) {
          throw new Error('Erro ao criar usuário.');
        }

        setSuccess("Cadastro realizado! Enviamos um link de confirmação para o seu e-mail.");
        setError('');
        // Mantemos o email no formData apenas para exibir na mensagem de sucesso, se desejar
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length === 0) return '';
    if (numbers.length < 3) return numbers;
    if (numbers.length < 8) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center mb-6">
        {/* ⬅️ RAIOS PARA A ESQUERDA */}
        <span className="absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor-effect rounded-[9999px] bg-[#21ff21] shadow-[0_0_20px_10px_#21ff21] before:absolute before:top-1/2 before:w-[150px] before:h-[1px] before:-translate-y-[50%] before:bg-gradient-to-r before:from-[#21ff21] before:to-transparent"></span>

        {/* Delay de -1.5s faz ele já começar no meio do caminho ou logo após o primeiro */}
        <span className="absolute top-1/3 left-2/3 h-0.5 w-0.5 rotate-[215deg] animate-meteor-effect [animation-delay:-1.5s] rounded-[9999px] bg-[#21ff21] shadow-[0_0_20px_10px_#21ff21] before:absolute before:top-1/2 before:w-[150px] before:h-[1px] before:-translate-y-[50%] before:bg-gradient-to-r before:from-[#21ff21] before:to-transparent"></span>

        {/* ➡️ RAIOS PARA A DIREITA */}
        {/* Delay de -3s faz ele começar imediatamente no carregamento */}
        <span className="absolute top-1/2 right-1/2 h-0.5 w-0.5 rotate-[-45deg] animate-meteor-reverse [animation-delay:-3s] rounded-[9999px] bg-[#21ff21] shadow-[0_0_20px_10px_#21ff21] before:absolute before:top-1/2 before:w-[150px] before:h-[1px] before:-translate-y-[50%] before:bg-gradient-to-r before:from-[#21ff21] before:to-transparent"></span>

        {/* Delay de -4.5s garante que ele não fique travado no topo */}


        {/* Aura fixa pulsante */}
        <div className="absolute w-40 h-40 rounded-full bg-[#21ff21]/20 blur-3xl animate-pulse duration-[4000ms]"></div>

        <Image
          src="/logo.png"
          alt="Arena Clans Logo"
          width={160}
          height={160}
          className="relative z-10 drop-shadow-[0_0_20px_#21ff21]"
        />
      </div>

      <Card className="w-full max-w-md border-dark-700 bg-dark-900 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Entrar na Arena' : 'Crie sua conta'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {mode === 'login' ? 'Acesse para gerenciar sua equipe' : 'Conecte-se aos melhores times'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-900 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-[#21ff21]/10 border border-[#21ff21]/50 rounded text-[#21ff21] text-sm animate-pulse">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">✉️</span>
              <span className="font-bold">Verifique seu e-mail!</span>
            </div>
            <p className="text-gray-300">
              Enviamos um link de confirmação para <strong className="text-white">{formData.email}</strong>.
              Confirme para liberar seu acesso.
            </p>
            <button
              onClick={() => { setSuccess(''); router.push('/auth?mode=login'); }}
              className="mt-3 text-white text-xs font-bold underline hover:text-[#21ff21] transition-colors"
            >
              Ir para a tela de login →
            </button>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="text-sm text-gray-400 space-y-2">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consents.terms}
                      onChange={(e) =>
                        setConsents({ ...consents, terms: e.target.checked })
                      }
                    />
                    <span>
                      Eu aceito os{' '}
                      <Link href="/terms" className="text-[#21ff21] underline">
                        Termos de Uso
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consents.privacy}
                      onChange={(e) =>
                        setConsents({ ...consents, privacy: e.target.checked })
                      }
                    />
                    <span>
                      Eu aceito a{' '}
                      <Link href="/privacy" className="text-[#21ff21] underline">
                        Política de Privacidade
                      </Link>
                    </span>
                  </label>
                </div>
                <Input
                  label="Nome Completo"
                  placeholder="Seu nome real"
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={50}
                  required
                />
                <Input
                  label="WhatsApp"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e: any) =>
                    setFormData({
                      ...formData,
                      phone: formatPhone(e.target.value)
                    })
                  }
                  required
                />
              </>


            )}
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button
              type="submit"
              className="w-full !bg-[#21ff21] hover:!bg-[#16cc16] !text-black !shadow-[#21ff21]/50 !border-none"
              disabled={loading}
            >
              {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <Link href="/auth?mode=register" onClick={() => { setSuccess(''); setError('') }} className="text-[#21ff21] hover:underline font-medium">
                Cadastre-se
              </Link>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <Link href="/auth?mode=login" onClick={() => { setSuccess(''); setError('') }} className="text-[#21ff21] hover:underline font-medium">
                Faça login
              </Link>
            </>
          )}
        </div>
      </Card>

      <div className="mt-16 flex flex-col items-center gap-4 animate-pulse duration-[5000ms]">
        <div className="flex flex-col items-center group">
          {/* Texto de suporte maior e com espaçamento elegante */}
          <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3 italic">
            Developer
          </p>

          <div className="relative p-2">
            {/* Brilho de fundo sutil para destacar o logo no dark mode */}
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-150 animate-pulse"></div>

            {/* Logo da Kube Monkey - Tamanho Ampliado */}
            <Image
              src="/kube-logo.png"
              alt="Kube Monkey Technology"
              width={200} // Aumentado para dar mais presença
              height={60}
              className="relative z-10 object-contain brightness-110 contrast-125 transition-transform duration-700 hover:scale-110"
            />
          </div>

          {/* Linha de separação com as cores da marca */}
          <div className="flex gap-1 mt-4">
            <div className="w-12 h-[2px] bg-[#002d5b]"></div> {/* Azul da Kube Monkey */}
            <div className="w-12 h-[2px] bg-[#ffb400]"></div> {/* Amarelo da Kube Monkey */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;