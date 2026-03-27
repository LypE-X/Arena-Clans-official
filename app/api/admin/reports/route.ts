import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
    const token = req.headers.get('authorization');

    if (!token) {
        return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const supabaseUser = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        data: { user },
        error: userError,
    } = await supabaseUser.auth.getUser(token.replace('Bearer ', ''));

    if (!user || userError) {
        return Response.json({ error: 'Token inválido' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: userData } = await supabaseAdmin
        .from('users')
        .select('is_admin')
        .eq('email', user.email)
        .single();

    if (!userData?.is_admin) {
        return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
}