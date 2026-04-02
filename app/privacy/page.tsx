import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <main className="max-w-4xl mx-auto py-12 px-6 text-slate-300 font-sans">
            <h1 className="text-3xl font-bold mb-8 text-white">Política de Privacidade (LGPD)</h1>
            <section className="space-y-6 text-sm">
                <p>A sua privacidade é prioridade no Arena Clans. Em conformidade com a Lei Geral de Proteção de Dados (LGPD):</p>
                <div>
                    <h2 className="text-xl font-semibold text-white text-blue-400">Coleta de Dados</h2>
                    <p>Coletamos nome, telefone, e-mail e ID de usuário para autenticação, além de metadados de mensagens e interações de equipe para funcionamento do serviço.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Uso de Dados</h2>
                    <p>Seus dados são usados exclusivamente para gerenciar sua conta, calcular sua reputação na plataforma e permitir a comunicação via chat.</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-white">Seus Direitos</h2>
                    <p>Você pode solicitar a exportação ou exclusão definitiva de seus dados a qualquer momento através das configurações de perfil.</p>
                </div>
            </section>
            <Link href="/" className="mt-8 inline-block text-blue-400 hover:underline">Voltar ao Início</Link>
        </main>
    );
}