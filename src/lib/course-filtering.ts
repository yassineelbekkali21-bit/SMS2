import { CourseWithTrend } from './faculty-sorting';

// Types pour les filtres
export type SubjectFilter = 'all' | 'physics' | 'chemistry' | 'mathematics' | 'biology';
export type TrendFilter = 'popular' | 'new' | 'recommended';
export type SocialFilter = 'buddies' | 'most-followed' | 'not-followed';
export type SortOption = 'students' | 'lessons' | 'date' | 'name';

export interface FilterState {
  subjects: SubjectFilter[];
  trends: TrendFilter[];
  social: SocialFilter[];
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export interface FilterOption {
  id: string;
  label: string;
  emoji?: string;
  count?: number;
}

// Configuration des filtres
export const FILTER_CONFIG = {
  subjects: [
    { id: 'all', label: 'Tout', emoji: '📚' },
    { id: 'physics', label: 'Physique', emoji: '⚛️' },
    { id: 'chemistry', label: 'Chimie', emoji: '🧪' },
    { id: 'mathematics', label: 'Mathématiques', emoji: '📊' },
    { id: 'biology', label: 'Biologie', emoji: '🧬' }
  ] as FilterOption[],
  
  trends: [
    { id: 'popular', label: 'Populaires', emoji: '🔥' },
    { id: 'new', label: 'Nouveaux', emoji: '🧠' },
    { id: 'recommended', label: 'Recommandés', emoji: '🎯' }
  ] as FilterOption[],
  
  social: [
    { id: 'buddies', label: 'Suivis par mes buddies', emoji: '👥' },
    { id: 'most-followed', label: 'Les plus suivis', emoji: '📈' },
    { id: 'not-followed', label: 'Non suivis encore', emoji: '💡' }
  ] as FilterOption[],
  
  sorting: [
    { id: 'students', label: 'Nombre d\'étudiants' },
    { id: 'lessons', label: 'Nombre de leçons' },
    { id: 'date', label: 'Date d\'ajout' },
    { id: 'name', label: 'Nom du cours (A-Z)' }
  ] as FilterOption[]
};

// Fonction pour déterminer la matière d'un cours
function getCourseSubject(course: CourseWithTrend): SubjectFilter {
  const courseId = course.id.toLowerCase();
  const title = course.title.toLowerCase();
  
  // Physique
  if (courseId.includes('force') || courseId.includes('gauss') || courseId.includes('electro') || 
      title.includes('force') || title.includes('gauss') || title.includes('électro') || 
      title.includes('mouvement') || title.includes('physique')) {
    return 'physics';
  }
  
  // Chimie
  if (courseId.includes('equilibre') || courseId.includes('chimie') || 
      title.includes('équilibre') || title.includes('chimie') || title.includes('réaction')) {
    return 'chemistry';
  }
  
  // Mathématiques
  if (courseId.includes('integral') || courseId.includes('math') || courseId.includes('calcul') ||
      title.includes('intégrale') || title.includes('mathématique') || title.includes('calcul')) {
    return 'mathematics';
  }
  
  // Biologie par défaut pour les autres
  return 'biology';
}

// Fonction pour vérifier si un cours est suivi par des buddies (mock)
function isFollowedByBuddies(course: CourseWithTrend): boolean {
  // Mock: basé sur l'ID du cours pour la cohérence
  const hash = course.id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return Math.abs(hash) % 3 === 0; // ~33% des cours sont suivis par des buddies
}

// Fonction principale de filtrage
export function filterAndSortCourses(
  courses: CourseWithTrend[],
  filters: FilterState
): CourseWithTrend[] {
  let filteredCourses = [...courses];

  // Filtrage par matière
  if (!filters.subjects.includes('all') && filters.subjects.length > 0) {
    filteredCourses = filteredCourses.filter(course => 
      filters.subjects.includes(getCourseSubject(course))
    );
  }

  // Filtrage par tendance
  if (filters.trends.length > 0) {
    filteredCourses = filteredCourses.filter(course => {
      if (filters.trends.includes('popular') && course.trendBadge === 'popular') return true;
      if (filters.trends.includes('new') && course.trendBadge === 'new') return true;
      if (filters.trends.includes('recommended') && course.trendBadge === 'recommended') return true;
      return false;
    });
  }

  // Filtrage par activité sociale
  if (filters.social.length > 0) {
    filteredCourses = filteredCourses.filter(course => {
      const followedByBuddies = isFollowedByBuddies(course);
      const studentCount = course.studentCount || 0;
      
      if (filters.social.includes('buddies') && followedByBuddies) return true;
      if (filters.social.includes('most-followed') && studentCount >= 100) return true;
      if (filters.social.includes('not-followed') && studentCount < 50) return true;
      return false;
    });
  }

  // Tri
  filteredCourses.sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'students':
        comparison = (b.studentCount || 0) - (a.studentCount || 0);
        break;
      case 'lessons':
        comparison = (b.totalLessons || 0) - (a.totalLessons || 0);
        break;
      case 'date':
        // Mock: tri par ID comme proxy de la date
        comparison = b.id.localeCompare(a.id);
        break;
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        comparison = 0;
    }
    
    return filters.sortOrder === 'desc' ? comparison : -comparison;
  });

  return filteredCourses;
}

// Fonction pour compter les cours par filtre
export function getFilterCounts(courses: CourseWithTrend[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  // Compter par matière
  FILTER_CONFIG.subjects.forEach(subject => {
    if (subject.id === 'all') {
      counts[subject.id] = courses.length;
    } else {
      counts[subject.id] = courses.filter(course => 
        getCourseSubject(course) === subject.id
      ).length;
    }
  });
  
  // Compter par tendance
  FILTER_CONFIG.trends.forEach(trend => {
    counts[trend.id] = courses.filter(course => 
      course.trendBadge === trend.id
    ).length;
  });
  
  // Compter par activité sociale
  counts['buddies'] = courses.filter(course => isFollowedByBuddies(course)).length;
  counts['most-followed'] = courses.filter(course => (course.studentCount || 0) >= 100).length;
  counts['not-followed'] = courses.filter(course => (course.studentCount || 0) < 50).length;
  
  return counts;
}
