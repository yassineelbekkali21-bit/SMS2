'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Plus,
  BookOpen,
  Lock,
  ChevronRight,
  Zap,
  ArrowRight
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface DetectedCourse {
  id: string;
  title: string;
  program: string;
  isOwned: boolean;
}

interface DocumentUploadWidgetProps {
  onCoursesDetected?: (courses: DetectedCourse[]) => void;
  ownedPrograms?: string[];
  floating?: boolean;
}

export function DocumentUploadWidget({ 
  onCoursesDetected, 
  ownedPrograms = [],
  floating = true 
}: DocumentUploadWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [detectedCourses, setDetectedCourses] = useState<DetectedCourse[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        size: file.size
      }));
      setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 10));
      setAnalysisComplete(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setAnalysisComplete(false);
  };

  const analyzeDocuments = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse (en production, appel API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock: détecter des cours basés sur les fichiers uploadés
    const mockDetectedCourses: DetectedCourse[] = [
      { 
        id: 'course-econometrie', 
        title: 'Économétrie', 
        program: 'economics',
        isOwned: ownedPrograms.includes('economics')
      },
      { 
        id: 'course-macro', 
        title: 'Macroéconomie', 
        program: 'economics',
        isOwned: ownedPrograms.includes('economics')
      },
      { 
        id: 'course-stats-avancees', 
        title: 'Statistiques Avancées', 
        program: 'mathematics',
        isOwned: ownedPrograms.includes('mathematics')
      },
    ];
    
    setDetectedCourses(mockDetectedCourses);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    
    if (onCoursesDetected) {
      onCoursesDetected(mockDetectedCourses);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Version sidebar - Light mode simplifié
  if (!floating) {
    return (
      <>
        {/* Mini zone d'upload - Light mode */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div
            onClick={() => setIsExpanded(true)}
            className="group cursor-pointer"
          >
            {/* Card minimaliste SMS style */}
            <div className="group cursor-pointer">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Upload size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Importer mes documents
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Personnalise ton contenu
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modal d'upload - Style SMS minimaliste */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              onClick={() => setIsExpanded(false)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/60" />
              
              {/* Modal centré - Style SMS */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header minimaliste */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                        <Upload size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">Importer mes documents</h3>
                        <p className="text-sm text-gray-500">Personnalise ton contenu</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsExpanded(false)}
                      className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Upload Zone minimaliste */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 hover:border-gray-900 rounded-xl p-8 cursor-pointer hover:bg-gray-50 transition-all text-center group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.ppt,.pptx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Plus size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-1">
                      Glisse tes fichiers ici
                    </p>
                    <p className="text-gray-500 text-sm">
                      ou clique pour parcourir
                    </p>
                    <p className="text-gray-400 text-xs mt-3">
                      PDF, Word, Images • Max 10 fichiers
                    </p>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file) => (
                        <div 
                          key={file.id}
                          className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-gray-900" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFile(file.id)}
                            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <X size={16} className="text-gray-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Analysis Results */}
                  <AnimatePresence>
                    {analysisComplete && detectedCourses.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle size={18} className="text-gray-900" />
                            <span className="font-semibold text-gray-900">
                              {detectedCourses.length} cours détectés
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Basé sur tes documents
                          </p>
                        </div>

                        <div className="space-y-2">
                          {detectedCourses.map((course) => (
                            <div 
                              key={course.id}
                              className="flex items-center justify-between rounded-xl px-4 py-3 border border-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  course.isOwned ? 'bg-gray-900' : 'bg-gray-100'
                                }`}>
                                  {course.isOwned ? (
                                    <BookOpen size={14} className="text-white" />
                                  ) : (
                                    <Lock size={12} className="text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{course.title}</p>
                                  <p className="text-xs text-gray-500">{course.program}</p>
                                </div>
                              </div>
                              {course.isOwned ? (
                                <span className="text-xs font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                                  Ajouté
                                </span>
                              ) : (
                                <span className="text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1 rounded-full">
                                  Essai gratuit
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer CTA */}
                {uploadedFiles.length > 0 && !analysisComplete && (
                  <div className="p-6 pt-0">
                    <button
                      onClick={analyzeDocuments}
                      disabled={isAnalyzing}
                      className="w-full py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles size={18} />
                          </motion.div>
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          Analyser mes documents
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {/* Widget principal (non-flottant) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Upload size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Personnalise ton parcours</h3>
                <p className="text-sm text-gray-500">Upload tes documents pour des recommandations sur-mesure</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-blue-50 rounded-full">
              <span className="text-xs font-semibold text-blue-600">Recommandé</span>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="p-5">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-6 cursor-pointer hover:bg-blue-50/30 transition-all text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.ppt,.pptx"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Plus size={24} className="text-gray-400" />
            </div>
            
            <p className="text-gray-700 font-medium mb-1">
              Dépose tes fichiers ici
            </p>
            <p className="text-gray-400 text-sm">
              Synthèses, examens, exercices, syllabus...
            </p>
            <p className="text-gray-400 text-xs mt-2">
              PDF, Word, Images • Max 10 fichiers
            </p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Analyze Button */}
          {uploadedFiles.length > 0 && !analysisComplete && (
            <button
              onClick={analyzeDocuments}
              disabled={isAnalyzing}
              className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={18} />
                  </motion.div>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyser mes documents
                </>
              )}
            </button>
          )}

          {/* Analysis Results */}
          <AnimatePresence>
            {analysisComplete && detectedCourses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={18} className="text-green-600" />
                    <span className="font-semibold text-green-800">
                      {detectedCourses.length} cours détectés !
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Basé sur tes documents, nous avons identifié des cours qui correspondent à ton programme.
                  </p>
                </div>

                <div className="space-y-2">
                  {detectedCourses.map((course) => (
                    <div 
                      key={course.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          course.isOwned ? 'bg-blue-100' : 'bg-gray-200'
                        }`}>
                          {course.isOwned ? (
                            <BookOpen size={16} className="text-blue-600" />
                          ) : (
                            <Lock size={14} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{course.title}</p>
                          <p className="text-xs text-gray-500">{course.program}</p>
                        </div>
                      </div>
                      {course.isOwned ? (
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Ajouté
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          Essai gratuit
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {detectedCourses.some(c => !c.isOwned) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={18} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Certains cours nécessitent un abonnement
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Tu peux commencer un essai gratuit de 10h pour découvrir le contenu.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              <span className="font-semibold text-gray-900">2,400+</span> étudiants ont personnalisé leur parcours
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-medium text-gray-700">4.9</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal pour version compacte - TODO si besoin */}
    </>
  );
}

