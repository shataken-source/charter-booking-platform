module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@supabase/supabase-js", () => require("@supabase/supabase-js"));

module.exports = mod;
}),
"[externals]/react [external] (react, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react", () => require("react"));

module.exports = mod;
}),
"[project]/charter-booking-platform/pages/_app.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/_app.js - ACTUAL WORKING CODE
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
(()=>{
    const e = new Error("Cannot find module 'react-hot-toast'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
// Initialize Supabase client
const supabase = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__cjs$29$__["createClient"])(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key');
function MyApp({ Component, pageProps }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Check for user session
        checkUser();
        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session)=>{
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });
        return ()=>{
            authListener?.subscription?.unsubscribe();
        };
    }, []);
    async function checkUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        } catch (error) {
            console.error('Error checking user:', error);
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                ...pageProps,
                supabase: supabase,
                user: user
            }, void 0, false, {
                fileName: "[project]/charter-booking-platform/pages/_app.js",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Toaster, {
                position: "top-right",
                toastOptions: {
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff'
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff'
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff'
                        }
                    }
                }
            }, void 0, false, {
                fileName: "[project]/charter-booking-platform/pages/_app.js",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
const __TURBOPACK__default__export__ = MyApp;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0183e618._.js.map