'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen,
  MessageCircle,
  ExternalLink,
  Tag,
  MapPin,
  Users
} from 'lucide-react';
import { Course, Lesson } from '@/types';
import { GaussStyleCard } from './GaussStyleCard';
import { getWhatsAppLink } from '@/lib/mock-data';

interface ExternalCourseCardProps {
  course: Course & { catalogInfo: any };
  userBalance: number;
}

export function ExternalCourseCard({
  course,
  userBalance
}: ExternalCourseCardProps) {
  
  const handleWhatsAppContact = () => {
    const whatsappLink = getWhatsAppLink(course.catalogInfo);
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 relative w-full"
    >
      {/* Header avec icône - Même hauteur que GaussStyleCard */}
      <div className="relative h-48 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Badge "Hors programme" au lieu du favori */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium border border-purple-200">
            <Tag size={10} className="inline mr-1" />
            Hors programme
          </div>
        </div>
        
        {/* Icône centrale - Style identique à GaussStyleCard */}
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
          <BookOpen className="text-blue-600" size={20} />
        </div>
        
        {/* Nom de l'école - Style identique à GaussStyleCard */}
        <div className="text-sm text-gray-600 font-medium text-center">
          Solvay Brussels School
        </div>
      </div>

      {/* Contenu - Même padding et structure que GaussStyleCard */}
      <div className="p-4">
        {/* Titre - Style identique */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Description - Style identique */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Métadonnées - Style identique à GaussStyleCard */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            <Users size={12} />
            <span>{Math.floor(Math.random() * 200) + 50} étudiants</span>
          </div>
          
          {course.totalLessons && (
            <div className="flex items-center gap-1 text-gray-600">
              <BookOpen size={14} />
              <span>{course.totalLessons} leçons</span>
            </div>
          )}
        </div>

        {/* Actions - Bouton WhatsApp avec même style que GaussStyleCard */}
        <div className="flex gap-3">
          <button
            onClick={handleWhatsAppContact}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            Discute avec nous
          </button>
        </div>
      </div>
    </motion.div>
  );
}