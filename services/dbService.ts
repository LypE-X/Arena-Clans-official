// <--- Isso diz ao Next.js: "Rode tudo aqui no servidor"
import { User, Team, Review, TeamMessage } from "../types";
import { supabase } from "./supabaseClient";
import { createClient } from "@supabase/supabase-js"




// =============================
// AUTH
// =============================

export const loginUser = async (email: string, password: string): Promise<User> => {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error(error.message);

  // 🔒 bloqueia login sem confirmação
  if (!data.user.email_confirmed_at) {
    throw new Error("Confirme seu email antes de fazer login.");
  }

  const uid = data.user.id;

  const { data: userData, error: dbError } = await supabase
    .from("users")
    .select("*, welcome_sent")
    .eq("uid", uid)
    .single();

  if (dbError) throw new Error(dbError.message);

  return {
    uid: userData.uid,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    phoneVerified: userData.phone_verified,
    teamId: userData.team_id,
    welcome_sent: userData.welcome_sent // ✨ Adicionado ao retorno
  };
};


export const registerUser = async (data: any): Promise<void> => {
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      // 💡 Os dados dentro de 'data' vão para o 'raw_user_meta_data' que a Trigger lê
      data: {
        name: data.name,
        phone: data.phone
      }
    }
  });

  if (error) throw new Error(error.message);

  // ✅ Removido o código de upsert manual! O banco cuida disso agora.
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
    phone: userData.phone,
    phoneVerified: userData.phone_verified,
    teamId: userData.team_id,
    welcome_sent: userData.welcome_sent

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


export const sendMessage = async (
  fromId: string,
  toId: string,
  text: string,
  userId: string
) => {

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

  try {

  } catch (err) {
    console.error("Erro ao criar notificação:", err);
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

export const createReport = async (report: {
  target_team_id: string;
  author_team_id: string;
  comment: string;
  file_url?: string | null;
}) => {
  const { data, error } = await supabase
    .from("reports")
    .insert([report]) // Passamos o objeto direto aqui
    .select()
    .single();

  if (error) {
    console.error("Erro detalhado do Supabase:", error.message);
    throw error;
  }

  return data;
};

export const uploadReportFile = async (file: File) => {
  // Criamos um nome único para o arquivo (ex: 123456789-foto.jpg)
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from('report_files') // Nome do bucket que criamos
    .upload(filePath, file);

  if (error) {
    console.error("Erro no upload:", error.message);
    throw error;
  }

  // Pegamos o link público do arquivo
  const { data: publicUrl } = supabase.storage
    .from('reports_files')
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
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

// Função para atualizar os dados (E-mail, Senha, Telefone)
export const updateAccount = async (uid: string, data: any) => {
  // 1. Se tiver senha, atualiza no Auth do Supabase
  if (data.password) {
    const { error: authError } = await supabase.auth.updateUser({
      password: data.password
    });
    if (authError) throw authError;
  }

  // 2. Atualiza o telefone na sua tabela pública
  const { error: dbError } = await supabase
    .from('users')
    .update({
      phone: data.phone
    })
    .eq('uid', uid);

  if (dbError) throw dbError;
};

// ✨ ESTA É A FUNÇÃO QUE ESTÁ FALTANDO NO SEU ERRO:
export const deleteUserAccount = async (uid: string): Promise<void> => {
  // 1. Remove os dados da tabela pública (O CASCADE no banco cuidará do resto)
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("uid", uid);

  if (error) throw new Error(error.message);

  // 2. Faz o logout do usuário
  await supabase.auth.signOut();
};





