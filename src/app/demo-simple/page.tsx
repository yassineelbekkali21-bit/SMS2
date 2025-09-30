'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Play, CheckCircle, Star, Clock } from 'lucide-react';

export default function DemoSimplePage() {
  const [selectedLesson, setSelectedLesson] = useState(0);

  const lessons = [
    {
      id: 1,
      title: "Les fondamentaux essentiels",
      description: "Découvrez les concepts de base qui forment le socle solide de votre apprentissage.",
      duration: 15,
      isCompleted: true,
      isPurchased: true
    },
    {
      id: 2,
      title: "Calcul du champ électrique",
      description: "Apprenez à calculer le champ électrique dans différentes configurations.",
      duration: 25,
      isCompleted: false,
      isPurchased: true
    },
    {
      id: 3,
      title: "Applications pratiques",
      description: "Mettez en pratique vos connaissances avec des exercices concrets.",
      duration: 30,
      isCompleted: false,
      isPurchased: false
    }
  ];

  const lessonNodes = lessons.map((lesson, index) => ({
    lesson,
    position: { 
      x: (index % 3) * 200 + 150, 
      y: Math.floor(index / 3) * 150 + 150 
    }
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Suites et Limites</h1>
              <p className="text-gray-600">Votre parcours d'apprentissage</p>
            </div>
          </div>
          
          {/* Progression */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Niveau 1</div>
              <div className="text-xl font-bold text-gray-900">1/5</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">25 / 210 XP</div>
              <div className="text-xl font-bold text-blue-600">20%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Étapes</div>
              <div className="text-xl font-bold text-gray-900">Progression</div>
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Map Mario */}
        <div className="flex-1 p-6">
          <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[600px]">
            <svg className="absolute inset-0 w-full h-full" style={{ minHeight: '600px' }}>
              {/* Chemins entre les leçons */}
              {lessonNodes.slice(0, -1).map((node, index) => {
                const nextNode = lessonNodes[index + 1];
                return (
                  <line
                    key={`path-${index}`}
                    x1={node.position.x}
                    y1={node.position.y}
                    x2={nextNode.position.x}
                    y2={nextNode.position.y}
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    strokeDasharray={node.lesson.isPurchased ? "0" : "5,5"}
                  />
                );
              })}
            </svg>

            {/* Nodes des leçons */}
            {lessonNodes.map((node, index) => (
              <motion.div
                key={node.lesson.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ 
                  left: node.position.x, 
                  top: node.position.y 
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLesson(index)}
              >
                <div className={`
                  relative w-16 h-16 rounded-2xl border-4 flex items-center justify-center font-bold text-white
                  ${node.lesson.isCompleted 
                    ? 'bg-green-500 border-green-400 shadow-green-200' 
                    : node.lesson.isPurchased 
                      ? 'bg-blue-500 border-blue-400 shadow-blue-200'
                      : 'bg-gray-400 border-gray-300 shadow-gray-200'
                  } shadow-lg
                  ${selectedLesson === index ? 'ring-4 ring-purple-300' : ''}
                `}>
                  {node.lesson.isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : node.lesson.isPurchased ? (
                    <Play className="w-6 h-6" />
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                  
                  {/* Badge XP */}
                  {node.lesson.isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      +25
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-xs font-medium text-gray-700 whitespace-nowrap max-w-24 truncate">
                    {node.lesson.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                  {node.lesson.isPurchased && (
                    <div className="text-xs text-green-600 font-medium">Facile</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Panneau de détails */}
        <div className="w-96 p-6">
          <motion.div
            key={selectedLesson}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            {/* Header de la leçon */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {lessons[selectedLesson].title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Étape {selectedLesson + 1} • {lessons[selectedLesson].isCompleted ? 'Vous avez terminé cette leçon avec succès' : 'Prêt à commencer'}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                {lessons[selectedLesson].isCompleted && (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    Terminé
                  </div>
                )}
                <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                  Facile
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                {lessons[selectedLesson].description}
              </p>
            </div>

            {/* Ce que vous allez apprendre */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                Ce que vous allez apprendre
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2 text-sm text-gray-700">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Comprendre les concepts fondamentaux du sujet</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-700">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Identifier les éléments clés à retenir</span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-gray-700">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Établir une base solide pour la suite du cours</span>
                </li>
              </ul>
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-xs text-gray-500">Durée</div>
                <div className="text-sm font-semibold text-gray-900">{lessons[selectedLesson].duration} min</div>
                <div className="text-xs text-gray-500">15-35 min</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-xs text-purple-500">Récompense</div>
                <div className="text-sm font-semibold text-gray-900">+25 XP</div>
                <div className="text-xs text-gray-500">Points d'expérience</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                </div>
                <div className="text-xs text-orange-500">Niveau</div>
                <div className="text-sm font-semibold text-gray-900">Facile</div>
                <div className="text-xs text-gray-500">Parfait pour débuter</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                    <Play className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="text-sm font-semibold text-gray-900">Vidéo</div>
                <div className="text-xs text-gray-500">Format du contenu</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {lessons[selectedLesson].isPurchased ? (
                <>
                  <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>{lessons[selectedLesson].isCompleted ? 'Revoir la leçon' : 'Commencer la leçon'}</span>
                  </button>
                  
                  <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Quiz d'entraînement</span>
                  </button>
                </>
              ) : (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Débloquer cette leçon</span>
                </button>
              )}
              
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Aperçu gratuit</span>
              </button>
            </div>

            {/* Note */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Prêt à commencer cette leçon ?
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}







