'use client';

import React, { useState } from 'react';

interface CourseCard {
  id: string;
  subject: string;
  level: string;
  title: string;
  description: string;
  features: string[];
}

const coursesData: { [key: string]: CourseCard[] } = {
  maths: [
    {
      id: 'maths-1',
      subject: 'Maths',
      level: 'Bac 1',
      title: 'Résolution d\'équations différentielles',
      description: 'Maîtrise les équations différentielles du premier et second ordre étape par étape',
      features: ['Exercices corrigés', 'PDF manuscrits', 'Quiz auto-correctifs']
    },
    {
      id: 'maths-2',
      subject: 'Maths',
      level: 'Bac 2',
      title: 'Intégrales doubles et triples',
      description: 'Calcul d\'intégrales multiples avec des exemples concrets et applications',
      features: ['Exercices corrigés', 'PDF manuscrits']
    }
  ],
  physique: [
    {
      id: 'physique-1',
      subject: 'Physique',
      level: 'Bac 1',
      title: 'Mécanique quantique fondamentale',
      description: 'Comprends les bases de la mécanique quantique avec des exercices pratiques',
      features: ['Exercices corrigés', 'PDF manuscrits', 'Quiz auto-correctifs']
    }
  ],
  chimie: [
    {
      id: 'chimie-1',
      subject: 'Chimie',
      level: 'Bac 2',
      title: 'Mécanismes réactionnels',
      description: 'Maîtrise les mécanismes SN1, SN2, E1 et E2 en chimie organique',
      features: ['Exercices corrigés', 'PDF manuscrits']
    }
  ],
  economie: [
    {
      id: 'economie-1',
      subject: 'Économie',
      level: 'Bac 1',
      title: 'Équilibre du marché',
      description: 'Offre, demande, élasticité et surplus avec applications concrètes',
      features: ['Exercices corrigés', 'Quiz auto-correctifs']
    }
  ],
  statistiques: [
    {
      id: 'stats-1',
      subject: 'Statistiques',
      level: 'Bac 2',
      title: 'Tests d\'hypothèses',
      description: 'Tests statistiques et intervalles de confiance avec interprétations',
      features: ['Exercices corrigés', 'PDF manuscrits', 'Quiz auto-correctifs']
    }
  ],
  autres: [
    {
      id: 'autres-1',
      subject: 'Autres',
      level: 'Tous niveaux',
      title: 'Méthodologie et organisation',
      description: 'Apprends à organiser ton travail et optimiser ton apprentissage',
      features: ['PDF manuscrits', 'Quiz auto-correctifs']
    }
  ]
};

export function ContentsSection() {
  const [activeTab, setActiveTab] = useState('maths');
  const subjects = ['maths', 'physique', 'chimie', 'economie', 'statistiques', 'autres'];
  const subjectLabels: { [key: string]: string } = {
    maths: 'Maths',
    physique: 'Physique',
    chimie: 'Chimie',
    economie: 'Économie',
    statistiques: 'Statistiques',
    autres: 'Autres'
  };

  const currentCourses = coursesData[activeTab] || [];

  const handleExtrait = (courseId: string) => {
    console.log('Voir extrait:', courseId);
    // TODO: Open video modal
  };

  return (
    <section id="contents" className="py-20 md:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
          Un catalogue riche, organisé par matière,<br />au service de ton plan sur mesure
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 text-center max-w-4xl mx-auto">
          On ne te laisse pas choisir au hasard. Mais tu peux voir à quoi ressemble ce que tu vas recevoir.
        </p>

        {/* Tabs */}
        <div className="flex overflow-x-auto mb-12 border-b border-gray-200 scrollbar-hide">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveTab(subject)}
              className={`flex-shrink-0 px-6 py-3 font-semibold transition-all relative ${
                activeTab === subject
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {subjectLabels[subject]}
              {activeTab === subject && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Carousel - Horizontal scroll */}
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
            {currentCourses.map((course) => (
              <div
                key={course.id}
                className="flex-shrink-0 w-80 bg-slate-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Tag */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {course.subject}
                  </span>
                  <span className="text-sm text-gray-600">{course.level}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {course.description}
                </p>

                {/* Features chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA button */}
                <button
                  onClick={() => handleExtrait(course.id)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Voir un extrait →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




