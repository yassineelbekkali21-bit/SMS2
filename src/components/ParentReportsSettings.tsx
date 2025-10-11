'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Settings,
  Shield,
  Calendar,
  FileText,
  Users,
  Video,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { ParentReportsService, ParentReportSettings } from '@/lib/parent-reports-service';

interface ParentReportsSettingsProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ParentReportsSettings({ userId, userName, isOpen, onClose }: ParentReportsSettingsProps) {
  const [settings, setSettings] = useState<ParentReportSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen, userId]);

  const loadSettings = () => {
    setIsLoading(true);
    
    const existingSettings = ParentReportsService.getParentReportSettings(userId);
    if (existingSettings) {
      setSettings(existingSettings);
    } else {
      // Créer des paramètres par défaut
      const defaultSettings = ParentReportsService.createDefaultSettings(
        userId,
        '',
        ''
      );
      setSettings(defaultSettings);
    }
    
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    
    try {
      // Valider les champs obligatoires
      if (settings.isEnabled && (!settings.parentEmail || !settings.parentName)) {
        alert('Veuillez remplir l\'email et le nom du parent pour activer les rapports.');
        setIsSaving(false);
        return;
      }

      // Sauvegarder les paramètres
      ParentReportsService.saveParentReportSettings(settings);
      
      // Générer un rapport de test si activé
      if (settings.isEnabled && settings.studentConsent && settings.parentConsent) {
        const testReport = ParentReportsService.generateWeeklyReport(userId);
        if (testReport) {
          console.log('📧 Rapport de test généré:', testReport);
        }
      }

      alert('Paramètres sauvegardés avec succès !');
      onClose();
      
    } catch (error) {
      console.error('Erreur sauvegarde paramètres rapports parents:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!settings) return;
    
    const testReport = ParentReportsService.generateWeeklyReport(userId);
    if (testReport) {
      const emailContent = ParentReportsService.formatReportForEmail(testReport, settings);
      
      // Ouvrir dans une nouvelle fenêtre pour prévisualiser
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(emailContent);
        previewWindow.document.close();
      }
    }
  };

  if (!isOpen || !settings) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Rapports Parents</h2>
                <p className="opacity-90">Configuration des résumés hebdomadaires</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Chargement...</span>
              </div>
            ) : (
              <>
                {/* Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">À propos des rapports parents</p>
                      <p>Les rapports hebdomadaires permettent aux parents de suivre la progression, l'activité sociale et les habitudes d'étude de leur enfant sur la plateforme.</p>
                    </div>
                  </div>
                </div>

                {/* Activation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Activer les rapports</h3>
                      <p className="text-sm text-gray-600">Envoyer des résumés hebdomadaires par email</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
                      className="p-1"
                    >
                      {settings.isEnabled ? (
                        <ToggleRight className="text-blue-600" size={24} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={24} />
                      )}
                    </button>
                  </div>

                  {settings.isEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 border-l-2 border-blue-200 pl-4"
                    >
                      {/* Email et nom du parent */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email du parent *
                          </label>
                          <input
                            type="email"
                            value={settings.parentEmail}
                            onChange={(e) => setSettings({ ...settings, parentEmail: e.target.value })}
                            placeholder="parent@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du parent *
                          </label>
                          <input
                            type="text"
                            value={settings.parentName}
                            onChange={(e) => setSettings({ ...settings, parentName: e.target.value })}
                            placeholder="Mme/M. Dupont"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Fréquence et jour */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fréquence
                          </label>
                          <select
                            value={settings.frequency}
                            onChange={(e) => setSettings({ ...settings, frequency: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="weekly">Hebdomadaire</option>
                            <option value="biweekly">Toutes les 2 semaines</option>
                            <option value="monthly">Mensuel</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jour d'envoi
                          </label>
                          <select
                            value={settings.preferredDay}
                            onChange={(e) => setSettings({ ...settings, preferredDay: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="sunday">Dimanche</option>
                            <option value="monday">Lundi</option>
                            <option value="tuesday">Mardi</option>
                            <option value="wednesday">Mercredi</option>
                            <option value="thursday">Jeudi</option>
                            <option value="friday">Vendredi</option>
                            <option value="saturday">Samedi</option>
                          </select>
                        </div>
                      </div>

                      {/* Contenu du rapport */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Contenu du rapport</h4>
                        
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.includeDetailed}
                              onChange={(e) => setSettings({ ...settings, includeDetailed: e.target.checked })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">Rapport détaillé (vs résumé)</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.includeSocialActivity}
                              onChange={(e) => setSettings({ ...settings, includeSocialActivity: e.target.checked })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">Activité sociale (buddies, entraide)</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.includeStudyRoomActivity}
                              onChange={(e) => setSettings({ ...settings, includeStudyRoomActivity: e.target.checked })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">Activité Study Rooms</span>
                          </label>
                        </div>
                      </div>

                      {/* Consentements */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Shield size={16} />
                          Consentements requis
                        </h4>
                        
                        <div className="space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.studentConsent}
                              onChange={(e) => setSettings({ ...settings, studentConsent: e.target.checked })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                            />
                            <span className="text-sm">
                              <strong>Consentement étudiant :</strong> J'autorise le partage de mes données d'apprentissage avec mes parents/tuteurs.
                            </span>
                          </label>
                          
                          <label className="flex items-start gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.parentConsent}
                              onChange={(e) => setSettings({ ...settings, parentConsent: e.target.checked })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                            />
                            <span className="text-sm">
                              <strong>Consentement parent :</strong> Le parent a donné son accord pour recevoir ces rapports.
                            </span>
                          </label>
                        </div>
                        
                        {(!settings.studentConsent || !settings.parentConsent) && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
                            <AlertTriangle size={14} />
                            <span>Les deux consentements sont requis pour activer les rapports.</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreview}
                disabled={!settings.isEnabled || isSaving}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Prévisualiser</span>
                </div>
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Sauvegarder</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


