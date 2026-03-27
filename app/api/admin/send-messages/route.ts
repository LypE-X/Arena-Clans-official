import { createClient } from '@supabase/supabase-js';


export async function POST(req: Request) {
    const body = await req.json();
    const { team_id, message } = body;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from('team_messages').insert({
        to_team_id: team_id,
        content: message,
        system: true, // 🔥 mensagem do sistema
    });

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
}