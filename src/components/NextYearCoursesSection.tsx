'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  ArrowRight,
  BookOpen,
  Users,
  Star,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Course } from '@/types';
import { GaussStyleCard } from './GaussStyleCard';

interface NextYearCourse {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  difficulty: 'Facile' | 'Intermédiaire' | 'Avancé';
  estimatedHours: number;
  enrolledStudents: number; // Nombre d'étudiants qui suivent ce cours
  category: string;
  isHighPriority?: boolean;
}

interface NextYearCoursesSectionProps {
  facultyName: string;
  currentYear: number;
  onCourseClick: (courseId: string) => void;
}

// Données mockées des cours de l'année prochaine basées sur la faculté
const getNextYearCourses = (facultyName: string, currentYear: number): NextYearCourse[] => {
  // Logique simplifiée - en production, cela viendrait d'une API
  const coursesByFaculty: Record<string, NextYearCourse[]> = {
    'Sciences': [
      {
        id: 'advanced-calculus',
        title: 'Calcul Avancé',
        description: 'Intégrales multiples, séries de Fourier et équations différentielles',
        lessonCount: 24,
        difficulty: 'Avancé',
        estimatedHours: 45,
        enrolledStudents: 1247,
        category: 'Mathématiques',
        isHighPriority: true
      },
      {
        id: 'quantum-physics',
        title: 'Physique Quantique',
        description: 'Mécanique quantique et applications modernes',
        lessonCount: 28,
        difficulty: 'Avancé',
        estimatedHours: 52,
        enrolledStudents: 892,
        category: 'Physique',
        isHighPriority: true
      },
      {
        id: 'organic-chemistry',
        title: 'Chimie Organique',
        description: 'Réactions et mécanismes en chimie organique',
        lessonCount: 22,
        difficulty: 'Intermédiaire',
        estimatedHours: 38,
        enrolledStudents: 1156,
        category: 'Chimie'
      },
      {
        id: 'statistical-analysis',
        title: 'Analyse Statistique',
        description: 'Statistiques avancées et analyse de données',
        lessonCount: 20,
        difficulty: 'Intermédiaire',
        estimatedHours: 35,
        enrolledStudents: 834,
        category: 'Statistiques'
      },
      {
        id: 'molecular-biology',
        title: 'Biologie Moléculaire',
        description: 'ADN, ARN et mécanismes cellulaires',
        lessonCount: 26,
        difficulty: 'Avancé',
        estimatedHours: 42,
        enrolledStudents: 798,
        category: 'Biologie'
      },
      {
        id: 'thermodynamics',
        title: 'Thermodynamique',
        description: 'Lois thermodynamiques et applications',
        lessonCount: 18,
        difficulty: 'Intermédiaire',
        estimatedHours: 32,
        enrolledStudents: 923,
        category: 'Physique'
      },
      {
        id: 'linear-algebra-advanced',
        title: 'Algèbre Linéaire Avancée',
        description: 'Espaces vectoriels et transformations linéaires',
        lessonCount: 21,
        difficulty: 'Avancé',
        estimatedHours: 40,
        enrolledStudents: 1089,
        category: 'Mathématiques'
      },
      {
        id: 'research-methods',
        title: 'Méthodes de Recherche',
        description: 'Méthodologie scientifique et rédaction',
        lessonCount: 16,
        difficulty: 'Intermédiaire',
        estimatedHours: 28,
        enrolledStudents: 1203,
        category: 'Méthodologie'
      },
      {
        id: 'computational-physics',
        title: 'Physique Computationnelle',
        description: 'Simulation numérique et modélisation',
        lessonCount: 25,
        difficulty: 'Avancé',
        estimatedHours: 48,
        enrolledStudents: 672,
        category: 'Physique'
      }
    ],
    'Médecine': [
      {
        id: 'advanced-anatomy',
        title: 'Anatomie Avancée',
        description: 'Anatomie systémique et clinique',
        lessonCount: 32,
        difficulty: 'Avancé',
        estimatedHours: 60,
        enrolledStudents: 487,
        category: 'Anatomie',
        isHighPriority: true
      },
      {
        id: 'pathophysiology',
        title: 'Physiopathologie',
        description: 'Mécanismes des maladies',
        lessonCount: 28,
        difficulty: 'Avancé',
        estimatedHours: 55,
        enrolledStudents: 456,
        category: 'Pathologie',
        isHighPriority: true
      },
      {
        id: 'pharmacology',
        title: 'Pharmacologie',
        description: 'Médicaments et interactions',
        lessonCount: 24,
        difficulty: 'Avancé',
        estimatedHours: 45,
        enrolledStudents: 423,
        category: 'Pharmacologie'
      },
      {
        id: 'clinical-diagnosis',
        title: 'Diagnostic Clinique',
        description: 'Méthodes diagnostiques et examens',
        lessonCount: 26,
        difficulty: 'Avancé',
        estimatedHours: 50,
        enrolledStudents: 398,
        category: 'Clinique'
      },
      {
        id: 'medical-imaging',
        title: 'Imagerie Médicale',
        description: 'Radiologie et techniques d\'imagerie',
        lessonCount: 22,
        difficulty: 'Intermédiaire',
        estimatedHours: 40,
        enrolledStudents: 312,
        category: 'Imagerie'
      },
      {
        id: 'emergency-medicine',
        title: 'Médecine d\'Urgence',
        description: 'Prise en charge des urgences',
        lessonCount: 20,
        difficulty: 'Avancé',
        estimatedHours: 38,
        enrolledStudents: 345,
        category: 'Urgences'
      },
      {
        id: 'medical-ethics',
        title: 'Éthique Médicale',
        description: 'Déontologie et bioéthique',
        lessonCount: 14,
        difficulty: 'Intermédiaire',
        estimatedHours: 25,
        enrolledStudents: 367,
        category: 'Éthique'
      },
      {
        id: 'surgery-basics',
        title: 'Bases de Chirurgie',
        description: 'Techniques chirurgicales fondamentales',
        lessonCount: 30,
        difficulty: 'Avancé',
        estimatedHours: 65,
        enrolledStudents: 289,
        category: 'Chirurgie'
      },
      {
        id: 'pediatrics',
        title: 'Pédiatrie',
        description: 'Médecine de l\'enfant et de l\'adolescent',
        lessonCount: 25,
        difficulty: 'Avancé',
        estimatedHours: 48,
        enrolledStudents: 334,
        category: 'Pédiatrie'
      }
    ]
  };

  const courses = coursesByFaculty[facultyName] || coursesByFaculty['Sciences'];
  
  // Trier par priorité puis par nombre d'étudiants inscrits, prendre les 9 premiers
  return courses
    .sort((a, b) => {
      if (a.isHighPriority && !b.isHighPriority) return -1;
      if (!a.isHighPriority && b.isHighPriority) return 1;
      return b.enrolledStudents - a.enrolledStudents;
    })
    .slice(0, 9);
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Facile': return 'bg-green-100 text-green-800';
    case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
    case 'Avancé': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function NextYearCoursesSection({ 
  facultyName, 
  currentYear, 
  onCourseClick 
}: NextYearCoursesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Par défaut ouvert
  const nextYearCourses = getNextYearCourses(facultyName, currentYear);
  const nextYear = currentYear + 1;

  return (
    <section className="mb-8">
      {/* Header avec titre engageant - Cliquable */}
      <div 
        className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
            <Calendar size={24} className="text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Vos prochaines étapes académiques
            </h2>
            <p className="text-gray-600 text-sm">
              Un regard sur les cours que vous aborderez l'an prochain dans la continuité de votre apprentissage.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2 text-sm text-indigo-600 mb-1 font-medium">
                <ArrowRight size={14} />
                <span>Année {nextYear}</span>
              </div>
              <div className="text-xs text-gray-500">
                {nextYearCourses.length} cours essentiels
              </div>
            </div>
            {/* Icône de chevron */}
            <div className="text-gray-400">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu pliable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Grille 3x3 des cours */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {nextYearCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GaussStyleCard
                    title={course.title}
                    description={course.description}
                    faculty={course.category}
                    studentsCount={course.enrolledStudents}
                    duration={`${course.estimatedHours}h`}
                    lessonCount={course.lessonCount}
                    price={course.category === 'Médecine' ? 300 : 200}
                    isOwned={false}
                    courseId={course.id}
                    onPreview={() => console.log('Aperçu cours futur:', course.id)}
                    onTest={() => console.log('Quiz cours futur:', course.id)}
                    onClick={() => onCourseClick(course.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Message de continuité et projection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Calendar className="text-indigo-600" size={20} />
                  <h3 className="font-semibold text-gray-900">Continuité pédagogique</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4 max-w-2xl mx-auto">
                  Ces enseignements s'inscrivent dans la progression naturelle de votre cursus en <strong>{facultyName}</strong>. 
                  Ils constituent les fondements de votre formation de niveau supérieur.
                </p>
                <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Matières fondamentales
                  </span>
                  <span>📚 Programme officiel</span>
                  <span>🎓 Cursus {facultyName}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
