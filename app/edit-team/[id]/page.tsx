'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { GameType } from '../../../types';
import * as db from '../../../services/dbService';
import { BRAZIL_STATES } from '../../../constants/brazilStates';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAppContext } from '../../../components/layout/AppShell';
import { getTeamImage } from '@/services/image'

const EditTeamPage = () => {
  const { user } = useAppContext();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    game: GameType.VALORANT,
    region: { country: 'Brasil', state: '' },
    description: '',
    photoUrl: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      if (!id || !user) {
        setLoading(false);
        return;
      }
      const team = await db.getTeamById(id as string);
      if (team) {
        if (team.ownerUid !== user.uid) {
          alert('Você não tem permissão para editar esta equipe.');
          router.push('/');
          return;
        }

        setFormData({
          name: team.name,
          game: team.game,
          region: team.region,
          description: team.description,
          photoUrl: team.photoUrl, // 👈 só o path mesmo
        });
      }
      setLoading(false);
    };
    loadTeam();
  }, [id, user, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // Salva o arquivo real para o upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        let finalPhotoPath = formData.photoUrl;

        // Se o usuário selecionou um NOVO arquivo, fazemos o upload antes de salvar
        if (imageFile) {
          finalPhotoPath = await db.uploadTeamLogo(imageFile, id);
        } else {
          // Se ele não mudou a foto, precisamos garantir que enviamos apenas o NOME do arquivo
          // e não a URL completa do Supabase que está no estado de preview
          if (finalPhotoPath.includes('perfil_img/')) {
            finalPhotoPath = finalPhotoPath.split('perfil_img/').pop() || '';
          }
        }

        await db.updateTeam(id as string, {
          ...formData,
          photoUrl: finalPhotoPath
        });

        router.push(`/team/${id}`);
      }
    } catch (err: any) {
      alert("Erro ao atualizar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-[#21ff21]">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <h1 className="text-2xl font-bold mb-6">Editar Perfil da Equipe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome da Equipe"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Jogo</label>
            <select
              className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white"
              value={formData.game}
              onChange={(e) => setFormData({ ...formData, game: e.target.value as GameType })}
            >
              {Object.values(GameType).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Logo da Equipe</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-center overflow-hidden">
                {formData.photoUrl ? (
                  <img
                    src={getTeamImage(formData.photoUrl)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📷</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#21ff21] file:text-black hover:file:bg-[#16cc16]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
              <select
                value={formData.region.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    region: { ...formData.region, state: e.target.value },
                  })
                }
                className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] focus:border-[#21ff21] outline-none"
                required
              >
                <option value="">Selecione um estado</option>
                {BRAZIL_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.uf} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Descrição / Bio</label>
            <textarea
              rows={3}
              className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditTeamPage;

