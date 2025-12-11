import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Settings,
  Heart,
  X,
  ArrowRight
} from 'lucide-react';
import { PlannerAccess, StudyPreferences, StudyPlan, BuddySystem, Course } from '@/types/index';
import { SocialPlannerIntegration } from './SocialPlannerIntegration';
import { ParticipativeExamDates } from './ParticipativeExamDates';
import { AdvancedPlanDisplay } from './AdvancedPlanDisplay';
import { useAdvancedPlanner } from '@/lib/use-advanced-planner';

interface StrategicPlannerCompactProps {
  plannerAccess: PlannerAccess;
  onGeneratePlan?: (preferences: StudyPreferences) => StudyPlan;
  onWhatsAppContact?: () => void;
  onUpgrade?: () => void;
  onRestartOnboarding?: () => void;
  buddy?: BuddySystem | null;
  onAddBuddy?: (buddy: Omit<BuddySystem, 'id' | 'userId'>) => void;
  onUpdateBuddy?: (buddy: BuddySystem) => void;
  onRemoveBuddy?: () => void;
  onSendBuddyNotification?: (type: 'missed-session' | 'progress-update', sessionName?: string) => void;
  favoriteCourses?: Array<{
    id: string;
    title: string;
    examDate?: Date;
    progress?: number;
  }>;
  focusedCourse?: Course | null;
  onNavigateToCourse?: (courseId: string) => void;
  existingPlan?: StudyPlan | null; // Planning existant pour détecter si c'est une mise à jour
}

