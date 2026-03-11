(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/dev/Arena-Clans/app/my-team/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/dev/Arena-Clans/components/layout/AppShell.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const MyTeamRedirectPage = ()=>{
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "MyTeamRedirectPage.useEffect": ()=>{
            if (!user) {
                router.push('/');
                return;
            }
            if (user.teamId) {
                router.replace(`/team/${user.teamId}`);
            } else {
                router.replace('/');
            }
        }
    }["MyTeamRedirectPage.useEffect"], [
        user,
        router
    ]);
    return null;
};
_s(MyTeamRedirectPage, "Kiotfux8970EnPrjL0d9bsoHDQk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$components$2f$layout$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppContext"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$dev$2f$Arena$2d$Clans$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = MyTeamRedirectPage;
const __TURBOPACK__default__export__ = MyTeamRedirectPage;
var _c;
__turbopack_context__.k.register(_c, "MyTeamRedirectPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_dev_Arena-Clans_app_my-team_page_tsx_a77bcf21._.js.map