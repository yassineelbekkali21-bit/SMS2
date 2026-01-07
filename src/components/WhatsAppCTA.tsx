'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

interface WhatsAppCTAProps {
  courseId: string;
  courseName: string;
  activeStudents?: number;
  weeklyQuestions?: number;
  isVeryActive?: boolean;
}

export function WhatsAppCTA({
  courseId,
  courseName,
  activeStudents = 124,
  weeklyQuestions = 37,
  isVeryActive = true
}: WhatsAppCTAProps) {
  
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Salut ! J'ai une question sur le cours "${courseName}". Pouvez-vous m'aider ? 🎓`
    );
    const whatsappUrl = `https://wa.me/+33123456789?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header avec question */}
      <div className="p-6 pb-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Une question ?</h3>
          <p className="text-sm text-gray-600">Posez vos questions, échangez avec d'autres étudiants et obtenez de l'aide rapidement !</p>
        </div>

        {/* Indicateurs d'activité FOMO */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Étudiants actifs */}
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Users size={14} className="text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Étudiants actifs</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{activeStudents}+</span>
              <span className="text-xs text-gray-500">en ligne</span>
            </div>
          </div>

          {/* Questions cette semaine */}
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Cette semaine</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">{weeklyQuestions}</span>
              <span className="text-xs text-gray-500">questions</span>
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <motion.button
          onClick={handleWhatsAppClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-[#25D366]/25 flex items-center justify-center gap-3"
        >
          <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
            <MessageCircle className="text-[#25D366]" size={14} />
          </div>
          <span>Rejoindre WhatsApp</span>
          <ArrowUpRight size={16} />
        </motion.button>
      </div>

      {/* Footer avec avatars simulés */}
      <div className="bg-white/50 border-t border-gray-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-gray-900 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                +
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              et {activeStudents - 4} autres
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">En ligne maintenant</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}







