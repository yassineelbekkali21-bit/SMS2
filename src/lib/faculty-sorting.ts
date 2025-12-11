import { Course } from '@/types';

// Types pour les badges de tendance
export type TrendBadge = 'popular' | 'recommended' | 'new' | null;

export interface CourseWithTrend extends Course {
  studentCount?: number;
  isRecommended?: boolean;
  isNew?: boolean;
  createdAt?: Date;
  trendBadge?: TrendBadge;
}

// Configuration pour le tri intelligent
const SORTING_CONFIG = {
  NEW_COURSE_THRESHOLD_DAYS: 30,
  POPULAR_THRESHOLD: 50, // Nombre minimum d'étudiants pour être "populaire"
  FAIR_VISIBILITY_SLOTS: 2, // Nombre de slots réservés aux cours moins populaires
  MAX_DISPLAY: 12 // Nombre maximum de cours affichés
};

// Fonction pour générer un nombre d'étudiants pseudo-aléatoire basé sur l'ID du cours
function generateStudentCount(courseId: string): number {
  if (!courseId || typeof courseId !== 'string') {
    console.error('🚨 generateStudentCount: courseId is invalid:', courseId);
    return 50; // Valeur par défaut
  }
  
  const hash = courseId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Générer un nombre entre 15 et 200 étudiants
  return Math.abs(hash) % 185 + 15;
}

// Fonction pour déterminer si un cours est "nouveau"
function isCourseNew(course: Course): boolean {
  if (course.createdAt) {
    const daysSinceCreation = (Date.now() - course.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= SORTING_CONFIG.NEW_COURSE_THRESHOLD_DAYS;
  }
  
  // Pour les cours sans date, considérer certains comme "nouveaux" basé sur l'ID
  const newCourseIds = ['course-thermodynamique', 'course-quantique', 'course-relativite'];
  return newCourseIds.includes(course.id);
}

// Fonction pour déterminer si un cours est "recommandé"
function isCourseRecommended(course: Course): boolean {
  // Cours recommandés par la faculté (basé sur la qualité pédagogique)
  const recommendedCourseIds = ['course-equilibres', 'course-gauss', 'course-forces'];
  return recommendedCourseIds.includes(course.id);
}

// Fonction pour déterminer le badge de tendance
function getTrendBadge(course: CourseWithTrend): TrendBadge {
  // Priorité : Populaire > Recommandé > Nouveau
  if (course.studentCount && course.studentCount >= SORTING_CONFIG.POPULAR_THRESHOLD) {
    return 'popular';
  }
  
  if (course.isRecommended) {
    return 'recommended';
  }
  
  if (course.isNew) {
    return 'new';
  }
  
  return null;
}

// Fonction principale de tri intelligent
export function smartSortFacultyCourses(courses: Course[]): CourseWithTrend[] {
  // Enrichir les cours avec les données de tendance
  const enrichedCourses: CourseWithTrend[] = courses.map(course => {
    const studentCount = generateStudentCount(course.id);
    const isNew = isCourseNew(course);
    const isRecommended = isCourseRecommended(course);
    
    const enrichedCourse: CourseWithTrend = {
      ...course,
      studentCount,
      isNew,
      isRecommended,
      trendBadge: getTrendBadge({ ...course, studentCount, isNew, isRecommended })
    };
    
    return enrichedCourse;
  });

  // Séparer les cours populaires des moins populaires
  const popularCourses = enrichedCourses.filter(course => 
    course.studentCount! >= SORTING_CONFIG.POPULAR_THRESHOLD
  );
  
  const lesserCourses = enrichedCourses.filter(course => 
    course.studentCount! < SORTING_CONFIG.POPULAR_THRESHOLD
  );

  // Trier les cours populaires
  const sortedPopularCourses = popularCourses.sort((a, b) => {
    // 1. Priorité aux recommandés
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    
    // 2. Boost pour les nouveaux cours
    const aScore = (a.studentCount || 0) + (a.isNew ? 25 : 0);
    const bScore = (b.studentCount || 0) + (b.isNew ? 25 : 0);
    
    return bScore - aScore;
  });

  // Trier les cours moins populaires
  const sortedLesserCourses = lesserCourses.sort((a, b) => {
    // Priorité aux nouveaux et recommandés
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    
    return (b.studentCount || 0) - (a.studentCount || 0);
  });

  // Mécanisme de Fair Visibility : mélanger quelques cours moins populaires
  const fairVisibilitySlots = Math.min(SORTING_CONFIG.FAIR_VISIBILITY_SLOTS, sortedLesserCourses.length);
  const selectedLesserCourses = [];
  
  // Sélection semi-aléatoire des cours moins populaires à mettre en avant
  for (let i = 0; i < fairVisibilitySlots; i++) {
    const randomIndex = Math.floor(Math.random() * Math.min(sortedLesserCourses.length, 5)); // Parmi les 5 meilleurs des moins populaires
    const selectedCourse = sortedLesserCourses.splice(randomIndex, 1)[0];
    if (selectedCourse) {
      selectedLesserCourses.push(selectedCourse);
    }
  }

  // Combiner les résultats : populaires + fair visibility + reste des moins populaires
  const finalResults = [
    ...sortedPopularCourses,
    ...selectedLesserCourses,
    ...sortedLesserCourses
  ].slice(0, SORTING_CONFIG.MAX_DISPLAY);

  return finalResults;
}

// Fonction pour obtenir le texte et style du badge
export function getBadgeInfo(badge: TrendBadge): { text: string; emoji: string; bgColor: string; textColor: string } | null {
  switch (badge) {
    case 'popular':
      return {
        text: 'Populaire',
        emoji: '🔥',
        bgColor: 'bg-gray-50/90',
        textColor: 'text-gray-700'
      };
    case 'recommended':
      return {
        text: 'Recommandé',
        emoji: '🎯',
        bgColor: 'bg-blue-50/90',
        textColor: 'text-blue-700'
      };
    case 'new':
      return {
        text: 'Nouveau',
        emoji: '🧠',
        bgColor: 'bg-green-50/90',
        textColor: 'text-green-700'
      };
    default:
      return null;
  }
}
