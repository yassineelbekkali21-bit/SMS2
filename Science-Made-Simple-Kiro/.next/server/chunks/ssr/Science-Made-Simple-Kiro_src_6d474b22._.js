module.exports = [
"[project]/Science-Made-Simple-Kiro/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateProgress",
    ()=>calculateProgress,
    "cn",
    ()=>cn,
    "estimateCompletionTime",
    ()=>estimateCompletionTime,
    "formatDuration",
    ()=>formatDuration,
    "formatRank",
    ()=>formatRank,
    "formatRelativeTime",
    ()=>formatRelativeTime,
    "generateSlug",
    ()=>generateSlug,
    "getDifficultyLabel",
    ()=>getDifficultyLabel,
    "getMotivationMessage",
    ()=>getMotivationMessage,
    "getProgressColor",
    ()=>getProgressColor,
    "getTagColor",
    ()=>getTagColor,
    "isPopularCourse",
    ()=>isPopularCourse,
    "isValidEmail",
    ()=>isValidEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
        return `${mins}m`;
    }
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}
function calculateProgress(completed, total) {
    if (total === 0) return 0;
    return Math.round(completed / total * 100);
}
function getProgressColor(progress) {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-orange-500";
    if (progress < 75) return "bg-yellow-500";
    return "bg-green-500";
}
function formatRank(rank, total) {
    return `#${rank}/${total}`;
}
function isPopularCourse(enrolledStudents, averageProgress) {
    return enrolledStudents > 50 && averageProgress > 60;
}
function getMotivationMessage(progress, facultyAverage) {
    if (progress > facultyAverage + 10) {
        return "Excellent ! Vous êtes au-dessus de la moyenne ! 🚀";
    }
    if (progress > facultyAverage) {
        return "Bon travail ! Continuez sur cette lancée ! 💪";
    }
    if (progress < facultyAverage - 20) {
        return "Il est temps de rattraper ! Vous pouvez le faire ! 🔥";
    }
    return "Vous progressez bien ! Gardez le rythme ! ⭐";
}
function estimateCompletionTime(totalLessons, completedLessons, averageLessonDuration) {
    const remainingLessons = totalLessons - completedLessons;
    const totalMinutes = remainingLessons * averageLessonDuration;
    return formatDuration(totalMinutes);
}
function formatRelativeTime(date) {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR');
}
function getTagColor(tag) {
    const colors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-purple-100 text-purple-800",
        "bg-orange-100 text-orange-800",
        "bg-pink-100 text-pink-800",
        "bg-indigo-100 text-indigo-800"
    ];
    const hash = tag.split('').reduce((acc, char)=>acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}
