import { User, Team, Review, TeamMessage } from "../types";
import { supabase } from "./supabaseClient";


// =============================
// AUTH
// =============================

export const loginUser = async (email: string, password: string): Promise<User> => {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error(error.message);

  const uid = data.user.id;

  const { data: userData, error: dbError } = await supabase
    .from("users")
    .select("*")
    .eq("uid", uid)
    .single();

  if (dbError) throw new Error(dbError.message);

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


export const registerUser = async (data: any): Promise<User> => {

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });

  if (error) throw new Error(error.message);

  const uid = authData.user?.id;

  if (!uid) throw new Error("Erro ao criar usuário");

  const { error: updateError } = await supabase
    .from("users")
    .update({
      name: data.name,
      cpf: data.cpf,
      phone: data.phone
    })
    .eq("uid", uid);

  if (updateError) throw new Error(updateError.message);

  return {
    uid,
    name: data.name,
    email: data.email,
    cpf: data.cpf,
    phone: data.phone,
    phoneVerified: false
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


// =============================
// TEAMS
// =============================

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
    rating: Number(team.rating || 0),
    totalReviews: Number(team.total_reviews || 0)
  };
};


export const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<Team> => {

  const { data, error } = await supabase
    .from("teams")
    .update({
      name: updates.name,
      game: updates.game,
      country: updates.region?.country,
      state: updates.region?.state,
      city: updates.region?.city,
      description: updates.description,
      photo_url: updates.photoUrl
    })
    .eq("id", teamId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    ownerUid: data.owner_uid,
    name: data.name,
    game: data.game,
    region: {
      country: data.country,
      state: data.state,
      city: data.city
    },
    description: data.description,
    photoUrl: data.photo_url,
    rating: Number(data.rating || 0),
    totalReviews: Number(data.total_reviews || 0)
  };
};


export const getTeams = async (filters?: {
  game?: string;
  state?: string;
  minRating?: number;
  search?: string;
}): Promise<Team[]> => {

  let query = supabase.from("teams").select("*");

  if (filters?.game && filters.game !== "Todos") {
    query = query.eq("game", filters.game);
  }

  if (filters?.state && filters.state !== "Todos os Estados") {
    query = query.eq("state", filters.state);
  }

  if (filters?.minRating) {
    query = query.gte("rating", filters.minRating);
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return (data || []).map(team => ({
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
    rating: Number(team.rating || 0),
    totalReviews: Number(team.total_reviews || 0)
  }));
};


export const getTeamById = async (id: string): Promise<Team | null> => {

  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    ownerUid: data.owner_uid,
    name: data.name,
    game: data.game,
    region: {
      country: data.country,
      state: data.state,
      city: data.city
    },
    description: data.description,
    photoUrl: data.photo_url,
    rating: Number(data.rating || 0),
    totalReviews: Number(data.total_reviews || 0)
  };
};


// =============================
// REVIEWS
// =============================

export const addReview = async (review: any) => {

  const average =
    (Number(review.boaConduta) +
      Number(review.comunicacao) +
      Number(review.pontualidade)) / 3;

  // 🔎 verificar se já existe review desse time
  const { data: existingReviews, error: searchError } = await supabase
    .from("reviews")
    .select("*")
    .eq("target_team_id", review.targetTeamId)
    .eq("author_team_id", review.authorTeamId);

  if (searchError) throw new Error(searchError.message);

  const existing = existingReviews?.[0];

  let data;
  let error;

  if (existing) {

    // ✏️ UPDATE
    const res = await supabase
      .from("reviews")
      .update({
        boa_conduta: review.boaConduta,
        comunicacao: review.comunicacao,
        pontualidade: review.pontualidade,
        average,
        comment: review.comment
      })
      .eq("id", existing.id)
      .select()
      .single();

    data = res.data;
    error = res.error;

  } else {

    // ➕ INSERT
    const res = await supabase
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

    data = res.data;
    error = res.error;
  }

  if (error) throw new Error(error.message);

  return data;
};

