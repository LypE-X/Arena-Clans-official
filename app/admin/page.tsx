'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';

type Report = {
    id: string;
    comment: string;
    file_url: string;
    created_at: string;
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
                    <p><strong>Comentário:</strong> {report.comment}</p>
                    <p><strong>Data:</strong> {report.created_at}</p>

                    {report.file_url && (
                        <img src={report.file_url} alt="evidência" width={200} />
                    )}
                </div>
            ))}
        </div>
    );
}