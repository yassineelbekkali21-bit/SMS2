'use client';

import React, { useState } from 'react';
import { StaircaseProgress, ProgressStep } from './StaircaseProgress';
import { BookOpen, FileText, Video, Brain, Award, Trophy } from 'lucide-react';

/**
 * Exemple d'utilisation du composant StaircaseProgress
 * Démontre un parcours académique complet avec 6 étapes
 */
export const StaircaseProgressExample: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  // Exemple de parcours académique avec 6 étapes
  const academicSteps: ProgressStep[] = [
    {
      icon: <BookOpen className="text-blue-600" size={20} />,
      title: "Introduction",
      description: "Découverte du sujet et présentation des objectifs pédagogiques. Mise en contexte et motivation des étudiants.",
      status: 'completed'
    },
    {
      icon: "❓",
      title: "Quiz de prérequis", 
      description: "Évaluation des connaissances préalables nécessaires pour aborder le cours principal avec confiance.",
      status: 'completed'
    },
    {
      icon: <Video className="text-green-600" size={20} />,
      title: "Cours principal",
      description: "Apprentissage interactif avec vidéos, animations et exercices pratiques pour assimiler les concepts clés.",
      status: 'current'
    },
    {
      icon: <Brain className="text-purple-600" size={20} />,
      title: "Révision active",
      description: "Consolidation des acquis à travers des exercices de synthèse et des rappels des points essentiels.",
      status: 'locked'
    },
    {
      icon: <FileText className="text-orange-600" size={20} />,
      title: "Test final",
      description: "Évaluation sommative pour valider la maîtrise des compétences et concepts étudiés.",
      status: 'locked'
    },
    {
      icon: <Trophy className="text-yellow-500" size={20} />,
      title: "Certification",
      description: "Obtention du diplôme et reconnaissance officielle des compétences acquises dans ce domaine.",
      status: 'locked'
    }
  ];

  // Exemple alternatif avec des émojis
  const emojiSteps: ProgressStep[] = [
    {
      icon: "📚",
      title: "Cacke Bay",
      description: "Apprentissage fondamental. Introduction aux concepts de base et familiarisation avec le domaine d'étude.",
      status: 'completed'
    },
    {
      icon: "📄", 
      title: "Foard Style",
      description: "Étude des méthodes et techniques avancées. Approfondissement des connaissances théoriques.",
      status: 'completed'
    },
    {
      icon: "🎯",
      title: "Digone Lass", 
      description: "Application pratique des concepts appris. Développement des compétences opérationnelles.",
      status: 'current'
    },
    {
      icon: "📋",
      title: "Cling Lass",
      description: "Évaluation intermédiaire et consolidation. Vérification de la progression et ajustements.",
      status: 'locked'
    },
    {
      icon: "🏆",
      title: "Diploma",
      description: "Évaluation finale et validation. Reconnaissance officielle des compétences acquises.",
      status: 'locked'
    }
  ];

  const [currentExample, setCurrentExample] = useState<'academic' | 'emoji'>('academic');
  const currentSteps = currentExample === 'academic' ? academicSteps : emojiSteps;

  const handleStepClick = (stepIndex: number, step: ProgressStep) => {
    setSelectedStep(stepIndex);
    console.log(`Étape cliquée:`, { stepIndex, step });
    
    // Ici vous pourriez déclencher d'autres actions :
    // - Navigation vers une page spécifique
    // - Ouverture d'un modal avec plus de détails
    // - Déclenchement d'une animation
    // - Mise à jour de l'état global de l'application
  };

  return (
    <div className="w-full space-y-8">
      {/* En-tête avec sélecteur d'exemple */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Parcours Académique Interactif
            </h2>
            <p className="text-gray-600">
              Cliquez sur une étape pour interagir avec le parcours
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentExample('academic')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentExample === 'academic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Exemple avec icônes
            </button>
            <button
              onClick={() => setCurrentExample('emoji')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentExample === 'emoji'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Exemple avec émojis
            </button>
          </div>
        </div>
      </div>

      {/* Composant StaircaseProgress */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <StaircaseProgress
          steps={currentSteps}
          onStepClick={handleStepClick}
          className="border border-gray-200"
          height="h-[500px] md:h-[600px]"
        />
      </div>

      {/* Informations sur l'étape sélectionnée */}
      {selectedStep !== null && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {selectedStep + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentSteps[selectedStep].title}
              </h3>
              <p className="text-gray-700 mb-4">
                {currentSteps[selectedStep].description}
              </p>
              
              {/* Statut de l'étape */}
              {currentSteps[selectedStep].status && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Statut:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentSteps[selectedStep].status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : currentSteps[selectedStep].status === 'current'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currentSteps[selectedStep].status === 'completed' && '✓ Terminé'}
                    {currentSteps[selectedStep].status === 'current' && '▶ En cours'}
                    {currentSteps[selectedStep].status === 'locked' && '🔒 Verrouillé'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documentation d'utilisation */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💻 Comment utiliser le composant
        </h3>
        
        <div className="space-y-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Import et utilisation de base</h4>
            <pre className="bg-gray-100 rounded p-3 overflow-x-auto text-xs">
{`import { StaircaseProgress, ProgressStep } from './StaircaseProgress';

const steps: ProgressStep[] = [
  {
    icon: "📚",
    title: "Étape 1",
    description: "Description de l'étape",
    status: 'completed' // optionnel
  }
];

<StaircaseProgress 
  steps={steps}
  onStepClick={(index, step) => console.log(index, step)}
  className="custom-class"
  height="h-[600px]"
/>`}
            </pre>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Personnalisation des étapes</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>icon:</strong> Peut être un émoji (string) ou un composant React (ex: Lucide icons)</li>
              <li><strong>title:</strong> Titre principal affiché dans l'info-bulle</li>
              <li><strong>description:</strong> Description détaillée de l'étape</li>
              <li><strong>status:</strong> 'completed' | 'current' | 'locked' (optionnel)</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Accessibilité et interactions</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Navigation au clavier avec Tab et Enter/Espace</li>
              <li>Aria-labels pour les lecteurs d'écran</li>
              <li>Focus visible avec ring de focus</li>
              <li>Hover effects avec transitions fluides</li>
              <li>Responsive design pour desktop et tablette</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaircaseProgressExample;

