'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Course } from '@/types';
import { SmartSearchPrompt } from './SmartSearchPrompt';
import { CourseRow, SubjectSection } from './CourseRow';

// ============================================================================
// MOCK DATA
// ============================================================================
const createCourse = (
  id: string,
  title: string,
  subject: string,
  progress: number = 0,
  totalLessons: number = 10
): Course => ({
  id,
  title,
  description: `Cours complet sur ${title}`,
  faculty: 'Sciences',
  year: '2024',
  totalLessons,
  completedLessons: Math.floor((progress / 100) * totalLessons),
  duration: `${Math.round(totalLessons * 0.75)}h`,
  isOwned: progress > 0,
  isPrimary: progress > 50,
  progress,
  price: 49,
  thumbnail: '',
  previewAvailable: true,
  tags: [subject],
  difficulty: 'intermediate',
});

// Données
const IN_PROGRESS = [
  createCourse('physics-meca-1', 'Mécanique du point', 'Physique', 65, 12),
  createCourse('math-analyse-1', 'Analyse I', 'Mathématiques', 42, 15),
  createCourse('chemistry-organique-1', 'Chimie organique I', 'Chimie', 28, 10),
  createCourse('physics-thermo-1', 'Thermodynamique I', 'Physique', 15, 8),
  createCourse('info-python-1', 'Python - Les bases', 'Informatique', 72, 20),
];

const COMPLETED = [
  createCourse('physics-intro', 'Introduction à la physique', 'Physique', 100, 8),
  createCourse('math-bases', 'Bases mathématiques', 'Mathématiques', 100, 10),
  createCourse('chemistry-intro', 'Introduction à la chimie', 'Chimie', 100, 6),
  createCourse('info-algo-intro', 'Introduction à l\'algorithmique', 'Informatique', 100, 12),
];

const NEW_COURSES = [
  createCourse('physics-moderne', 'Physique moderne', 'Physique', 0, 14),
  createCourse('info-ia', 'Intelligence artificielle', 'Informatique', 0, 18),
  createCourse('math-crypto', 'Cryptographie', 'Mathématiques', 0, 10),
  createCourse('chemistry-env', 'Chimie environnementale', 'Chimie', 0, 8),
  createCourse('eco-finance', 'Finance d\'entreprise', 'Économie', 0, 12),
  createCourse('info-cloud', 'Cloud computing', 'Informatique', 0, 10),
];

const RECOMMENDED = [
  createCourse('physics-ondes', 'Ondes mécaniques', 'Physique', 0, 10),
  createCourse('math-algebre', 'Algèbre linéaire I', 'Mathématiques', 0, 14),
  createCourse('chemistry-generale', 'Chimie générale I', 'Chimie', 0, 12),
  createCourse('physics-electro', 'Électrostatique', 'Physique', 0, 8),
  createCourse('info-python', 'Python - Les fondamentaux', 'Informatique', 0, 16),
  createCourse('stats-proba', 'Probabilités', 'Statistiques', 0, 12),
  createCourse('eco-micro', 'Microéconomie', 'Économie', 0, 10),
  createCourse('physics-circuits', 'Circuits électriques', 'Physique', 0, 10),
  createCourse('math-analyse', 'Analyse I', 'Mathématiques', 0, 15),
  createCourse('info-bdd', 'Bases de données', 'Informatique', 0, 12),
];

const TRENDING = [
  createCourse('math-proba', 'Probabilités', 'Mathématiques', 0, 12),
  createCourse('physics-quantique', 'Physique quantique', 'Physique', 0, 16),
  createCourse('chemistry-analytique', 'Chimie analytique', 'Chimie', 0, 10),
  createCourse('info-python-avance', 'Python avancé', 'Informatique', 0, 14),
  createCourse('stats-descriptives', 'Statistiques descriptives', 'Statistiques', 0, 8),
];

// Mastery Programs
const PHYSICS: Course[][] = [
  [
    createCourse('phy-meca-intro', 'Introduction à la mécanique', 'Physique', 100, 8),
    createCourse('phy-meca-point', 'Mécanique du point', 'Physique', 65, 12),
    createCourse('phy-meca-solide', 'Mécanique du solide', 'Physique', 0, 10),
  ],
  [
    createCourse('phy-elec-intro', 'Introduction à l\'électrostatique', 'Physique', 100, 6),
    createCourse('phy-elec-champs', 'Champs électriques', 'Physique', 35, 10),
    createCourse('phy-elec-potentiel', 'Potentiel électrique', 'Physique', 0, 8),
  ],
  [
    createCourse('phy-thermo-1', 'Thermodynamique I', 'Physique', 15, 10),
    createCourse('phy-thermo-2', 'Thermodynamique II', 'Physique', 0, 12),
  ],
];

const MATH: Course[][] = [
  [
    createCourse('math-analyse-1', 'Analyse I', 'Mathématiques', 42, 14),
    createCourse('math-analyse-2', 'Analyse II', 'Mathématiques', 0, 12),
    createCourse('math-analyse-3', 'Analyse III', 'Mathématiques', 0, 14),
  ],
  [
    createCourse('math-algebre-1', 'Algèbre linéaire I', 'Mathématiques', 100, 12),
    createCourse('math-algebre-2', 'Algèbre linéaire II', 'Mathématiques', 0, 14),
  ],
];

const CHEMISTRY: Course[][] = [
  [
    createCourse('chem-gen-1', 'Chimie générale I', 'Chimie', 28, 10),
    createCourse('chem-gen-2', 'Chimie générale II', 'Chimie', 0, 12),
  ],
  [
    createCourse('chem-orga-1', 'Chimie organique I', 'Chimie', 0, 14),
    createCourse('chem-orga-2', 'Chimie organique II', 'Chimie', 0, 16),
  ],
];

