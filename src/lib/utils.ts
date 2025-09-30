import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ========================================================================
// UTILITIES POUR SCIENCE MADE SIMPLE
// ========================================================================

/**
 * Formate la durée en format lisible
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) {
    return `${mins}m`
  }
  
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

/**
 * Calcule le pourcentage de progression
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

/**
 * Génère une couleur de progression basée sur le pourcentage
 */
export function getProgressColor(progress: number): string {
  if (progress < 25) return "bg-red-500"
  if (progress < 50) return "bg-orange-500"
  if (progress < 75) return "bg-yellow-500"
  return "bg-green-500"
}

/**
 * Formate le rang de l'étudiant
 */
export function formatRank(rank: number, total: number): string {
  return `#${rank}/${total}`
}

/**
 * Détermine si un cours doit être affiché comme "populaire"
 */
export function isPopularCourse(enrolledStudents: number, averageProgress: number): boolean {
  return enrolledStudents > 50 && averageProgress > 60
}

/**
 * Génère un message de motivation basé sur la progression
 */
export function getMotivationMessage(progress: number, facultyAverage: number): string {
  if (progress > facultyAverage + 10) {
    return "Excellent ! Vous êtes au-dessus de la moyenne ! 🚀"
  }
  if (progress > facultyAverage) {
    return "Bon travail ! Continuez sur cette lancée ! 💪"
  }
  if (progress < facultyAverage - 20) {
    return "Il est temps de rattraper ! Vous pouvez le faire ! 🔥"
  }
  return "Vous progressez bien ! Gardez le rythme ! ⭐"
}

/**
 * Calcule le temps estimé pour terminer un cours
 */
export function estimateCompletionTime(
  totalLessons: number,
  completedLessons: number,
  averageLessonDuration: number
): string {
  const remainingLessons = totalLessons - completedLessons
  const totalMinutes = remainingLessons * averageLessonDuration
  
  return formatDuration(totalMinutes)
}

/**
 * Formate une date relative (il y a X jours)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return "Aujourd'hui"
  if (diffInDays === 1) return "Hier"
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`
  
  return date.toLocaleDateString('fr-FR')
}

/**
 * Génère des couleurs pour les tags/catégories
 */
export function getTagColor(tag: string): string {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-orange-100 text-orange-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ]
  
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Génère un slug à partir d'un titre
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Détermine le niveau de difficulté d'un quiz
 */
export function getDifficultyLabel(difficulty: 'easy' | 'medium' | 'hard'): {
  label: string;
  color: string;
  icon: string;
} {
  switch (difficulty) {
    case 'easy':
      return { label: 'Facile', color: 'text-green-600', icon: '🟢' }
    case 'medium':
      return { label: 'Moyen', color: 'text-orange-600', icon: '🟡' }
    case 'hard':
      return { label: 'Difficile', color: 'text-red-600', icon: '🔴' }
  }
}
