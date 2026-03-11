module.exports = [
"[project]/Desktop/dev/Arena-Clans/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GameType",
    ()=>GameType
]);
var GameType = /*#__PURE__*/ function(GameType) {
    GameType["VALORANT"] = "Valorant";
    GameType["LOL"] = "League of Legends";
    return GameType;
}({});
}),
"[project]/Desktop/dev/Arena-Clans/constants/brazilStates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BRAZIL_STATES",
    ()=>BRAZIL_STATES
]);
const BRAZIL_STATES = [
    {
        uf: 'AC',
        name: 'Acre'
    },
    {
        uf: 'AL',
        name: 'Alagoas'
    },
    {
        uf: 'AP',
        name: 'Amapá'
    },
    {
        uf: 'AM',
        name: 'Amazonas'
    },
    {
        uf: 'BA',
        name: 'Bahia'
    },
    {
        uf: 'CE',
        name: 'Ceará'
    },
    {
        uf: 'DF',
        name: 'Distrito Federal'
    },
    {
        uf: 'ES',
        name: 'Espírito Santo'
    },
    {
        uf: 'GO',
        name: 'Goiás'
    },
    {
        uf: 'MA',
        name: 'Maranhão'
    },
    {
        uf: 'MT',
        name: 'Mato Grosso'
    },
    {
        uf: 'MS',
        name: 'Mato Grosso do Sul'
    },
    {
        uf: 'MG',
        name: 'Minas Gerais'
    },
    {
        uf: 'PA',
        name: 'Pará'
    },
    {
        uf: 'PB',
        name: 'Paraíba'
    },
    {
        uf: 'PR',
        name: 'Paraná'
    },
    {
        uf: 'PE',
        name: 'Pernambuco'
    },
    {
        uf: 'PI',
        name: 'Piauí'
    },
    {
        uf: 'RJ',
        name: 'Rio de Janeiro'
    },
    {
        uf: 'RN',
        name: 'Rio Grande do Norte'
    },
    {
        uf: 'RS',
        name: 'Rio Grande do Sul'
    },
    {
        uf: 'RO',
        name: 'Rondônia'
    },
    {
        uf: 'RR',
        name: 'Roraima'
    },
    {
        uf: 'SC',
        name: 'Santa Catarina'
    },
    {
        uf: 'SP',
        name: 'São Paulo'
    },
    {
        uf: 'SE',
        name: 'Sergipe'
    },
    {
        uf: 'TO',
        name: 'Tocantins'
    }
];
}),
"[project]/Desktop/dev/Arena-Clans/components/ui/Card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const Card = ({ children, className = '' })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-dark-800/50 border border-dark-800 backdrop-blur-sm rounded-xl p-6 ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Card.tsx",
        lineNumber: 4,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const __TURBOPACK__default__export__ = Card;
}),
"[project]/Desktop/dev/Arena-Clans/components/ui/Badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const Badge = ({ children, color = 'green' })=>{
    const colors = {
        green: 'bg-[#21ff21]/30 text-[#21ff21] border-[#21ff21]',
        red: 'bg-red-900/30 text-red-400 border-red-900',
        blue: 'bg-blue-900/30 text-blue-400 border-blue-900',
        gray: 'bg-gray-800 text-gray-400 border-gray-700'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `px-2 py-0.5 rounded text-xs font-medium border ${colors[color] || colors.gray}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Badge.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Badge;
}),
"[project]/Desktop/dev/Arena-Clans/components/ui/Button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' })=>{
    const base = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
    const styles = {
        primary: 'bg-brand-500 text-black hover:bg-brand-600 shadow-lg shadow-[#21ff21]/50',
        secondary: 'bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-700',
        danger: 'bg-red-600 hover:bg-red-500 text-white',
        ghost: 'text-gray-400 hover:text-white'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        onClick: onClick,
        disabled: disabled,
        className: `${base} ${styles[variant]} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/components/ui/Button.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Button;
}),
"[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/services/dbService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$constants$2f$brazilStates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/constants/brazilStates.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/ui/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/ui/Badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/ui/Icons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
const DashboardPage = ()=>{
    const { user, openChat } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppContext"])();
    const [teams, setTeams] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState([]);
    const [filterGame, setFilterGame] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState('ALL');
    const [filterState, setFilterState] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState('');
    const [filterRating, setFilterRating] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(0);
    const [searchName, setSearchName] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState('');
    const [loading, setLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(true);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        const load = async ()=>{
            setLoading(true);
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTeams"]({
                game: filterGame === 'ALL' ? undefined : filterGame,
                state: filterState,
                minRating: filterRating > 0 ? filterRating : undefined
            });
            setTeams(data);
            setLoading(false);
        };
        const timer = setTimeout(load, 300);
        return ()=>clearTimeout(timer);
    }, [
        filterGame,
        filterState,
        filterRating
    ]);
    const handleChallenge = async (teamId)=>{
        if (!user?.teamId) {
            alert('Você precisa criar uma equipe para desafiar!');
            return;
        }
        const hasConvo = (await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getConversation"](user.teamId, teamId)).length > 0;
        if (!hasConvo) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$services$2f$dbService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sendMessage"](user.teamId, teamId, 'Olá! Vamos marcar um treino?');
        }
        openChat(teamId);
    };
    const clearFilters = ()=>{
        setFilterGame('ALL');
        setFilterState('');
        setFilterRating(0);
    };
    const filteredTeams = teams.filter((team)=>{
        if (!searchName) return true;
        return team.name.toLowerCase().includes(searchName.toLowerCase());
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8 flex flex-col md:flex-row justify-between items-end gap-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-extrabold text-white mb-2 text-center",
                        children: "Escolha uma equipe e desafie!"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-dark-800/50 p-4 rounded-xl border border-dark-700 mb-8 flex flex-col lg:flex-row gap-4 items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 bg-dark-900 p-1 rounded-lg self-start",
                        children: [
                            'ALL',
                            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GameType"].VALORANT,
                            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GameType"].LOL
                        ].map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilterGame(g),
                                className: `px-4 py-2 rounded-md text-sm font-medium transition-colors ${filterGame === g ? 'bg-[#21ff21] text-black shadow' : 'text-gray-400 hover:text-white'}`,
                                children: g === 'ALL' ? 'Todos' : g
                            }, g, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: filterState,
                                onChange: (e)=>setFilterState(e.target.value),
                                className: "w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] focus:border-[#21ff21] outline-none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Todos os Estados"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$constants$2f$brazilStates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BRAZIL_STATES"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: s.uf,
                                            children: [
                                                s.uf,
                                                " - ",
                                                s.name
                                            ]
                                        }, s.uf, true, {
                                            fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "w-full bg-dark-900 border border-dark-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-[#21ff21] outline-none text-sm",
                                value: filterRating,
                                onChange: (e)=>setFilterRating(Number(e.target.value)),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 0,
                                        children: "Todas as Reputações"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 3,
                                        children: "⭐ 3+ Estrelas"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 4,
                                        children: "⭐ 4+ Estrelas"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 4.5,
                                        children: "⭐ 4.5+ Estrelas"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                        lineNumber: 107,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 5,
                                        children: "⭐ 5 Estrelas"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Buscar equipe pelo nome...",
                                value: searchName,
                                onChange: (e)=>setSearchName(e.target.value),
                                className: "w-full lg:w-64 bg-dark-900 border border-dark-800 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#21ff21] outline-none"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: clearFilters,
                        className: "px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-[#21ff21] transition-colors whitespace-nowrap",
                        children: "Limpar Filtros"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-20 text-gray-500",
                children: "Carregando equipes..."
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                lineNumber: 129,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : filteredTeams.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-20 bg-dark-800/20 rounded-xl border border-dashed border-dark-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-400 text-lg",
                        children: "Nenhuma equipe encontrada com esses filtros."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setFilterGame('ALL');
                            setFilterState('');
                            setFilterRating(0);
                        },
                        className: "text-[#21ff21] hover:underline mt-2 text-sm",
                        children: "Limpar filtros"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: filteredTeams.map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "group relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: `/team/${team.id}`,
                                className: "block h-full",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    className: "h-full hover:border-[#21ff21]/50 transition-colors relative overflow-hidden pb-16",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-4 mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: team.photoUrl,
                                                    alt: team.name,
                                                    className: "w-16 h-16 rounded-lg object-cover bg-dark-900"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "font-bold text-lg text-white group-hover:text-[#21ff21] transition-colors",
                                                            children: team.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-xs text-gray-400 mt-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    color: "blue",
                                                                    children: team.game
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                                    lineNumber: 157,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: team.region.state
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                                    lineNumber: 158,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                    lineNumber: 152,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-400 text-sm line-clamp-2 mb-4 h-10",
                                            children: team.description
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                            lineNumber: 162,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between pt-4 border-t border-dark-700/50 absolute bottom-4 left-6 right-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Icons"].Star, {
                                                        fill: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-white",
                                                        children: team.rating
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600 text-xs",
                                                        children: [
                                                            "(",
                                                            team.totalReviews,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                            lineNumber: 163,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                lineNumber: 148,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            user?.teamId !== team.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-4 right-6 z-10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    className: "bg-[#21ff21] text-black hover:bg-[#16cc16] text-xs py-1 px-3 shadow-none",
                                    onClick: ()=>handleChallenge(team.id),
                                    children: "🥊 Desafiar"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                    lineNumber: 174,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                                lineNumber: 173,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, team.id, true, {
                        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                        lineNumber: 147,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = DashboardPage;
}),
"[project]/Desktop/dev/Arena-Clans/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$app$2f$dashboard$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/app/dashboard/page.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function HomePage() {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    if (!user) {
        router.push('/auth');
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$app$2f$dashboard$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/Desktop/dev/Arena-Clans/app/page.tsx",
        lineNumber: 17,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=Desktop_dev_Arena-Clans_16a9c8d6._.js.map