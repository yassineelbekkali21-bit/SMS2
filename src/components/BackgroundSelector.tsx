'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Check } from 'lucide-react';

interface BackgroundOption {
  id: string;
  name: string;
  path: string;
  description: string;
  preview: string;
}

interface BackgroundSelectorProps {
  selectedBackground: string;
  onBackgroundChange: (backgroundId: string) => void;
}

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'course-path-1',
    name: 'Parcours Montagne',
    path: '/course-backgrounds/course-path-1.svg',
    description: 'Chemin d\'apprentissage avec montagnes et étapes progressives',
    preview: '#87ceeb'
  },
  {
    id: 'course-path-2',
    name: 'Chemin Sinueux',
    path: '/course-backgrounds/course-path-2.svg',
    description: 'Parcours dynamique avec chemin coloré et arbres',
    preview: '#e0f2fe'
  },
  {
    id: 'course-path-3',
    name: 'Style Académique',
    path: '/course-backgrounds/course-path-3.svg',
    description: 'Design universitaire minimaliste et professionnel',
    preview: '#f8f9fa'
  },
  {
    id: 'default',
    name: 'Design Original',
    path: '',
    description: 'Arrière-plan par défaut de la plateforme',
    preview: '#ffffff'
  }
];

export function BackgroundSelector({ selectedBackground, onBackgroundChange }: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton d'ouverture */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center z-40 hover:bg-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings size={20} className="text-gray-700" />
      </motion.button>

      {/* Modal de sélection */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Personnaliser le fond</h2>
                  <p className="text-sm text-gray-600 mt-1">Choisissez un arrière-plan pour votre parcours</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Grille d'options */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {BACKGROUND_OPTIONS.map((option) => (
                    <motion.div
                      key={option.id}
                      className={`
                        relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-300
                        ${selectedBackground === option.id 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => {
                        onBackgroundChange(option.id);
                        setIsOpen(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Aperçu */}
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        {option.id !== 'default' ? (
                          <img 
                            src={option.path} 
                            alt={option.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full"
                            style={{ backgroundColor: option.preview }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-gray-500 text-4xl">🎓</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Badge sélectionné */}
                        {selectedBackground === option.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </div>

                      {/* Informations */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{option.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{option.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Astuce :</strong> Vous pouvez changer l'arrière-plan à tout moment depuis les paramètres de votre parcours.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default BackgroundSelector;









