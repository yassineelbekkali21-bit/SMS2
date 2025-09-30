'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Styles CSS pour l'effet 3D isométrique
const staircaseStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .preserve-3d {
    transform-style: preserve-3d;
  }
  
  .staircase-step {
    transform-style: preserve-3d;
  }
  
  .staircase-step:hover {
    transform: translateZ(10px) rotateX(-2deg) rotateY(2deg);
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotateX(-15deg) rotateY(15deg); }
    50% { transform: translateY(-5px) rotateX(-15deg) rotateY(15deg); }
  }
  
  .step-float {
    animation: float 3s ease-in-out infinite;
  }
`;

/**
 * Interface pour définir une étape du parcours académique
 */
export interface ProgressStep {
  /** Icône de l'étape (émoji ou composant React) */
  icon: string | React.ReactNode;
  /** Titre principal de l'étape */
  title: string;
  /** Description détaillée de l'étape */
  description: string;
  /** Statut de l'étape (optionnel) */
  status?: 'completed' | 'current' | 'locked';
}

/**
 * Props du composant StaircaseProgress
 */
export interface StaircaseProgressProps {
  /** Liste des étapes du parcours */
  steps: ProgressStep[];
  /** Callback appelé lors du clic sur une étape */
  onStepClick?: (stepIndex: number, step: ProgressStep) => void;
  /** Classe CSS personnalisée pour le conteneur */
  className?: string;
  /** Hauteur personnalisée du composant */
  height?: string;
}

/**
 * Composant StaircaseProgress - Affiche un parcours académique sous forme d'escalier 3D
 * 
 * Fonctionnalités :
 * - Design isométrique avec escalier diagonal
 * - Dégradé de fond avec silhouettes de montagnes
 * - Interactions hover et click
 * - Support de l'accessibilité
 * - Responsive design
 * 
 * Usage :
 * ```tsx
 * const steps = [
 *   { icon: "📘", title: "Introduction", description: "Découverte du sujet" },
 *   { icon: "📄", title: "Quiz", description: "Évaluation des prérequis" }
 * ];
 * 
 * <StaircaseProgress 
 *   steps={steps} 
 *   onStepClick={(index, step) => console.log(index, step)}
 * />
 * ```
 * 
 * Pour ajouter/retirer des étapes :
 * - Ajoutez/supprimez des objets dans le tableau `steps`
 * - Le composant s'adapte automatiquement au nombre d'étapes
 * - Maximum recommandé : 8 étapes pour une lisibilité optimale
 */
export const StaircaseProgress: React.FC<StaircaseProgressProps> = ({
  steps,
  onStepClick,
  className = '',
  height = 'h-[600px]'
}) => {
  return (
    <>
      {/* Injection des styles CSS personnalisés */}
      <style dangerouslySetInnerHTML={{ __html: staircaseStyles }} />
      
      <div 
        className={`relative w-full ${height} overflow-hidden rounded-2xl ${className}`}
        role="region"
        aria-label="Parcours académique interactif"
      >
      {/* Fond avec dégradé et montagnes */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-800">
        {/* Silhouettes de montagnes en arrière-plan */}
        <div className="absolute inset-0">
          {/* Montagnes lointaines */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              viewBox="0 0 1200 400"
              className="w-full h-full opacity-20"
              preserveAspectRatio="none"
            >
              {/* Première couche de montagnes */}
              <path
                d="M0,400 L0,200 L200,120 L400,180 L600,100 L800,160 L1000,80 L1200,140 L1200,400 Z"
                fill="rgba(59, 130, 246, 0.3)"
              />
              {/* Deuxième couche */}
              <path
                d="M0,400 L0,250 L150,200 L350,240 L550,180 L750,220 L950,160 L1200,200 L1200,400 Z"
                fill="rgba(59, 130, 246, 0.2)"
              />
              {/* Troisième couche */}
              <path
                d="M0,400 L0,300 L100,280 L300,320 L500,280 L700,300 L900,260 L1200,280 L1200,400 Z"
                fill="rgba(59, 130, 246, 0.1)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Conteneur principal de l'escalier 3D */}
      <div className="relative h-full overflow-hidden perspective-1000">
        <div className="relative w-full h-full transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Escalier 3D isométrique */}
          <div className="absolute inset-0" style={{ perspective: '1000px' }}>
            {steps.map((step, index) => {
              // Calcul de position isométrique authentique
              const totalSteps = steps.length;
              const stepRatio = index / Math.max(1, totalSteps - 1);
              
              // Position isométrique : chaque marche plus haute et plus à droite
              const baseX = 15; // Position de départ (15% de la largeur)
              const baseY = 75; // Position de départ (75% de la hauteur)
              const stepWidth = 70 / totalSteps; // Répartition sur 70% de la largeur
              const stepHeight = 50 / totalSteps; // Répartition sur 50% de la hauteur
              
              const xPercent = baseX + (stepRatio * stepWidth * totalSteps);
              const yPercent = baseY - (stepRatio * stepHeight * totalSteps);
              
              // Taille et profondeur 3D
              const stepSize = 80;
              const stepDepth = 12;
              
              return (
                <motion.div
                  key={index}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: totalSteps - index // Les premières marches devant les autres
                  }}
                  initial={{ opacity: 0, scale: 0, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 120
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotateX: -5,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onStepClick?.(index, step)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Étape ${index + 1}: ${step.title}. ${step.description}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onStepClick?.(index, step);
                    }
                  }}
                  className="focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-60 rounded-xl"
                >
                  {/* Marche 3D isométrique authentique */}
                  <div className="relative transform-gpu staircase-step step-float" style={{ transformStyle: 'preserve-3d', animationDelay: `${index * 0.5}s` }}>
                    
                    {/* Ombre projetée de la marche */}
                    <div 
                      className="absolute bg-black opacity-15 rounded-lg"
                      style={{
                        width: `${stepSize + 8}px`,
                        height: `${stepSize + 8}px`,
                        left: `${stepDepth}px`,
                        top: `${stepDepth}px`,
                        transform: 'rotateX(90deg) translateZ(-2px)',
                        filter: 'blur(4px)'
                      }}
                    />
                    
                    {/* Face supérieure de la marche */}
                    <div 
                      className="relative bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300 rounded-lg shadow-xl group-hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
                      style={{
                        width: `${stepSize}px`,
                        height: `${stepSize}px`,
                        transform: 'rotateX(-15deg) rotateY(15deg)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Face avant de la marche (côté visible) */}
                      <div 
                        className="absolute bg-gradient-to-b from-yellow-200 to-yellow-400 border-r-2 border-yellow-400"
                        style={{
                          width: `${stepDepth}px`,
                          height: `${stepSize}px`,
                          right: `-${stepDepth}px`,
                          top: '0',
                          transform: 'rotateY(90deg)',
                          transformOrigin: 'left center'
                        }}
                      />
                      
                      {/* Face côté de la marche */}
                      <div 
                        className="absolute bg-gradient-to-r from-yellow-300 to-yellow-500 border-b-2 border-yellow-500"
                        style={{
                          width: `${stepSize}px`,
                          height: `${stepDepth}px`,
                          left: '0',
                          bottom: `-${stepDepth}px`,
                          transform: 'rotateX(-90deg)',
                          transformOrigin: 'center top'
                        }}
                      />
                      
                      {/* Icône de l'étape */}
                      <div className="relative z-10 text-3xl group-hover:scale-125 transition-transform duration-200 drop-shadow-sm">
                        {typeof step.icon === 'string' ? (
                          <span role="img" aria-hidden="true">{step.icon}</span>
                        ) : (
                          step.icon
                        )}
                      </div>
                      
                      {/* Indicateur de statut */}
                      {step.status && (
                        <div 
                          className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-white shadow-md ${
                            step.status === 'completed' ? 'bg-green-500' :
                            step.status === 'current' ? 'bg-blue-500 animate-pulse' :
                            'bg-gray-400'
                          }`} 
                        />
                      )}
                    </div>

                    {/* Numéro de l'étape flottant */}
                    <div 
                      className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20"
                      style={{ transform: 'translateX(-50%) translateZ(20px)' }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Bloc de texte informatif latéral */}
                  <div 
                    className={`absolute ${
                      index % 2 === 0 ? 'left-24' : 'right-24'
                    } top-0 w-72 p-4 bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-300 transform ${
                      index % 2 === 0 ? 'translate-x-4' : '-translate-x-4'
                    } group-hover:translate-x-0 pointer-events-none z-30`}
                  >
                    {/* En-tête avec numéro */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {step.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {step.description}
                    </p>
                    
                    {/* Badge de statut */}
                    {step.status && (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        step.status === 'completed' ? 'bg-green-100 text-green-800' :
                        step.status === 'current' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.status === 'completed' && '✓ Terminé'}
                        {step.status === 'current' && '▶ En cours'}
                        {step.status === 'locked' && '🔒 Verrouillé'}
                      </div>
                    )}
                    
                    {/* Flèche pointant vers la marche */}
                    <div 
                      className={`absolute top-8 ${
                        index % 2 === 0 ? '-left-3' : '-right-3'
                      } w-6 h-6 bg-white border-l border-b border-gray-200 transform rotate-45 shadow-sm`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default StaircaseProgress;