export function StrategicPlannerCompact({ 
  plannerAccess, 
  onGeneratePlan,
  onWhatsAppContact,
  onUpgrade,
  onRestartOnboarding,
  buddy,
  onAddBuddy,
  onUpdateBuddy,
  onRemoveBuddy,
  onSendBuddyNotification,
  favoriteCourses = [],
  focusedCourse,
  onNavigateToCourse,
  existingPlan = null
}: StrategicPlannerCompactProps) {
  
  const [preferences, setPreferences] = useState<StudyPreferences>({
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    preferredStartTime: '09:00',
    preferredEndTime: '17:00',
    dailyStudyHours: 3,
    preferredStudySlots: ['morning', 'afternoon'],
    breakDuration: 15,
    studyIntensity: 'moderate'
  });

  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(existingPlan);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  
  // États pour les widgets latéraux
  const [activeWidget, setActiveWidget] = useState<'preferences' | 'buddy' | 'dates' | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Hook pour le planificateur avancé
  const advancedPlanner = useAdvancedPlanner({
    hasAccess: plannerAccess.canCreatePlan,
    plannerAccess
  });

  // Initialisation au montage : ouvrir le bon widget selon l'état du planning
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      if (existingPlan === null) {
        // Cas 1 : Premier cours (planning vide) -> ouvrir widget préférences
        setActiveWidget('preferences');
      } else {
        // Cas 2 : Planning existant (ajout d'un cours) -> ouvrir directement widget dates
        setActiveWidget('dates');
      }
    }
  }, [hasInitialized, existingPlan]);

  const handleGeneratePlan = () => {
    if (!onGeneratePlan) return;
    
    setIsGeneratingPlan(true);
    
    // Simuler la génération
    setTimeout(() => {
      const plan = onGeneratePlan(preferences);
      setGeneratedPlan(plan);
      setIsGeneratingPlan(false);
      setActiveWidget(null); // Fermer le widget après génération
    }, 2000);
  };

  const handleNextWidget = (current: 'preferences' | 'buddy' | 'dates') => {
    // Navigation séquentielle : preferences -> buddy -> dates
    if (current === 'preferences') {
      setActiveWidget('buddy');
    } else if (current === 'buddy') {
      setActiveWidget('dates');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Premium */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planification</h1>
            <p className="text-gray-600 font-medium mt-1">Planificateur activé pour 2 cours complétés. Ton coach personnel t'attend !</p>
          </div>
        </div>
      </div>

      {/* Contenu principal avec layout moderne */}
      <div className="flex flex-col md:flex-row min-h-0 flex-1">
        {/* Barre de boutons latérale */}
        <div className="w-full md:w-16 bg-white border-r border-gray-200 flex md:flex-col flex-row justify-center md:justify-start items-center py-4 gap-2">
          {/* Bouton Préférences */}
          <motion.button
            onClick={() => setActiveWidget(activeWidget === 'preferences' ? null : 'preferences')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeWidget === 'preferences' 
                ? 'bg-gray-900 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Préférences"
          >
            <Settings size={20} />
          </motion.button>

          {/* Bouton Buddy */}
          <motion.button
            onClick={() => setActiveWidget(activeWidget === 'buddy' ? null : 'buddy')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeWidget === 'buddy' 
                ? 'bg-gray-900 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Soutien de ton Buddy"
          >
            <Heart size={20} />
          </motion.button>

          {/* Bouton Dates d'examen */}
          <motion.button
            onClick={() => setActiveWidget(activeWidget === 'dates' ? null : 'dates')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeWidget === 'dates' 
                ? 'bg-gray-900 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Dates d'examen"
          >
            <Calendar size={20} />
          </motion.button>
        </div>

        {/* Widget latéral */}
        <AnimatePresence>
          {activeWidget && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 384, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-white border-r border-gray-200 overflow-hidden"
            >
              <div className="w-96 h-full overflow-y-auto p-8">
                {/* Header du widget */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {activeWidget === 'preferences' && 'Préférences'}
                    {activeWidget === 'buddy' && 'Soutien de ton Buddy'}
                    {activeWidget === 'dates' && 'Dates d\'examen'}
                  </h3>
                  <button
                    onClick={() => setActiveWidget(null)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Contenu du widget */}
                {activeWidget === 'preferences' && (
                  <div className="space-y-6">
                    {/* Notification de reportement si applicable */}
                    {plannerAccess.hasPostponed && onRestartOnboarding && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="text-blue-600" size={16} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">
                              Planification reportée
                            </h4>
                            <p className="text-xs text-blue-700 leading-relaxed mb-3">
                              Tu peux reprendre la configuration de ton planning quand tu veux !
                            </p>
                            <button
                              onClick={onRestartOnboarding}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Configurer maintenant →
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Jours disponibles - Design moderne */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-4">Jours disponibles</label>
                      <div className="grid grid-cols-7 gap-2">
                        {[
                          { id: 'monday', label: 'L' },
                          { id: 'tuesday', label: 'M' },
                          { id: 'wednesday', label: 'M' },
                          { id: 'thursday', label: 'J' },
                          { id: 'friday', label: 'V' },
                          { id: 'saturday', label: 'S' },
                          { id: 'sunday', label: 'D' }
                        ].map((day) => (
                          <button
                            key={day.id}
                            onClick={() => {
                              const newDays = preferences.availableDays.includes(day.id as any)
                                ? preferences.availableDays.filter(d => d !== day.id)
                                : [...preferences.availableDays, day.id as any];
                              setPreferences({ ...preferences, availableDays: newDays });
                            }}
                            className={`aspect-square text-xs font-semibold rounded-lg transition-all ${
                              preferences.availableDays.includes(day.id as any)
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Heures d'étude */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-3">
                        Heures d'étude par jour: {preferences.dailyStudyHours}h
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={preferences.dailyStudyHours}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          dailyStudyHours: parseInt(e.target.value)
                        })}
                        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1h</span>
                        <span>4h</span>
                        <span>8h</span>
                      </div>
                    </div>

                    {/* Créneaux préférés */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-3">Créneaux préférés</label>
                      <div className="space-y-2">
                        {[
                          { id: 'morning', label: 'Matin (6h-12h)' },
                          { id: 'afternoon', label: 'Après-midi (12h-18h)' },
                          { id: 'evening', label: 'Soir (18h-22h)' }
                        ].map((slot) => (
                          <label key={slot.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={preferences.preferredStudySlots.includes(slot.id as any)}
                              onChange={(e) => {
                                const newSlots = e.target.checked
                                  ? [...preferences.preferredStudySlots, slot.id as any]
                                  : preferences.preferredStudySlots.filter(s => s !== slot.id);
                                setPreferences({ ...preferences, preferredStudySlots: newSlots });
                              }}
                              className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                            />
                            <span className="text-sm text-gray-700">{slot.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Intensité d'étude */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-3">Intensité d'étude</label>
                      <select
                        value={preferences.studyIntensity}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          studyIntensity: e.target.value as any
                        })}
                        className="w-full p-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
                      >
                        <option value="light">Légère - Rythme détendu</option>
                        <option value="moderate">Modérée - Équilibre parfait</option>
                        <option value="intensive">Intensive - Préparation accélérée</option>
                      </select>
                    </div>

                    {/* Pauses */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-3">
                        Durée des pauses: {preferences.breakDuration}min
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="5"
                        value={preferences.breakDuration}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          breakDuration: parseInt(e.target.value)
                        })}
                        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5min</span>
                        <span>15min</span>
                        <span>30min</span>
                      </div>
                    </div>

                    {/* Horaires personnalisés */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-3">Horaires de travail</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Début</label>
                          <input
                            type="time"
                            value={preferences.preferredStartTime}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              preferredStartTime: e.target.value
                            })}
                            className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Fin</label>
                          <input
                            type="time"
                            value={preferences.preferredEndTime}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              preferredEndTime: e.target.value
                            })}
                            className="w-full p-2 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleNextWidget('preferences')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 py-4 font-semibold rounded-xl transition-all shadow-lg bg-gray-900 text-white hover:bg-gray-800"
                    >
                      Suivant →
                    </motion.button>
                  </div>
                )}

                {activeWidget === 'buddy' && (
                  <div className="space-y-6">
                    <SocialPlannerIntegration
                      userId="current_user"
                      userName="Étudiant SMS"
                      onNavigateToBuddies={() => {
                        // Navigation vers l'onglet Buddies de la Communauté
                        console.log('Navigation vers Buddies');
                      }}
                    />
                    <motion.button
                      onClick={() => handleNextWidget('buddy')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-8 py-4 font-semibold rounded-xl transition-all shadow-lg bg-gray-900 text-white hover:bg-gray-800"
                    >
                      Suivant →
                    </motion.button>
                  </div>
                )}

                {activeWidget === 'dates' && (
                  <div className="space-y-6">
                    <ParticipativeExamDates
                      favoriteCourses={favoriteCourses.length > 0 ? favoriteCourses : [
                        { id: 'suites-limites', title: 'Suites et Limites', progress: 67 },
                        { id: 'loi-gauss', title: 'Loi de Gauss', progress: 0 },
                        { id: 'integrales', title: 'Intégrales et Applications', progress: 0 },
                        { id: 'equilibres', title: 'Équilibres Chimiques', progress: 0 },
                        { id: 'analyse-math', title: 'Analyse Mathématique I', progress: 0 },
                        { id: 'mecanique', title: 'Mécanique Classique', progress: 0 },
                        { id: 'forces', title: 'Forces et Mouvement', progress: 0 }
                      ]}
                      focusedCourse={focusedCourse}
                      userId="current_user"
                      userName="Étudiant SMS"
                      faculty="Faculté Sciences"
                    />
                    <motion.button
                      onClick={handleGeneratePlan}
                      disabled={isGeneratingPlan}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full mt-8 py-4 font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                        isGeneratingPlan 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                      }`}
                    >
                      {isGeneratingPlan ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                          <span>{generatedPlan === null ? 'Génération en cours...' : 'Mise à jour en cours...'}</span>
                        </div>
                      ) : (
                        <>
                          <span>{generatedPlan === null ? 'Générer le planning' : 'Mettre à jour le planning'}</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone principale - Planning généré */}
        <div className={`flex-1 h-full bg-gray-50 overflow-hidden transition-all duration-300 ${
          activeWidget ? 'mr-0' : 'mr-0'
        }`}>
          {generatedPlan ? (
            // Affichage du planning avec le vrai composant AdvancedPlanDisplay
            <AdvancedPlanDisplay
              plan={generatedPlan}
              badges={advancedPlanner.badges}
              adaptationSuggestions={advancedPlanner.adaptationSuggestions}
              missedSessionAlert={advancedPlanner.missedSessionAlert}
              onEditPlan={() => setGeneratedPlan(null)}
              onRegeneratePlan={handleGeneratePlan}
              onSessionComplete={(sessionId) => {
                const updatedPlan = advancedPlanner.handleSessionComplete(sessionId);
                if (updatedPlan) setGeneratedPlan(updatedPlan);
              }}
              onApplyAdaptation={(suggestion, action) => {
                const updatedPlan = advancedPlanner.handleApplyAdaptation(suggestion, action);
                if (updatedPlan) setGeneratedPlan(updatedPlan);
              }}
              onDismissSuggestion={advancedPlanner.handleDismissSuggestion}
              onRescheduleSession={(sessionId, newDate, isAutomatic) => {
                const updatedPlan = advancedPlanner.handleSessionReschedule(sessionId, newDate, isAutomatic);
                if (updatedPlan) setGeneratedPlan(updatedPlan);
              }}
              onCloseMissedAlert={advancedPlanner.handleCloseMissedAlert}
              onManualReschedule={advancedPlanner.handleManualReschedule}
              focusedCourse={focusedCourse}
              onNavigateToCourse={onNavigateToCourse}
            />
          ) : (
            /* Interface de génération initiale - Style Premium */
            <div className="h-full p-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/60 h-full p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-6">Planning Intelligent</h2>
                  <div className="flex items-center justify-center">
                    <div className="text-sm font-medium text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-3 rounded-xl border border-emerald-200 shadow-sm">
                      🎯 Adaptation automatique en temps réel
                    </div>
                  </div>
                  
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent mb-4">Prêt à commencer ?</h3>
                    <p className="text-slate-600 font-medium mb-8 max-w-md mx-auto">
                      Configure tes préférences et génère ton planning personnalisé. Le système s'adapte automatiquement à tes progrès.
                    </p>
                    
                    <motion.button
                      onClick={() => setActiveWidget('preferences')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mx-auto px-8 py-4 text-base font-semibold rounded-xl transition-all shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Configurer mes préférences</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Planning intelligent
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      Adaptation temps réel
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Coaching intégré
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
