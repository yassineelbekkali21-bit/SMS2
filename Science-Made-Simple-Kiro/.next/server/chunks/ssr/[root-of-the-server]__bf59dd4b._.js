module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Science-Made-Simple-Kiro/src/components/AccessibilityProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccessibilityProvider",
    ()=>AccessibilityProvider,
    "useAccessibility",
    ()=>useAccessibility,
    "useResponsiveAnimation",
    ()=>useResponsiveAnimation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const AccessibilityContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AccessibilityProvider({ children }) {
    const [reducedMotion, setReducedMotion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [highContrast, setHighContrast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [largeText, setLargeText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [screenReaderMode, setScreenReaderMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [focusRing, setFocusRing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Détecter les préférences système
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Détecter la préférence de mouvement réduit
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(motionQuery.matches);
        const handleMotionChange = (e)=>{
            setReducedMotion(e.matches);
        };
        motionQuery.addEventListener('change', handleMotionChange);
        // Détecter le contraste élevé
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        setHighContrast(contrastQuery.matches);
        const handleContrastChange = (e)=>{
            setHighContrast(e.matches);
        };
        contrastQuery.addEventListener('change', handleContrastChange);
        // Détecter l'utilisation du clavier pour la navigation
        const handleKeyDown = (e)=>{
            if (e.key === 'Tab') {
                setFocusRing(true);
            }
        };
        const handleMouseDown = ()=>{
            setFocusRing(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        // Charger les préférences sauvegardées
        const savedPreferences = localStorage.getItem('accessibility-preferences');
        if (savedPreferences) {
            const preferences = JSON.parse(savedPreferences);
            setLargeText(preferences.largeText || false);
            setScreenReaderMode(preferences.screenReaderMode || false);
        }
        return ()=>{
            motionQuery.removeEventListener('change', handleMotionChange);
            contrastQuery.removeEventListener('change', handleContrastChange);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);
    // Sauvegarder les préférences
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const preferences = {
            largeText,
            screenReaderMode
        };
        localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
    }, [
        largeText,
        screenReaderMode
    ]);
    // Appliquer les classes CSS pour les préférences
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const body = document.body;
        body.classList.toggle('reduced-motion', reducedMotion);
        body.classList.toggle('high-contrast', highContrast);
        body.classList.toggle('large-text', largeText);
        body.classList.toggle('screen-reader-mode', screenReaderMode);
        body.classList.toggle('focus-ring', focusRing);
    }, [
        reducedMotion,
        highContrast,
        largeText,
        screenReaderMode,
        focusRing
    ]);
    const toggleReducedMotion = ()=>setReducedMotion(!reducedMotion);
    const toggleHighContrast = ()=>setHighContrast(!highContrast);
    const toggleLargeText = ()=>setLargeText(!largeText);
    const toggleScreenReaderMode = ()=>setScreenReaderMode(!screenReaderMode);
    // Fonction pour annoncer des messages aux lecteurs d'écran
    const announceLiveRegion = (message)=>{
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Effacer après un délai pour permettre de nouvelles annonces
            setTimeout(()=>{
                liveRegion.textContent = '';
            }, 1000);
        }
    };
    const value = {
        reducedMotion,
        highContrast,
        largeText,
        screenReaderMode,
        focusRing,
        toggleReducedMotion,
        toggleHighContrast,
        toggleLargeText,
        toggleScreenReaderMode,
        announceLiveRegion
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AccessibilityContext.Provider, {
        value: value,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "live-region",
                "aria-live": "polite",
                "aria-atomic": "true",
                className: "sr-only"
            }, void 0, false, {
                fileName: "[project]/Science-Made-Simple-Kiro/src/components/AccessibilityProvider.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Science-Made-Simple-Kiro/src/components/AccessibilityProvider.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
function useAccessibility() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
}
function useResponsiveAnimation() {
    const { reducedMotion } = useAccessibility();
    return {
        // Retourne des valeurs de transition adaptées
        transition: reducedMotion ? {
            duration: 0
        } : {
            type: "spring",
            stiffness: 300,
            damping: 30
        },
        // Animations de base respectueuses
        fadeIn: reducedMotion ? {
            opacity: 1
        } : {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0
            }
        },
        slideUp: reducedMotion ? {
            y: 0
        } : {
            initial: {
                y: 20,
                opacity: 0
            },
            animate: {
                y: 0,
                opacity: 1
            },
            exit: {
                y: -20,
                opacity: 0
            }
        },
        scale: reducedMotion ? {
            scale: 1
        } : {
            whileHover: {
                scale: 1.02
            },
            whileTap: {
                scale: 0.98
            }
        }
    };
}
}),
"[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bf59dd4b._.js.map