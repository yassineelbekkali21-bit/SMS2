import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Target, 
  Users, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Settings,
  Heart,
  Zap,
  MessageCircle,
  Lock,
  Crown,
  Sparkles,
  ArrowRight,
  Phone
} from 'lucide-react';
import { PlannerAccess, StudyPreferences, StudyPlan, BuddySystem, Course } from '@/types/index';
import { BuddySystemComponent } from './BuddySystem';
import { GeneratedPlanDisplay } from './GeneratedPlanDisplay';
import { AdvancedPlanDisplay } from './AdvancedPlanDisplay';
import { useAdvancedPlanner } from '@/lib/use-advanced-planner';
import { CollapsibleBlock } from './CollapsibleBlock';
import { ParticipativeExamDates } from './ParticipativeExamDates';
import { SocialPlannerIntegration } from './SocialPlannerIntegration';

interface StrategicPlannerProps {
  plannerAccess: PlannerAccess;
  onGeneratePlan?: (preferences: StudyPreferences) => StudyPlan;
  onWhatsAppContact?: () => void;
  onUpgrade?: () => void;
  onRestartOnboarding?: () => void; // Nouveau: relancer l'onboarding
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
  focusedCourse?: Course | null; // Nouveau: cours sur lequel se concentrer depuis l'onboarding
  onNavigateToCourse?: (courseId: string) => void; // Nouveau: navigation vers le Course Viewer
}

