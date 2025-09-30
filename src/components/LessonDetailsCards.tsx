'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Award } from 'lucide-react';
import { Lesson } from '@/types';

interface LessonDetailsCardsProps {
  lesson: Lesson;
}

interface DetailCardProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  children: React.ReactNode;
  delay?: number;
}

function DetailCard({ 
  title, 
  icon, 
  iconBgColor, 
  iconTextColor, 
  children, 
  delay = 0 
}: DetailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center`}>
            <div className={iconTextColor}>
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function LessonDetailsCards({ lesson }: LessonDetailsCardsProps) {
  return (
    <div className="space-y-6">
      {/* Carte Description */}
      {lesson.description && (
        <DetailCard
          title="Description"
          icon={<BookOpen size={18} />}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
          delay={0}
        >
          <p className="text-base leading-relaxed">{lesson.description}</p>
        </DetailCard>
      )}

      {/* Carte Objectifs d'apprentissage */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <DetailCard
          title="Objectifs d'apprentissage"
          icon={<Target size={18} />}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
          delay={0.1}
        >
          <div className="space-y-4">
            {lesson.objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-base leading-relaxed">{objective}</span>
              </div>
            ))}
          </div>
        </DetailCard>
      )}

      {/* Carte Prérequis */}
      {lesson.prerequisites && lesson.prerequisites.length > 0 && (
        <DetailCard
          title="Prérequis"
          icon={<Award size={18} />}
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-600"
          delay={0.2}
        >
          <div className="space-y-3">
            {lesson.prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-base leading-relaxed">{prerequisite}</span>
              </div>
            ))}
          </div>
        </DetailCard>
      )}
    </div>
  );
}




