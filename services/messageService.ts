import { supabase } from "./supabaseClient";

export const getTeamMessages = async (myTeamId: string, otherTeamId: string) => {

  const { data, error } = await supabase
    .from("team_messages")
    .select("*")
    .or(`and(from_team_id.eq.${myTeamId},to_team_id.eq.${otherTeamId}),and(from_team_id.eq.${otherTeamId},to_team_id.eq.${myTeamId})`)
    .order("timestamp", { ascending: true });

  if (error) throw error;

  return data;
};

export const sendMessage = async (fromId: string, toId: string, text: string) => {

  const { data, error } = await supabase
    .from("team_messages")
    .insert({
      from_team_id: fromId,
      to_team_id: toId,
      text,
      read: false
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};