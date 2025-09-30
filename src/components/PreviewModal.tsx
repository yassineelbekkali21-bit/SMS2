'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause,
  Clock, 
  Star,
  Zap,
  CheckCircle,
  ArrowRight,
  Eye,
  Gift,
  Crown,
  Brain,
  TrendingUp,
  Target,
  BookOpen,
  Shield,
  Sparkles,
  Heart
} from 'lucide-react';
import { Course } from '@/types';

// 🎨 Fonctions utilitaires reprises de CourseViewer
const generatePreviewPattern = (courseId: string, title: string) => {
  const hash = title.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const patterns = [
    'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)',
    'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%), radial-gradient(circle at 60% 40%, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
    'conic-gradient(from 180deg at 50% 50%, rgba(236, 72, 153, 0.3) 0deg, rgba(59, 130, 246, 0.3) 120deg, rgba(34, 197, 94, 0.3) 240deg, rgba(236, 72, 153, 0.3) 360deg)',
    'radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.4) 0%, transparent 60%), linear-gradient(45deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
    'linear-gradient(45deg, rgba(239, 68, 68, 0.3) 0%, rgba(251, 191, 36, 0.3) 50%, rgba(34, 197, 94, 0.3) 100%)'
  ];
  return patterns[Math.abs(hash) % patterns.length];
};

const getPreviewIcon = (title: string, faculty: string) => {
  if (title.toLowerCase().includes('math')) return Brain;
  if (title.toLowerCase().includes('physique')) return Zap;
  if (title.toLowerCase().includes('économie') || faculty.includes('Solvay')) return TrendingUp;
  if (title.toLowerCase().includes('informatique')) return Target;
  return BookOpen;
};

const getPreviewColors = (title: string, faculty: string) => {
  if (title.toLowerCase().includes('math')) return {
    primary: 'from-blue-500 to-indigo-600',
    accent: 'bg-blue-500/20 border-blue-400/30 text-blue-300',
    glow: 'shadow-blue-500/20'
  };
  if (title.toLowerCase().includes('physique')) return {
    primary: 'from-purple-500 to-violet-600', 
    accent: 'bg-purple-500/20 border-purple-400/30 text-purple-300',
    glow: 'shadow-purple-500/20'
  };
  if (title.toLowerCase().includes('économie') || faculty.includes('Solvay')) return {
    primary: 'from-emerald-500 to-teal-600',
    accent: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300',
    glow: 'shadow-emerald-500/20'
  };
  if (title.toLowerCase().includes('informatique')) return {
    primary: 'from-orange-500 to-amber-600',
    accent: 'bg-orange-500/20 border-orange-400/30 text-orange-300',
    glow: 'shadow-orange-500/20'
  };
  return {
    primary: 'from-gray-500 to-slate-600',
    accent: 'bg-gray-500/20 border-gray-400/30 text-gray-300',
    glow: 'shadow-gray-500/20'
  };
};

interface PreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  onNavigateToUnlock?: () => void;
  onShowUpsell?: (courseId: string) => void;
  onNavigateToCourse?: (courseId: string) => void;
}

