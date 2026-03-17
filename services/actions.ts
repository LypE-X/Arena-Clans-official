'use server';

import { createClient } from "@supabase/supabase-js";

export const createReviewNotificationAction = async (teamId: string) => {
  // Criamos o admin aqui dentro para garantir que rode no servidor
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: user } = await adminClient
    .from("users")
    .select("uid")
    .eq("team_id", teamId)
    .maybeSingle();

  if (!user?.uid) return;

  await adminClient.from("notifications").insert({
    user_id: user.uid,
    type: "success",
    related_team_id: teamId,
    title: "Nova avaliação",
    message: "Seu time recebeu uma nova avaliação",
    read: false
  });
};