
//**
import { User, Team, GameType, Review, VideoEvidence, Notification, TeamMessage } from '../types';
import { supabase } from "./supabaseClient";
/**
 * MOCK DATABASE SERVICE
 * 
 * In a real production environment, this file would import `firebase/firestore` or `@supabase/supabase-js`.
 * Here, we simulate async DB calls using LocalStorage to allow the app to be fully functional 
 * as a standalone artifact.
 */

const STORAGE_KEYS = {
  USERS: 'scrimlink_users',
  TEAMS: 'scrimlink_teams',
  REVIEWS: 'scrimlink_reviews',
  VIDEOS: 'scrimlink_videos',
  SESSION: 'scrimlink_session',
  NOTIFICATIONS: 'scrimlink_notifications',
  MESSAGES: 'scrimlink_messages',
  REPORTS: 'scrimlink_reports',
};

// --- Helpers ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Auth Services (Supabase) ---

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

  // ATUALIZA A TABELA USERS
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

// --- Phone Verification (WhatsApp Mock) ---

export const sendVerificationCode = async (phone: string): Promise<string> => {
  await delay(1500);
  // Implementation: Call Meta API / Twilio here
  console.log(`[SMS-MOCK] Sending code 1234 to ${phone}`);
  return "1234"; // Fixed for demo
};

export const verifyCode = async (uid: string, inputCode: string): Promise<boolean> => {
  await delay(1000);
  if (inputCode === "1234") {
    const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.uid === uid);
    if (userIndex >= 0) {
      users[userIndex].phoneVerified = true;
      setStorage(STORAGE_KEYS.USERS, users);

      // Update session
      const session = await getCurrentUser();
      if (session) {
        session.phoneVerified = true;
      }
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    }
  }
  return true;
}


// --- Team Services ---

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

  // Atualiza o usuário com o team_id
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


export const updateTeam = async (
  teamId: string,
  updates: Partial<Team>
): Promise<Team> => {

  // verifica se já existe outro time com o mesmo nome
  if (updates.name) {
    const { data: existing } = await supabase
      .from("teams")
      .select("id")
      .eq("name", updates.name)
      .neq("id", teamId)
      .maybeSingle();

    if (existing) {
      throw new Error("Nome da equipe já existe.");
    }
  }

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
    rating: data.rating,
    totalReviews: data.total_reviews
  };
};

export interface TeamFilters {
  game?: string;
  state?: string;
  minRating?: number;
}

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
    rating: data.rating,
    totalReviews: data.total_reviews
  };
};


// --- Reviews ---

export const addReview = async (
  review: Omit<Review, "id" | "timestamp" | "average">
) => {

  const average =
    (review.boaConduta +
      review.comunicacao +
      review.pontualidade) / 3;

  // 🔎 procurar review existente
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
        comment: review.comment,
      })
      .eq("id", existing.id)
      .select()
      .maybeSingle();

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

  return data.map(r => ({
    id: r.id,
    targetTeamId: r.target_team_id,
    authorTeamId: r.author_team_id,
    authorTeamName: r.author_team_name,
    boaConduta: r.boa_conduta,
    comunicacao: r.comunicacao,
    pontualidade: r.pontualidade,
    average: r.average,
    comment: r.comment,
    timestamp: r.timestamp
  }));
};

// --- Video Upload ---

export const uploadVideo = async (data: Omit<VideoEvidence, 'id' | 'timestamp'>): Promise<VideoEvidence> => {
  await delay(2000); // Simulate upload time
  const videos = getStorage<VideoEvidence>(STORAGE_KEYS.VIDEOS);

  const newVideo: VideoEvidence = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    // @ts-ignore
    average: 0, // Mock for interface compat if needed
  };

  videos.push(newVideo);
  setStorage(STORAGE_KEYS.VIDEOS, videos);
  return newVideo;
};

export const getVideos = async (teamId: string): Promise<VideoEvidence[]> => {
  const videos = getStorage<VideoEvidence>(STORAGE_KEYS.VIDEOS);
  return videos.filter(v => v.teamId === teamId);
};

// --- Notifications ---

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  await delay(500);

  // 🧹 limpa notificações lidas antigas
  cleanupReadNotifications(userId, 10);

  const notifications = getStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
  const userNotes = notifications.filter(n => n.userId === userId);

  return userNotes.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
};