function getDifficultyLabel(difficulty) {
    switch(difficulty){
        case 'easy':
            return {
                label: 'Facile',
                color: 'text-green-600',
                icon: '🟢'
            };
        case 'medium':
            return {
                label: 'Moyen',
                color: 'text-orange-600',
                icon: '🟡'
            };
        case 'hard':
            return {
                label: 'Difficile',
                color: 'text-red-600',
                icon: '🔴'
            };
    }
}
}),
"[project]/Science-Made-Simple-Kiro/src/lib/mock-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enrollInCourse",
    ()=>enrollInCourse,
    "generateMockLessons",
    ()=>generateMockLessons,
    "getCourseLessons",
    ()=>getCourseLessons,
    "getCoursePacks",
    ()=>getCoursePacks,
    "getCurrentUserProfile",
    ()=>getCurrentUserProfile,
    "getEnhancedDashboardData",
    ()=>getEnhancedDashboardData,
    "getIndividualLessons",
    ()=>getIndividualLessons,
    "getLessonsForCourse",
    ()=>getLessonsForCourse,
    "getMiniQuizForCourse",
    ()=>getMiniQuizForCourse,
    "getMockAlumniProfiles",
    ()=>getMockAlumniProfiles,
    "getMockCircles",
    ()=>getMockCircles,
    "getMockCommunityActivities",
    ()=>getMockCommunityActivities,
    "getMockCommunityChallenge",
    ()=>getMockCommunityChallenge,
    "getMockCommunityQuestions",
    ()=>getMockCommunityQuestions,
    "getMockSocialBadges",
    ()=>getMockSocialBadges,
    "getMockStudyRooms",
    ()=>getMockStudyRooms,
    "getMockVideoQuizzes",
    ()=>getMockVideoQuizzes,
    "getPersonalProfile",
    ()=>getPersonalProfile,
    "getPersonalProfileComplet",
    ()=>getPersonalProfileComplet,
    "getStudentProfile",
    ()=>getStudentProfile,
    "mockAlumniProfiles",
    ()=>mockAlumniProfiles,
    "mockAmbitionsDetaillees",
    ()=>mockAmbitionsDetaillees,
    "mockBlocagesDetailles",
    ()=>mockBlocagesDetailles,
    "mockCheminRecommande",
    ()=>mockCheminRecommande,
    "mockCircles",
    ()=>mockCircles,
    "mockCommunityActivities",
    ()=>mockCommunityActivities,
    "mockCommunityChallenge",
    ()=>mockCommunityChallenge,
    "mockCommunityQuestions",
    ()=>mockCommunityQuestions,
    "mockCourseLessons",
    ()=>mockCourseLessons,
    "mockCoursePacks",
    ()=>mockCoursePacks,
    "mockCourses",
    ()=>mockCourses,
    "mockDashboardData",
    ()=>mockDashboardData,
    "mockEnhancedDashboardData",
    ()=>mockEnhancedDashboardData,
    "mockFacultyStats",
    ()=>mockFacultyStats,
    "mockIndividualLessons",
    ()=>mockIndividualLessons,
    "mockMiniQuizzes",
    ()=>mockMiniQuizzes,
    "mockPersonalProfile",
    ()=>mockPersonalProfile,
    "mockPersonalProfileComplet",
    ()=>mockPersonalProfileComplet,
    "mockProgress",
    ()=>mockProgress,
    "mockSocialBadges",
    ()=>mockSocialBadges,
    "mockStudentInfo",
    ()=>mockStudentInfo,
    "mockStudentProfiles",
    ()=>mockStudentProfiles,
    "mockStudyRooms",
    ()=>mockStudyRooms,
    "mockSuggestions",
    ()=>mockSuggestions,
    "mockUser",
    ()=>mockUser,
    "mockVideoQuizzes",
    ()=>mockVideoQuizzes,
    "reorderPrimaryCourses",
    ()=>reorderPrimaryCourses,
    "toggleCourseFavorite",
    ()=>toggleCourseFavorite
]);
const mockUser = {
    id: '1',
    name: 'Yacine Elbekali',
    email: 'yacine@student.solvay.be',
    faculty: 'Solvay Brussels School',
    year: 'Première année Ingénieur de gestion',
    avatar: undefined,
    isKYCCompleted: true,
    preferences: {
        notifications: true,
        studyReminders: true,
        theme: 'light',
        language: 'fr'
    }
};
const mockCourses = [
    // ========================================================================
    // COURS FAVORIS (PRIMAIRES) - Ceux que l'étudiant a sélectionnés
    // ========================================================================
    {
        id: '1',
        title: 'Mathématiques : Analyse I Q1',
        description: 'Cours complet d\'analyse mathématique pour ingénieurs de gestion. Méthode SMS : manuscrite, 90% pratique, 10% théorie.',
        faculty: 'Solvay Brussels School',
        year: 'Première année',
        instructor: 'Zakaria SMS',
        totalLessons: 7,
        completedLessons: 2,
        duration: '4h 15m',
        isOwned: true,
        isPrimary: true,
        progress: 29,
        thumbnail: undefined,
        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        previewAvailable: false,
        tags: [
            'mathématiques',
            'analyse',
            'Q1'
        ],
        difficulty: 'intermediate',
        get lessons () {
            return generateMockLessons(this.id, this.title);
        }
    },
    {
        id: '2',
        title: 'Physique pour Ingénieurs',
        description: 'Physique appliquée aux sciences de l\'ingénieur. Électrostatique, mécanique, thermodynamique.',
        faculty: 'Solvay Brussels School',
        year: 'Première année',
        instructor: 'Zakaria SMS',
        totalLessons: 14,
        completedLessons: 1,
        duration: '6h 45m',
        isOwned: true,
        isPrimary: true,
        progress: 7,
        lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        previewAvailable: false,
        tags: [
            'physique',
            'ingénieur',
            'électrostatique'
        ],
        difficulty: 'intermediate'
    },
    // ========================================================================
    // COURS SUGGÉRÉS - Populaires dans la faculté
    // ========================================================================
    {
        id: '3',
        title: 'Chimie Générale I Q2',
        description: 'Fondements de la chimie générale. Diagrammes de lignes, équilibres, thermodynamique chimique.',
        faculty: 'Solvay Brussels School',
        year: 'Première année',
        instructor: 'Zakaria SMS',
        totalLessons: 12,
        completedLessons: 0,
        duration: '5h 20m',
        isOwned: false,
        isPrimary: false,
        progress: 0,
        price: 299,
        creditCost: 20,
        previewAvailable: true,
        previewDuration: '5-10 min',
        tags: [
            'chimie',
            'Q2',
            'diagrammes'
        ],
        difficulty: 'intermediate'
    },
    {
        id: '4',
        title: 'Statistique descriptive et éléments de probabilités',
        description: 'Statistiques pour la gestion. Probabilités, distributions, tests d\'hypothèses.',
        faculty: 'Solvay Brussels School',
        year: 'Première année',
        instructor: 'Zakaria SMS',
        totalLessons: 9,
        completedLessons: 0,
        duration: '4h 15m',
        isOwned: false,
        isPrimary: false,
        progress: 0,
        price: 249,
        creditCost: 15,
        previewAvailable: true,
        previewDuration: '7 min',
        tags: [
            'statistiques',
            'probabilités',
            'gestion'
        ],
        difficulty: 'beginner'
    },
    {
        id: '5',
        title: 'Microéconomie',
        description: 'Principes fondamentaux de microéconomie pour ingénieurs de gestion.',
        faculty: 'Solvay Brussels School',
        year: 'Première année',
        instructor: 'Zakaria SMS',
        totalLessons: 8,
        completedLessons: 0,
        duration: '3h 45m',
        isOwned: false,
        isPrimary: false,
        progress: 0,
        price: 199,
        creditCost: 12,
        previewAvailable: true,
        previewDuration: '6 min',
        tags: [
            'économie',
            'micro',
            'gestion'
        ],
        difficulty: 'intermediate'
    },
    {
        id: '6',
        title: 'MATH F115 | Compléments d\'analyse et algèbre linéaire',
        description: 'Mathématiques avancées : algèbre linéaire, espaces vectoriels, applications linéaires.',
        faculty: 'Solvay Brussels School',
        year: 'Première année',
        instructor: 'Zakaria SMS',
        totalLessons: 13,
        completedLessons: 0,
        duration: '7h 10m',
        isOwned: false,
        isPrimary: false,
        progress: 0,
        price: 349,
        creditCost: 25,
        previewAvailable: true,
        previewDuration: '8-12 min',
        tags: [
            'mathématiques',
            'algèbre',
            'linéaire'
        ],
        difficulty: 'advanced'
    },
    {
        id: '7',
        title: 'Physique des technologies de l\'information',
        description: 'Physique appliquée aux technologies modernes. Diodes, transistors, circuits.',
        faculty: 'Solvay Brussels School',
        year: 'Première année',
        instructor: 'Zakaria SMS',
        totalLessons: 19,
        completedLessons: 0,
        duration: '9h 25m',
        isOwned: false,
        isPrimary: false,
        progress: 0,
        price: 399,
        previewAvailable: true,
        previewDuration: '10 min',
        tags: [
            'physique',
            'technologies',
            'information'
        ],
        difficulty: 'advanced'
    }
];
const mockProgress = [
    {
        userId: '1',
        courseId: '1',
        currentLesson: 3,
        totalLessons: 17,
        percentComplete: 18,
        facultyAverage: 32,
        facultyRanking: 15,
        totalStudents: 124,
        timeSpent: 145,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        streakDays: 3,
        totalPoints: 285
    },
    {
        userId: '1',
        courseId: '2',
        currentLesson: 1,
        totalLessons: 14,
        percentComplete: 7,
        facultyAverage: 28,
        facultyRanking: 45,
        totalStudents: 124,
        timeSpent: 67,
        lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        streakDays: 0,
        totalPoints: 85
    }
];
const mockSuggestions = [
    {
        course: mockCourses[2],
        reason: 'faculty_popular',
        enrolledStudents: 87,
        averageProgress: 45,
        isPopular: true,
        hasFreeTrial: true,
        priority: 1
    },
    {
        course: mockCourses[3],
        reason: 'similar_students',
        enrolledStudents: 72,
        averageProgress: 62,
        isPopular: true,
        hasFreeTrial: true,
        priority: 2
    },
    {
        course: mockCourses[4],
        reason: 'faculty_popular',
        enrolledStudents: 56,
        averageProgress: 38,
        isPopular: false,
        hasFreeTrial: true,
        priority: 3
    },
    {
        course: mockCourses[5],
        reason: 'prerequisite',
        enrolledStudents: 34,
        averageProgress: 29,
        isPopular: false,
        hasFreeTrial: true,
        priority: 4
    },
    {
        course: mockCourses[6],
        reason: 'continuation',
        enrolledStudents: 28,
        averageProgress: 24,
        isPopular: false,
        hasFreeTrial: true,
        priority: 5
    }
];
const mockFacultyStats = {
    faculty: 'Solvay Brussels School',
    year: 'Première année Ingénieur de gestion',
    totalStudents: 124,
    averageProgress: 35,
    topPerformers: [
        'user_123',
        'user_456',
        'user_789'
    ]
};
const mockDashboardData = {
    user: mockUser,
    primaryCourses: mockCourses.filter((course)=>course.isPrimary),
    suggestedCourses: mockSuggestions,
    progress: mockProgress,
    facultyStats: mockFacultyStats,
    recentActivity: [
        {
            id: '1',
            type: 'lesson_completed',
            title: 'Leçon 3 terminée',
            description: 'Les Suites: Concepts et Examens (Questions Ouvertes)',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            courseId: '1',
            lessonId: 'lesson_3'
        },
        {
            id: '2',
            type: 'course_started',
            title: 'Cours démarré',
            description: 'Physique pour Ingénieurs',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            courseId: '2'
        }
    ],
    achievements: [
        {
            id: '1',
            title: 'Premier cours',
            description: 'Vous avez démarré votre premier cours !',
            icon: '🎯',
            unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            progress: 100,
            target: 1
        },
        {
            id: '2',
            title: 'Étudiant assidu',
            description: 'Étudiez 3 jours consécutifs',
            icon: '🔥',
            progress: 75,
            target: 3
        }
    ],
    upcomingEvents: [
        {
            id: '1',
            title: 'Session de rattrapage Mathématiques',
            start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
            type: 'study_session',
            courseId: '1',
            priority: 'high'
        }
    ]
};
function toggleCourseFavorite(courseId) {
    return mockCourses.map((course)=>{
        if (course.id === courseId) {
            return {
                ...course,
                isPrimary: !course.isPrimary
            };
        }
        return course;
    });
}
function reorderPrimaryCourses(courseId, newIndex) {
    const primaryCourses = mockCourses.filter((course)=>course.isPrimary);
    const courseToMove = primaryCourses.find((course)=>course.id === courseId);
    if (!courseToMove) return primaryCourses;
    const filteredCourses = primaryCourses.filter((course)=>course.id !== courseId);
    filteredCourses.splice(newIndex, 0, courseToMove);
    return filteredCourses;
}
function enrollInCourse(courseId) {
    const course = mockCourses.find((c)=>c.id === courseId);
    if (!course) return null;
    return {
        ...course,
        isOwned: true,
        isPrimary: true,
        previewAvailable: false
    };
}
const mockVideoQuizzes = [
    {
        id: 'vq1',
        timestamp: 120,
        question: 'Que représente graphiquement la limite d\'une fonction en un point ?',
        type: 'multiple-choice',
        options: [
            'La valeur de la fonction en ce point',
            'La valeur vers laquelle tend la fonction quand x se rapproche du point',
            'La dérivée de la fonction en ce point',
            'L\'aire sous la courbe jusqu\'à ce point'
        ],
        correctAnswer: 1,
        explanation: 'La limite représente la valeur vers laquelle tend la fonction quand x se rapproche du point, même si la fonction n\'est pas définie en ce point.',
        points: 10
    },
    {
        id: 'vq2',
        timestamp: 300,
        question: 'La règle de L\'Hôpital s\'applique-t-elle à toutes les limites ?',
        type: 'true-false',
        options: [
            'Vrai',
            'Faux'
        ],
        correctAnswer: 1,
        explanation: 'Faux ! La règle de L\'Hôpital ne s\'applique qu\'aux formes indéterminées comme 0/0 ou ∞/∞.',
        points: 15
    },
    {
        id: 'vq3',
        timestamp: 480,
        question: 'Quelle est la première étape pour calculer une limite qui donne 0/0 ?',
        type: 'multiple-choice',
        options: [
            'Appliquer directement la règle de L\'Hôpital',
            'Essayer de factoriser et simplifier',
            'Conclure que la limite n\'existe pas',
            'Utiliser un développement limité'
        ],
        correctAnswer: 1,
        explanation: 'Il faut d\'abord essayer de factoriser et simplifier l\'expression avant d\'appliquer des méthodes plus avancées comme la règle de L\'Hôpital.',
        points: 20
    }
];
const getMockVideoQuizzes = (lessonId)=>{
    // En réalité, cela viendrait d'une base de données
    if (lessonId === '1' || lessonId === '2') {
        return mockVideoQuizzes;
    }
    return [];
};
const mockCoursePacks = [
    {
        id: 'pack-chimie',
        title: 'Pack Chimie Complète',
        description: 'Maîtrisez tous les aspects de la chimie générale avec ce pack complet',
        courses: [
            '3'
        ],
        creditCost: 18,
        originalCreditCost: 20,
        savings: 2,
        badge: 'Populaire',
        icon: '⚗️',
        color: 'from-green-400 to-emerald-500',
        features: [
            'Chimie Générale I Q2',
            'Exercices pratiques inclus',
            'Support WhatsApp prioritaire'
        ]
    },
    {
        id: 'pack-maths',
        title: 'Pack Mathématiques Avancées',
        description: 'Perfectionnez vos compétences mathématiques avec nos cours d\'élite',
        courses: [
            '4',
            '6'
        ],
        creditCost: 35,
        originalCreditCost: 40,
        savings: 5,
        badge: 'Recommandé',
        icon: '📐',
        color: 'from-blue-400 to-indigo-500',
        features: [
            'Statistiques descriptives',
            'Algèbre linéaire avancée',
            'Méthodes de résolution optimisées',
            'Coaching personnalisé inclus'
        ]
    },
    {
        id: 'pack-rentree',
        title: 'Pack Rentrée Scolaire',
        description: 'Démarrez l\'année en force avec l\'essentiel pour réussir',
        courses: [
            '3',
            '4',
            '5'
        ],
        creditCost: 45,
        originalCreditCost: 52,
        savings: 7,
        badge: 'Nouveau',
        icon: '🎒',
        color: 'from-purple-400 to-pink-500',
        features: [
            'Chimie Générale I Q2',
            'Statistiques descriptives',
            'Microéconomie',
            'Planning personnalisé',
            'Garantie de réussite'
        ]
    },
    {
        id: 'pack-excellence',
        title: 'Pack Excellence Ingénieur',
        description: 'Le pack ultime pour les futurs ingénieurs de gestion',
        courses: [
            '3',
            '4',
            '5',
            '6'
        ],
        creditCost: 65,
        originalCreditCost: 77,
        savings: 12,
        badge: 'Premium',
        icon: '🏆',
        color: 'from-yellow-400 to-orange-500',
        features: [
            'Tous les cours fondamentaux',
            'Coaching 1-on-1 mensuel',
            'Accès prioritaire aux nouveautés',
            'Certificat de réussite NFT',
            'Garantie satisfaction 100%'
        ]
    }
];
const getCoursePacks = ()=>{
    return mockCoursePacks;
};
const mockIndividualLessons = [
    // Mathématiques
    {
        id: 'lesson-math-1',
        courseId: '1',
        title: 'Introduction aux Limites',
        description: 'Comprendre le concept fondamental de limite en analyse mathématique',
        duration: '45 min',
        order: 1,
        isCompleted: false,
        isAccessible: true,
        hasPreview: true,
        documents: [],
        type: 'video',
        xpReward: 15,
        difficulty: 'easy',
        objectives: [
            'Définir une limite mathématique',
            'Calculer des limites simples',
            'Appliquer les théorèmes fondamentaux'
        ]
    },
    {
        id: 'lesson-math-2',
        courseId: '1',
        title: 'Dérivées : Définition et Calculs',
        description: 'Maîtriser la dérivation et ses applications pratiques',
        duration: '60 min',
        order: 2,
        isCompleted: false,
        isAccessible: true,
        hasPreview: true,
        documents: [],
        type: 'video',
        xpReward: 20,
        difficulty: 'medium',
        objectives: [
            'Comprendre la définition de la dérivée',
            'Utiliser les règles de dérivation',
            'Résoudre des problèmes d\'optimisation'
        ]
    },
    // Physique
    {
        id: 'lesson-physics-1',
        courseId: '2',
        title: 'Forces et Mouvement',
        description: 'Les lois de Newton et leurs applications en mécanique',
        duration: '50 min',
        order: 1,
        isCompleted: false,
        isAccessible: true,
        hasPreview: true,
        documents: [],
        type: 'video',
        xpReward: 18,
        difficulty: 'medium',
        objectives: [
            'Comprendre les trois lois de Newton',
            'Analyser des systèmes de forces',
            'Résoudre des problèmes de dynamique'
        ]
    },
    {
        id: 'lesson-physics-2',
        courseId: '2',
        title: 'Énergie et Travail',
        description: 'Conservation de l\'énergie et applications pratiques',
        duration: '55 min',
        order: 2,
        isCompleted: false,
        isAccessible: true,
        hasPreview: true,
        documents: [],
        type: 'video',
        xpReward: 22,
        difficulty: 'hard',
        objectives: [
            'Définir travail et énergie',
            'Appliquer le principe de conservation',
            'Résoudre des problèmes complexes'
        ]
    },
    // Chimie
    {
        id: 'lesson-chemistry-1',
        courseId: '3',
        title: 'Structure Atomique',
        description: 'Comprendre la structure de l\'atome et ses propriétés',
        duration: '40 min',
        order: 1,
        isCompleted: false,
        isAccessible: true,
        hasPreview: true,
        documents: [],
        type: 'video',
        xpReward: 12,
        difficulty: 'easy',
        objectives: [
            'Décrire la structure de l\'atome',
            'Comprendre les orbitales',
            'Prédire les propriétés des éléments'
        ]
    },
    {
        id: 'lesson-chemistry-2',
        courseId: '3',
        title: 'Liaisons Chimiques',
        description: 'Types de liaisons et propriétés des molécules',
        duration: '65 min',
        order: 2,
        isCompleted: false,
        isAccessible: true,
        hasPreview: true,
        documents: [],
        type: 'video',
        xpReward: 25,
        difficulty: 'hard',
        objectives: [
            'Identifier les types de liaisons',
            'Prédire la géométrie moléculaire',
            'Comprendre les propriétés des composés'
        ]
    },
    // Statistiques
    {
        id: 'lesson-stats-1',
        courseId: '4',
        title: 'Mesures de Tendance Centrale',
        description: 'Moyenne, médiane, mode : calculer et interpréter',
        duration: '35 min',
        order: 1,
        isCompleted: false,
        isAccessible: true,
        hasPreview: true,
        documents: [],
        type: 'video',
        xpReward: 10,
        difficulty: 'easy',
        objectives: [
            'Calculer moyenne, médiane, mode',
            'Choisir la mesure appropriée',
            'Interpréter les résultats'
        ]
    },
    // Microéconomie
    {
        id: 'lesson-micro-1',
        courseId: '5',
        title: 'Offre et Demande',
        description: 'Les mécanismes fondamentaux du marché',
        duration: '45 min',
        order: 1,
        isCompleted: false,
        isAccessible: true,
        hasPreview: true,
        documents: [],
        type: 'video',
        xpReward: 16,
        difficulty: 'medium',
        objectives: [
            'Comprendre l\'offre et la demande',
            'Analyser l\'équilibre du marché',
            'Prédire les effets des variations'
        ]
    }
];
const getIndividualLessons = ()=>{
    return mockIndividualLessons;
};
const mockStudentProfiles = [
    {
        id: 'current-user',
        firstName: 'Yassine',
        faculty: 'Solvay Brussels School',
        avatar: '👨‍🎓',
        totalXP: 1250,
        level: 8,
        coursesCompleted: 3,
        socialBadges: [],
        joinDate: new Date('2024-09-01'),
        lastActive: new Date(),
        bio: 'Étudiant en économie passionné par les mathématiques appliquées',
        motto: 'Viser 16, pas la moyenne !',
        isOnline: true,
        studyStreak: 12
    },
    {
        id: 'marie-l',
        firstName: 'Marie',
        faculty: 'Solvay Brussels School',
        avatar: '👩‍🎓',
        totalXP: 2100,
        level: 12,
        coursesCompleted: 5,
        socialBadges: [],
        joinDate: new Date('2024-08-15'),
        lastActive: new Date(Date.now() - 300000),
        bio: 'Future consultante, mentor en mathématiques',
        motto: 'Ensemble, on va plus loin',
        isOnline: true,
        studyStreak: 25
    },
    {
        id: 'lucas-m',
        firstName: 'Lucas',
        faculty: 'UCLouvain',
        avatar: '👨‍💻',
        totalXP: 1800,
        level: 10,
        coursesCompleted: 4,
        socialBadges: [],
        joinDate: new Date('2024-08-20'),
        lastActive: new Date(Date.now() - 1800000),
        bio: 'Ingénieur en devenir, expert en physique',
        isOnline: false,
        studyStreak: 8
    },
    {
        id: 'sara-k',
        firstName: 'Sara',
        faculty: 'Solvay Brussels School',
        avatar: '👩‍🔬',
        totalXP: 1950,
        level: 11,
        coursesCompleted: 6,
        socialBadges: [],
        joinDate: new Date('2024-07-10'),
        lastActive: new Date(Date.now() - 3600000),
        bio: 'Passionnée de chimie et sciences',
        motto: 'La science, c\'est magique ✨',
        isOnline: false,
        studyStreak: 15
    }
];
const mockSocialBadges = [
    {
        id: 'helper',
        name: 'Helper',
        description: 'A aidé 5 autres étudiants',
        icon: '🤝',
        color: 'blue',
        rarity: 'common',
        criteria: {
            type: 'questions_answered',
            target: 5,
            current: 3
        }
    },
    {
        id: 'study-captain',
        name: 'Capitaine de révision',
        description: 'A créé 3 Study Rooms',
        icon: '⚓',
        color: 'purple',
        rarity: 'rare',
        criteria: {
            type: 'rooms_created',
            target: 3,
            current: 1
        }
    },
    {
        id: 'streak-master',
        name: 'Toujours là',
        description: 'Connecté 7 jours d\'affilée',
        icon: '🔥',
        color: 'orange',
        rarity: 'epic',
        criteria: {
            type: 'study_streak',
            target: 7,
            current: 12
        },
        unlockedAt: new Date('2024-12-10')
    },
    {
        id: 'community-legend',
        name: 'Légende communautaire',
        description: 'Membre exemplaire de la communauté',
        icon: '👑',
        color: 'gold',
        rarity: 'legendary',
        criteria: {
            type: 'community_helper',
            target: 50,
            current: 28
        }
    }
];
const mockAlumniProfiles = [
    {
        id: 'thomas-l',
        firstName: 'Thomas',
        lastName: 'L.',
        avatar: '👨‍💻',
        currentPosition: 'Software Engineer',
        company: 'Google',
        university: 'UCLouvain',
        degree: 'Master en Sciences Informatiques',
        graduationYear: 2023,
        smsCoursesCompleted: [
            'Mathématiques',
            'Physique',
            'Algorithmique'
        ],
        linkedinUrl: 'https://linkedin.com/in/thomas-l',
        email: 'thomas.l@google.com',
        testimonial: 'SMS m\'a donné les bases solides pour réussir mes études d\'ingénieur et décrocher mon poste chez Google.',
        domain: 'engineering',
        joinedSmsYear: 2020
    },
    {
        id: 'marie-d',
        firstName: 'Marie',
        lastName: 'D.',
        avatar: '👩‍⚕️',
        currentPosition: 'Résidente en Médecine',
        company: 'CHU Saint-Luc',
        university: 'UCLouvain',
        degree: 'Docteur en Médecine',
        graduationYear: 2024,
        smsCoursesCompleted: [
            'Chimie',
            'Biologie',
            'Physique'
        ],
        linkedinUrl: 'https://linkedin.com/in/marie-d',
        testimonial: 'Les cours de chimie de SMS ont été déterminants pour réussir ma première année de médecine.',
        domain: 'medicine',
        joinedSmsYear: 2019
    },
    {
        id: 'lucas-m',
        firstName: 'Lucas',
        lastName: 'M.',
        avatar: '👨‍💼',
        currentPosition: 'Consultant Strategy',
        company: 'McKinsey & Company',
        university: 'HEC Paris',
        degree: 'Master in Management',
        graduationYear: 2023,
        smsCoursesCompleted: [
            'Mathématiques',
            'Statistiques',
            'Économie'
        ],
        linkedinUrl: 'https://linkedin.com/in/lucas-m',
        testimonial: 'SMS m\'a appris la rigueur mathématique qui fait la différence en conseil en stratégie.',
        domain: 'business',
        joinedSmsYear: 2021
    },
    {
        id: 'sophie-k',
        firstName: 'Sophie',
        lastName: 'K.',
        avatar: '👩‍🔬',
        currentPosition: 'Research Scientist',
        company: 'CERN',
        university: 'ETH Zurich',
        degree: 'PhD in Particle Physics',
        graduationYear: 2024,
        smsCoursesCompleted: [
            'Physique',
            'Mathématiques Avancées'
        ],
        linkedinUrl: 'https://linkedin.com/in/sophie-k',
        testimonial: 'La physique enseignée chez SMS m\'a préparée aux défis de la recherche au CERN.',
        domain: 'research',
        joinedSmsYear: 2018
    },
    {
        id: 'alexandre-r',
        firstName: 'Alexandre',
        lastName: 'R.',
        avatar: '👨‍🎓',
        currentPosition: 'Data Scientist',
        company: 'Meta',
        university: 'KULeuven',
        degree: 'Master in Data Science',
        graduationYear: 2023,
        smsCoursesCompleted: [
            'Statistiques',
            'Mathématiques',
            'Informatique'
        ],
        linkedinUrl: 'https://linkedin.com/in/alexandre-r',
        testimonial: 'Les statistiques apprises chez SMS sont la base de tout mon travail en data science.',
        domain: 'tech',
        joinedSmsYear: 2020
    },
    {
        id: 'camille-b',
        firstName: 'Camille',
        lastName: 'B.',
        avatar: '👩‍⚖️',
        currentPosition: 'Avocate en Droit des Affaires',
        company: 'Linklaters',
        university: 'ULB',
        degree: 'Master en Droit',
        graduationYear: 2022,
        smsCoursesCompleted: [
            'Mathématiques',
            'Économie',
            'Statistiques'
        ],
        linkedinUrl: 'https://linkedin.com/in/camille-b',
        testimonial: 'La logique mathématique de SMS m\'aide quotidiennement dans l\'analyse juridique complexe.',
        domain: 'law',
        joinedSmsYear: 2019
    }
];
const mockCircles = [
    {
        id: 'alumni-network',
        name: 'Réseau Alumni SMS',
        type: 'alumni',
        description: 'Nos anciens étudiants qui excellent dans leurs domaines - Inspiration et mentorat',
        memberCount: 847,
        icon: '🎓',
        color: 'purple',
        isJoined: true,
        recentActivity: [],
        moderators: [
            'admin-team'
        ]
    },
    {
        id: 'solvay-brussels',
        name: 'Club Solvay Brussels',
        type: 'faculty',
        description: 'Étudiants de la Solvay Brussels School - Excellence et bienveillance',
        memberCount: 234,
        icon: '🏛️',
        color: 'blue',
        isJoined: true,
        recentActivity: [],
        moderators: [
            'marie-l'
        ]
    },
    {
        id: 'uclouvain',
        name: 'UCLouvain Sciences',
        type: 'faculty',
        description: 'Communauté des étudiants UCLouvain en sciences',
        memberCount: 189,
        icon: '🎓',
        color: 'green',
        isJoined: false,
        recentActivity: [],
        moderators: [
            'lucas-m'
        ]
    },
    {
        id: 'math-analysis',
        name: 'Analyse Mathématique',
        type: 'course',
        description: 'Entraide et révisions en analyse mathématique',
        memberCount: 87,
        icon: '📊',
        color: 'purple',
        isJoined: true,
        recentActivity: [],
        moderators: [
            'marie-l'
        ]
    },
    {
        id: 'chemistry-general',
        name: 'Chimie Générale',
        type: 'course',
        description: 'Groupe d\'étude pour la chimie générale',
        memberCount: 72,
        icon: '🧪',
        color: 'orange',
        isJoined: true,
        recentActivity: [],
        moderators: [
            'sara-k'
        ]
    },
    {
        id: 'physics-mechanics',
        name: 'Physique - Mécanique',
        type: 'course',
        description: 'Résolution de problèmes de mécanique ensemble',
        memberCount: 56,
        icon: '⚛️',
        color: 'red',
        isJoined: false,
        recentActivity: [],
        moderators: [
            'lucas-m'
        ]
    }
];
const mockStudyRooms = [
    {
        id: 'room-1',
        name: 'Session Analyse - Prépa partiels',
        circleId: 'math-analysis',
        createdBy: 'marie-l',
        currentUsers: [
            mockStudentProfiles[1],
            mockStudentProfiles[0]
        ],
        maxUsers: 6,
        subject: 'Révision limites et dérivées',
        pomodoroTimer: {
            isActive: true,
            currentSession: 2,
            totalSessions: 4,
            sessionDuration: 25,
            breakDuration: 5,
            timeRemaining: 1080 // 18 minutes
        },
        settings: {
            cameraEnabled: true,
            micEnabled: false,
            chatEnabled: true,
            isPrivate: false
        },
        createdAt: new Date(Date.now() - 3600000)
    },
    {
        id: 'room-2',
        name: 'Chimie organique intense',
        circleId: 'chemistry-general',
        createdBy: 'sara-k',
        currentUsers: [
            mockStudentProfiles[3]
        ],
        maxUsers: 4,
        subject: 'Mécanismes réactionnels',
        pomodoroTimer: {
            isActive: false,
            currentSession: 0,
            totalSessions: 0,
            sessionDuration: 25,
            breakDuration: 5,
            timeRemaining: 0
        },
        settings: {
            cameraEnabled: false,
            micEnabled: false,
            chatEnabled: true,
            isPrivate: false
        },
        createdAt: new Date(Date.now() - 1800000)
    }
];
const mockCommunityQuestions = [
    {
        id: 'q1',
        courseId: '1',
        studentId: 'current-user',
        title: 'Aide sur les limites indéterminées',
        content: 'Je bloque sur les formes indéterminées type ∞/∞. Comment déterminer la limite de (2x³-x)/(3x³+5x²) quand x→∞ ?',
        answers: [
            {
                id: 'a1',
                questionId: 'q1',
                studentId: 'marie-l',
                content: 'Pour ce type de limite, regarde le degré le plus élevé au numérateur et dénominateur. Ici c\'est x³ des deux côtés, donc la limite est le rapport des coefficients : 2/3.',
                likes: 8,
                likedBy: [
                    'current-user',
                    'sara-k'
                ],
                isAccepted: true,
                isMentorVerified: true,
                createdAt: new Date(Date.now() - 1800000)
            }
        ],
        likes: 5,
        likedBy: [
            'marie-l',
            'sara-k'
        ],
        tags: [
            'limites',
            'analyse'
        ],
        isResolved: true,
        createdAt: new Date(Date.now() - 7200000),
        lastActivity: new Date(Date.now() - 1800000)
    },
    {
        id: 'q2',
        courseId: '3',
        studentId: 'lucas-m',
        title: 'Équilibrage équations redox',
        content: 'J\'ai du mal avec l\'équilibrage des réactions d\'oxydoréduction. Des conseils pour la méthode systématique ?',
        answers: [],
        likes: 2,
        likedBy: [
            'current-user'
        ],
        tags: [
            'redox',
            'équilibrage'
        ],
        isResolved: false,
        createdAt: new Date(Date.now() - 3600000),
        lastActivity: new Date(Date.now() - 3600000)
    }
];
const mockCommunityActivities = [
    // Annonces officielles
    {
        id: 'announce1',
        type: 'announcement',
        studentId: 'admin-team',
        content: '🚀 Nouvelle fonctionnalité : Réseau Alumni maintenant disponible ! Découvrez les parcours inspirants de nos anciens étudiants.',
        priority: 'high',
        createdAt: new Date(Date.now() - 1800000),
        reactions: {
            likes: 23,
            hearts: 8,
            celebrates: 15,
            likedBy: [
                'current-user',
                'marie-l',
                'sara-k'
            ]
        }
    },
    {
        id: 'announce2',
        type: 'announcement',
        studentId: 'admin-team',
        content: '📅 Webinaire spécial "Méthodes de révision efficaces" ce vendredi à 18h avec Marie L. (ancienne étudiante, maintenant chez Google).',
        priority: 'medium',
        createdAt: new Date(Date.now() - 86400000),
        reactions: {
            likes: 18,
            hearts: 5,
            celebrates: 12,
            likedBy: [
                'current-user',
                'paul-m'
            ]
        }
    },
    // Célébrations et succès
    {
        id: 'celebration1',
        type: 'celebration',
        studentId: 'current-user',
        content: '🎉 Bravo Yassine ! Tu viens de terminer le cours Analyse Mathématique I avec une note de 16/20 !',
        circleId: 'math-analysis',
        priority: 'high',
        createdAt: new Date(Date.now() - 3600000),
        reactions: {
            likes: 12,
            hearts: 8,
            celebrates: 20,
            likedBy: [
                'marie-l',
                'sara-k',
                'paul-m'
            ]
        }
    },
    {
        id: 'celebration2',
        type: 'milestone',
        studentId: 'marie-l',
        content: '🏆 Félicitations Marie ! Tu as atteint le niveau 15 et obtenu le badge "Mentor Expert" en aidant plus de 50 étudiants !',
        circleId: 'solvay-brussels',
        priority: 'high',
        createdAt: new Date(Date.now() - 7200000),
        reactions: {
            likes: 25,
            hearts: 15,
            celebrates: 30,
            likedBy: [
                'current-user',
                'sara-k',
                'paul-m',
                'alex-r'
            ]
        }
    },
    {
        id: 'celebration3',
        type: 'level_up',
        studentId: 'sara-k',
        content: '⭐ Sara a progressé au niveau 8 ! Son streak d\'étude de 21 jours est impressionnant.',
        circleId: 'chemistry',
        priority: 'medium',
        createdAt: new Date(Date.now() - 10800000),
        reactions: {
            likes: 8,
            hearts: 4,
            celebrates: 10,
            likedBy: [
                'current-user',
                'marie-l'
            ]
        }
    },
    // Activités communautaires
    {
        id: 'activity1',
        type: 'room_created',
        studentId: 'paul-m',
        content: '📚 Paul a ouvert une session d\'étude collective "Préparation Partiels Physique" - 4 places disponibles !',
        circleId: 'physics',
        priority: 'medium',
        createdAt: new Date(Date.now() - 14400000),
        reactions: {
            likes: 6,
            hearts: 2,
            celebrates: 3,
            likedBy: [
                'current-user'
            ]
        }
    },
    {
        id: 'activity2',
        type: 'achievement',
        studentId: 'alex-r',
        content: '🔥 Alex a complété le défi "Expert en Statistiques" en terminant 5 exercices difficiles cette semaine !',
        circleId: 'math-stats',
        priority: 'medium',
        createdAt: new Date(Date.now() - 18000000),
        reactions: {
            likes: 9,
            hearts: 3,
            celebrates: 7,
            likedBy: [
                'current-user',
                'marie-l',
                'sara-k'
            ]
        }
    },
    // Bienvenue et interactions
    {
        id: 'welcome1',
        type: 'welcome',
        studentId: 'admin-team',
        content: '👋 Bienvenue aux 12 nouveaux étudiants qui ont rejoint Science Made Simple cette semaine ! Votre parcours vers l\'excellence commence maintenant.',
        priority: 'medium',
        createdAt: new Date(Date.now() - 172800000),
        reactions: {
            likes: 15,
            hearts: 10,
            celebrates: 8,
            likedBy: [
                'current-user',
                'marie-l',
                'sara-k',
                'paul-m'
            ]
        }
    },
    {
        id: 'qa1',
        type: 'question_asked',
        studentId: 'current-user',
        content: '❓ Yassine a posé une excellente question sur les intégrales par parties qui a aidé 8 autres étudiants.',
        circleId: 'math-analysis',
        priority: 'low',
        createdAt: new Date(Date.now() - 259200000),
        reactions: {
            likes: 11,
            hearts: 2,
            celebrates: 5,
            likedBy: [
                'marie-l',
                'paul-m',
                'alex-r'
            ]
        }
    },
    {
        id: 'answer1',
        type: 'answer_given',
        studentId: 'marie-l',
        content: '💡 Marie a donné une réponse détaillée qui a résolu le problème de chimie organique de 3 étudiants.',
        circleId: 'chemistry',
        priority: 'low',
        createdAt: new Date(Date.now() - 345600000),
        reactions: {
            likes: 7,
            hearts: 5,
            celebrates: 3,
            likedBy: [
                'current-user',
                'sara-k'
            ]
        }
    }
];
const mockCommunityChallenge = {
    id: 'challenge-1',
    title: 'Défi Communauté Solvay',
    description: '1000h d\'étude collective ce mois-ci',
    type: 'collective',
    target: 1000,
    current: 342,
    participants: [
        'current-user',
        'marie-l',
        'sara-k'
    ],
    reward: 'Badge exclusif "Champion Solvay" pour tous',
    icon: '🏆',
    color: 'gold',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    isActive: true
};
const mockMiniQuizzes = {
    '1': [
        {
            id: 'math1-q1',
            question: 'Quelle est la définition d\'une limite d\'une fonction en un point ?',
            options: [
                'La valeur que prend la fonction en ce point',
                'La valeur vers laquelle tend la fonction quand x se rapproche du point',
                'La dérivée de la fonction en ce point',
                'L\'intégrale de la fonction jusqu\'à ce point'
            ],
            correctAnswer: 1,
            explanation: 'La limite d\'une fonction en un point est la valeur vers laquelle tend cette fonction quand la variable se rapproche de ce point, indépendamment de la valeur de la fonction en ce point.',
            difficulty: 'medium'
        },
        {
            id: 'math1-q2',
            question: 'Une fonction continue sur un intervalle fermé borné possède-t-elle toujours un maximum ?',
            options: [
                'Oui, c\'est le théorème de Weierstrass',
                'Non, seulement si elle est dérivable',
                'Seulement si elle est monotone',
                'Cela dépend de la fonction'
            ],
            correctAnswer: 0,
            explanation: 'Le théorème de Weierstrass stipule qu\'une fonction continue sur un intervalle fermé et borné atteint ses bornes, donc possède un maximum et un minimum.',
            difficulty: 'hard'
        }
    ],
    '2': [
        {
            id: 'phys2-q1',
            question: 'Quelle est l\'unité de la force dans le système international ?',
            options: [
                'Joule (J)',
                'Watt (W)',
                'Newton (N)',
                'Pascal (Pa)'
            ],
            correctAnswer: 2,
            explanation: 'Le Newton (N) est l\'unité de force dans le système international. 1 N = 1 kg⋅m⋅s⁻²',
            difficulty: 'easy'
        },
        {
            id: 'phys2-q2',
            question: 'Dans un mouvement circulaire uniforme, l\'accélération est :',
            options: [
                'Nulle',
                'Tangentielle et constante',
                'Centripète et constante en norme',
                'Variable en direction et en norme'
            ],
            correctAnswer: 2,
            explanation: 'Dans un mouvement circulaire uniforme, l\'accélération est centripète (dirigée vers le centre) et constante en norme, mais sa direction change constamment.',
            difficulty: 'medium'
        }
    ],
    '3': [
        {
            id: 'chem3-q1',
            question: 'Combien d\'électrons peut contenir au maximum la couche électronique L ?',
            options: [
                '2 électrons',
                '8 électrons',
                '18 électrons',
                '32 électrons'
            ],
            correctAnswer: 1,
            explanation: 'La couche L (n=2) peut contenir au maximum 2n² = 2×2² = 8 électrons.',
            difficulty: 'easy'
        }
    ],
    '4': [
        {
            id: 'stat4-q1',
            question: 'Quelle est la propriété principale d\'une distribution normale standard ?',
            options: [
                'Moyenne = 1, Écart-type = 0',
                'Moyenne = 0, Écart-type = 1',
                'Moyenne = 0, Écart-type = 0',
                'Moyenne = 1, Écart-type = 1'
            ],
            correctAnswer: 1,
            explanation: 'Une distribution normale standard a une moyenne μ = 0 et un écart-type σ = 1.',
            difficulty: 'medium'
        }
    ],
    '5': [
        {
            id: 'eco5-q1',
            question: 'Que représente l\'élasticité-prix de la demande ?',
            options: [
                'La variation absolue de la demande',
                'Le pourcentage de variation de la demande suite à une variation de 1% du prix',
                'Le prix maximum qu\'un consommateur est prêt à payer',
                'La quantité minimum demandée'
            ],
            correctAnswer: 1,
            explanation: 'L\'élasticité-prix de la demande mesure la sensibilité de la quantité demandée aux variations de prix, exprimée en pourcentage.',
            difficulty: 'medium'
        }
    ]
};
const generateMockLessons = (courseId, courseTitle)=>{
    const baseTypes = [
        {
            type: 'video',
            icon: '🎥',
            baseDuration: 25
        },
        {
            type: 'reading',
            icon: '📖',
            baseDuration: 15
        },
        {
            type: 'exercise',
            icon: '💪',
            baseDuration: 30
        },
        {
            type: 'video',
            icon: '🎯',
            baseDuration: 35
        },
        {
            type: 'exercise',
            icon: '🔬',
            baseDuration: 45
        },
        {
            type: 'quiz',
            icon: '❓',
            baseDuration: 20
        },
        {
            type: 'exercise',
            icon: '🏆',
            baseDuration: 60
        }
    ];
    const lessonTemplates = [
        {
            title: 'Introduction et objectifs',
            description: 'Découverte du sujet et présentation des objectifs pédagogiques. Mise en contexte et motivation.'
        },
        {
            title: 'Concepts fondamentaux',
            description: 'Apprentissage des notions de base essentielles. Définitions et première approche théorique.'
        },
        {
            title: 'Applications pratiques',
            description: 'Exercices concrets et mise en pratique des concepts. Développement des compétences opérationnelles.'
        },
        {
            title: 'Techniques avancées',
            description: 'Approfondissement et méthodes avancées. Résolution de problèmes complexes.'
        },
        {
            title: 'Synthèse et intégration',
            description: 'Consolidation des acquis et vision d\'ensemble. Liens entre les différents concepts.'
        },
        {
            title: 'Évaluation des connaissances',
            description: 'Test formatif pour vérifier la maîtrise. Auto-évaluation et feedback constructif.'
        },
        {
            title: 'Projet de synthèse',
            description: 'Application globale dans un projet concret. Validation des compétences acquises.'
        }
    ];
    return lessonTemplates.map((template, index)=>{
        const typeInfo = baseTypes[index];
        const isCompleted = index < 2; // Les 2 premières leçons sont complétées
        const isUnlocked = index < 3; // Les 3 premières sont débloquées
        return {
            id: `${courseId}-lesson-${index + 1}`,
            courseId,
            title: template.title,
            description: template.description,
            duration: typeInfo.baseDuration + Math.floor(Math.random() * 10) - 5,
            order: index + 1,
            completed: isCompleted,
            isCompleted: isCompleted,
            unlocked: isUnlocked,
            isAccessible: isUnlocked,
            hasPreview: index === 0 || !isUnlocked,
            type: typeInfo.type,
            xpReward: 10 + index * 5,
            difficulty: index < 2 ? 'easy' : index < 5 ? 'medium' : 'hard',
            objectives: [
                `Maîtriser ${template.title.toLowerCase()}`,
                `Appliquer les concepts dans ${courseTitle}`,
                `Préparer la suite du parcours académique`
            ],
            previewUrl: index === 0 ? '/preview-video.mp4' : undefined,
            videoUrl: typeInfo.type === 'video' ? '/course-video.mp4' : undefined
        };
    });
};
const getCourseLessons = (courseId)=>{
    const course = mockCourses.find((c)=>c.id === courseId);
    if (!course) return [];
    return generateMockLessons(courseId, course.title);
};
const mockCourseLessons = {
    '1': generateMockLessons('1', 'Mathématiques : Analyse I Q1'),
    '2': generateMockLessons('2', 'Chimie Générale I Q1'),
    '3': generateMockLessons('3', 'Physique Générale I Q1'),
    '4': generateMockLessons('4', 'Statistiques et Probabilités'),
    '5': generateMockLessons('5', 'Économie - Microéconomie'),
    '6': generateMockLessons('6', 'Comptabilité Générale Q1'),
    '7': generateMockLessons('7', 'Informatique Q1'),
    '8': generateMockLessons('8', 'Droit Civil - Introduction'),
    '9': generateMockLessons('9', 'Analyse II Q2'),
    '10': generateMockLessons('10', 'Chimie Générale I Q2')
};
const getStudentProfile = (id)=>mockStudentProfiles.find((p)=>p.id === id);
const getCurrentUserProfile = ()=>mockStudentProfiles[0];
const getMockCircles = ()=>mockCircles;
const getMockStudyRooms = ()=>mockStudyRooms;
const getMockCommunityQuestions = ()=>mockCommunityQuestions;
const getMockCommunityActivities = ()=>mockCommunityActivities;
const getMockSocialBadges = ()=>mockSocialBadges;
const getMockCommunityChallenge = ()=>mockCommunityChallenge;
const getMockAlumniProfiles = ()=>mockAlumniProfiles;
const getMiniQuizForCourse = (courseId)=>mockMiniQuizzes[courseId] || [];
const getLessonsForCourse = (courseId)=>mockCourseLessons[courseId] || generateMockLessons(courseId, `Cours ${courseId}`);
const mockPersonalProfile = {
    blocages: [
        {
            id: 'b1',
            titre: 'Difficultés en intégrales',
            description: 'J\'ai du mal avec les techniques d\'intégration avancées, surtout les intégrales par parties',
            matiere: 'Mathématiques - Analyse I',
            niveau: 'difficile',
            identifieLe: new Date('2024-09-10'),
            source: 'conversation-ia',
            recommandations: [
                'Réviser les bases des dérivées',
                'Pratiquer les exercices d\'intégration simple',
                'Utiliser la méthode progressive des intégrales par parties'
            ]
        },
        {
            id: 'b2',
            titre: 'Équilibres chimiques complexes',
            description: 'Les calculs d\'équilibres avec plusieurs réactions simultanées me posent problème',
            matiere: 'Chimie Générale I',
            niveau: 'moyen',
            identifieLe: new Date('2024-09-15'),
            source: 'whatsapp',
            recommandations: [
                'Maîtriser d\'abord les équilibres simples',
                'Utiliser des schémas visuels',
                'Pratiquer avec des exemples concrets'
            ]
        },
        {
            id: 'b3',
            titre: 'Procrastination et gestion du temps',
            description: 'J\'ai tendance à reporter mes révisions, surtout pour les matières difficiles',
            matiere: 'Méthodes de travail',
            niveau: 'moyen',
            identifieLe: new Date('2024-09-20'),
            source: 'auto-evaluation',
            recommandations: [
                'Utiliser la technique Pomodoro',
                'Planifier des créneaux fixes',
                'Commencer par de petites tâches'
            ]
        }
    ],
    ambitions: [
        {
            id: 'a1',
            titre: 'Décrocher une mention en première année',
            description: 'Je veux terminer ma première année avec une moyenne de 14/20 minimum',
            echeance: new Date('2025-06-30'),
            priorite: 'haute',
            progres: 35,
            etapes: [
                {
                    id: 'e1',
                    titre: 'Maîtriser les mathématiques Q1',
                    terminee: false,
                    coursLie: '1'
                },
                {
                    id: 'e2',
                    titre: 'Réussir l\'examen de chimie',
                    terminee: false,
                    coursLie: '2'
                },
                {
                    id: 'e3',
                    titre: 'Développer une routine d\'étude',
                    terminee: true
                }
            ]
        },
        {
            id: 'a2',
            titre: 'Intégrer un programme d\'échange',
            description: 'Je veux partir en Erasmus en 3ème année, idéalement en Allemagne ou aux Pays-Bas',
            echeance: new Date('2026-09-01'),
            priorite: 'moyenne',
            progres: 15,
            etapes: [
                {
                    id: 'e4',
                    titre: 'Maintenir une excellente moyenne',
                    terminee: false
                },
                {
                    id: 'e5',
                    titre: 'Améliorer mon niveau d\'anglais',
                    terminee: false
                },
                {
                    id: 'e6',
                    titre: 'Me renseigner sur les universités partenaires',
                    terminee: true
                }
            ]
        }
    ],
    cheminRecommande: {
        id: 'cr1',
        titre: 'Parcours de remise à niveau en sciences',
        description: 'Plan personnalisé basé sur tes difficultés actuelles et tes objectifs académiques',
        progression: 42,
        tempEstime: '8-10 semaines',
        creeLe: new Date('2024-09-25'),
        baseSur: [
            'conversation-ia',
            'blocages',
            'ambitions'
        ],
        etapes: [
            {
                id: 'ec1',
                titre: 'Consolider les bases mathématiques',
                description: 'Révision des dérivées et introduction progressive aux intégrales',
                coursRecommande: '1',
                terminee: true,
                ordre: 1
            },
            {
                id: 'ec2',
                titre: 'Renforcer la méthodologie',
                description: 'Développer des techniques d\'organisation et de gestion du temps',
                terminee: true,
                ordre: 2
            },
            {
                id: 'ec3',
                titre: 'Approfondir la chimie générale',
                description: 'Focus sur les équilibres et la thermodynamique',
                coursRecommande: '2',
                terminee: false,
                ordre: 3
            },
            {
                id: 'ec4',
                titre: 'Pratiquer avec des exercices avancés',
                description: 'Applications concrètes et problèmes complexes',
                terminee: false,
                ordre: 4
            }
        ]
    },
    conversationsIA: [
        {
            id: 'ci1',
            date: new Date('2024-09-25'),
            resume: 'Discussion sur les difficultés en mathématiques et définition d\'un plan d\'action',
            decouvertesClés: [
                'Lacunes dans les techniques d\'intégration',
                'Besoin de réviser les bases avant d\'avancer',
                'Motivation élevée malgré les difficultés'
            ],
            recommandations: [
                'Suivre le cours de rattrapage en analyse',
                'Utiliser des ressources visuelles pour mieux comprendre',
                'Planifier 30min de révision quotidienne'
            ]
        },
        {
            id: 'ci2',
            date: new Date('2024-09-20'),
            resume: 'Évaluation du niveau global et identification des priorités',
            decouvertesClés: [
                'Niveau satisfaisant en chimie de base',
                'Excellente motivation et objectifs clairs',
                'Problèmes de gestion du temps à résoudre'
            ],
            recommandations: [
                'Créer un planning hebdomadaire structuré',
                'Commencer par consolider les mathématiques',
                'Utiliser les outils de suivi de progression'
            ]
        }
    ],
    conversationsWhatsApp: [
        {
            id: 'cw1',
            date: new Date('2024-09-22'),
            resume: 'Questions sur l\'équilibre chimique et demande de ressources supplémentaires',
            pointsDiscutes: [
                'Calculs d\'équilibres multiples',
                'Recommandations de livres et exercices',
                'Planification des révisions pour l\'examen'
            ],
            suiviNecessaire: false
        },
        {
            id: 'cw2',
            date: new Date('2024-09-18'),
            resume: 'Discussion motivationnelle et conseil sur la gestion du stress',
            pointsDiscutes: [
                'Anxiété avant les examens',
                'Techniques de relaxation',
                'Importance de maintenir un équilibre vie/études'
            ],
            suiviNecessaire: true
        }
    ]
};
const getPersonalProfile = ()=>mockPersonalProfile;
const mockStudentInfo = {
    university: 'Solvay Brussels School',
    faculty: 'École de Commerce Solvay',
    section: 'Ingénieur de gestion',
    year: 'Première année',
    currentSituation: 'Étudiant motivé mais avec quelques difficultés en mathématiques. Souhaite exceller pour intégrer un master prestigieux.',
    urgentDeadlines: [
        new Date('2024-12-15'),
        new Date('2024-12-20'),
        new Date('2025-01-10') // Session de rattrapage
    ],
    stressLevel: 3,
    contactPreference: 'whatsapp'
};
const mockBlocagesDetailles = [
    {
        id: 'blocage-1',
        titre: 'Intégrales par parties',
        description: 'Difficulté à identifier quand et comment appliquer la méthode d\'intégration par parties. Confusion sur le choix de u et dv.',
        matiere: 'Mathématiques',
        niveau: 'difficile',
        identifieLe: new Date('2024-09-15'),
        source: 'diagnostic-initial',
        recommandations: [
            'Revoir les règles de priorité pour le choix de u (LIATE)',
            'Faire des exercices progressifs avec correction détaillée',
            'Utiliser la méthode des tableaux pour visualiser'
        ],
        priorite: 'critique',
        coursRecommandes: [
            '1'
        ],
        resolved: false,
        mentorNotes: 'Étudiant intelligent mais manque de méthode. Besoin de structure dans l\'approche.'
    },
    {
        id: 'blocage-2',
        titre: 'Équilibres chimiques',
        description: 'Compréhension théorique correcte mais difficultés dans l\'application pratique des calculs d\'équilibre.',
        matiere: 'Chimie',
        niveau: 'moyen',
        identifieLe: new Date('2024-09-20'),
        source: 'whatsapp',
        recommandations: [
            'Pratiquer avec des exercices types',
            'Mémoriser les constantes d\'équilibre courantes',
            'Utiliser des schémas pour visualiser les réactions'
        ],
        priorite: 'importante',
        coursRecommandes: [
            '3'
        ],
        resolved: false
    },
    {
        id: 'blocage-3',
        titre: 'Gestion du temps d\'étude',
        description: 'Tendance à procrastiner et difficulté à maintenir un rythme d\'étude régulier.',
        matiere: 'Méthodologie',
        niveau: 'moyen',
        identifieLe: new Date('2024-09-10'),
        source: 'conversation-ia',
        recommandations: [
            'Utiliser la technique Pomodoro',
            'Planifier des créneaux d\'étude fixes',
            'Se fixer des objectifs quotidiens réalisables'
        ],
        priorite: 'importante',
        coursRecommandes: [],
        resolved: false
    }
];
const mockAmbitionsDetaillees = [
    {
        id: 'ambition-1',
        titre: 'Obtenir 14/20 en Analyse Mathématique',
        description: 'Viser l\'excellence en mathématiques pour avoir une base solide pour les années suivantes.',
        echeance: new Date('2024-12-15'),
        priorite: 'haute',
        progres: 35,
        etapes: [
            {
                id: 'etape-1-1',
                titre: 'Maîtriser les limites',
                terminee: true,
                coursLie: '1'
            },
            {
                id: 'etape-1-2',
                titre: 'Comprendre les dérivées',
                terminee: true,
                coursLie: '1'
            },
            {
                id: 'etape-1-3',
                titre: 'Maîtriser les intégrales',
                terminee: false,
                coursLie: '1'
            },
            {
                id: 'etape-1-4',
                titre: 'Résoudre des exercices complexes',
                terminee: false,
                coursLie: '1'
            }
        ]
    },
    {
        id: 'ambition-2',
        titre: 'Intégrer un master en Finance',
        description: 'Objectif à long terme : intégrer un master prestigieux en finance quantitative.',
        echeance: new Date('2025-06-30'),
        priorite: 'haute',
        progres: 15,
        etapes: [
            {
                id: 'etape-2-1',
                titre: 'Excellents résultats en 1ère année',
                terminee: false
            },
            {
                id: 'etape-2-2',
                titre: 'Stage en banque d\'investissement',
                terminee: false
            },
            {
                id: 'etape-2-3',
                titre: 'Préparation aux concours',
                terminee: false
            }
        ]
    },
    {
        id: 'ambition-3',
        titre: 'Développer une méthode d\'étude efficace',
        description: 'Créer un système d\'apprentissage personnel qui me permettra de réussir tout au long de mes études.',
        echeance: new Date('2024-11-30'),
        priorite: 'moyenne',
        progres: 60,
        etapes: [
            {
                id: 'etape-3-1',
                titre: 'Identifier mon style d\'apprentissage',
                terminee: true
            },
            {
                id: 'etape-3-2',
                titre: 'Mettre en place un planning',
                terminee: true
            },
            {
                id: 'etape-3-3',
                titre: 'Tester et ajuster la méthode',
                terminee: false
            }
        ]
    }
];
const mockCheminRecommande = {
    id: 'chemin-1',
    titre: 'Parcours Excellence Ingénieur de Gestion',
    description: 'Un parcours personnalisé pour exceller en première année et préparer ton avenir en finance quantitative.',
    etapes: [
        {
            id: 'etape-chemin-1',
            titre: 'Consolider les bases en mathématiques',
            description: 'Maîtriser parfaitement l\'analyse mathématique, priorité absolue pour la suite.',
            coursRecommande: '1',
            terminee: false,
            ordre: 1
        },
        {
            id: 'etape-chemin-2',
            titre: 'Renforcer la physique appliquée',
            description: 'Développer l\'intuition physique nécessaire pour les applications en ingénierie.',
            coursRecommande: '2',
            terminee: false,
            ordre: 2
        },
        {
            id: 'etape-chemin-3',
            titre: 'Approfondir la chimie générale',
            description: 'Compléter les connaissances scientifiques de base.',
            coursRecommande: '3',
            terminee: false,
            ordre: 3
        },
        {
            id: 'etape-chemin-4',
            titre: 'Maîtriser les statistiques',
            description: 'Fondamental pour la finance quantitative et l\'analyse de données.',
            coursRecommande: '4',
            terminee: false,
            ordre: 4
        },
        {
            id: 'etape-chemin-5',
            titre: 'Comprendre la microéconomie',
            description: 'Base théorique essentielle pour les études en gestion.',
            coursRecommande: '5',
            terminee: false,
            ordre: 5
        }
    ],
    progression: 25,
    tempEstime: '6 mois',
    creeLe: new Date('2024-09-15'),
    baseSur: [
        'diagnostic-initial',
        'blocages',
        'ambitions'
    ]
};
const mockPersonalProfileComplet = {
    blocages: mockBlocagesDetailles,
    ambitions: mockAmbitionsDetaillees,
    cheminRecommande: mockCheminRecommande,
    conversationsIA: mockPersonalProfile.conversationsIA,
    conversationsWhatsApp: mockPersonalProfile.conversationsWhatsApp,
    diagnosticCompleted: true,
    diagnosticDate: new Date('2024-09-15'),
    studentInfo: mockStudentInfo,
    prescriptionGenerated: true
};
const getPersonalProfileComplet = ()=>mockPersonalProfileComplet;
const mockEnhancedDashboardData = {
    ...mockDashboardData,
    personalProfile: mockPersonalProfileComplet,
    diagnosticCompleted: true,
    prescriptionDate: new Date('2024-09-15'),
    headerConfig: {
        title: "Ton plan de réussite sur mesure",
        baseline: "Issu de ton diagnostic et de nos échanges",
        showWhatsAppButton: true,
        showAIButton: true
    },
    socialProofByFaculty: [
        {
            courseId: '1',
            facultyName: 'Solvay Brussels School',
            enrolledStudents: 87,
            averageProgress: 68,
            diagnosticRecommendationRate: 92,
            successRate: 84
        },
        {
            courseId: '3',
            facultyName: 'Solvay Brussels School',
            enrolledStudents: 72,
            averageProgress: 71,
            diagnosticRecommendationRate: 78,
            successRate: 89
        },
        {
            courseId: '4',
            facultyName: 'Solvay Brussels School',
            enrolledStudents: 65,
            averageProgress: 75,
            diagnosticRecommendationRate: 85,
            successRate: 91
        }
    ]
};
const getEnhancedDashboardData = ()=>mockEnhancedDashboardData;
}),
"[project]/Science-Made-Simple-Kiro/src/lib/smart-recommendations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculatePackValue",
    ()=>calculatePackValue,
    "getContextualMessage",
    ()=>getContextualMessage,
    "getCourseContextualMessage",
    ()=>getCourseContextualMessage,
    "getCourseRecommendations",
    ()=>getCourseRecommendations,
    "getLessonRecommendations",
    ()=>getLessonRecommendations,
    "getRecommendationLevel",
    ()=>getRecommendationLevel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/src/lib/mock-data.ts [app-ssr] (ecmascript)");
