import { User, Team, GameType, Review, VideoEvidence, Notification, TeamMessage } from '../types';

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

// --- Auth Services ---

export const loginUser = async (email: string, password: string): Promise<User> => {
  await delay(800);
  const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) throw new Error("Credenciais inválidas.");

  const { password: _, ...safeUser } = user;
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeUser));
  return safeUser;
};

export const registerUser = async (data: any): Promise<User> => {
  await delay(1200);
  const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);

  // Uniqueness checks
  if (users.some(u => u.email === data.email)) throw new Error("E-mail já cadastrado.");
  if (users.some(u => u.cpf === data.cpf)) throw new Error("CPF já cadastrado.");

  const newUser: User & { password: string } = {
    uid: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    cpf: data.cpf,
    phone: data.phone,
    phoneVerified: false,
    password: data.password, // In real backend, verify hash
  };

  users.push(newUser);
  setStorage(STORAGE_KEYS.USERS, users);

  const { password: _, ...safeUser } = newUser;
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeUser));
  return safeUser;
};

export const logoutUser = async () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem(STORAGE_KEYS.SESSION);
  return session ? JSON.parse(session) : null;
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
      const session = getCurrentUser();
      if (session) {
        session.phoneVerified = true;
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      }
    }
    return true;
  }
  return false;
};

// --- Team Services ---

export const createTeam = async (user: User, data: Partial<Team>): Promise<Team> => {
  await delay(1000);
  const teams = getStorage<Team>(STORAGE_KEYS.TEAMS);

  if (teams.some(t => t.name.toLowerCase() === data.name?.toLowerCase())) {
    throw new Error("Nome da equipe já existe.");
  }

  const newTeam: Team = {
    id: crypto.randomUUID(),
    ownerUid: user.uid,
    name: data.name!,
    game: data.game as GameType,
    region: data.region!,
    description: data.description || "",
    photoUrl: data.photoUrl || `https://picsum.photos/seed/${data.name}/200`,
    rating: 0,
    totalReviews: 0,
  };

  teams.push(newTeam);
  setStorage(STORAGE_KEYS.TEAMS, teams);

  // Link team to user
  const users = getStorage<User & { password: string }>(STORAGE_KEYS.USERS);
  const uIdx = users.findIndex(u => u.uid === user.uid);
  if (uIdx >= 0) {
    users[uIdx].teamId = newTeam.id;
    setStorage(STORAGE_KEYS.USERS, users);

    // Update session
    const session = getCurrentUser();
    if (session) {
      session.teamId = newTeam.id;
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    }
  }

  return newTeam;
};

export const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<Team> => {
  await delay(800);
  const teams = getStorage<Team>(STORAGE_KEYS.TEAMS);
  const index = teams.findIndex(t => t.id === teamId);

  if (index === -1) {
    throw new Error("Equipe não encontrada.");
  }

  // Merge updates
  const updatedTeam = { ...teams[index], ...updates };

  // Basic validation if name changed
  if (updates.name && updates.name !== teams[index].name) {
    if (teams.some(t => t.id !== teamId && t.name.toLowerCase() === updates.name?.toLowerCase())) {
      throw new Error("Nome da equipe já existe.");
    }
  }

  teams[index] = updatedTeam;
  setStorage(STORAGE_KEYS.TEAMS, teams);
  return updatedTeam;
};

export interface TeamFilters {
  game?: string;
  state?: string;
  minRating?: number;
}

export const getTeams = async (filters: TeamFilters = {}): Promise<Team[]> => {
  await delay(600);
  let teams = getStorage<Team>(STORAGE_KEYS.TEAMS);

  // Filter by Game
  if (filters.game && filters.game !== 'ALL') {
    teams = teams.filter(t => t.game === filters.game);
  }

  // Filter by Region (State) - Partial match, case insensitive
  if (filters.state && filters.state.trim() !== '') {
    const searchState = filters.state.toLowerCase();
    teams = teams.filter(t => t.region.state.toLowerCase().includes(searchState));
  }

  // Filter by Minimum Rating
  if (filters.minRating && filters.minRating > 0) {
    teams = teams.filter(t => t.rating >= filters.minRating!);
  }

  return teams;
};

export const getTeamById = async (id: string): Promise<Team | undefined> => {
  await delay(400);
  const teams = getStorage<Team>(STORAGE_KEYS.TEAMS);
  return teams.find(t => t.id === id);
};

// --- Reviews ---

export const addReview = async (review: Omit<Review, 'id' | 'timestamp' | 'average'>) => {
  await delay(500);

  const reviews = getStorage<Review>(STORAGE_KEYS.REVIEWS);

  const existingIndex = reviews.findIndex(
    r => r.targetTeamId === review.targetTeamId && r.authorTeamId === review.authorTeamId
  );

  const average = (review.boaConduta + review.comunicacao + review.pontualidade) / 3;

  const newReview: Review = {
    ...review,
    id: existingIndex >= 0 ? reviews[existingIndex].id : crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    average,
  };

  if (existingIndex >= 0) {
    reviews[existingIndex] = newReview;
  } else {
    reviews.push(newReview);
  }

  setStorage(STORAGE_KEYS.REVIEWS, reviews);

  // Update team rating
  const teams = getStorage<Team>(STORAGE_KEYS.TEAMS);
  const teamIndex = teams.findIndex(t => t.id === review.targetTeamId);

  if (teamIndex >= 0) {
    const teamReviews = reviews.filter(r => r.targetTeamId === review.targetTeamId);
    const avgTeam = teamReviews.reduce((acc, r) => acc + r.average, 0) / teamReviews.length;

    teams[teamIndex].rating = parseFloat(avgTeam.toFixed(1));
    teams[teamIndex].totalReviews = teamReviews.length;

    setStorage(STORAGE_KEYS.TEAMS, teams);
  }

  return newReview; // <-- AGORA SIM
};

export const getReviews = async (teamId: string) => {
  const reviews = getStorage<Review>(STORAGE_KEYS.REVIEWS);
  return reviews
    .filter(r => r.targetTeamId === teamId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
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


