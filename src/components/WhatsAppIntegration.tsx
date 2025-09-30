'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, ArrowUpRight, TrendingUp } from 'lucide-react';

interface WhatsAppIntegrationProps {
  courseId: string;
  courseName: string;
  type: 'inline' | 'section'; // inline: à côté de la vidéo, section: section communauté
  studentCount?: number;
  weeklyQuestions?: number;
  whatsappGroupUrl?: string;
}

export function WhatsAppIntegration({
  courseId,
  courseName,
  type,
  studentCount = 124,
  weeklyQuestions = 37,
  whatsappGroupUrl
}: WhatsAppIntegrationProps) {
  const handleJoinWhatsApp = () => {
    // Si une URL spécifique n'est pas fournie, on génère un lien par défaut
    const defaultMessage = encodeURIComponent(`Salut ! Je suis un étudiant de "${courseName}" sur Science Made Simple. J'aimerais rejoindre le groupe d'étude WhatsApp.`);
    const defaultUrl = `https://wa.me/+32123456789?text=${defaultMessage}`;
    
    const finalUrl = whatsappGroupUrl || defaultUrl;
    window.open(finalUrl, '_blank');
  };

  if (type === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm">
                Une question ? 
              </div>
              <div className="text-green-700 text-xs">
                +{studentCount} étudiants échangent déjà
              </div>
            </div>
          </div>
          
          <motion.button
            onClick={handleJoinWhatsApp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            Rejoindre
            <ArrowUpRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Communauté WhatsApp</h3>
            <p className="text-sm text-gray-600">Posez vos questions, échangez avec les autres étudiants</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <p className="text-gray-700 leading-relaxed">
            Vos questions alimentent le cours. Rejoignez le groupe WhatsApp pour poser vos questions et 
            échanger avec les autres étudiants. Une communauté active vous attend !
          </p>
        </div>

        {/* Statistiques d'activité */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="text-green-600" size={16} />
              <span className="text-sm font-medium text-gray-600">Étudiants actifs</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">+{studentCount}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-gray-600">Questions cette semaine</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{weeklyQuestions}</div>
          </div>
        </div>

        {/* Call-to-Action */}
        <motion.button
          onClick={handleJoinWhatsApp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          <MessageCircle size={20} />
          <span>Rejoindre la discussion</span>
          <ArrowUpRight size={16} />
        </motion.button>

        {/* Note explicative */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔥 Effet FOMO garanti : voyez le groupe s'agiter même quand vous n'étudiez pas !
          </p>
        </div>
      </div>
    </div>
  );
}




