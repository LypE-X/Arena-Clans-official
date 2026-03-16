import { supabase } from "./supabaseClient";

export const getNotifications = async (userId: string) => {

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false });

  if (error) throw error;

  return data;
};

export const markNotificationRead = async (id: string) => {

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
};