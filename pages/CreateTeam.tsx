import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GameType, User } from '../types';
import * as db from '../services/dbService';
import { generateTeamDescription } from '../services/geminiService';
import { BRAZIL_STATES } from '../constants/brazilStates';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const CreateTeam = ({ user, setUser }: { user: User; setUser: (u: User) => void }) => {
  const navigate = useNavigate();
  const MAX_DESC = 300;
  const [formData, setFormData] = useState({
    name: '',
    game: GameType.VALORANT,
    region: { country: 'Brasil', state: '', city: '' },
    description: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateBio = async () => {
    if (!formData.name) return alert('Preencha o nome da equipe primeiro.');
    setGenerating(true);
    const bio = await generateTeamDescription(formData.name, formData.game, 'Competitivo/Tryhard');
    setFormData((prev) => ({ ...prev, description: bio }));
    setGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      const team = await db.createTeam(user, formData);
      setUser({ ...user, teamId: team.id });
      navigate(`/team/${team.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <h1 className="text-2xl font-bold mb-6">Cadastrar Equipe</h1>
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
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
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
            {/* Updated State Input to Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
              <select
                value={formData.region.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    region: { ...formData.region, state: e.target.value }
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
            <Input
              label="Cidade"
              placeholder="São Paulo"
              value={formData.region.city}
              onChange={(e: any) =>
                setFormData({ ...formData, region: { ...formData.region, city: e.target.value } })
              }
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-400">Descrição / Bio</label>
              <button
                type="button"
                onClick={handleGenerateBio}
                disabled={generating}
                className="text-xs text-[#21ff21] hover:text-[#16cc16] flex items-center gap-1"
              >
                {generating ? 'Gerando...' : 'Gerar bio'}
              </button>
            </div>
            <textarea
              rows={3}
              maxLength={MAX_DESC}
              className="w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.description.length}/{MAX_DESC}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Finalizar Cadastro'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateTeam;

