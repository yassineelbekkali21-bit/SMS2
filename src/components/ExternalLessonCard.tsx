'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock,
  MessageCircle,
  ExternalLink,
  Tag,
  MapPin,
  PlayCircle
} from 'lucide-react';
import { Lesson } from '@/types';
import { getWhatsAppLink } from '@/lib/mock-data';

interface ExternalLessonCardProps {
  lesson: Lesson & { catalogInfo: any };
  userBalance: number;
}

export function ExternalLessonCard({
  lesson,
  userBalance
}: ExternalLessonCardProps) {
  
  const handleWhatsAppContact = () => {
    const whatsappLink = getWhatsAppLink(lesson.catalogInfo);
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-6 relative overflow-hidden"
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Étiquette "Hors programme" */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-200">
          <Tag size={12} className="inline mr-1" />
          {lesson.catalogInfo.category || 'Hors programme'}
        </div>
      </div>

      {/* Source université */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <MapPin size={14} />
        <span className="font-medium">{lesson.catalogInfo.source}</span>
      </div>

      {/* Titre et description */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 pr-20">{lesson.title}</h3>
        
        {/* Description */}
        <div className="text-sm text-gray-700 leading-relaxed mb-4">
          {lesson.description}
        </div>

        {/* Métadonnées de la leçon */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{lesson.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle size={16} />
            <span>Leçon #{lesson.order}</span>
          </div>
        </div>

        {/* Niveau */}
        <div>
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              lesson.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
              'bg-orange-100 text-orange-800'}
          `}>
            Niveau {lesson.difficulty === 'beginner' ? 'Débutant' : 
                    lesson.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
          </span>
        </div>
      </div>

      {/* Prix et action */}
      <div className="space-y-4">
        <div className="text-center py-3 bg-gray-50 rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Prix</div>
          <div className="text-xl font-bold text-gray-900">{lesson.price}€</div>
        </div>

        {/* Bouton WhatsApp unique */}
        <motion.button
          onClick={handleWhatsAppContact}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                     text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 
                     flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle size={20} />
          <span>Discuter sur WhatsApp</span>
          <ExternalLink size={16} />
        </motion.button>

        {/* Message informatif */}
        <div className="text-xs text-gray-500 text-center px-2">
          Contactez {lesson.catalogInfo.source.split(' - ')[0]} pour cette leçon externe
        </div>
      </div>
    </motion.div>
  );
}






