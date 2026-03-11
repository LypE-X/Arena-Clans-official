module.exports = [
"[project]/Desktop/dev/Arena-Clans/app/my-team/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
const MyTeamRedirectPage = ()=>{
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (!user) {
            router.push('/');
            return;
        }
        if (user.teamId) {
            router.replace(`/team/${user.teamId}`);
        } else {
            router.replace('/');
        }
    }, [
        user,
        router
    ]);
    return null;
};
const __TURBOPACK__default__export__ = MyTeamRedirectPage;
}),
];

//# sourceMappingURL=Desktop_dev_Arena-Clans_app_my-team_page_tsx_e9818066._.js.map