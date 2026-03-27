import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const body = await req.json();
  const { report_id } = body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', report_id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}