export const getReviews = async (teamId: string) => {

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("target_team_id", teamId)
    .order("timestamp", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map(r => ({
    id: r.id,
    targetTeamId: r.target_team_id,
    authorTeamId: r.author_team_id,
    authorTeamName: r.author_team_name,

    boaConduta: Number(r.boa_conduta ?? 0),
    comunicacao: Number(r.comunicacao ?? 0),
    pontualidade: Number(r.pontualidade ?? 0),

    average: Number(r.average ?? 0),
    comment: r.comment,
    timestamp: r.timestamp
  }));
};


// =============================
// CHAT
// =============================

export const getTeamMessages = async (
  myTeamId: string,
  otherTeamId: string
) => {

  const { data, error } = await supabase
    .from("team_messages")
    .select("*")
    .or(`and(from_team_id.eq.${myTeamId},to_team_id.eq.${otherTeamId}),and(from_team_id.eq.${otherTeamId},to_team_id.eq.${myTeamId})`)
    .order("timestamp", { ascending: true })
    .limit(50);

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  return (data || []).map((m) => ({
    id: m.id,
    fromTeamId: m.from_team_id,
    toTeamId: m.to_team_id,
    text: m.text,
    read: m.read,
    timestamp: m.timestamp
  }));
};


export const sendMessage = async (fromId: string, toId: string, text: string) => {

  const { data, error } = await supabase
    .from("team_messages")
    .insert({
      from_team_id: fromId,
      to_team_id: toId,
      text,
      read: false,
      timestamp: Date.now()
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    throw error;
  }

  return data;
};

// =============================
// CONVERSATION
// =============================

export const getConversation = async (teamAId: string, teamBId: string) => {

  const { data, error } = await supabase
    .from("team_messages")
    .select("*")
    .or(
      `and(from_team_id.eq.${teamAId},to_team_id.eq.${teamBId}),and(from_team_id.eq.${teamBId},to_team_id.eq.${teamAId})`
    )
    .order("timestamp", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};


// =============================
// MARK CONVERSATION READ
// =============================

export const markConversationRead = async (
  teamId: string,
  otherTeamId: string
) => {

  const { error } = await supabase
    .from("team_messages")
    .update({ read: true })
    .eq("to_team_id", teamId)
    .eq("from_team_id", otherTeamId)
    .eq("read", false);

  if (error) console.error(error);
};


// =============================
// NOTIFICATIONS
// =============================

export const getNotifications = async (userId: string) => {

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};


export const markNotificationRead = async (id: string) => {

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) console.error(error);
};


export const markMessageNotificationsFromTeamRead = async (
  userId: string,
  fromTeamId: string
) => {

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("related_team_id", fromTeamId)
    .eq("type", "message")
    .eq("read", false);

  if (error) console.error(error);
};

// =============================
// REPORTS
// =============================

export const addReport = async (report: {
  targetTeamId: string;
  authorTeamId: string;
  comment: string;
  fileUrl?: string | null;
}) => {

  const { data, error } = await supabase
    .from("reports")
    .insert({
      target_team_id: report.targetTeamId,
      author_team_id: report.authorTeamId,
      comment: report.comment,
      file_url: report.fileUrl ?? null
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao enviar denúncia:", error);
    throw error;
  }

  return data;
};

// =============================
// INBOX (lista de conversas)
// =============================

export const getInbox = async (teamId: string) => {

  const { data: messages, error } = await supabase
    .from("team_messages")
    .select("*")
    .or(`from_team_id.eq.${teamId},to_team_id.eq.${teamId}`)
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Supabase error:", error.message);
    return [];
  }

  const interactions = new Map<string, any>();

  for (const m of messages || []) {

    const otherId =
      m.from_team_id === teamId
        ? m.to_team_id
        : m.from_team_id;

    // evita duplicar conversa
    if (!interactions.has(otherId)) {

      // 🔥 busca dados da equipe
      const otherTeam = await getTeamById(otherId);

      interactions.set(otherId, {
        otherTeam,
        lastMessage: {
          id: m.id,
          fromTeamId: m.from_team_id,
          toTeamId: m.to_team_id,
          text: m.text,
          read: m.read,
          timestamp: m.timestamp
        }
      });
    }
  }

  return Array.from(interactions.values());
};