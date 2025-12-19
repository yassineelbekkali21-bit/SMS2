import { Lesson, Course, CoursePack } from '@/types';
import { getCoursePacks } from './mock-data';

// Mapping des leçons vers leurs cours et packs recommandés
export const getLessonRecommendations = (lesson: Lesson) => {
  const coursePacks = getCoursePacks();
  
  // Trouve le cours correspondant basé sur le courseId de la leçon
  const getRelatedCourse = (): Course => {
    // Mapping basé sur les IDs de cours
    const courseMapping: Record<string, Course> = {
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
        tags: ['mathématiques', 'analyse', 'dérivées']
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
        tags: ['physique', 'mécanique', 'thermodynamique']
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
        tags: ['chimie', 'liaisons', 'réactions']
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
        tags: ['statistiques', 'probabilités', 'analyse']
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
        tags: ['économie', 'marchés', 'microéconomie']
      }
    };

    return courseMapping[lesson.courseId] || courseMapping['1'];
  };

  // Trouve le pack recommandé basé sur le contenu de la leçon
  const getRecommendedPack = (): CoursePack => {
    // Logique de recommandation basée sur les matières
    if (lesson.courseId === '1' || lesson.courseId === '4') {
      // Mathématiques ou Statistiques → Pack Mathématiques
      return coursePacks.find(pack => pack.id === 'pack-mathematics') || coursePacks[0];
    }
    
    if (lesson.courseId === '2') {
      // Physique → Pack Physique
      return coursePacks.find(pack => pack.id === 'pack-physics') || coursePacks[0];
    }
    
    if (lesson.courseId === '3') {
      // Chimie → Pack Chimie
      return coursePacks.find(pack => pack.id === 'pack-chemistry') || coursePacks[0];
    }
    
    // Par défaut, recommander le pack Physique
    return coursePacks.find(pack => pack.id === 'pack-physics') || coursePacks[0];
  };

  return {
    relatedCourse: getRelatedCourse(),
    recommendedPack: getRecommendedPack()
  };
};

// Messages pédagogiques contextuels
export const getContextualMessage = (lesson: Lesson, course: Course, pack: CoursePack) => {
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

// Calcule la valeur ajoutée du pack
export const calculatePackValue = (pack: CoursePack) => {
  const baseValue = pack.originalCreditCost;
  const actualCost = pack.creditCost;
  const savings = baseValue - actualCost;
  
  return {
    savings,
    percentageSave: Math.round((savings / baseValue) * 100),
    bonusContent: pack.features.length - pack.courses.length, // Nombre de features bonus
    valueProposition: `${savings} crédits de contenu bonus inclus`
  };
};

// Détermine le niveau de recommandation
export const getRecommendationLevel = (lesson: Lesson) => {
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

// Recommandations pour les cours (similaire aux leçons mais spécifique aux cours)
export const getCourseRecommendations = (course: Course) => {
  const coursePacks = getCoursePacks();
  
  // Mapping cours -> pack recommandé basé sur la matière et le niveau
  const getRecommendedPack = (): CoursePack => {
    // Mathématiques et Statistiques → Pack Mathématiques
    if (course.id === '1' || course.id === '4' || course.title.toLowerCase().includes('math') || course.title.toLowerCase().includes('intégral') || course.title.toLowerCase().includes('algèbre')) {
      return coursePacks.find(pack => pack.id === 'pack-mathematics') || coursePacks[0];
    }
    
    // Physique → Pack Physique
    if (course.id === '2' || course.title.toLowerCase().includes('physique') || course.title.toLowerCase().includes('gauss') || course.title.toLowerCase().includes('force') || course.title.toLowerCase().includes('mécan')) {
      return coursePacks.find(pack => pack.id === 'pack-physics') || coursePacks[0];
    }
    
    // Chimie → Pack Chimie
    if (course.id === '3' || course.title.toLowerCase().includes('chimie') || course.title.toLowerCase().includes('équilibre')) {
      return coursePacks.find(pack => pack.id === 'pack-chemistry') || coursePacks[0];
    }
    
    // Par défaut → Pack Physique
    return coursePacks.find(pack => pack.id === 'pack-physics') || coursePacks[0];
  };

  // Pack alternatif pour donner le choix
  const getAlternativePack = (mainPack: CoursePack): CoursePack => {
    // Proposer un pack différent
    if (mainPack.id === 'pack-physics') {
      return coursePacks.find(pack => pack.id === 'pack-mathematics') || coursePacks[0];
    }
    if (mainPack.id === 'pack-mathematics') {
      return coursePacks.find(pack => pack.id === 'pack-physics') || coursePacks[0];
    }
    return coursePacks.find(pack => pack.id === 'pack-physics') || coursePacks[0];
  };

  const recommendedPack = getRecommendedPack();
  const alternativePack = getAlternativePack(recommendedPack);

  return {
    recommendedPack,
    alternativePack
  };
};

// Messages contextuels pour courses (adaptation des messages de leçons)
export const getCourseContextualMessage = (course: Course, pack: CoursePack) => {
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