const INFORMATICS: Course[][] = [
  [
    createCourse('info-python-intro', 'Python - Introduction', 'Informatique', 100, 12),
    createCourse('info-python-bases', 'Python - Les bases', 'Informatique', 72, 16),
    createCourse('info-python-poo', 'Python - POO', 'Informatique', 0, 14),
  ],
  [
    createCourse('info-bdd-intro', 'Introduction aux BDD', 'Informatique', 0, 8),
    createCourse('info-bdd-sql', 'SQL - Fondamentaux', 'Informatique', 0, 12),
  ],
];

const ECONOMICS: Course[][] = [
  [
    createCourse('eco-micro-1', 'Microéconomie I', 'Économie', 33, 10),
    createCourse('eco-micro-2', 'Microéconomie II', 'Économie', 0, 12),
  ],
  [
    createCourse('eco-macro-1', 'Macroéconomie I', 'Économie', 0, 10),
    createCourse('eco-macro-2', 'Macroéconomie II', 'Économie', 0, 12),
  ],
];

// ============================================================================
// COMPONENT
// ============================================================================
interface NetflixCatalogSectionProps {
  onCourseClick: (course: Course) => void;
  onToggleFavorite?: (courseId: string) => void;
}

export function NetflixCatalogSection({ 
  onCourseClick, 
  onToggleFavorite = () => {} 
}: NetflixCatalogSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(true);
    // Smooth scroll to top after expansion
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="overflow-visible">
      {/* Search Prompt - Toujours visible, change juste de position */}
      <motion.div
        layout
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`w-full ${!isExpanded ? 'max-w-4xl mx-auto' : ''}`}
        style={{ 
          paddingTop: !isExpanded ? 'calc(30vh - 100px)' : '0',
          paddingBottom: !isExpanded ? '0' : '0'
        }}
      >
        <SmartSearchPrompt
          onSearch={(query) => {
            console.log('Search:', query);
            setIsExpanded(true);
          }}
          onUpload={(file) => console.log('Upload:', file)}
          onProgramSelect={(programId) => {
            console.log('Program:', programId);
            setIsExpanded(true);
          }}
          compact={isExpanded}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ============================================================ */
          /* VUE COLLAPSED - Learning tracks + Arrow */
          /* ============================================================ */
          <motion.div
            key="collapsed"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center px-4"
          >
            {/* Learning Tracks conçus pour toi */}
            <div className="w-full mt-8">
              <CourseRow
                title="Learning tracks conçus pour toi"
                courses={RECOMMENDED.slice(0, 6)}
                onCourseClick={(course) => {
                  setIsExpanded(true);
                  onCourseClick(course);
                }}
                showProgress={false}
                defaultFavorites={true}
                onToggleFavorite={onToggleFavorite}
              />
            </div>

            {/* Arrow to expand */}
            <motion.button
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              onClick={handleExpand}
              className="mt-12 mb-12 flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors group"
            >
              <span className="text-sm font-medium">Découvrir tout le catalogue</span>
              <div className="w-12 h-12 rounded-full border-2 border-gray-200 group-hover:border-gray-400 flex items-center justify-center transition-colors">
                <ChevronDown size={24} />
              </div>
            </motion.button>
          </motion.div>
        ) : (
          /* ============================================================ */
          /* VUE EXPANDED - Catalogue complet */
          /* ============================================================ */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 mt-6"
          >
            {/* Catalogue */}
            <div>
              {/* 1. Reprendre ma progression */}
              <section className="mb-6">
                <CourseRow
                  title="Reprendre ma progression"
                  courses={IN_PROGRESS}
                  onCourseClick={onCourseClick}
                  showProgress={true}
                  emptyMessage="Tu n'as pas encore commencé de cours"
                  maxVisible={8}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              {/* 2. Conçus pour toi */}
              <section className="mb-6">
                <CourseRow
                  title="Learning tracks conçus pour toi"
                  courses={RECOMMENDED}
                  onCourseClick={onCourseClick}
                  showProgress={false}
                  defaultFavorites={true}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              {/* 3. Nouveautés */}
              <section className="mb-6">
                <CourseRow
                  title="Nouveautés chez SMS"
                  courses={NEW_COURSES}
                  onCourseClick={onCourseClick}
                  showProgress={false}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              {/* 4. Mastery Programs */}
              <section className="mb-6">
                <SubjectSection
                  subject="Physique"
                  subGroups={PHYSICS}
                  onCourseClick={onCourseClick}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              <section className="mb-6">
                <SubjectSection
                  subject="Mathématiques"
                  subGroups={MATH}
                  onCourseClick={onCourseClick}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              <section className="mb-6">
                <SubjectSection
                  subject="Chimie"
                  subGroups={CHEMISTRY}
                  onCourseClick={onCourseClick}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              <section className="mb-6">
                <SubjectSection
                  subject="Informatique"
                  subGroups={INFORMATICS}
                  onCourseClick={onCourseClick}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              <section className="mb-6">
                <SubjectSection
                  subject="Économie"
                  subGroups={ECONOMICS}
                  onCourseClick={onCourseClick}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              {/* 5. Populaires */}
              <section className="mb-6">
                <CourseRow
                  title="Populaires cette semaine"
                  courses={TRENDING}
                  onCourseClick={onCourseClick}
                  showProgress={false}
                  onToggleFavorite={onToggleFavorite}
                />
              </section>

              {/* 6. Revoir */}
              <section className="mb-6">
                <CourseRow
                  title="Revoir"
                  courses={COMPLETED}
                  onCourseClick={onCourseClick}
                  showProgress={true}
                  emptyMessage="Tu n'as pas encore terminé de cours"
                  onToggleFavorite={onToggleFavorite}
                />
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NetflixCatalogSection;


