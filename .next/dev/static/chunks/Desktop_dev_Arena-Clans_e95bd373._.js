(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/dev/Arena-Clans/services/dbService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addReport",
    ()=>addReport,
    "addReview",
    ()=>addReview,
    "cleanupReadNotifications",
    ()=>cleanupReadNotifications,
    "createTeam",
    ()=>createTeam,
    "getConversation",
    ()=>getConversation,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getInbox",
    ()=>getInbox,
    "getNotifications",
    ()=>getNotifications,
    "getReviews",
    ()=>getReviews,
    "getTeamById",
    ()=>getTeamById,
    "getTeams",
    ()=>getTeams,
    "getVideos",
    ()=>getVideos,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "markConversationRead",
    ()=>markConversationRead,
    "markMessageNotificationsFromTeamRead",
    ()=>markMessageNotificationsFromTeamRead,
    "markNotificationRead",
    ()=>markNotificationRead,
    "registerUser",
    ()=>registerUser,
    "sendMessage",
    ()=>sendMessage,
    "sendVerificationCode",
    ()=>sendVerificationCode,
    "updateTeam",
    ()=>updateTeam,
    "uploadVideo",
    ()=>uploadVideo,
    "verifyCode",
    ()=>verifyCode
]);
/**
 * MOCK DATABASE SERVICE
 * 
 * In a real production environment, this file would import `firebase/firestore` or `@supabase/supabase-js`.
 * Here, we simulate async DB calls using LocalStorage to allow the app to be fully functional 
 * as a standalone artifact.
 */ const STORAGE_KEYS = {
    USERS: 'scrimlink_users',
    TEAMS: 'scrimlink_teams',
    REVIEWS: 'scrimlink_reviews',
    VIDEOS: 'scrimlink_videos',
    SESSION: 'scrimlink_session',
    NOTIFICATIONS: 'scrimlink_notifications',
    MESSAGES: 'scrimlink_messages',
    REPORTS: 'scrimlink_reports'
};
// --- Helpers ---
const delay = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms));
const getStorage = (key)=>{
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};
const setStorage = (key, data)=>{
    localStorage.setItem(key, JSON.stringify(data));
};
const loginUser = async (email, password)=>{
    await delay(800);
    const users = getStorage(STORAGE_KEYS.USERS);
    const user = users.find((u)=>u.email === email && u.password === password);
    if (!user) throw new Error("Credenciais inválidas.");
    const { password: _, ...safeUser } = user;
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeUser));
    return safeUser;
};
const registerUser = async (data)=>{
    await delay(1200);
    const users = getStorage(STORAGE_KEYS.USERS);
    // Uniqueness checks
    if (users.some((u)=>u.email === data.email)) throw new Error("E-mail já cadastrado.");
    if (users.some((u)=>u.cpf === data.cpf)) throw new Error("CPF já cadastrado.");
    const newUser = {
        uid: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        phoneVerified: false,
        password: data.password
    };
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeUser));
    return safeUser;
};
const logoutUser = async ()=>{
    localStorage.removeItem(STORAGE_KEYS.SESSION);
};
const getCurrentUser = ()=>{
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
};
const sendVerificationCode = async (phone)=>{
    await delay(1500);
    // Implementation: Call Meta API / Twilio here
    console.log(`[SMS-MOCK] Sending code 1234 to ${phone}`);
    return "1234"; // Fixed for demo
};
const verifyCode = async (uid, inputCode)=>{
    await delay(1000);
    if (inputCode === "1234") {
        const users = getStorage(STORAGE_KEYS.USERS);
        const userIndex = users.findIndex((u)=>u.uid === uid);
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
const createTeam = async (user, data)=>{
    await delay(1000);
    const teams = getStorage(STORAGE_KEYS.TEAMS);
    if (teams.some((t)=>t.name.toLowerCase() === data.name?.toLowerCase())) {
        throw new Error("Nome da equipe já existe.");
    }
    const newTeam = {
        id: crypto.randomUUID(),
        ownerUid: user.uid,
        name: data.name,
        game: data.game,
        region: data.region,
        description: data.description || "",
        photoUrl: data.photoUrl || `https://picsum.photos/seed/${data.name}/200`,
        rating: 0,
        totalReviews: 0
    };
    teams.push(newTeam);
    setStorage(STORAGE_KEYS.TEAMS, teams);
    // Link team to user
    const users = getStorage(STORAGE_KEYS.USERS);
    const uIdx = users.findIndex((u)=>u.uid === user.uid);
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
const updateTeam = async (teamId, updates)=>{
    await delay(800);
    const teams = getStorage(STORAGE_KEYS.TEAMS);
    const index = teams.findIndex((t)=>t.id === teamId);
    if (index === -1) {
        throw new Error("Equipe não encontrada.");
    }
    // Merge updates
    const updatedTeam = {
        ...teams[index],
        ...updates
    };
    // Basic validation if name changed
    if (updates.name && updates.name !== teams[index].name) {
        if (teams.some((t)=>t.id !== teamId && t.name.toLowerCase() === updates.name?.toLowerCase())) {
            throw new Error("Nome da equipe já existe.");
        }
    }
    teams[index] = updatedTeam;
    setStorage(STORAGE_KEYS.TEAMS, teams);
    return updatedTeam;
};
const getTeams = async (filters = {})=>{
    await delay(600);
    let teams = getStorage(STORAGE_KEYS.TEAMS);
    // Filter by Game
    if (filters.game && filters.game !== 'ALL') {
        teams = teams.filter((t)=>t.game === filters.game);
    }
    // Filter by Region (State) - Partial match, case insensitive
    if (filters.state && filters.state.trim() !== '') {
        const searchState = filters.state.toLowerCase();
        teams = teams.filter((t)=>t.region.state.toLowerCase().includes(searchState));
    }
    // Filter by Minimum Rating
    if (filters.minRating && filters.minRating > 0) {
        teams = teams.filter((t)=>t.rating >= filters.minRating);
    }
    return teams;
};
const getTeamById = async (id)=>{
    await delay(400);
    const teams = getStorage(STORAGE_KEYS.TEAMS);
    return teams.find((t)=>t.id === id);
};
const addReview = async (review)=>{
    await delay(500);
    const reviews = getStorage(STORAGE_KEYS.REVIEWS);
    const existingIndex = reviews.findIndex((r)=>r.targetTeamId === review.targetTeamId && r.authorTeamId === review.authorTeamId);
    const average = (review.boaConduta + review.comunicacao + review.pontualidade) / 3;
    const newReview = {
        ...review,
        id: existingIndex >= 0 ? reviews[existingIndex].id : crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        average
    };
    if (existingIndex >= 0) {
        reviews[existingIndex] = newReview;
    } else {
        reviews.push(newReview);
    }
    setStorage(STORAGE_KEYS.REVIEWS, reviews);
    // Update team rating
    const teams = getStorage(STORAGE_KEYS.TEAMS);
    const teamIndex = teams.findIndex((t)=>t.id === review.targetTeamId);
    if (teamIndex >= 0) {
        const teamReviews = reviews.filter((r)=>r.targetTeamId === review.targetTeamId);
        const avgTeam = teamReviews.reduce((acc, r)=>acc + r.average, 0) / teamReviews.length;
        teams[teamIndex].rating = parseFloat(avgTeam.toFixed(1));
        teams[teamIndex].totalReviews = teamReviews.length;
        setStorage(STORAGE_KEYS.TEAMS, teams);
    }
    return newReview; // <-- AGORA SIM
};
const getReviews = async (teamId)=>{
    const reviews = getStorage(STORAGE_KEYS.REVIEWS);
    return reviews.filter((r)=>r.targetTeamId === teamId).sort((a, b)=>b.timestamp.localeCompare(a.timestamp));
};
const uploadVideo = async (data)=>{
    await delay(2000); // Simulate upload time
    const videos = getStorage(STORAGE_KEYS.VIDEOS);
    const newVideo = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        // @ts-ignore
        average: 0
    };
    videos.push(newVideo);
    setStorage(STORAGE_KEYS.VIDEOS, videos);
    return newVideo;
};
const getVideos = async (teamId)=>{
    const videos = getStorage(STORAGE_KEYS.VIDEOS);
    return videos.filter((v)=>v.teamId === teamId);
};
const getNotifications = async (userId)=>{
    await delay(500);
    // 🧹 limpa notificações lidas antigas
    cleanupReadNotifications(userId, 10);
    const notifications = getStorage(STORAGE_KEYS.NOTIFICATIONS);
    const userNotes = notifications.filter((n)=>n.userId === userId);
    return userNotes.sort((a, b)=>b.timestamp.localeCompare(a.timestamp));
};
const markNotificationRead = async (id)=>{
    const notifications = getStorage(STORAGE_KEYS.NOTIFICATIONS);
    const index = notifications.findIndex((n)=>n.id === id);
    if (index >= 0) {
        notifications[index].read = true;
        setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
};
const sendMessage = async (fromTeamId, toTeamId, text)=>{
    await delay(300);
    const messages = getStorage(STORAGE_KEYS.MESSAGES);
    const newMessage = {
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
    const teams = getStorage(STORAGE_KEYS.TEAMS);
    const fromTeam = teams.find((t)=>t.id === fromTeamId);
    const toTeam = teams.find((t)=>t.id === toTeamId);
    if (toTeam && fromTeam) {
        const notifications = getStorage(STORAGE_KEYS.NOTIFICATIONS);
        // 🔹 verifica se já existe notificação NÃO lida dessa equipe
        const existing = notifications.find((n)=>n.userId === toTeam.ownerUid && n.type === 'message' && n.relatedTeamId === fromTeamId && !n.read);
        if (existing) {
            // 🔁 Atualiza a notificação existente (não cria outra)
            existing.message = text.substring(0, 50) + (text.length > 50 ? "..." : "");
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
const getConversation = async (teamAId, teamBId)=>{
    // await delay(200);
    const messages = getStorage(STORAGE_KEYS.MESSAGES);
    return messages.filter((m)=>m.fromTeamId === teamAId && m.toTeamId === teamBId || m.fromTeamId === teamBId && m.toTeamId === teamAId).sort((a, b)=>a.timestamp - b.timestamp);
};
const getInbox = async (teamId)=>{
    await delay(500);
    const messages = getStorage(STORAGE_KEYS.MESSAGES);
    const teams = getStorage(STORAGE_KEYS.TEAMS);
    // Find all interactions involving teamId
    const interactions = new Map();
    messages.forEach((m)=>{
        if (m.fromTeamId === teamId || m.toTeamId === teamId) {
            const otherId = m.fromTeamId === teamId ? m.toTeamId : m.fromTeamId;
            const current = interactions.get(otherId);
            if (!current || m.timestamp > current.timestamp) {
                interactions.set(otherId, m);
            }
        }
    });
    const inbox = [];
    for (const [otherId, msg] of interactions.entries()){
        const otherTeam = teams.find((t)=>t.id === otherId);
        if (otherTeam) {
            inbox.push({
                otherTeam,
                lastMessage: msg
            });
        }
    }
    // Sort by latest message
    return inbox.sort((a, b)=>b.lastMessage.timestamp - a.lastMessage.timestamp);
};
const markConversationRead = async (teamId, otherTeamId)=>{
    const msgs = getStorage(STORAGE_KEYS.MESSAGES);
    let updated = false;
    msgs.forEach((m)=>{
        if (m.toTeamId === teamId && m.fromTeamId === otherTeamId && !m.read) {
            m.read = true;
            updated = true;
        }
    });
    if (updated) {
        setStorage(STORAGE_KEYS.MESSAGES, msgs);
    }
};
const markMessageNotificationsFromTeamRead = async (userId, fromTeamId)=>{
    const notifications = getStorage(STORAGE_KEYS.NOTIFICATIONS);
    let updated = false;
    notifications.forEach((n)=>{
        if (n.userId === userId && n.type === "message" && n.relatedTeamId === fromTeamId && !n.read) {
            n.read = true;
            updated = true;
        }
    });
    if (updated) {
        setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
};
const cleanupReadNotifications = (userId, maxRead = 10)=>{
    const notifications = getStorage(STORAGE_KEYS.NOTIFICATIONS);
    // separa notificações do usuário
    const userNotifications = notifications.filter((n)=>n.userId === userId);
    // não lidas (nunca mexe)
    const unread = userNotifications.filter((n)=>!n.read);
    // lidas, ordenadas da mais recente para a mais antiga
    const read = userNotifications.filter((n)=>n.read).sort((a, b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    // mantém só as N mais recentes
    const keptRead = read.slice(0, maxRead);
    // notificações de outros usuários (não mexe)
    const others = notifications.filter((n)=>n.userId !== userId);
    // salva tudo de volta
    setStorage(STORAGE_KEYS.NOTIFICATIONS, [
        ...others,
        ...unread,
        ...keptRead
    ]);
};
const addReport = async (report)=>{
    await delay(400);
    const reports = getStorage(STORAGE_KEYS.REPORTS);
    reports.push(report);
    setStorage(STORAGE_KEYS.REPORTS, reports);
    return report;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Icons",
    ()=>Icons
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const Icons = {
    Gamepad: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-6 h-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M15 5v2m0 4v23m0-2c0 1.105-.895 2-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2zM3 15a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4zm16-4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4a2 2 0 012-2h4z"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 7,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 6,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Shield: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-6 h-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 16,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Star: ({ fill })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: `w-5 h-5 ${fill ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`,
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363 1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 26,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Lock: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-4 h-4",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 40,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Video: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-6 h-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 50,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    User: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-6 h-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 60,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Check: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-6 h-6 text-[#21ff21]",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M5 13l4 4L19 7"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 70,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Menu: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-6 h-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M4 6h16M4 12h16M4 18h16"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 75,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Bell: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-6 h-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 80,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Filter: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-4 h-4",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 90,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Message: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-5 h-5",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx",
            lineNumber: 100,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/services/dbService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const Navbar = ({ user, onOpenChat, notificationVersion, onRequestLogout })=>{
    _s();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const notifRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            if (user) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotifications"](user.uid).then(setNotifications);
            }
        }
    }["Navbar.useEffect"], [
        user,
        notificationVersion
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const handleClickOutside = {
                "Navbar.useEffect.handleClickOutside": (event)=>{
                    if (notifRef.current && !notifRef.current.contains(event.target)) {
                        setShowNotifications(false);
                    }
                }
            }["Navbar.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "Navbar.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    const unreadTeamIds = new Set(notifications.filter((n)=>!n.read && n.type === 'message' && n.relatedTeamId).map((n)=>n.relatedTeamId));
    const unreadCount = unreadTeamIds.size;
    const handleNotificationClick = async (notification)=>{
        if (!notification.read) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markNotificationRead"](notification.id);
            setNotifications((prev)=>prev.map((n)=>n.id === notification.id ? {
                        ...n,
                        read: true
                    } : n));
        }
        if (notification.type === 'message' && notification.relatedTeamId) {
            onOpenChat(notification.relatedTeamId);
            setShowNotifications(false);
        }
    };
    if (!user) return null; // Hide Navbar if not logged in
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "sticky top-0 z-50 border-b border-dark-800 bg-dark-950/80 backdrop-blur-md",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between h-16 items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "https://i.imgur.com/N2ONXvq.png",
                                alt: "Arena Clans Logo",
                                className: "w-10 h-10 object-contain"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-xl tracking-tight text-white",
                                children: [
                                    "ARENA-",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#21ff21]",
                                        children: "CLANS"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                        lineNumber: 72,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: 2,
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "w-6 h-6 sm:w-5 sm:h-5 mr-0 sm:mr-2 text-[#21ff21]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M3 9l9-7 9 7"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                lineNumber: 90,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9 22V12h6v10"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                lineNumber: 91,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Início"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            user.teamId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/my-team",
                                className: "flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: 2,
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "w-6 h-6 sm:w-5 sm:h-5 mr-0 sm:mr-2 text-[#21ff21]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "12",
                                                cy: "8",
                                                r: "4"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                lineNumber: 110,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M6 20c0-3 2-5 6-5s6 2 6 5"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                lineNumber: 111,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                        lineNumber: 100,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Minha Equipe"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                        lineNumber: 113,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                lineNumber: 96,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/create-team",
                                className: "text-sm text-[#21ff21] hover:text-[#16cc16]",
                                children: "Criar Equipe"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                ref: notifRef,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowNotifications(!showNotifications),
                                        className: "p-2 text-gray-400 hover:text-white relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Bell, {}, void 0, false, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-dark-950"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                lineNumber: 129,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute right-0 mt-2 w-80 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 border-b border-dark-700 flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-bold text-sm text-white",
                                                        children: "Notificações"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                        lineNumber: 136,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            unreadCount,
                                                            " novas"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                lineNumber: 135,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "max-h-80 overflow-y-auto",
                                                children: notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4 text-center text-gray-500 text-sm",
                                                    children: "Sem notificações."
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)) : notifications.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>handleNotificationClick(n),
                                                        className: `p-3 border-b border-dark-800 hover:bg-dark-800/50 cursor-pointer transition-colors ${!n.read ? 'bg-dark-800/30' : ''}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-start mb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-semibold text-white",
                                                                        children: n.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                                        lineNumber: 152,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    !n.read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "w-2 h-2 bg-[#21ff21] rounded-full"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                                        lineNumber: 153,
                                                                        columnNumber: 41
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                                lineNumber: 151,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-400 line-clamp-2",
                                                                children: n.message
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                                lineNumber: 155,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-gray-600 mt-2 block",
                                                                children: new Date(n.timestamp).toLocaleDateString()
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                                lineNumber: 156,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, n.id, true, {
                                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                        lineNumber: 144,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                                lineNumber: 139,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-px h-6 bg-dark-800 mx-2"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onRequestLogout,
                                className: "text-sm text-gray-400 hover:text-white",
                                children: "Sair"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Navbar, "/E8K6uPmQhRmXPjRt+Gbef/JXiA=");
_c = Navbar;
const __TURBOPACK__default__export__ = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/services/dbService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const ChatModal = ({ open, onClose, teamId, currentTeamId, userId, refreshNotifications })=>{
    _s();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [text, setText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [otherTeam, setOtherTeam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load team + messages
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatModal.useEffect": ()=>{
            if (!open || !teamId || !userId) return;
            const load = {
                "ChatModal.useEffect.load": async ()=>{
                    // 1. Carrega equipe
                    const team = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTeamById"](teamId);
                    setOtherTeam(team || null);
                    // 2. Carrega mensagens
                    const msgs = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConversation"](currentTeamId, teamId);
                    setMessages(msgs);
                    // 3. Marca notificações dessa equipe como lidas
                    await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markMessageNotificationsFromTeamRead"](userId, teamId);
                    // 4. Atualiza Navbar
                    refreshNotifications();
                    // Scroll
                    setTimeout({
                        "ChatModal.useEffect.load": ()=>{
                            bottomRef.current?.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }
                    }["ChatModal.useEffect.load"], 100);
                }
            }["ChatModal.useEffect.load"];
            load();
        }
    }["ChatModal.useEffect"], [
        open,
        teamId,
        currentTeamId,
        userId
    ]);
    const handleSend = async (e)=>{
        e.preventDefault();
        if (!text.trim()) return;
        const msg = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendMessage"](currentTeamId, teamId, text);
        setMessages((prev)=>[
                ...prev,
                msg
            ]);
        setText('');
        // Rola para baixo após enviar
        setTimeout(()=>{
            bottomRef.current?.scrollIntoView({
                behavior: 'smooth'
            });
        }, 100);
    };
    if (!open || !otherTeam) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "   w-full    max-w-lg    h-[85vh]   sm:h-[85vh] sm:h-[600px]   bg-dark-900    border border-[#21ff21]    rounded-2xl    shadow-2xl shadow-[#21ff21]/20    flex flex-col    overflow-hidden   ",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "   bg-dark-800    p-3 sm:p-4    border-b border-dark-700    flex items-center justify-between   ",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: otherTeam.photoUrl,
                                    alt: otherTeam.name,
                                    className: "w-10 h-10 rounded-full object-cover border border-[#21ff21]"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-white font-bold text-sm sm:text-base",
                                            children: otherTeam.name
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[#21ff21] text-xs",
                                            children: "Online"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                            lineNumber: 104,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-300 hover:text-white text-xl leading-none",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "   flex-1    overflow-y-auto    p-3 sm:p-4    space-y-4    bg-dark-950/40   ",
                    children: [
                        messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-center text-gray-500 text-sm mt-6",
                            children: "Comece a conversa!"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        messages.map((m)=>{
                            const isMe = m.fromTeamId === currentTeamId;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex ${isMe ? 'justify-end' : 'justify-start'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `
                    max-w-[80%] 
                    rounded-xl 
                    p-3 
                    text-sm 
                    ${isMe ? 'bg-[#21ff21] text-black rounded-tr-none' : 'bg-dark-800 text-gray-200 border border-dark-700 rounded-tl-none'}
                  `,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: m.text
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                            lineNumber: 144,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `
                      text-[10px] block text-right mt-1
                      ${isMe ? 'text-black/60' : 'text-gray-500'}
                    `,
                                            children: [
                                                new Date(m.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }),
                                                isMe && (m.read ? ' ✅ Lida' : ' ✅ Enviada')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                            lineNumber: 145,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                    lineNumber: 131,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, m.id, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                lineNumber: 130,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0));
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: bottomRef
                        }, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSend,
                    className: "p-3 sm:p-4 bg-dark-800 border-t border-dark-700 flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            value: text,
                            onChange: (e)=>setText(e.target.value),
                            placeholder: "Digite sua mensagem...",
                            className: "   flex-1    bg-dark-900    border border-dark-700    rounded-lg    px-4 py-2    text-white    focus:outline-none    focus:border-[#21ff21]   "
                        }, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "   bg-[#21ff21]    text-black    p-2    rounded-lg    hover:bg-[#16cc16]    flex items-center justify-center   ",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icons"].Message, {}, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ChatModal, "1BD13BqhCre4SuwGqjRQmvJM4qQ=");
_c = ChatModal;
const __TURBOPACK__default__export__ = ChatModal;
var _c;
__turbopack_context__.k.register(_c, "ChatModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const WelcomeModal = ({ open, onClose })=>{
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-dark-900 border border-[#21ff21]/40 rounded-2xl shadow-[0_0_25px_#21ff21]/20 p-8 max-w-md w-full text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: "https://i.imgur.com/N2ONXvq.png",
                    alt: "Arena Clans Logo",
                    className: "w-20 h-20 mx-auto mb-4 object-contain drop-shadow-[0_0_10px_#21ff21]"
                }, void 0, false, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                    lineNumber: 10,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-3xl font-bold text-white mb-4",
                    children: "Bem-vindo ao Arena-Clans!"
                }, void 0, false, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-300 text-base leading-relaxed mb-6",
                    children: [
                        "Aqui conectamos equipes com foco em treinos e amistosos reais, priorizando compromisso e evolução.",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        "- ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[#21ff21] font-semibold",
                            children: "Sem toxidade"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 24,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        "- ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[#21ff21] font-semibold",
                            children: "Sem trollagens"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 26,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        "-",
                        ' ',
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[#21ff21] font-semibold",
                            children: "Somente equipes dedicadas a evoluir"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        "Mantenha o respeito, jogue com seriedade e aproveite a experiência."
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "w-full bg-[#21ff21] text-black font-semibold py-3 rounded-xl hover:bg-[#16cc16] transition-colors",
                    children: "Continuar"
                }, void 0, false, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = WelcomeModal;
const __TURBOPACK__default__export__ = WelcomeModal;
var _c;
__turbopack_context__.k.register(_c, "WelcomeModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppShell,
    "useAppContext",
    ()=>useAppContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/services/dbService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/layout/Navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$modals$2f$ChatModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/modals/ChatModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$modals$2f$WelcomeModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/modals/WelcomeModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useAppContext() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!ctx) {
        throw new Error('useAppContext must be used within AppShell');
    }
    return ctx;
}
_s(useAppContext, "/dMy7t63NXD4eYACoT93CePwGrg=");
function AppShell({ children }) {
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showWelcome, setShowWelcome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notificationVersion, setNotificationVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [chatTarget, setChatTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const refreshNotifications = ()=>{
        setNotificationVersion((v)=>v + 1);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppShell.useEffect": ()=>{
            if (!user) return;
            const key = `welcomeSeen_${user.uid}`;
            if (!localStorage.getItem(key)) {
                setShowWelcome(true);
                localStorage.setItem(key, 'true');
            }
        }
    }["AppShell.useEffect"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppShell.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutUser"]();
            setUser(null);
            setLoading(false);
        }
    }["AppShell.useEffect"], []);
    const openChat = async (teamId)=>{
        if (!user || !user.teamId) return;
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markConversationRead"](user.teamId, teamId);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markMessageNotificationsFromTeamRead"](user.uid, teamId);
        setNotificationVersion((v)=>v + 1);
        setChatTarget(teamId);
    };
    const closeChat = ()=>{
        setChatTarget(null);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen app-background flex items-center justify-center text-[#21ff21]",
            children: "Carregando..."
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this);
    }
    const contextValue = {
        user,
        setUser,
        openChat
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: contextValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen app-background text-gray-100 font-sans selection:bg-[#21ff21]/30",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    user: user,
                    onOpenChat: openChat,
                    notificationVersion: notificationVersion,
                    onRequestLogout: ()=>setShowLogoutConfirm(true)
                }, void 0, false, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this),
                children,
                user?.teamId && chatTarget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$modals$2f$ChatModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    open: !!chatTarget,
                    onClose: closeChat,
                    teamId: chatTarget,
                    currentTeamId: user.teamId,
                    userId: user.uid,
                    refreshNotifications: refreshNotifications
                }, void 0, false, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                    lineNumber: 108,
                    columnNumber: 11
                }, this),
                showWelcome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$modals$2f$WelcomeModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    open: showWelcome,
                    onClose: ()=>setShowWelcome(false)
                }, void 0, false, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                    lineNumber: 118,
                    columnNumber: 25
                }, this),
                showLogoutConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-dark-900 border border-dark-700 rounded-xl p-6 w-full max-w-sm text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white mb-6",
                                children: "Tem certeza que deseja sair da sua conta?"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowLogoutConfirm(false),
                                        className: "px-4 py-2 rounded-lg bg-dark-800 text-gray-300 hover:bg-dark-700",
                                        children: "Cancelar"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                                        lineNumber: 126,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            document.body.style.overflow = 'unset';
                                            document.documentElement.style.overflow = 'unset';
                                            document.body.style.position = 'static';
                                            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutUser"]();
                                            setUser(null);
                                            setShowLogoutConfirm(false);
                                            router.push('/auth');
                                            window.scrollTo(0, 0);
                                        },
                                        className: "px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500",
                                        children: "Sair"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                                        lineNumber: 133,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                                lineNumber: 125,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                        lineNumber: 122,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
            lineNumber: 97,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s1(AppShell, "BehNOsWxhOAI67H7fCmi3L9olks=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AppShell;
var _c;
__turbopack_context__.k.register(_c, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/dev/Arena-Clans/app/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "pt-BR",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: "app-background",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/app/layout.tsx",
                lineNumber: 13,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/dev/Arena-Clans/app/layout.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/app/layout.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = RootLayout;
var _c;
__turbopack_context__.k.register(_c, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_dev_Arena-Clans_e95bd373._.js.map