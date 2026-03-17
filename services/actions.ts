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

export const createMessageNotificationAction = async (fromTeamId: string, toTeamId: string) => {
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Achar o destinatário (dono do toTeamId)
  const { data: recipient } = await adminClient
    .from("users")
    .select("uid")
    .eq("team_id", toTeamId)
    .maybeSingle();

  if (!recipient?.uid) return;

  // 2. Checar se já existe notificação não lida para evitar spam
  const { data: existing } = await adminClient
    .from("notifications")
    .select("id")
    .eq("user_id", recipient.uid)
    .eq("type", "message")
    .eq("related_team_id", fromTeamId)
    .eq("read", false);

  if (existing && existing.length > 0) return;

  // 3. Pegar nome do time que enviou
  const { data: team } = await adminClient
    .from("teams")
    .select("name")
    .eq("id", fromTeamId)
    .single();

  // 4. Inserir para o destinatário
  await adminClient.from("notifications").insert({
    user_id: recipient.uid,
    type: "message",
    related_team_id: fromTeamId,
    title: "Nova mensagem",
    message: `${team?.name || "Equipe"} enviou novas mensagens`,
    read: false
  });
};