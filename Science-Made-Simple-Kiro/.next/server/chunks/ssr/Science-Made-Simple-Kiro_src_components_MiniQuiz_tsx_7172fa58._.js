module.exports = [
"[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MiniQuiz",
    ()=>MiniQuiz
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
'use client';
;
;
;
;
function MiniQuiz({ questions, onComplete, onClose, courseTitle }) {
    const [currentQuestion, setCurrentQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedAnswer, setSelectedAnswer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showResult, setShowResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Array(questions.length).fill(null));
    const [isComplete, setIsComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleAnswerSelect = (answerIndex)=>{
        setSelectedAnswer(answerIndex);
        const newAnswers = [
            ...answers
        ];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };
    const handleNext = ()=>{
        if (selectedAnswer !== null) {
            setShowResult(true);
            setTimeout(()=>{
                if (currentQuestion < questions.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                } else {
                    // Quiz terminé
                    setIsComplete(true);
                    const score = answers.reduce((acc, answer, index)=>{
                        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
                    }, 0);
                    onComplete(score, questions.length);
                }
            }, 2000);
        }
    };
    const handlePrevious = ()=>{
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(answers[currentQuestion - 1]);
            setShowResult(false);
        }
    };
    const handleRestart = ()=>{
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setAnswers(new Array(questions.length).fill(null));
        setIsComplete(false);
    };
    const calculateScore = ()=>{
        return answers.reduce((acc, answer, index)=>{
            return acc + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
    };
    const getScoreMessage = (score, total)=>{
        const percentage = score / total * 100;
        const wrongAnswers = total - score;
        if (percentage >= 80) {
            return {
                message: "Excellent niveau ! 🎯",
                color: "text-green-600",
                bg: "bg-green-50",
                diagnosis: "Vous maîtrisez déjà bien les bases. Ce cours vous permettra d'approfondir et de structurer vos connaissances.",
                recommendation: "Idéal pour viser l'excellence"
            };
        }
        if (percentage >= 60) {
            return {
                message: "Bases solides 💪",
                color: "text-blue-600",
                bg: "bg-blue-50",
                diagnosis: `Vous avez de bonnes bases mais ${wrongAnswers} point${wrongAnswers > 1 ? 's' : ''} à consolider. Ce cours comblera parfaitement vos lacunes.`,
                recommendation: "Progression assurée avec ce cours"
            };
        }
        if (percentage >= 40) {
            return {
                message: "Potentiel à développer 🌱",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
                diagnosis: `Quelques notions acquises mais ${wrongAnswers} concepts fondamentaux à maîtriser. Ce cours vous donnera les clés de la réussite.`,
                recommendation: "Ce cours est fait pour vous accompagner"
            };
        }
        return {
            message: "Nouveau départ 🚀",
            color: "text-purple-600",
            bg: "bg-purple-50",
            diagnosis: "Pas d'inquiétude ! Nous partons des fondamentaux. Ce test révèle simplement que ce cours vous sera particulièrement bénéfique.",
            recommendation: "Investissement stratégique pour votre réussite"
        };
    };
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    const score = calculateScore();
    const scoreInfo = getScoreMessage(score, questions.length);
    if (isComplete) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                opacity: 0,
                y: 30
            },
            animate: {
                opacity: 1,
                y: 0
            },
            exit: {
                opacity: 0,
                y: -30
            },
            transition: {
                duration: 0.6,
                ease: [
                    0.25,
                    0.46,
                    0.45,
                    0.94
                ]
            },
            className: "relative max-w-5xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl",
                            animate: {
                                scale: [
                                    1,
                                    1.1,
                                    1
                                ],
                                rotate: [
                                    0,
                                    5,
                                    -5,
                                    0
                                ]
                            },
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "40",
                                height: "40",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                className: "text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].h2, {
                            className: "text-3xl font-bold text-gray-900 mb-3",
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: 0.2
                            },
                            children: "Test Terminé"
                        }, void 0, false, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 161,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                            className: "text-lg text-gray-600 font-medium",
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: 0.3
                            },
                            children: [
                                "Voici votre profil de compétences en ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-gray-800",
                                    children: courseTitle
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 175,
                                    columnNumber: 50
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50",
                            initial: {
                                opacity: 0,
                                x: -30
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: 0.4
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-20 h-20 rounded-full ${scoreInfo.bg} flex items-center justify-center mx-auto mb-4 ring-4 ring-white shadow-lg`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-3xl",
                                            children: "📊"
                                        }, void 0, false, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 190,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-4xl font-bold text-gray-900 mb-1",
                                                children: [
                                                    score,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-2xl text-gray-500",
                                                        children: [
                                                            "/",
                                                            questions.length
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 79
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `text-lg font-semibold ${diagnosticInfo.color}`,
                                                children: diagnosticInfo.message
                                            }, void 0, false, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 194,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 192,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-24 h-24 mx-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-24 h-24 transform -rotate-90",
                                                viewBox: "0 0 100 100",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "50",
                                                        cy: "50",
                                                        r: "40",
                                                        stroke: "currentColor",
                                                        strokeWidth: "8",
                                                        fill: "transparent",
                                                        className: "text-gray-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                        lineNumber: 202,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].circle, {
                                                        cx: "50",
                                                        cy: "50",
                                                        r: "40",
                                                        stroke: "currentColor",
                                                        strokeWidth: "8",
                                                        fill: "transparent",
                                                        strokeLinecap: "round",
                                                        className: "text-indigo-500",
                                                        strokeDasharray: `${2 * Math.PI * 40}`,
                                                        initial: {
                                                            strokeDashoffset: 2 * Math.PI * 40
                                                        },
                                                        animate: {
                                                            strokeDashoffset: 2 * Math.PI * 40 * (1 - score / questions.length)
                                                        },
                                                        transition: {
                                                            duration: 1.5,
                                                            ease: "easeOut"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg font-bold text-gray-900",
                                                    children: [
                                                        Math.round(score / questions.length * 100),
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 228,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 200,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 182,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: "bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100/50",
                            initial: {
                                opacity: 0,
                                x: 30
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: 0.5
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "24",
                                            height: "24",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            className: "text-white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                                                stroke: "currentColor",
                                                strokeWidth: "1.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 247,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 246,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-semibold text-blue-900 mb-3 text-lg",
                                                children: "Analyse Personnalisée"
                                            }, void 0, false, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 251,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-blue-800 text-sm mb-4 leading-relaxed",
                                                children: diagnosticInfo.diagnosis
                                            }, void 0, false, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 252,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-blue-700 text-sm font-medium",
                                                    children: [
                                                        "✨ ",
                                                        diagnosticInfo.recommendation
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 253,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 244,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-blue-600 text-lg",
                                    children: "💡"
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 265,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 264,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold text-blue-900 mb-2",
                                        children: "Votre diagnostic personnalisé"
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 268,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-blue-800 text-sm mb-3",
                                        children: diagnosticInfo.diagnosis
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-blue-100 rounded-lg p-3",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-blue-700 text-sm font-medium",
                                            children: [
                                                "✨ ",
                                                diagnosticInfo.recommendation
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 271,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 270,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 267,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 263,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                    lineNumber: 262,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 rounded-xl p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-green-600",
                                    children: score
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 279,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-600",
                                    children: "Concepts maîtrisés"
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 280,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 278,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-50 rounded-xl p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xl font-bold text-red-500",
                                    children: questions.length - score
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 283,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-gray-600",
                                    children: "Points à renforcer"
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 282,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                    lineNumber: 277,
                    columnNumber: 11
                }, this),
                questions.length - score > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6 text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "font-semibold text-orange-900 mb-3 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-orange-600",
                                    children: "⚠️"
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 292,
                                    columnNumber: 17
                                }, this),
                                "Concepts à renforcer"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 291,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: answers.map((answer, index)=>answer !== questions[index].correctAnswer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-3 p-3 bg-orange-100 rounded-lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 text-sm font-bold flex-shrink-0",
                                            children: index + 1
                                        }, void 0, false, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 299,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-orange-800 text-sm font-medium mb-1",
                                                    children: questions[index].question
                                                }, void 0, false, {
                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-orange-700 text-xs",
                                                    children: [
                                                        "💡 ",
                                                        questions[index].explanation
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 302,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 298,
                                    columnNumber: 21
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 295,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-3 bg-orange-100 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-orange-700 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Bonne nouvelle :"
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 316,
                                        columnNumber: 19
                                    }, this),
                                    " Ce cours couvre exactement ces points ! Vous saurez où concentrer vos efforts pour une progression optimale."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 315,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 314,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                    lineNumber: 290,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "flex flex-col sm:flex-row gap-4",
                    initial: {
                        opacity: 0,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        delay: 0.8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                            onClick: handleRestart,
                            whileHover: {
                                scale: 1.02
                            },
                            whileTap: {
                                scale: 0.98
                            },
                            className: "flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white border border-gray-200 transition-all duration-200 shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "18",
                                    height: "18",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M1 4v6h6M23 20v-6h-6",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 337,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 338,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 336,
                                    columnNumber: 13
                                }, this),
                                "Refaire l'évaluation"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 330,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                            onClick: onClose,
                            whileHover: {
                                scale: 1.02
                            },
                            whileTap: {
                                scale: 0.98
                            },
                            className: "flex-1 flex items-center justify-center gap-3 py-4 px-8 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-indigo-200/50 font-semibold",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "18",
                                    height: "18",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round"
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 350,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 349,
                                    columnNumber: 13
                                }, this),
                                "Accéder au cours complet"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 343,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "16",
                                            height: "16",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            className: "text-white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round"
                                            }, void 0, false, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 367,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 366,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 365,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-900",
                                                children: [
                                                    "Question ",
                                                    currentQuestion + 1,
                                                    " sur ",
                                                    questions.length
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 371,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: "Progression de votre évaluation"
                                            }, void 0, false, {
                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                lineNumber: 372,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 370,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-gray-900",
                                        children: [
                                            Math.round((currentQuestion + 1) / questions.length * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 376,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500",
                                        children: "Complété"
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 377,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 375,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 363,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative h-2 bg-gray-100 rounded-full overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-full",
                                initial: {
                                    width: 0
                                },
                                animate: {
                                    width: `${(currentQuestion + 1) / questions.length * 100}%`
                                },
                                transition: {
                                    duration: 0.8,
                                    ease: [
                                        0.25,
                                        0.46,
                                        0.45,
                                        0.94
                                    ]
                                }
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 383,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-between px-1",
                                children: Array.from({
                                    length: questions.length
                                }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-1.5 h-1.5 rounded-full transition-all duration-300 ${i <= currentQuestion ? 'bg-white shadow-sm' : 'bg-gray-300'}`
                                    }, i, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 392,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 382,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                lineNumber: 362,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50 ring-1 ring-black/5",
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    duration: 0.5
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "20",
                                        height: "20",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        className: "text-gray-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 417,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 416,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 415,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-600",
                                            children: "Question d'évaluation"
                                        }, void 0, false, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 421,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-2 h-2 rounded-full ${currentQ.difficulty === 'easy' ? 'bg-emerald-400' : currentQ.difficulty === 'medium' ? 'bg-blue-400' : 'bg-purple-400'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-medium text-gray-500",
                                                    children: currentQ.difficulty === 'easy' ? 'Niveau accessible' : currentQ.difficulty === 'medium' ? 'Niveau intermédiaire' : 'Niveau avancé'
                                                }, void 0, false, {
                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                    lineNumber: 428,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 422,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 420,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                            lineNumber: 414,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 413,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-2xl font-semibold text-gray-900 leading-relaxed mb-6",
                                children: currentQ.question
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 439,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: currentQ.options.map((option, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                                        onClick: ()=>!showResult && handleAnswerSelect(index),
                                        disabled: showResult,
                                        whileHover: !showResult ? {
                                            scale: 1.005,
                                            y: -1
                                        } : {},
                                        whileTap: !showResult ? {
                                            scale: 0.995
                                        } : {},
                                        transition: {
                                            duration: 0.2
                                        },
                                        className: `group relative w-full p-5 text-left rounded-xl transition-all duration-300 ${showResult ? index === currentQ.correctAnswer ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-sm' : selectedAnswer === index ? 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 shadow-sm' : 'bg-gray-50/50 border-2 border-gray-100 text-gray-400' : selectedAnswer === index ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md' : 'bg-white/80 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-white'}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${showResult ? index === currentQ.correctAnswer ? 'border-emerald-500 bg-emerald-500' : selectedAnswer === index ? 'border-red-500 bg-red-500' : 'border-gray-300' : selectedAnswer === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-gray-400'}`,
                                                            children: showResult && index === currentQ.correctAnswer || !showResult && selectedAnswer === index ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                width: "12",
                                                                height: "12",
                                                                viewBox: "0 0 24 24",
                                                                fill: "none",
                                                                className: "text-white",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M20 6L9 17l-5-5",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "3",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                                    lineNumber: 480,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                                lineNumber: 479,
                                                                columnNumber: 25
                                                            }, this) : null
                                                        }, void 0, false, {
                                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                            lineNumber: 467,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `font-medium ${showResult && selectedAnswer === index && index !== currentQ.correctAnswer ? 'text-red-700' : showResult && index === currentQ.correctAnswer ? 'text-emerald-700' : selectedAnswer === index ? 'text-blue-700' : 'text-gray-700'}`,
                                                            children: option
                                                        }, void 0, false, {
                                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                            lineNumber: 484,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                    lineNumber: 466,
                                                    columnNumber: 19
                                                }, this),
                                                showResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-shrink-0",
                                                    children: index === currentQ.correctAnswer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            className: "text-emerald-600",
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                        lineNumber: 501,
                                                        columnNumber: 25
                                                    }, this) : selectedAnswer === index ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 bg-red-100 rounded-full flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                            className: "text-red-600",
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                            lineNumber: 506,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 25
                                                    }, this) : null
                                                }, void 0, false, {
                                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                                    lineNumber: 499,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                            lineNumber: 465,
                                            columnNumber: 17
                                        }, this)
                                    }, index, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 446,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 444,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 438,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                lineNumber: 406,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        height: 0
                    },
                    animate: {
                        opacity: 1,
                        height: 'auto'
                    },
                    exit: {
                        opacity: 0,
                        height: 0
                    },
                    className: `p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3",
                        children: [
                            isCorrect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                className: "text-green-600 mt-0.5",
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 531,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                className: "text-red-600 mt-0.5",
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 532,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `font-medium mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`,
                                        children: isCorrect ? 'Correct ! 🎉' : 'Incorrect 😔'
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 535,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`,
                                        children: currentQ.explanation
                                    }, void 0, false, {
                                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                        lineNumber: 538,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 534,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 529,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                    lineNumber: 521,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                lineNumber: 519,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                        onClick: handlePrevious,
                        disabled: currentQuestion === 0,
                        whileHover: currentQuestion === 0 ? {} : {
                            scale: 1.05
                        },
                        whileTap: currentQuestion === 0 ? {} : {
                            scale: 0.95
                        },
                        className: `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${currentQuestion === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M19 12H5M12 19l-7-7 7-7",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 561,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 560,
                                columnNumber: 11
                            }, this),
                            "Précédent"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 549,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: questions.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: `w-3 h-3 rounded-full transition-all duration-300 ${index < currentQuestion ? 'bg-emerald-500 shadow-sm' : index === currentQuestion ? 'bg-indigo-500 shadow-sm ring-2 ring-indigo-200' : 'bg-gray-200'}`,
                                whileHover: {
                                    scale: 1.2
                                }
                            }, index, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 569,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 567,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                        onClick: handleNext,
                        disabled: selectedAnswer === null,
                        whileHover: selectedAnswer === null ? {} : {
                            scale: 1.05
                        },
                        whileTap: selectedAnswer === null ? {} : {
                            scale: 0.95
                        },
                        className: `flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${selectedAnswer === null ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700 shadow-indigo-200/50'}`,
                        children: [
                            currentQuestion === questions.length - 1 ? 'Terminer l\'évaluation' : 'Question suivante',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M5 12h14M12 5l7 7-7 7",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                    lineNumber: 596,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                                lineNumber: 595,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                        lineNumber: 583,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
                lineNumber: 548,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Science-Made-Simple-Kiro/src/components/MiniQuiz.tsx",
        lineNumber: 360,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Science-Made-Simple-Kiro_src_components_MiniQuiz_tsx_7172fa58._.js.map