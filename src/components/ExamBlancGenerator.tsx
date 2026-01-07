'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  FileText,
  Clock,
  BookOpen,
  ChevronRight,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

interface ExamBlancGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
}

interface ExamConfig {
  duration: '30min' | '1h' | '2h' | '3h';
  difficulty: 'facile' | 'moyen' | 'difficile' | 'examen';
  questionTypes: ('qcm' | 'ouvert' | 'exercice')[];
  topics: string[];
}

const MOCK_TOPICS = [
  { id: 't1', name: 'Dérivées et primitives', selected: true },
  { id: 't2', name: 'Intégrales définies', selected: true },
  { id: 't3', name: 'Équations différentielles', selected: false },
  { id: 't4', name: 'Séries numériques', selected: false },
  { id: 't5', name: 'Limites et continuité', selected: true },
  { id: 't6', name: 'Fonctions de plusieurs variables', selected: false },
];

export function ExamBlancGenerator({ 
  isOpen, 
  onClose, 
  trackTitle 
}: ExamBlancGeneratorProps) {
  const [step, setStep] = useState<'config' | 'generating' | 'ready'>('config');
  const [config, setConfig] = useState<ExamConfig>({
    duration: '1h',
    difficulty: 'moyen',
    questionTypes: ['qcm', 'exercice'],
    topics: ['t1', 't2', 't5']
  });

  const handleGenerate = () => {
    setStep('generating');
    // Simulate generation
    setTimeout(() => {
      setStep('ready');
    }, 3000);
  };

  const toggleTopic = (topicId: string) => {
    setConfig(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(t => t !== topicId)
        : [...prev.topics, topicId]
    }));
  };

  const toggleQuestionType = (type: 'qcm' | 'ouvert' | 'exercice') => {
    setConfig(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type]
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Retour</span>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Examen Blanc</h1>
          <p className="text-xs text-gray-500">{trackTitle}</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        {step === 'config' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Intro */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-900" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Génère ton examen blanc personnalisé
              </h2>
              <p className="text-gray-500">
                Configure les paramètres et on génère un examen adapté à tes besoins.
              </p>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                <Clock size={16} className="inline mr-2" />
                Durée de l'examen
              </label>
              <div className="grid grid-cols-4 gap-3">
                {(['30min', '1h', '2h', '3h'] as const).map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setConfig(prev => ({ ...prev, duration }))}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      config.duration === duration
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                <Sparkles size={16} className="inline mr-2" />
                Niveau de difficulté
              </label>
              <div className="grid grid-cols-4 gap-3">
                {([
                  { id: 'facile', label: 'Facile' },
                  { id: 'moyen', label: 'Moyen' },
                  { id: 'difficile', label: 'Difficile' }
                ] as const).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setConfig(prev => ({ ...prev, difficulty: item.id }))}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      config.difficulty === item.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Types */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                <BookOpen size={16} className="inline mr-2" />
                Types de questions
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: 'qcm', label: 'QCM' },
                  { id: 'ouvert', label: 'Questions ouvertes' },
                  { id: 'exercice', label: 'Exercices' }
                ] as const).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleQuestionType(item.id)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      config.questionTypes.includes(item.id)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {config.questionTypes.includes(item.id) && <Check size={16} />}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Sujets à inclure
              </label>
              <div className="space-y-2">
                {MOCK_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                      config.topics.includes(topic.id)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="font-medium">{topic.name}</span>
                    {config.topics.includes(topic.id) && <Check size={18} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Warning */}
            {config.topics.length === 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-6">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  Sélectionne au moins un sujet pour générer l'examen.
                </p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={config.topics.length === 0 || config.questionTypes.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                config.topics.length > 0 && config.questionTypes.length > 0
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles size={20} />
              Générer mon examen blanc
            </button>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Génération en cours...</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Notre IA analyse tes préférences et génère un examen personnalisé.
            </p>
            
            {/* Progress indicators */}
            <div className="mt-8 space-y-3 text-sm text-gray-600">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2"
              >
                <Check size={16} className="text-green-500" />
                Analyse des sujets sélectionnés
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-2"
              >
                <Check size={16} className="text-green-500" />
                Sélection des questions
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-gray-900 animate-spin" />
                Génération du corrigé
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Ton examen blanc est prêt !
            </h2>
            <p className="text-gray-500 mb-10">
              {config.duration} · {config.difficulty} · {config.topics.length} sujets
            </p>

            {/* Exam preview card */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Examen Blanc - {trackTitle}</h3>
                  <p className="text-sm text-gray-500">Généré le {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                  {config.duration}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-gray-500">Exercices</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">20</p>
                  <p className="text-xs text-gray-500">Points</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Commencer l'examen
                <ChevronRight size={20} />
              </button>
              <button className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Télécharger en PDF
              </button>
              <button 
                onClick={() => setStep('config')}
                className="w-full py-3 text-gray-500 hover:text-gray-900 transition-colors"
              >
                Modifier les paramètres
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

