'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  X, 
  FileText, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (file: File) => void;
}

export function IdentityVerificationModal({ 
  isOpen, 
  onClose, 
  onUploadComplete 
}: IdentityVerificationModalProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('error');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      return;
    }

    setSelectedFile(file);
    setUploadStatus('uploading');

    // Simuler l'upload
    setTimeout(() => {
      setUploadStatus('success');
      onUploadComplete(file);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-8 text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="text-white" size={28} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sécurisez votre compte
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Une étape simple pour protéger votre parcours d'apprentissage et accéder à toutes nos fonctionnalités premium.
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {uploadStatus === 'idle' && (
              <>
                <p className="text-gray-700 mb-6 text-center">
                  Ajoutez votre pièce d'identité en toute sécurité – le processus ne prend qu'une minute.
                </p>

                {/* Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                >
                  <Upload className="text-gray-400 mx-auto mb-4" size={32} />
                  <p className="text-gray-600 mb-2 font-medium">
                    Glissez votre document ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Formats acceptés : PDF, JPG, PNG • Taille max : 5MB
                  </p>
                  
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className="hidden"
                    id="identity-upload"
                  />
                  <label
                    htmlFor="identity-upload"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <FileText size={18} />
                    Sélectionner mon document
                  </label>
                </div>

                {/* Accepted formats */}
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText size={16} />
                    PDF
                  </div>
                  <div className="flex items-center gap-1">
                    <ImageIcon size={16} />
                    JPG/PNG
                  </div>
                </div>
              </>
            )}

            {uploadStatus === 'uploading' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Téléchargement en cours...
                </h3>
                <p className="text-gray-600">
                  Votre document est en cours de téléchargement sécurisé
                </p>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Document reçu avec succès !
                </h3>
                <p className="text-gray-600 mb-6">
                  Votre document est maintenant en cours de vérification. Vous recevrez une notification dès que le processus sera terminé.
                </p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Parfait, merci !
                </button>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Format non supporté
                </h3>
                <p className="text-gray-600 mb-6">
                  Veuillez sélectionner un fichier PDF, JPG ou PNG de moins de 5MB.
                </p>
                <button
                  onClick={() => setUploadStatus('idle')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  Réessayer
                </button>
              </div>
            )}
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
