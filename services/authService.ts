import { supabase } from "./supabaseClient";
import { User } from "../types";

export const loginUser = async (email: string, password: string): Promise<User> => {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error(error.message);

  const uid = data.user.id;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("uid", uid)
    .single();

  return {
    uid: userData.uid,
    name: userData.name,
    email: userData.email,
    cpf: userData.cpf,
    phone: userData.phone,
    phoneVerified: userData.phone_verified,
    teamId: userData.team_id
  };
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {

  const { data } = await supabase.auth.getUser();

  if (!data.user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("uid", data.user.id)
    .single();

  if (!userData) return null;

  return {
    uid: userData.uid,
    name: userData.name,
    email: userData.email,
    cpf: userData.cpf,
    phone: userData.phone,
    phoneVerified: userData.phone_verified,
    teamId: userData.team_id
  };
};