;
const getLessonRecommendations = (lesson)=>{
    const coursePacks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCoursePacks"])();
    // Trouve le cours correspondant basé sur le courseId de la leçon
    const getRelatedCourse = ()=>{
        // Mapping basé sur les IDs de cours
        const courseMapping = {
            '1': {
                id: '1',
                title: 'Mathématiques : Analyse I Q1',
                description: 'Cours complet d\'analyse mathématique avec limites, dérivées et intégrales',
                faculty: 'Sciences',
                year: 'L1',
                instructor: 'Prof. Martin',
                totalLessons: 12,
                completedLessons: 0,
                duration: '8h 30min',
                isOwned: false,
                isPrimary: false,
                progress: 0,
                creditCost: 25,
                difficulty: 'intermediate',
                previewAvailable: true,
                tags: [
                    'mathématiques',
                    'analyse',
                    'dérivées'
                ]
            },
            '2': {
                id: '2',
                title: 'Physique pour Ingénieurs',
                description: 'Mécanique classique, thermodynamique et électromagnétisme',
                faculty: 'Sciences',
                year: 'L1',
                instructor: 'Prof. Dubois',
                totalLessons: 15,
                completedLessons: 0,
                duration: '10h 15min',
                isOwned: false,
                isPrimary: false,
                progress: 0,
                creditCost: 28,
                difficulty: 'intermediate',
                previewAvailable: true,
                tags: [
                    'physique',
                    'mécanique',
                    'thermodynamique'
                ]
            },
            '3': {
                id: '3',
                title: 'Chimie Générale I Q2',
                description: 'Fondements de la chimie générale avec liaisons et réactions',
                faculty: 'Sciences',
                year: 'L1',
                instructor: 'Prof. Laurent',
                totalLessons: 10,
                completedLessons: 0,
                duration: '7h 45min',
                isOwned: false,
                isPrimary: false,
                progress: 0,
                creditCost: 22,
                difficulty: 'beginner',
                previewAvailable: true,
                tags: [
                    'chimie',
                    'liaisons',
                    'réactions'
                ]
            },
            '4': {
                id: '4',
                title: 'Statistiques Descriptives',
                description: 'Analyse statistique et probabilités pour l\'ingénieur',
                faculty: 'Sciences',
                year: 'L1',
                instructor: 'Prof. Moreau',
                totalLessons: 8,
                completedLessons: 0,
                duration: '6h 20min',
                isOwned: false,
                isPrimary: false,
                progress: 0,
                creditCost: 20,
                difficulty: 'beginner',
                previewAvailable: true,
                tags: [
                    'statistiques',
                    'probabilités',
                    'analyse'
                ]
            },
            '5': {
                id: '5',
                title: 'Microéconomie',
                description: 'Principes fondamentaux de l\'économie de marché',
                faculty: 'Économie',
                year: 'L1',
                instructor: 'Prof. Bernard',
                totalLessons: 9,
                completedLessons: 0,
                duration: '7h 10min',
                isOwned: false,
                isPrimary: false,
                progress: 0,
                creditCost: 18,
                difficulty: 'intermediate',
                previewAvailable: true,
                tags: [
                    'économie',
                    'marchés',
                    'microéconomie'
                ]
            }
        };
        return courseMapping[lesson.courseId] || courseMapping['1'];
    };
    // Trouve le pack recommandé basé sur le contenu de la leçon
    const getRecommendedPack = ()=>{
        // Logique de recommandation basée sur les matières
        if (lesson.courseId === '1' || lesson.courseId === '4') {
            // Mathématiques ou Statistiques → Pack Mathématiques Avancées
            return coursePacks.find((pack)=>pack.id === 'pack-math-advanced') || coursePacks[0];
        }
        if (lesson.courseId === '2' || lesson.courseId === '3') {
            // Physique ou Chimie → Pack Sciences
            return coursePacks.find((pack)=>pack.id === 'pack-chimie-complete') || coursePacks[0];
        }
        if (lesson.courseId === '5') {
            // Économie → Pack Rentrée (qui inclut micro)
            return coursePacks.find((pack)=>pack.id === 'pack-rentree') || coursePacks[0];
        }
        // Par défaut, recommander le pack Excellence
        return coursePacks.find((pack)=>pack.id === 'pack-excellence') || coursePacks[0];
    };
    return {
        relatedCourse: getRelatedCourse(),
        recommendedPack: getRecommendedPack()
    };
};
const getContextualMessage = (lesson, course, pack)=>{
    const messages = {
        encouragement: [
            "Un seul chapitre ne suffit pas toujours à réussir ton examen.",
            "Pour une compréhension approfondie, nous recommandons le cours complet.",
            "Les concepts sont interconnectés - une approche globale est plus efficace."
        ],
        courseValue: [
            `Avec le cours "${course.title}", tu maîtrises tout le sujet.`,
            "Le cours complet te donne une vision d'ensemble essentielle.",
            "Toutes les leçons sont conçues pour se compléter mutuellement."
        ],
        packValue: [
            `Le "${pack.title}" t'accompagne de A à Z avec des bonus exclusifs.`,
            "Un pack complet maximise tes chances de réussite.",
            "L'accompagnement personnalisé fait toute la différence."
        ]
    };
    return {
        encouragement: messages.encouragement[Math.floor(Math.random() * messages.encouragement.length)],
        courseValue: messages.courseValue[Math.floor(Math.random() * messages.courseValue.length)],
        packValue: messages.packValue[Math.floor(Math.random() * messages.packValue.length)]
    };
};
const calculatePackValue = (pack)=>{
    const baseValue = pack.originalCreditCost;
    const actualCost = pack.creditCost;
    const savings = baseValue - actualCost;
    return {
        savings,
        percentageSave: Math.round(savings / baseValue * 100),
        bonusContent: pack.features.length - pack.courses.length,
        valueProposition: `${savings} crédits de contenu bonus inclus`
    };
};
const getRecommendationLevel = (lesson)=>{
    // Leçons de difficulté 'hard' → forte recommandation pour le pack
    if (lesson.difficulty === 'hard') {
        return {
            primary: 'pack',
            message: 'Ce concept avancé nécessite une approche complète pour être maîtrisé.'
        };
    }
    // Leçons 'medium' → recommandation modérée pour le cours
    if (lesson.difficulty === 'medium') {
        return {
            primary: 'course',
            message: 'Cette leçon fait partie d\'un ensemble cohérent à étudier.'
        };
    }
    // Leçons 'easy' → recommandation légère
    return {
        primary: 'course',
        message: 'Même les bases sont mieux comprises dans leur contexte global.'
    };
};
const getCourseRecommendations = (course)=>{
    const coursePacks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCoursePacks"])();
    // Mapping cours -> pack recommandé basé sur la matière et le niveau
    const getRecommendedPack = ()=>{
        // Mathématiques et Statistiques → Pack Mathématiques Avancées
        if (course.id === '1' || course.id === '4' || course.title.toLowerCase().includes('math')) {
            return coursePacks.find((pack)=>pack.id === 'pack-math-advanced') || coursePacks[0];
        }
        // Physique et Chimie → Pack Sciences Exactes  
        if (course.id === '2' || course.id === '3' || course.title.toLowerCase().includes('physique') || course.title.toLowerCase().includes('chimie')) {
            return coursePacks.find((pack)=>pack.id === 'pack-chimie-complete') || coursePacks[0];
        }
        // Économie → Pack Rentrée
        if (course.id === '5' || course.faculty === 'Économie' || course.title.toLowerCase().includes('économie')) {
            return coursePacks.find((pack)=>pack.id === 'pack-rentree') || coursePacks[0];
        }
        // Par défaut → Pack Excellence
        return coursePacks.find((pack)=>pack.id === 'pack-excellence') || coursePacks[0];
    };
    // Pack alternatif pour donner le choix
    const getAlternativePack = (mainPack)=>{
        // Si le pack principal n'est pas Excellence, proposer Excellence
        if (mainPack.id !== 'pack-excellence') {
            return coursePacks.find((pack)=>pack.id === 'pack-excellence') || coursePacks[0];
        }
        // Sinon proposer le pack Mathématiques Avancées
        return coursePacks.find((pack)=>pack.id === 'pack-math-advanced') || coursePacks[0];
    };
    const recommendedPack = getRecommendedPack();
    const alternativePack = getAlternativePack(recommendedPack);
    return {
        recommendedPack,
        alternativePack
    };
};
const getCourseContextualMessage = (course, pack)=>{
    const messages = {
        courseEncouragement: [
            "Un seul cours peut ne pas suffire pour maîtriser complètement le domaine.",
            "Les meilleurs étudiants adoptent une approche transversale.",
            "L'excellence vient de la compréhension globale, pas fragmentée."
        ],
        packValue: [
            `Le "${pack.title}" t'offre une formation complète avec accompagnement premium.`,
            "Un pack complet maximise ton potentiel et tes chances de réussite.",
            "L'approche intégrée des packs fait toute la différence aux examens.",
            "Les bonus exclusifs des packs enrichissent considérablement ton apprentissage."
        ],
        motivation: [
            "Vise l'excellence, pas seulement la moyenne.",
            "Investis dans ta réussite avec les meilleurs outils.",
            "Ton futur mérite le meilleur accompagnement possible."
        ]
    };
    return {
        courseEncouragement: messages.courseEncouragement[Math.floor(Math.random() * messages.courseEncouragement.length)],
        packValue: messages.packValue[Math.floor(Math.random() * messages.packValue.length)],
        motivation: messages.motivation[Math.floor(Math.random() * messages.motivation.length)]
    };
};
}),
"[project]/Science-Made-Simple-Kiro/src/hooks/useCreditSystem.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreditSystem",
    ()=>useCreditSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const useCreditSystem = (initialCredits = 12)=>{
    const [credits, setCredits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialCredits);
    const [showLowCreditWarning, setShowLowCreditWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [movements, setMovements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: '1',
            type: 'gain',
            amount: 2,
            reason: 'Bonus de progression - Quiz Mathématiques terminé',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
            id: '2',
            type: 'spend',
            amount: 1,
            reason: 'Cours "Physique pour Ingénieurs" débloqué',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            courseId: 'physics-eng'
        },
        {
            id: '3',
            type: 'gain',
            amount: 1,
            reason: 'Connexion quotidienne - Bonus fidélité',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        }
    ]);
    const [showAnimation, setShowAnimation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Dépenser des crédits
    const spendCredits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((amount, reason, courseId)=>{
        if (credits < amount) {
            return false; // Pas assez de crédits
        }
        setCredits((prev)=>prev - amount);
        const newMovement = {
            id: Date.now().toString(),
            type: 'spend',
            amount,
            reason,
            timestamp: new Date(),
            courseId
        };
        setMovements((prev)=>[
                newMovement,
                ...prev
            ]);
        setShowAnimation({
            type: 'spend',
            amount
        });
        // Vérifier si les crédits sont faibles après la dépense
        const newCreditAmount = credits - amount;
        if (newCreditAmount <= 5 && newCreditAmount > 0) {
            setTimeout(()=>{
                setShowLowCreditWarning(true);
            }, 2000); // Afficher après l'animation de dépense
        }
        // Masquer l'animation après un délai
        setTimeout(()=>setShowAnimation(null), 1500);
        return true; // Succès
    }, [
        credits
    ]);
    // Gagner des crédits
    const gainCredits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((amount, reason)=>{
        setCredits((prev)=>prev + amount);
        const newMovement = {
            id: Date.now().toString(),
            type: 'gain',
            amount,
            reason,
            timestamp: new Date()
        };
        setMovements((prev)=>[
                newMovement,
                ...prev
            ]);
        setShowAnimation({
            type: 'gain',
            amount
        });
        // Masquer l'animation après un délai
        setTimeout(()=>setShowAnimation(null), 1500);
    }, []);
    // Générer des suggestions personnalisées
    const getSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const suggestions = [];
        if (credits >= 3) {
            suggestions.push("Avec tes 3+ crédits, tu peux débloquer une série complète en Sciences pour construire une base solide.");
        } else if (credits >= 2) {
            suggestions.push("Tes 2 crédits te permettent de choisir 2 cours complémentaires pour renforcer tes compétences.");
        } else if (credits === 1) {
            suggestions.push("Avec ton crédit restant, concentre-toi sur le cours qui t'apportera le plus de valeur immédiate.");
        } else {
            suggestions.push("Termine tes cours actuels pour gagner de nouveaux crédits et débloquer plus de contenu !");
        }
        // Suggestions basées sur l'historique
        const recentSpends = movements.filter((m)=>m.type === 'spend').slice(0, 3);
        if (recentSpends.length > 0) {
            suggestions.push("Basé sur tes derniers choix, nous recommandons de continuer dans la même thématique pour approfondir tes connaissances.");
        }
        return suggestions;
    }, [
        credits,
        movements
    ]);
    return {
        credits,
        movements,
        showAnimation,
        showModal,
        setShowModal,
        showLowCreditWarning,
        setShowLowCreditWarning,
        spendCredits,
        gainCredits,
        getSuggestions,
        canAfford: (amount)=>credits >= amount
    };
};
}),
"[project]/Science-Made-Simple-Kiro/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$components$2f$SimpleLanding$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/src/components/SimpleLanding.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$components$2f$SimpleDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/src/components/SimpleDashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Science-Made-Simple-Kiro/src/lib/mock-data.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function Home() {
    const [dashboardData, setDashboardData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockDashboardData"]);
    const [showApp, setShowApp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleUpdateCourseOrder = (courseId, newIndex)=>{
        console.log(`Reordering course ${courseId} to position ${newIndex}`);
    // Ici vous pourriez faire un appel API pour sauvegarder l'ordre
    };
    const handleToggleCourseFavorite = (courseId)=>{
        console.log(`Toggling favorite for course ${courseId}`);
        // Simulation de la mise à jour
        setDashboardData((prevData)=>{
            const updatedCourses = prevData.primaryCourses.concat(prevData.suggestedCourses.map((s)=>s.course)).map((course)=>{
                if (course.id === courseId) {
                    return {
                        ...course,
                        isPrimary: !course.isPrimary
                    };
                }
                return course;
            });
            return {
                ...prevData,
                primaryCourses: updatedCourses.filter((course)=>course.isPrimary),
                suggestedCourses: prevData.suggestedCourses.map((suggestion)=>({
                        ...suggestion,
                        course: updatedCourses.find((course)=>course.id === suggestion.course.id) || suggestion.course
                    })).filter((suggestion)=>!suggestion.course.isPrimary)
            };
        });
    };
    const handlePreviewCourse = (courseId)=>{
        console.log(`Opening preview for course ${courseId}`);
    // Ici vous ouvririez un modal de preview ou navigueriez vers la page de preview
    };
    const handleEnrollCourse = (courseId)=>{
        console.log(`Enrolling in course ${courseId}`);
        // Simulation de l'inscription
        setDashboardData((prevData)=>{
            const enrolledCourse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enrollInCourse"])(courseId);
            if (!enrolledCourse) return prevData;
            const updatedCourses = prevData.primaryCourses.concat(prevData.suggestedCourses.map((s)=>s.course)).map((course)=>{
                if (course.id === courseId) {
                    return enrolledCourse;
                }
                return course;
            });
            return {
                ...prevData,
                primaryCourses: updatedCourses.filter((course)=>course.isPrimary),
                suggestedCourses: prevData.suggestedCourses.filter((suggestion)=>suggestion.course.id !== courseId)
            };
        });
    };
    if (!showApp) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$components$2f$SimpleLanding$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SimpleLanding"], {
            onEnterApp: ()=>setShowApp(true)
        }, void 0, false, {
            fileName: "[project]/Science-Made-Simple-Kiro/src/app/page.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Science$2d$Made$2d$Simple$2d$Kiro$2f$src$2f$components$2f$SimpleDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SimpleDashboard"], {
        data: dashboardData,
        onUpdateCourseOrder: handleUpdateCourseOrder,
        onToggleCourseFavorite: handleToggleCourseFavorite,
        onPreviewCourse: handlePreviewCourse,
        onEnrollCourse: handleEnrollCourse
    }, void 0, false, {
        fileName: "[project]/Science-Made-Simple-Kiro/src/app/page.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Science-Made-Simple-Kiro_src_6d474b22._.js.map