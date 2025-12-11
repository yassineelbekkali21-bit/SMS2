// Données mock pour les buddies suivant les cours
export interface Buddy {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
  courseProgress: number;
  joinedRecently?: boolean;
}

// Avatars générés avec DiceBear API pour la cohérence
const generateAvatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&size=64`;

// Base de buddies mock
const mockBuddies: Buddy[] = [
  {
    id: 'buddy-1',
    name: 'Sophie Laurent',
    avatar: generateAvatar('sophie'),
    isActive: true,
    courseProgress: 75
  },
  {
    id: 'buddy-2', 
    name: 'Alex Moreau',
    avatar: generateAvatar('alex'),
    isActive: false,
    courseProgress: 45
  },
  {
    id: 'buddy-3',
    name: 'Léa Martinez',
    avatar: generateAvatar('lea'),
    isActive: true,
    courseProgress: 90,
    joinedRecently: true
  },
  {
    id: 'buddy-4',
    name: 'Thomas Dubois',
    avatar: generateAvatar('thomas'),
    isActive: false,
    courseProgress: 30
  },
  {
    id: 'buddy-5',
    name: 'Emma Bernard',
    avatar: generateAvatar('emma'),
    isActive: true,
    courseProgress: 60,
    joinedRecently: true
  },
  {
    id: 'buddy-6',
    name: 'Lucas Petit',
    avatar: generateAvatar('lucas'),
    isActive: false,
    courseProgress: 85
  },
  {
    id: 'buddy-7',
    name: 'Chloé Martin',
    avatar: generateAvatar('chloe'),
    isActive: true,
    courseProgress: 25
  }
];

// Fonction pour obtenir les buddies suivant un cours spécifique
export function getBuddiesForCourse(courseId: string): Buddy[] {
  // Générer une liste pseudo-aléatoire basée sur l'ID du cours
  const hash = courseId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const buddyCount = Math.abs(hash) % 5 + 1; // Entre 1 et 5 buddies par cours
  const startIndex = Math.abs(hash) % (mockBuddies.length - buddyCount);
  
  return mockBuddies.slice(startIndex, startIndex + buddyCount);
}

// Fonction pour vérifier si un cours a des buddies
export function hasBuddiesForCourse(courseId: string): boolean {
  return getBuddiesForCourse(courseId).length > 0;
}


