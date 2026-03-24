'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../components/layout/AppShell';
import * as db from '../../services/dbService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function EditProfilePage() {
    const { user, setUser } = useAppContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Atualiza apenas Telefone e/ou Senha
            await db.updateAccount(user!.uid, {
                phone: formData.phone,
                password: formData.password
            });
            alert("Dados atualizados com sucesso!");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-12">
            <Card className="border-dark-700 bg-dark-900 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Minha Conta</h1>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Gerencie seu acesso</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4 opacity-60">
                        <Input label="Nome Completo" value={formData.name} disabled className="cursor-not-allowed" />
                        <Input label="E-mail" value={formData.email} disabled className="cursor-not-allowed" />
                    </div>

                    <div className="h-px bg-dark-800 my-6"></div>

                    <Input
                        label="WhatsApp"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                    />

                    <Input
                        label="Nova Senha"
                        type="password"
                        placeholder="Deixe em branco para manter"
                        value={formData.password}
                        onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <Button type="submit" className="w-full !bg-[#21ff21] !text-black font-black uppercase tracking-widest text-xs py-3" disabled={loading}>
                        {loading ? 'SALVANDO...' : 'ATUALIZAR DADOS'}
                    </Button>
                </form>

                {/* 🛑 BOTÃO DELETAR DENTRO DO CARD */}
                <div className="mt-10 pt-6 border-t border-red-900/30">
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full text-red-600 hover:text-red-400 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Excluir minha conta
                    </button>
                </div>
            </Card>

            {/* MODAL DE CONFIRMAÇÃO (Fica fora do Card para o backdrop cobrir tudo) */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-dark-900 border border-red-500/40 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                        <div className="text-red-500 text-5xl mb-4 animate-pulse">⚠️</div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Atenção Total</h3>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                            Sua conta, equipe e mensagens serão <span className="text-red-500 font-bold underline">apagadas para sempre</span>.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        await db.deleteUserAccount(user!.uid);
                                        setUser(null);
                                        router.push('/auth?mode=register');
                                    } catch (err: any) {
                                        alert("Erro ao deletar: " + err.message);
                                        setLoading(false);
                                    }
                                }}
                                className="!bg-red-600 !text-white hover:!bg-red-500 font-black py-3 !border-none"
                            >
                                SIM, DELETAR CONTA
                            </Button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-gray-500 hover:text-white text-xs font-bold py-2"
                            >
                                CANCELAR E VOLTAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}