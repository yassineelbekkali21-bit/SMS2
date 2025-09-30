'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Package,
  CheckCircle,
  Sparkles,
  Crown,
  Zap,
  Trophy,
  Target,
  Gift,
  ArrowRight
} from 'lucide-react';
import { CoursePack, Course } from '@/types';

interface CoursePackCardProps {
  pack: CoursePack;
  courses: Course[]; // Cours inclus dans le pack
  isOwned?: boolean;
  onPurchase: (packId: string) => void;
  onPreview?: (packId: string) => void;
  onCoursePreview?: (courseId: string) => void;
  className?: string;
}

const getBadgeColor = (badge: string) => {
  switch (badge.toLowerCase()) {
    case 'populaire': return 'bg-blue-500';
    case 'nouveau': return 'bg-green-500';
    case 'pack premium': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

const getPackIcon = (packId: string) => {
  // Retourne l'icône appropriée selon l'ID du pack
  return Package;
};

export function CoursePackCard({ 
  pack, 
  courses,
  isOwned = false, 
  onPurchase, 
  onPreview,
  onCoursePreview,
  className = ""
}: CoursePackCardProps) {
  const PackIcon = getPackIcon(pack.id);
  const totalDuration = courses.reduce((acc, course) => {
    const duration = parseInt(course.duration?.replace(/[^\d]/g, '') || '0');
    return acc + duration;
  }, 0);
  
  const totalLessons = courses.reduce((acc, course) => acc + (course.totalLessons || 0), 0);

  const handlePurchase = () => {
    if (!isOwned) {
      onPurchase(pack.id);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(pack.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100 ${className}`}
    >
      {/* Badge Premium */}
      {pack.badge && (
        <div className="absolute top-6 right-6 z-10">
          <div className={`${getBadgeColor(pack.badge)} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg`}>
            <Star size={14} />
            {pack.badge}
          </div>
        </div>
      )}

      {/* Badge Possédé */}
      {isOwned && (
        <div className="absolute top-6 left-6 z-10">
          <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
            <CheckCircle size={20} />
          </div>
        </div>
      )}

      {/* Header magnifique avec grande hauteur */}
      <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-200">
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
            <div className="text-3xl">{pack.icon}</div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900">{pack.title}</h3>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-8">
        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {pack.description}
        </p>

        {/* Métadonnées du pack */}
        <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{courses.length} cours</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>{totalLessons} leçons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{totalDuration}h+</span>
          </div>
        </div>

        {/* Prix en euros - version épurée */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                1200€
              </span>
              <span className="text-gray-600">pack complet</span>
            </div>
          </div>
        </div>

        {/* Cours inclus */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Gift className="text-purple-600" size={18} />
            Cours inclus dans ce pack
          </h4>
          <div className="grid gap-3">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-purple-600" size={14} />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm">{course.title}</h5>
                  <p className="text-xs text-gray-600">{course.totalLessons} leçons • {course.duration}</p>
                </div>
                <button
                  onClick={() => onCoursePreview?.(course.id)}
                  className="text-xs text-purple-600 font-medium hover:text-purple-700 transition-colors cursor-pointer"
                >
                  Aperçu
                </button>
              </div>
            ))}
            {courses.length > 3 && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500">+ {courses.length - 3} autres cours</span>
              </div>
            )}
          </div>
        </div>

        {/* Features du pack */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={18} />
            Avantages inclus
          </h4>
          <div className="grid gap-2">
            {pack.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={12} />
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {isOwned ? (
            <button
              onClick={handlePreview}
              className="w-full bg-green-50 text-green-700 py-4 px-6 rounded-2xl font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-3"
            >
              <CheckCircle size={20} />
              Pack Possédé - Accéder
            </button>
          ) : (
            <button
              onClick={handlePurchase}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <Crown size={20} />
              Débloquer le Pack - 1200€
            </button>
          )}
        </div>

        {/* Bonus top-up highlight */}
        {!isOwned && (
          <div className="mt-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <Gift className="text-green-600" size={16} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800">Bonus de recharge inclus</p>
                <p className="text-xs text-green-700">+20% offert lors du rechargement de votre portefeuille</p>
              </div>
            </div>
          </div>
        )}

        {/* Message de valeur ajoutée */}
        {!isOwned && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="text-purple-600" size={16} />
              </div>
              <div>
                <h5 className="font-semibold text-purple-900 mb-1">Pourquoi choisir ce pack ?</h5>
                <p className="text-sm text-purple-800 mb-2">
                  Accès complet à tous les cours, support prioritaire et outils avancés.
                </p>
                <p className="text-xs text-purple-700">
                  Avec ce pack, tu débloques plus de contenu et un accompagnement plus complet.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}