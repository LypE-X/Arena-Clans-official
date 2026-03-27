import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    const body = await req.json();
    const { team_id, message } = body;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 🔥 1. pega o user do time
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('uid')
        .eq('team_id', team_id)
        .single();

    if (userError || !user) {
        return Response.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { error } = await supabase.from('notifications').insert({
        user_id: user.uid,
        related_team_id: team_id,
        type: 'message',
        title: 'Mensagem da moderação',
        message,
        read: false,
    });

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
}