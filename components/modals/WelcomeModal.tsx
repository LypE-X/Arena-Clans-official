import React from 'react';

const WelcomeModal = ({ open, onClose }: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-[#21ff21]/40 rounded-2xl shadow-[0_0_25px_#21ff21]/20 p-8 max-w-md w-full text-center">
        {/* Logo */}
        <img
          src="https://i.imgur.com/N2ONXvq.png"
          alt="Arena Clans Logo"
          className="w-20 h-20 mx-auto mb-4 object-contain drop-shadow-[0_0_10px_#21ff21]"
        />

        {/* Título maior */}
        <h2 className="text-3xl font-bold text-white mb-4">Bem-vindo ao Arena-Clans!</h2>

        {/* Texto maior */}
        <p className="text-gray-300 text-base leading-relaxed mb-6">
          Aqui conectamos equipes com foco em treinos e amistosos reais, priorizando compromisso e evolução.
          <br />
          <br />
          - <span className="text-[#21ff21] font-semibold">Sem toxidade</span>
          <br />
          - <span className="text-[#21ff21] font-semibold">Sem trollagens</span>
          <br />-{' '}
          <span className="text-[#21ff21] font-semibold">Somente equipes dedicadas a evoluir</span>
          <br />
          <br />
          Mantenha o respeito, jogue com seriedade e aproveite a experiência.
        </p>

        {/* Botão */}
        <button
          onClick={onClose}
          className="w-full bg-[#21ff21] text-black font-semibold py-3 rounded-xl hover:bg-[#16cc16] transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;

