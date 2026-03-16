import { supabase } from "./supabaseClient";
import { Team, User } from "../types";

export const createTeam = async (user: User, data: Partial<Team>): Promise<Team> => {

  const { data: team, error } = await supabase
    .from("teams")
    .insert({
      owner_uid: user.uid,
      name: data.name,
      game: data.game,
      country: data.region?.country,
      state: data.region?.state,
      city: data.region?.city,
      description: data.description,
      photo_url: data.photoUrl
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase
    .from("users")
    .update({ team_id: team.id })
    .eq("uid", user.uid);

  return {
    id: team.id,
    ownerUid: team.owner_uid,
    name: team.name,
    game: team.game,
    region: {
      country: team.country,
      state: team.state,
      city: team.city
    },
    description: team.description,
    photoUrl: team.photo_url,
    rating: team.rating,
    totalReviews: team.total_reviews
  };
};

export const getTeams = async (): Promise<Team[]> => {

  const { data, error } = await supabase
    .from("teams")
    .select("*");

  if (error) throw new Error(error.message);

  return data.map(team => ({
    id: team.id,
    ownerUid: team.owner_uid,
    name: team.name,
    game: team.game,
    region: {
      country: team.country,
      state: team.state,
      city: team.city
    },
    description: team.description,
    photoUrl: team.photo_url,
    rating: team.rating,
    totalReviews: team.total_reviews
  }));
};