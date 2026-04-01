import Link from 'next/link';

export default function TermsPage() {
    return (
        <main className="max-w-4xl mx-auto py-12 px-6 text-slate-300">
            <h1 className="text-3xl font-bold mb-8 text-white">Termos de Uso - Arena Clans</h1>
            <section className="space-y-6 text-sm leading-relaxed">
                <div>
                    <h2 className="text-xl font-semibold text-white">1. Objeto</h2>
                    <p>O Arena Clans é uma plataforma de gestão de equipes e interação competitiva.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">2. Chat e Conteúdo</h2>
                    <p>Você é integralmente responsável pelas mensagens enviadas. Proibido conteúdo ofensivo, discriminatório ou ilegal. Reservamo-nos o direito de moderar e remover conteúdos.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">3. Reputação e Ratings</h2>
                    <p>O sistema de rating é baseado no feedback da comunidade. Abusos no sistema de avaliação podem gerar banimento da conta.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">4. Banimento</h2>
                    <p>Violações repetidas destes termos resultarão na suspensão definitiva sem aviso prévio.</p>
                </div>
            </section>
            <Link href="/" className="mt-8 inline-block text-blue-400 hover:underline">Voltar ao Início</Link>
        </main>
    );
}