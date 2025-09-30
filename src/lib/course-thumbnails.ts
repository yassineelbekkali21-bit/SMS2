/**
 * Service de gestion des illustrations de cours par matière
 * Mappe automatiquement les illustrations selon la faculté/matière du cours
 */

export interface SubjectThumbnail {
  subject: string;
  thumbnail: string;
  scientist: string;
  description: string;
}

// Configuration des illustrations par matière
export const SUBJECT_THUMBNAILS: SubjectThumbnail[] = [
  {
    subject: 'Mathématiques',
    thumbnail: '/course-thumbnails/mathematics-gauss.png',
    scientist: 'Carl Friedrich Gauss',
    description: 'Le prince des mathématiques'
  },
  {
    subject: 'Physique',
    thumbnail: '/course-thumbnails/physics-einstein.png',
    scientist: 'Albert Einstein',
    description: 'Théorie de la relativité et physique moderne'
  },
  {
    subject: 'Statistiques',
    thumbnail: '/course-thumbnails/statistics-fisher.png',
    scientist: 'Ronald Fisher',
    description: 'Père de la statistique moderne'
  },
  {
    subject: 'Chimie',
    thumbnail: '/course-thumbnails/chemistry-curie.png',
    scientist: 'Marie Curie',
    description: 'Pionnière de la radioactivité'
  },
  {
    subject: 'Biologie',
    thumbnail: '/course-thumbnails/biology-franklin.png',
    scientist: 'Rosalind Franklin',
    description: 'Découverte de la structure de l\'ADN'
  }
];

// Mots-clés pour identifier les matières dans les titres de cours
const SUBJECT_KEYWORDS = {
  'Mathématiques': [
    'mathématiques', 'maths', 'math', 'algèbre', 'géométrie', 'calcul', 
    'analyse', 'arithmétique', 'trigonométrie', 'logarithme', 'exponentielle',
    'dérivée', 'intégrale', 'limite', 'suite', 'série', 'équation', 'fonction',
    'gauss', 'loi de gauss', 'distribution', 'probabilité'
  ],
  'Physique': [
    'physique', 'mécanique', 'thermodynamique', 'électricité', 'magnétisme',
    'optique', 'acoustique', 'relativité', 'quantique', 'électromagnétisme',
    'électrostatique', 'dynamique', 'cinématique', 'énergie', 'force',
    'champ électrique', 'potentiel', 'einstein', 'newton', 'maxwell'
  ],
  'Statistiques': [
    'statistiques', 'stats', 'probabilités', 'échantillonnage', 'régression',
    'corrélation', 'variance', 'écart-type', 'moyenne', 'médiane', 'mode',
    'distribution', 'test', 'hypothèse', 'fisher', 'student', 'chi-deux',
    'anova', 'bayésien', 'fréquentiste'
  ],
  'Chimie': [
    'chimie', 'chimique', 'molécule', 'atome', 'réaction', 'équilibre',
    'acide', 'base', 'ph', 'oxydation', 'réduction', 'catalyse', 'synthèse',
    'organique', 'inorganique', 'analytique', 'physico-chimique', 'curie',
    'radioactivité', 'isotope', 'liaison', 'cristallographie'
  ],
  'Biologie': [
    'biologie', 'biologique', 'cellule', 'adn', 'arn', 'génétique', 'gène',
    'protéine', 'enzyme', 'métabolisme', 'photosynthèse', 'respiration',
    'mitose', 'méiose', 'évolution', 'darwin', 'mendel', 'franklin',
    'watson', 'crick', 'organisme', 'écosystème', 'biodiversité',
    'anatomie', 'physiologie', 'microbiologie', 'immunologie', 'neurobiologie',
    'biochimie', 'biophysique', 'biotechnologie', 'génomique', 'protéomique'
  ]
};

/**
 * Détermine la matière d'un cours basé sur son titre et sa faculté
 */
export function detectCourseSubject(courseTitle: string, courseFaculty?: string): string | null {
  const searchText = `${courseTitle} ${courseFaculty || ''}`.toLowerCase();
  
  // Recherche par mots-clés dans l'ordre de priorité
  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return subject;
      }
    }
  }
  
  return null;
}

/**
 * Obtient l'illustration appropriée pour un cours
 */
export function getCourseThumbnail(courseTitle: string, courseFaculty?: string, courseId?: string): string | undefined {
  // Cas spéciaux par ID de cours (pour compatibilité avec l'existant)
  if (courseId === 'course-gauss' || courseId === 'loi-gauss') {
    return '/course-thumbnails/loi-de-gauss.png';
  }
  
  // Détection automatique par matière
  const subject = detectCourseSubject(courseTitle, courseFaculty);
  if (subject) {
    const thumbnailConfig = SUBJECT_THUMBNAILS.find(config => config.subject === subject);
    return thumbnailConfig?.thumbnail;
  }
  
  return undefined;
}

/**
 * Obtient les informations complètes sur l'illustration d'un cours
 */
export function getCourseThumbnailInfo(courseTitle: string, courseFaculty?: string, courseId?: string): SubjectThumbnail | null {
  const subject = detectCourseSubject(courseTitle, courseFaculty);
  if (subject) {
    return SUBJECT_THUMBNAILS.find(config => config.subject === subject) || null;
  }
  
  return null;
}

/**
 * Vérifie si une illustration existe pour une matière donnée
 */
export function hasSubjectThumbnail(subject: string): boolean {
  return SUBJECT_THUMBNAILS.some(config => config.subject === subject);
}

/**
 * Liste toutes les matières supportées
 */
export function getSupportedSubjects(): string[] {
  return SUBJECT_THUMBNAILS.map(config => config.subject);
}