export function PreviewModal({ course, isOpen, onClose, onEnroll, onNavigateToUnlock, onShowUpsell, onNavigateToCourse }: PreviewModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes en secondes
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPreview, setHasStartedPreview] = useState(false);
  const [showUnlockBanner, setShowUnlockBanner] = useState(false);
  const [courseUnlocked, setCourseUnlocked] = useState(false);

  // 🎨 Design génératif pour l'aperçu
  const previewPattern = course ? generatePreviewPattern(course.id, course.title) : '';
  const PreviewIcon = course ? getPreviewIcon(course.title, course.faculty) : BookOpen;
  const colors = course ? getPreviewColors(course.title, course.faculty) : {
    primary: 'from-gray-500 to-slate-600',
    accent: 'bg-gray-500/20 border-gray-400/30 text-gray-300',
    glow: 'shadow-gray-500/20'
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && hasStartedPreview && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setShowUnlockBanner(true); // Afficher la bannière quand le temps est écoulé
            return 0;
          }
          // Afficher la bannière quand il reste 30 secondes
          if (prev === 31) {
            setShowUnlockBanner(true);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, hasStartedPreview, timeRemaining]);

  // Reset timer when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeRemaining(600);
      setIsPlaying(false);
      setHasStartedPreview(false);
      setShowUnlockBanner(false);
      setCourseUnlocked(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPreview = () => {
    setHasStartedPreview(true);
    setIsPlaying(true);
  };


  const handleUnlockCourse = () => {
    if (course && onShowUpsell) {
      onShowUpsell(course.id);
    }
  };

  const handleCloseModal = () => {
    if (onNavigateToUnlock) {
      onNavigateToUnlock(); // Rediriger vers le module "Débloquer" au lieu de fermer brutalement
    } else {
      onClose();
    }
  };

  const handleCourseUnlocked = () => {
    setCourseUnlocked(true);
    setShowUnlockBanner(false);
    // Rediriger vers le course viewer après un court délai
    setTimeout(() => {
      if (course && onNavigateToCourse) {
        onNavigateToCourse(course.id);
        onClose();
      }
    }, 1000);
  };

  if (!course) return null;

  const previewBenefits = [
    "Accès complet au cours pendant 10 minutes",
    "Vidéos HD sans restriction",
    "Documents et ressources disponibles",
    "Aperçu des exercices pratiques"
  ];

  const courseBenefits = [
    "Accès illimité à vie",
    "Support communautaire 24/7", 
    "Certificat de completion",
    "Mises à jour gratuites",
    "Accès mobile et hors-ligne"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl w-[98vw] max-w-none max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 🎁 Header Aperçu - Bienveillant & Moderne */}
            <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
              {/* Pattern génératif en arrière-plan */}
              <div 
                className="absolute inset-0 opacity-50"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%), ${previewPattern}`,
                }}
              />
              
              {/* Mesh gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-50/20" />
              
              {/* Particules flottantes discrètes */}
              <motion.div 
                className="absolute top-4 left-16 w-1.5 h-1.5 bg-amber-400/40 rounded-full"
                animate={{ y: [0, -6, 0], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="absolute top-6 right-24 w-1 h-1 bg-emerald-400/30 rounded-full"
                animate={{ y: [0, -4, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              />
              
              {/* Timer flottant (si aperçu commencé) */}
              {hasStartedPreview && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 left-6 flex items-center gap-2 bg-amber-500/90 backdrop-blur-sm text-amber-900 px-4 py-2 rounded-full shadow-lg border border-amber-400/50"
                >
                  <Clock size={16} />
                  <span className="text-sm font-bold">
                    {timeRemaining > 0 ? formatTime(timeRemaining) : "⏰ Temps écoulé"}
                  </span>
                </motion.div>
              )}

              {/* Bouton fermer modernisé */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseModal();
                }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 border border-gray-200/50 group"
                title="Retour au catalogue"
              >
                <X size={18} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
              </motion.button>

              <div className="relative p-6">
                <div className="flex items-center gap-6">
                  
                  {/* Icône contextuelle et infos principales */}
                  <div className="flex items-center gap-6 flex-1">
                    {/* Icône domaine avec badge aperçu */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.primary} shadow-lg ${colors.glow} flex items-center justify-center`}
                    >
                      <PreviewIcon size={32} className="text-white drop-shadow-lg" />
                      {/* Badge aperçu gratuit */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <Gift size={16} className="text-white" />
                      </div>
                    </motion.div>
                    
                    <div className="flex-1 space-y-3">
                      {/* Badge aperçu gratuit principal */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                          <Sparkles size={16} />
                          Aperçu Gratuit
                        </div>
                        {course.previewDuration && (
                          <span className="text-gray-600 text-sm font-medium">• {course.previewDuration}</span>
                        )}
                      </motion.div>
                      
                      {/* Titre et sous-titre */}
                      <div className="space-y-2">
                        <motion.h1 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-3xl font-bold text-gray-900 leading-tight"
                        >
                          {course.title}
                        </motion.h1>
                        
                        {/* Message bienveillant d'aperçu */}
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-gray-50/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50"
                        >
                          <p className="text-gray-700 font-medium text-sm flex items-center gap-2">
                            🎓 Découvrez ce cours en toute tranquillité • Aucun engagement
                          </p>
                        </motion.div>
                      </div>
                      
                      {/* Informations instructeur et faculté */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4 text-sm text-gray-600"
                      >
                        <span className="font-medium">{course.faculty}</span>
                        
                        {/* Badge de confiance */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                          <Shield size={12} />
                          <span>Aperçu sécurisé</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Section droite : Métriques d'aperçu */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-4"
                  >
                    {/* Durée aperçu */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center px-4 py-3 bg-amber-50/80 rounded-xl border border-amber-200/50"
                    >
                      <div className="flex items-center gap-2 text-amber-700 font-bold">
                        <Eye size={16} />
                        <span>10 min</span>
                      </div>
                      <div className="text-xs text-amber-600 font-medium">Gratuit</div>
                    </motion.div>
                    
                    {/* Qualité */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="text-center px-4 py-3 bg-emerald-50/80 rounded-xl border border-emerald-200/50"
                    >
                      <div className="flex items-center gap-2 text-emerald-700 font-bold">
                        <Crown size={16} />
                        <span>HD</span>
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">Premium</div>
                    </motion.div>
                  </motion.div>
                  
                </div>
              </div>
            </div>

            <div className="flex h-[calc(95vh-140px)]">
              {/* Video Preview Area */}
              <div className="flex-1 flex flex-col">
                {!hasStartedPreview ? (
                  /* Preview Start Screen */
                  <div className="flex-1 bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-lg px-8">
                      <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                        <Eye size={32} className="text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-light text-black mb-6">
                        Découvrez ce cours gratuitement
                      </h3>
                      
                      <div className="space-y-2 mb-6">
                        {previewBenefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleStartPreview}
                        className="w-full bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play size={18} />
                        Commencer l'aperçu gratuit
                      </button>
                      
                      <p className="text-xs text-gray-500 mt-3">
                        Aucune carte de crédit requise
                      </p>
                    </div>
                  </div>
                ) : timeRemaining > 0 ? (
                  /* Active Preview */
                  <div className="flex-1 bg-black relative">
                    <video
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    >
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                    
                    {/* Overlay countdown */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
                      Aperçu : {formatTime(timeRemaining)}
                    </div>
                    
                    {/* Bannière flottante d'unlock */}
                    <AnimatePresence>
                      {showUnlockBanner && !courseUnlocked && (
                        <motion.div
                          initial={{ opacity: 0, y: 50, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ type: "spring", duration: 0.6 }}
                          className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl shadow-2xl border border-white/20"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-1">
                                🔓 Débloque maintenant l'accès complet à ce cours
                              </h4>
                              <p className="text-white/90 text-sm">
                                Continue ton apprentissage sans interruption
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => setShowUnlockBanner(false)}
                                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <X size={16} />
                              </button>
                              <button
                                onClick={handleUnlockCourse}
                                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                              >
                                Débloquer maintenant
                                <ArrowRight size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Message de succès après unlock */}
                    <AnimatePresence>
                      {courseUnlocked && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 bg-black/80 flex items-center justify-center"
                        >
                          <div className="bg-white rounded-2xl p-8 text-center max-w-md">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                              <CheckCircle size={32} className="text-white" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Cours débloqué !</h3>
                            <p className="text-gray-600 mb-4">Redirection vers le cours complet...</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1 }}
                                className="bg-green-500 h-2 rounded-full"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Time Expired */
                  <div className="flex-1 bg-gray-900 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-medium mb-2">Aperçu terminé</h3>
                      <p className="text-gray-400 mb-6">
                        Débloque maintenant l'accès complet pour continuer ton apprentissage
                      </p>
                      <button
                        onClick={handleUnlockCourse}
                        className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                      >
                        🔓 Débloquer le cours complet
                      </button>
                    </div>
                  </div>
                )}

                {/* Course Info */}
                <div className="p-6 bg-white border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Progression actuelle</p>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-black">{course.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Durée totale</p>
                      <p className="font-medium text-black">{course.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar CTA */}
              <div className="w-96 bg-gray-50 p-8 overflow-y-auto">
                <div className="sticky top-0">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Crown size={20} className="text-amber-500" />
                      <h3 className="font-semibold text-black">Accès Complet</h3>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {courseBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center mb-4">
                      {course.creditCost ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-black">700€</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Accédez à toutes les leçons, quiz et exercices pratiques sans limite.
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-2xl font-bold text-green-600">Gratuit</span>
                          <p className="text-sm text-gray-600 mb-2">
                            Accédez à toutes les leçons, quiz et exercices pratiques sans limite.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CTA principal unique */}
                    <button
                      onClick={handleUnlockCourse}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      🔓 Débloquer le cours complet
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Noté 4.9/5 par {course.enrolledStudents || 124} étudiants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