export function StrategicPlanner({ 
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
  onNavigateToCourse
}: StrategicPlannerProps) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<StudyPreferences>({
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    preferredStartTime: '09:00',
    preferredEndTime: '17:00',
    dailyStudyHours: 3,
    preferredStudySlots: ['morning', 'afternoon'],
    breakDuration: 15,
    studyIntensity: 'moderate'
  });

  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Charger automatiquement le planning existant s'il y en a un
  React.useEffect(() => {
    if (plannerAccess.hasAccess) {
      // Simuler la récupération d'un planning existant
      // En réalité, ceci devrait venir d'un service ou d'un hook
      const mockExistingPlan = localStorage.getItem('planner_1');
      if (mockExistingPlan && !generatedPlan) {
        try {
          const parsedPlan = JSON.parse(mockExistingPlan);
          // Reconstruire les dates
          parsedPlan.startDate = new Date(parsedPlan.startDate);
          parsedPlan.examDate = new Date(parsedPlan.examDate);
          parsedPlan.lastUpdated = new Date(parsedPlan.lastUpdated);
          parsedPlan.sessions = parsedPlan.sessions.map((session: any) => ({
            ...session,
            date: new Date(session.date)
          }));
          setGeneratedPlan(parsedPlan);
          console.log('📅 Planning existant chargé:', parsedPlan);
        } catch (error) {
          console.error('Erreur lors du chargement du planning existant:', error);
        }
      }
    }
  }, [plannerAccess.hasAccess, generatedPlan]);

  // Hook avancé pour le planificateur intelligent
  const advancedPlanner = useAdvancedPlanner({
    plan: generatedPlan || undefined,
    buddy: buddy || undefined,
    plannerAccess
  });

  const handleGeneratePlan = () => {
    if (!onGeneratePlan) return;
    
    setIsGeneratingPlan(true);
    const isUpdate = generatedPlan !== null;
    
    // Simuler un délai de génération pour l'UX
    setTimeout(() => {
      try {
        const plan = onGeneratePlan(preferences);
        setGeneratedPlan(plan);
        
        // Afficher un message contextualisé
        if (isUpdate && focusedCourse) {
          console.log(`✅ Planning mis à jour avec le cours "${focusedCourse.title}"`);
        } else if (isUpdate) {
          console.log('🔄 Planning mis à jour avec succès');
        } else {
          console.log('✨ Nouveau planning créé avec succès');
        }
      } catch (error) {
        console.error('Erreur lors de la génération du planning:', error);
        alert('Erreur lors de la génération du planning');
      } finally {
        setIsGeneratingPlan(false);
      }
    }, 1500);
  };

  const handleEditPlan = () => {
    setGeneratedPlan(null); // Retour aux préférences
  };

  const handleRegeneratePlan = () => {
    handleGeneratePlan(); // Régénérer avec les mêmes préférences
  };


  // Si pas d'accès → Message d'upsell moderne et élégant
  if (!plannerAccess.hasAccess) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Hero Section */}
          <div className="mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-indigo-200"
            >
              <Calendar className="text-indigo-600" size={40} />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-5xl font-semibold text-gray-900 mb-6 tracking-tight"
            >
              Planification
            </motion.h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8 rounded-full"
            />
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
            >
              {plannerAccess.accessMessage}
            </motion.p>
          </div>

          {/* Fonctionnalités - Design moderne avec cartes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid md:grid-cols-2 gap-6 mb-16"
          >
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Target className="text-indigo-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GPS de tes études</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Planning personnalisé avec deadlines et ajustements automatiques
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-emerald-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Buddy System</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Responsabilité sociale avec alertes automatiques
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Adaptation intelligente</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Optimisation en temps réel selon tes progrès
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="text-orange-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Coaching humain</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Accompagnement direct via WhatsApp
              </p>
            </div>
          </motion.div>

          {/* Actions modernes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              onClick={onUpgrade}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              Débloquer la planification
            </motion.button>
            
            <motion.button
              onClick={onWhatsAppContact}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Discuter avec nous
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Si accès → Interface du planificateur minimaliste plein écran

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-white">
      {/* Header moderne avec fond blanc */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 px-8 py-6 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Planification</h1>
            <p className="text-base text-gray-600 mt-2">{plannerAccess.accessMessage}</p>
          </div>
          
          {/* Bouton WhatsApp moderne et élégant */}
          <motion.button
            onClick={onWhatsAppContact}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
          >
            <MessageCircle size={18} />
            <span className="text-sm font-semibold">Support</span>
          </motion.button>
        </div>
      </div>

      {/* Contenu principal avec layout moderne */}
      <div className="flex flex-col md:flex-row min-h-0 flex-1">
        {/* Sidebar gauche - Préférences (Design moderne) */}
        <div className="w-full md:w-96 bg-white/60 backdrop-blur-sm border-r border-gray-100 min-h-96 md:min-h-full overflow-y-auto">
          <div className="p-8 space-y-8">
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

            {/* Préférences enrichies avec bloc dépliable */}
            <CollapsibleBlock
              title="Préférences"
              icon={<Settings size={16} />}
              iconBgColor="bg-indigo-100"
              iconTextColor="text-indigo-600"
              defaultExpanded={false}
            >
              <div className="space-y-6">
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
                            ? 'bg-indigo-600 text-white shadow-md'
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

              </div>

              <motion.button
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full mt-8 py-4 font-semibold rounded-xl transition-all shadow-lg ${
                  isGeneratingPlan 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/25'
                }`}
              >
                {isGeneratingPlan ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                    Génération en cours...
                  </div>
                ) : (
                  'Générer le planning'
                )}
              </motion.button>
            </CollapsibleBlock>

            {/* Soutien de ton Buddy avec bloc dépliable */}
            <CollapsibleBlock
              title="Soutien de ton Buddy"
              icon={<Heart size={16} />}
              iconBgColor="bg-green-50"
              iconTextColor="text-green-600"
              defaultExpanded={false}
            >
              <SocialPlannerIntegration
                userId="current_user"
                userName="Étudiant SMS"
                onNavigateToBuddies={() => {
                  // Navigation vers l'onglet Buddies de la Communauté
                  console.log('Navigation vers Buddies');
                }}
              />
            </CollapsibleBlock>

            {/* Dates d'examen participatives avec bloc dépliable */}
            <CollapsibleBlock
              title="Dates d'examen"
              icon={<Calendar size={16} />}
              iconBgColor="bg-orange-100"
              iconTextColor="text-orange-600"
              defaultExpanded={true}
            >
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
            </CollapsibleBlock>
          </div>
        </div>

        {/* Zone principale - Planning */}
        <div className="flex-1 h-full bg-gray-50 overflow-hidden">
          {generatedPlan ? (
            // Affichage du planning généré
            <AdvancedPlanDisplay
              plan={generatedPlan}
              badges={advancedPlanner.badges}
              adaptationSuggestions={advancedPlanner.adaptationSuggestions}
              missedSessionAlert={advancedPlanner.missedSessionAlert}
              onEditPlan={handleEditPlan}
              onRegeneratePlan={handleRegeneratePlan}
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
          ) : isGeneratingPlan ? (
            // État de chargement
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full mx-auto mb-6"
                />
                <h3 className="text-xl font-medium text-black mb-4">Génération de votre planning...</h3>
                <p className="text-gray-600 max-w-md">
                  Analyse de vos préférences et création d'un planning personnalisé optimal.
                </p>
              </div>
            </div>
          ) : (
            // État par défaut - aucun planning généré
            <div className="h-full flex flex-col">
              {/* Header de la zone planning */}
              <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-black">Planning généré</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Adaptation automatique</span>
                  </div>
                </div>
              </div>

              {/* Contenu du planning */}
              <div className="flex-1 p-8 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Calendar className="text-gray-400" size={24} />
                  </div>
                  
                  <h3 className="text-lg font-medium text-black mb-3">
                    Prêt à commencer ?
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Configure tes préférences et génère ton planning personnalisé. Le système s'adapte automatiquement à tes progrès.
                  </p>
                  
                  <motion.button
                    onClick={handleGeneratePlan}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-8 py-3 font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition-all mb-4"
                  >
                    ✨ Générer mon planning
                  </motion.button>
                  
                  <div className="text-sm text-gray-500">
                    Planning intelligent • Adaptation temps réel • Coaching intégré
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