export const markNotificationRead = async (id: string): Promise<void> => {
  const notifications = getStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
  const index = notifications.findIndex(n => n.id === id);
  if (index >= 0) {
    notifications[index].read = true;
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}

// --- Messaging System ---

export const sendMessage = async (fromTeamId: string, toTeamId: string, text: string): Promise<TeamMessage> => {
  await delay(300);
  const messages = getStorage<TeamMessage>(STORAGE_KEYS.MESSAGES);

  const newMessage: TeamMessage = {
    id: crypto.randomUUID(),
    fromTeamId,
    toTeamId,
    text,
    timestamp: Date.now(),
    read: false
  };

  messages.push(newMessage);
  setStorage(STORAGE_KEYS.MESSAGES, messages);

  // Create Notification for the receiver team owner
  const teams = getStorage<Team>(STORAGE_KEYS.TEAMS);
  const fromTeam = teams.find(t => t.id === fromTeamId);
  const toTeam = teams.find(t => t.id === toTeamId);

  if (toTeam && fromTeam) {
    const notifications = getStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);

    // 🔹 verifica se já existe notificação NÃO lida dessa equipe
    const existing = notifications.find(
      n =>
        n.userId === toTeam.ownerUid &&
        n.type === 'message' &&
        n.relatedTeamId === fromTeamId &&
        !n.read
    );

    if (existing) {
      // 🔁 Atualiza a notificação existente (não cria outra)
      existing.message =
        text.substring(0, 50) + (text.length > 50 ? "..." : "");
      existing.timestamp = new Date().toISOString();
    } else {
      // ➕ Cria apenas se não existir
      notifications.push({
        id: crypto.randomUUID(),
        userId: toTeam.ownerUid,
        title: `Nova mensagem de ${fromTeam.name}`,
        message: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
        read: false,
        timestamp: new Date().toISOString(),
        type: "message",
        relatedTeamId: fromTeamId
      });
    }

    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  return newMessage;
};

export const getConversation = async (teamAId: string, teamBId: string): Promise<TeamMessage[]> => {
  // await delay(200);
  const messages = getStorage<TeamMessage>(STORAGE_KEYS.MESSAGES);
  return messages
    .filter(m => (m.fromTeamId === teamAId && m.toTeamId === teamBId) || (m.fromTeamId === teamBId && m.toTeamId === teamAId))
    .sort((a, b) => a.timestamp - b.timestamp);
};

export const getInbox = async (teamId: string): Promise<{ otherTeam: Team, lastMessage: TeamMessage }[]> => {
  await delay(500);
  const messages = getStorage<TeamMessage>(STORAGE_KEYS.MESSAGES);
  const teams = getStorage<Team>(STORAGE_KEYS.TEAMS);

  // Find all interactions involving teamId
  const interactions = new Map<string, TeamMessage>();

  messages.forEach(m => {
    if (m.fromTeamId === teamId || m.toTeamId === teamId) {
      const otherId = m.fromTeamId === teamId ? m.toTeamId : m.fromTeamId;
      const current = interactions.get(otherId);
      if (!current || m.timestamp > current.timestamp) {
        interactions.set(otherId, m);
      }
    }
  });

  const inbox: { otherTeam: Team, lastMessage: TeamMessage }[] = [];

  for (const [otherId, msg] of interactions.entries()) {
    const otherTeam = teams.find(t => t.id === otherId);
    if (otherTeam) {
      inbox.push({ otherTeam, lastMessage: msg });
    }
  }

  // Sort by latest message
  return inbox.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
};

export const markConversationRead = async (teamId: string, otherTeamId: string) => {
  const msgs = getStorage<TeamMessage>(STORAGE_KEYS.MESSAGES);
  let updated = false;

  msgs.forEach(m => {
    if (m.toTeamId === teamId && m.fromTeamId === otherTeamId && !m.read) {
      m.read = true;
      updated = true;
    }
  });

  if (updated) {
    setStorage(STORAGE_KEYS.MESSAGES, msgs);
  }
};

export const markMessageNotificationsFromTeamRead = async (
  userId: string,
  fromTeamId: string
): Promise<void> => {
  const notifications = getStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);
  let updated = false;

  notifications.forEach(n => {
    if (
      n.userId === userId &&
      n.type === "message" &&
      n.relatedTeamId === fromTeamId &&
      !n.read
    ) {
      n.read = true;
      updated = true;
    }
  });

  if (updated) {
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
};

export const cleanupReadNotifications = (
  userId: string,
  maxRead: number = 10
): void => {
  const notifications = getStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS);

  // separa notificações do usuário
  const userNotifications = notifications.filter(n => n.userId === userId);

  // não lidas (nunca mexe)
  const unread = userNotifications.filter(n => !n.read);

  // lidas, ordenadas da mais recente para a mais antiga
  const read = userNotifications
    .filter(n => n.read)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  // mantém só as N mais recentes
  const keptRead = read.slice(0, maxRead);

  // notificações de outros usuários (não mexe)
  const others = notifications.filter(n => n.userId !== userId);

  // salva tudo de volta
  setStorage(STORAGE_KEYS.NOTIFICATIONS, [
    ...others,
    ...unread,
    ...keptRead
  ]);
};

export const addReport = async (report: {
  id: string;
  targetTeamId: string;
  authorTeamId: string;
  comment: string;
  fileUrl?: string | null;
  createdAt: number;
}) => {
  await delay(400);

  const reports = getStorage<any>(STORAGE_KEYS.REPORTS);
  reports.push(report);
  setStorage(STORAGE_KEYS.REPORTS, reports);

  return report;
};


