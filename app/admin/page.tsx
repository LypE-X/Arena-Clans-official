'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';

type Report = {
    id: string;
    comment: string;
    file_url?: string | null;
    created_at: string;
    author_team_id: string;
    target_team_id: string;
};

export default function AdminPage() {
    const [reports, setReports] = useState<Report[]>([]);

    const getReports = async () => {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        console.log('TOKEN:', token);

        const res = await fetch('/api/admin/reports', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('STATUS:', res.status);

        const text = await res.text();
        console.log('RAW:', text);

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            console.error('Não é JSON:', text);
            return;
        }

        console.log('PARSED:', data);

        if (Array.isArray(data)) {
            setReports(data);
        } else {
            console.error('Erro da API:', data);
            setReports([]);
        }
    };

    useEffect(() => {
        getReports();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Admin - Reports</h1>

            {reports.length === 0 && <p>Nenhum report encontrado</p>}

            {reports.map((report) => (
                <div key={report.id} style={{ border: '1px solid gray', marginBottom: 10, padding: 10 }}>

                    <p><strong>Time que reportou:</strong> {report.author_team_id}</p>
                    <p><strong>Time reportado:</strong> {report.target_team_id}</p>

                    <p><strong>Comentário:</strong> {report.comment}</p>
                    <p><strong>Data:</strong> {report.created_at}</p>

                    {report.file_url && (
                        <a href={report.file_url} target="_blank">
                            <img src={report.file_url} alt="evidência" width={200} />
                        </a>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                        <button onClick={() => sendMessageToAuthor(report)}>
                            Msg Reportador
                        </button>

                        <button onClick={() => sendMessageToTarget(report)}>
                            Msg Denunciado
                        </button>

                        <button onClick={() => deleteReport(report.id)}>
                            🗑️ Deletar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

const sendMessageToAuthor = async (report: Report) => {
    const message = prompt('Mensagem para quem reportou:');

    if (!message) return;

    await fetch('/api/admin/send-message', {
        method: 'POST',
        body: JSON.stringify({
            team_id: report.author_team_id,
            message,
        }),
    });

    alert('Mensagem enviada!');
};

const sendMessageToTarget = async (report: Report) => {
    const message = prompt('Mensagem para o time denunciado:');

    if (!message) return;

    await fetch('/api/admin/send-message', {
        method: 'POST',
        body: JSON.stringify({
            team_id: report.target_team_id,
            message,
        }),
    });

    alert('Mensagem enviada!');
};

const deleteReport = async (reportId: string) => {
    const confirmDelete = confirm('Tem certeza que quer apagar?');

    if (!confirmDelete) return;

    await fetch('/api/admin/delete-report', {
        method: 'POST',
        body: JSON.stringify({
            report_id: reportId,
        }),
    });

    alert('Report deletado!');
    window.location.reload(); // simples por enquanto
};
