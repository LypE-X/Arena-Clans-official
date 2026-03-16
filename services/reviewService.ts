import { supabase } from "./supabaseClient";
import { Review } from "../types";

export const addReview = async (
  review: Omit<Review, "id" | "timestamp" | "average">
) => {

  const average =
    (review.boaConduta +
      review.comunicacao +
      review.pontualidade) / 3;

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      target_team_id: review.targetTeamId,
      author_team_id: review.authorTeamId,
      author_team_name: review.authorTeamName,
      boa_conduta: review.boaConduta,
      comunicacao: review.comunicacao,
      pontualidade: review.pontualidade,
      average,
      comment: review.comment
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};