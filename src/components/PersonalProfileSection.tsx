'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Brain, 
  ChevronRight, 
  ChevronDown,
  Star,
  ArrowRight,
  Lightbulb,
  Users,
  BookOpen
} from 'lucide-react';
import { PersonalProfile, Blocage, Ambition } from '@/types';

interface PersonalProfileSectionProps {
  personalProfile: PersonalProfile;
  onCourseClick?: (courseId: string) => void;
}

const getNiveauColor = (niveau: string) => {
  switch (niveau) {
    case 'facile': return 'bg-green-100 text-green-800 border-green-200';
    case 'moyen': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'difficile': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPrioriteColor = (priorite: string) => {
  switch (priorite) {
    case 'haute': return 'bg-red-100 text-red-800 border-red-200';
    case 'moyenne': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'basse': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'conversation-ia': return <Brain size={16} className="text-blue-600" />;
    case 'whatsapp': return <MessageSquare size={16} className="text-green-600" />;
    case 'auto-evaluation': return <Target size={16} className="text-purple-600" />;
    default: return <Star size={16} className="text-gray-600" />;
  }
};

const BlocageCard: React.FC<{ blocage: Blocage; onCourseClick?: (courseId: string) => void }> = ({ 
  blocage, 
  onCourseClick 
}) => {
  const [showRecommandations, setShowRecommandations] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getSourceIcon(blocage.source)}
          <h4 className="font-medium text-gray-900">{blocage.titre}</h4>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${getNiveauColor(blocage.niveau)}`}>
          {blocage.niveau}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{blocage.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{blocage.matiere}</span>
        <button
          onClick={() => setShowRecommandations(!showRecommandations)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          Conseils
          {showRecommandations ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {showRecommandations && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            <div className="space-y-2">
              {blocage.recommandations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Lightbulb size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{rec}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AmbitionCard: React.FC<{ ambition: Ambition; onCourseClick?: (courseId: string) => void }> = ({ 
  ambition, 
  onCourseClick 
}) => {
  const [showEtapes, setShowEtapes] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-blue-600" />
          <h4 className="font-medium text-gray-900">{ambition.titre}</h4>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${getPrioriteColor(ambition.priorite)}`}>
          {ambition.priorite}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{ambition.description}</p>
      
      {/* Barre de progression */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Progression</span>
          <span className="font-medium text-gray-900">{ambition.progres}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ambition.progres}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} />
          {ambition.echeance.toLocaleDateString('fr-FR')}
        </div>
        <button
          onClick={() => setShowEtapes(!showEtapes)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          Étapes
          {showEtapes ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {showEtapes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            <div className="space-y-2">
              {ambition.etapes.map((etape) => (
                <div key={etape.id} className="flex items-center gap-3">
                  {etape.terminee ? (
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-sm flex-1 ${etape.terminee ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                    {etape.titre}
                  </span>
                  {etape.coursLie && onCourseClick && (
                    <button
                      onClick={() => onCourseClick(etape.coursLie!)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <BookOpen size={12} />
                      Cours
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CheminRecommande: React.FC<{ 
  chemin: PersonalProfile['cheminRecommande']; 
  onCourseClick?: (courseId: string) => void 
}> = ({ chemin, onCourseClick }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
          <TrendingUp className="text-gray-600" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{chemin.titre}</h3>
          <p className="text-sm text-gray-600">{chemin.description}</p>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progression globale</span>
          <span className="font-medium text-gray-900">{chemin.progression}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${chemin.progression}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-gray-900 h-3 rounded-full shadow-sm"
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
          <span>⏱️ {chemin.tempEstime}</span>
          <span>📅 Créé le {chemin.creeLe.toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Étapes du chemin */}
      <div className="space-y-3">
        {chemin.etapes.map((etape, index) => (
          <motion.div
            key={etape.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
              etape.terminee 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-white/70 border border-gray-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 bg-white text-sm font-medium">
              {etape.terminee ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <span className="text-gray-600">{etape.ordre}</span>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-medium ${etape.terminee ? 'text-green-800' : 'text-gray-900'}`}>
                {etape.titre}
              </h4>
              <p className={`text-sm ${etape.terminee ? 'text-green-600' : 'text-gray-600'}`}>
                {etape.description}
              </p>
            </div>

            {etape.coursRecommande && onCourseClick && (
              <button
                onClick={() => onCourseClick(etape.coursRecommande!)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
              >
                <BookOpen size={12} />
                Accéder
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export function PersonalProfileSection({ personalProfile, onCourseClick }: PersonalProfileSectionProps) {
  const [activeTab, setActiveTab] = useState<'blocages' | 'ambitions' | 'chemin'>('blocages');
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { 
      id: 'blocages' as const, 
      label: 'Tes blocages', 
      icon: AlertTriangle, 
      count: personalProfile.blocages.length,
      color: 'text-gray-600'
    },
    { 
      id: 'ambitions' as const, 
      label: 'Tes ambitions', 
      icon: Target, 
      count: personalProfile.ambitions.length,
      color: 'text-gray-600'
    },
    { 
      id: 'chemin' as const, 
      label: 'Ton chemin', 
      icon: TrendingUp, 
      count: personalProfile.cheminRecommande.etapes.length,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
              <Users className="text-gray-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ton chemin vers la maîtrise</h2>
              <p className="text-sm text-gray-600">Issu de ton diagnostic et de nos échanges</p>
            </div>
          </div>
          
          {/* Bouton d'expansion */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            aria-label={isExpanded ? 'Réduire la section' : 'Étendre la section'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Contenu expansible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-gray-900 bg-white border-b-2 border-blue-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Icon size={16} className={activeTab === tab.id ? tab.color : 'text-gray-400'} />
                        <span>{tab.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activeTab === tab.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'blocages' && (
            <motion.div
              key="blocages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {personalProfile.blocages.map((blocage) => (
                <BlocageCard 
                  key={blocage.id} 
                  blocage={blocage} 
                  onCourseClick={onCourseClick}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'ambitions' && (
            <motion.div
              key="ambitions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {personalProfile.ambitions.map((ambition) => (
                <AmbitionCard 
                  key={ambition.id} 
                  ambition={ambition} 
                  onCourseClick={onCourseClick}
                />
              ))}
            </motion.div>
          )}

          {activeTab === 'chemin' && (
            <motion.div
              key="chemin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CheminRecommande 
                chemin={personalProfile.cheminRecommande} 
                onCourseClick={onCourseClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

            {/* Footer avec boutons d'action */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Dernière conversation: {personalProfile.conversationsIA[0]?.date.toLocaleDateString('fr-FR')}
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://wa.me/33123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <MessageSquare size={14} />
                    Echange avec nous
                  </a>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <Brain size={14} />
                    Assistant express
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
