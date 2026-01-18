'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Calendar, Users, Infinity, CheckCircle2, Check, Zap, ChevronDown, PenTool, Clock, MessageCircle, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// ============================================
// ILLUSTRATIONS FOR EACH PROMISE
// ============================================

// 1. Pyramid Builder - "On reconstruit tes bases"
const PyramidIllustration = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
    <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gray-50">
      <div className="space-y-3 w-full max-w-[240px]">
        {[
          { label: 'Avancé', status: 'locked', width: '50%' },
          { label: 'Intermédiaire', status: 'current', width: '75%' },
          { label: 'Fondamentaux', status: 'done', width: '100%' },
        ].map((level, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (2 - i) * 0.2 }}
            className={`mx-auto rounded-xl p-3 text-center text-sm font-bold border-2 ${
              level.status === 'done' 
                ? 'bg-[#00c2ff]/10 border-[#00c2ff] text-[#00c2ff]' 
                : level.status === 'current'
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}
            style={{ width: level.width }}
          >
            <div className="flex items-center justify-center gap-2">
              {level.status === 'done' && <CheckCircle2 size={16} />}
              {level.label}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-sm text-gray-500 text-center"
      >
        On repart de zéro, sans jugement
      </motion.p>
    </div>
  </div>
);

// 2. Exam Stats - "90% de pratique"
const ExamStatsIllustration = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
    <div className="flex-1 p-6 flex flex-col justify-center gap-4 bg-gray-50">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold text-gray-900">Questions résolues</span>
          <span className="text-[#00c2ff] font-bold">3,247</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '78%' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-[#00c2ff] rounded-full"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-[9] bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-white font-bold text-2xl">90%</p>
          <p className="text-gray-400 text-xs">Pratique</p>
        </div>
        <div className="flex-[1] bg-gray-200 rounded-xl p-4 text-center">
          <p className="text-gray-600 font-bold text-2xl">10%</p>
          <p className="text-gray-400 text-xs">Théorie</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {['Paris-Saclay', 'Polytechnique', 'PASS Médecine', 'HEC'].map((src, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600"
          >
            {src}
          </motion.span>
        ))}
      </div>
    </div>
  </div>
);

// 3. Planner - "Planificateur Intelligent"
const PlannerIllustration = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
    <div className="flex-1 p-5 flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-gray-900">Ta semaine</span>
        <span className="text-xs font-medium text-[#00c2ff] bg-[#00c2ff]/10 px-3 py-1 rounded-full">Optimisé</span>
      </div>
      <div className="space-y-2 flex-1">
        {[
          { day: 'Lun', task: 'Thermodynamique', time: '2h', active: true },
          { day: 'Mar', task: 'Maths - Intégrales', time: '1h30', active: false },
          { day: 'Mer', task: 'Quiz Physique', time: '30m', active: false },
          { day: 'Jeu', task: 'Examen blanc', time: '3h', active: false },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-3 rounded-xl border flex items-center justify-between text-sm ${
              item.active ? 'bg-[#00c2ff]/10 border-[#00c2ff]/30' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 w-8">{item.day}</span>
              <span className="text-gray-600">{item.task}</span>
            </div>
            <span className="font-bold text-gray-900">{item.time}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 p-3 bg-gray-900 text-white rounded-xl text-xs flex items-center gap-2">
        <Zap size={14} className="text-[#00c2ff]" />
        <span>Adapté à ton énergie et tes objectifs</span>
      </div>
    </div>
  </div>
);

// 4. Study Rooms - "Ne révise plus jamais seul"
const StudyRoomsIllustration = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
    <div className="flex-1 p-5 flex flex-col bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-bold text-gray-900 text-sm">Study Room - Physique</span>
        </div>
        <span className="text-xs text-gray-500">3 présents</span>
      </div>
      <div className="flex gap-3 mb-4">
        {[
          { name: 'Toi', active: true },
          { name: 'Sarah', active: false },
          { name: 'Tom', active: false },
        ].map((p, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex-1 rounded-xl p-3 text-center ${
              p.active ? 'bg-[#00c2ff]/10 border-2 border-[#00c2ff]' : 'bg-white border border-gray-200'
            }`}
          >
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
              p.active ? 'bg-[#00c2ff] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {p.name.charAt(0)}
            </div>
            <p className="text-xs font-medium text-gray-700">{p.name}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3 space-y-2">
        {[
          { user: 'Sarah', msg: 'Quelqu\'un peut m\'expliquer Newton 3 ?' },
          { user: 'Tom', msg: 'Oui ! En gros c\'est action = réaction' },
        ].map((chat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.2 }}
            className="text-xs"
          >
            <span className="font-bold text-gray-900">{chat.user}:</span>
            <span className="text-gray-600 ml-1">{chat.msg}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// 5. Timeline - "Un seul paiement, accès à vie"
const TimelineIllustration = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
    <div className="flex-1 p-6 flex flex-col justify-center bg-gray-50">
      <div className="relative px-4">
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-4 h-1 bg-[#00c2ff] -translate-y-1/2 rounded-full"
          style={{ maxWidth: 'calc(100% - 32px)' }}
        />
        <div className="relative flex justify-between">
          {[
            { year: '2024', label: 'Achat' },
            { year: '2025', label: 'Updates' },
            { year: '2030', label: 'Toujours là' },
            { year: '∞', label: 'À vie' },
          ].map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 ${
                i === 3 
                  ? 'bg-[#00c2ff] border-[#00c2ff] text-white' 
                  : 'bg-white border-[#00c2ff] text-[#00c2ff]'
              }`}>
                {i === 3 ? <Infinity size={14} /> : <CheckCircle2 size={12} />}
              </div>
              <p className="mt-2 font-bold text-gray-900 text-sm">{point.year}</p>
              <p className="text-xs text-gray-500">{point.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-900">1 paiement</span> · Pas d'abonnement · Mises à jour incluses
        </p>
      </motion.div>
    </div>
  </div>
);

// 6. Handwritten - "Notes manuscrites"
const HandwrittenIllustration = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
    <div className="flex-1 p-6 flex flex-col justify-center items-center bg-[#fffef5]">
      <div className="w-full max-w-[280px] space-y-4">
        <motion.div
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-handwriting text-xl text-gray-800 italic"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          "F = m × a"
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600 leading-relaxed"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          La force est le produit de la masse par l'accélération...
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '60%' }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-0.5 bg-[#00c2ff]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-2 text-xs text-gray-500"
        >
          <PenTool size={12} className="text-[#00c2ff]" />
          Écrit à la main, comme tes notes
        </motion.div>
      </div>
    </div>
  </div>
);

// 7. Support 24/7 - "Réponses 7j/7"
const SupportIllustration = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
    <div className="flex-1 p-5 flex flex-col bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={16} className="text-[#00c2ff]" />
        <span className="font-bold text-gray-900 text-sm">Support SMS</span>
        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">En ligne</span>
      </div>
      <div className="flex-1 space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-200 rounded-2xl rounded-tl-md px-4 py-2 max-w-[80%] text-sm text-gray-700"
        >
          Je bloque sur les intégrales doubles, c'est possible d'avoir de l'aide ?
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#00c2ff] rounded-2xl rounded-tr-md px-4 py-2 max-w-[80%] ml-auto text-sm text-white"
        >
          Bien sûr ! Regarde la leçon 4.2, et si ça coince toujours, envoie ta question ici 👍
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-gray-400"
        >
          Répondu en 12 min
        </motion.div>
      </div>
    </div>
  </div>
);

// 8. Hundreds of hours - "Des centaines d'heures"
const HoursIllustration = () => (
  <div className="w-full h-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
    <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2 shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
      <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
    </div>
    <div className="flex-1 p-6 flex flex-col justify-center bg-gray-50">
      <div className="text-center mb-6">
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold text-gray-900"
        >
          500<span className="text-[#00c2ff]">+</span>
        </motion.p>
        <p className="text-gray-500 text-sm mt-1">heures de contenu</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { subject: 'Physique', hours: '180h' },
          { subject: 'Maths', hours: '150h' },
          { subject: 'Chimie', hours: '120h' },
          { subject: 'Stats', hours: '50h' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-3 text-center"
          >
            <p className="font-bold text-gray-900">{item.hours}</p>
            <p className="text-xs text-gray-500">{item.subject}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================
// PROMISES DATA
// ============================================

const promises = [
  {
    id: 1,
    titleFr: 'On reconstruit tes bases. Sans aucun jugement.',
    titleEn: 'We rebuild your foundations. Without judgment.',
    descFr: 'Tout problème complexe vient de bases mal comprises. On reprend tout depuis le début, jusqu\'à ce que ce soit limpide.',
    descEn: 'Every complex problem comes from poorly understood basics. We start from scratch, until it\'s crystal clear.',
    icon: BookOpen,
    Illustration: PyramidIllustration,
  },
  {
    id: 2,
    titleFr: 'On part de l\'examen pour construire le cours.',
    titleEn: 'We start from the exam to build the course.',
    descFr: 'Des milliers de questions d\'examens réels. On trace les cours à partir de ce qui tombe vraiment. Une approche inversée, unique et efficace.',
    descEn: 'Thousands of real exam questions. We build courses based on what actually appears. A unique, reverse-engineered approach.',
    icon: Target,
    Illustration: ExamStatsIllustration,
  },
  {
    id: 3,
    titleFr: 'Un catalogue colossal. Tout expliqué à la main.',
    titleEn: 'A colossal catalog. Everything explained by hand.',
    descFr: 'Oublie les slides froids. Des centaines d\'heures de contenu authentique où l\'on t\'explique tout, étape par étape, sans aucune impasse.',
    descEn: 'Forget cold slides. Hundreds of hours of authentic content where we explain everything, step by step, with absolutely no gaps.',
    icon: PenTool,
    Illustration: HandwrittenIllustration,
  },
  {
    id: 4,
    titleFr: 'Fini le stress de dernière minute.',
    titleEn: 'No more last-minute stress.',
    descFr: 'Ton emploi du temps sur-mesure, adapté à ton énergie et tes objectifs. On te trace ta route exacte pour réussir.',
    descEn: 'Your custom schedule, adapted to your energy and goals. We map your exact path to success.',
    icon: Calendar,
    Illustration: PlannerIllustration,
  },
  {
    id: 5,
    titleFr: 'Tu n\'es plus jamais seul.',
    titleEn: 'You are never alone again.',
    descFr: 'Support 7j/7 et communauté. Un blocage ? On te répond. Besoin de motivation ? Rejoins les autres étudiants pour avancer ensemble.',
    descEn: '7/7 Support & Community. Stuck? We answer. Need motivation? Join other students to move forward together.',
    icon: Users,
    Illustration: SupportIllustration,
  },
  {
    id: 6,
    titleFr: 'Un seul paiement, accès à vie.',
    titleEn: 'One payment, lifetime access.',
    descFr: 'Tu achètes une fois, c\'est à toi pour toujours. Zéro stress de temps. Mises à jour incluses.',
    descEn: 'Buy once, it\'s yours forever. Zero time stress. Updates included.',
    icon: Infinity,
    Illustration: TimelineIllustration,
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export function PromisesSectionMultilang() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const ActiveIllustration = promises[activeIndex].Illustration;

  return (
    <section className="py-16 md:py-24 px-6 md:px-8 lg:px-10 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-title text-center mb-12 md:mb-16 tracking-wide max-w-5xl mx-auto"
          style={{ fontSize: '64px' }}
        >
          {language === 'fr' ? 'Une décennie de pédagogie scientifique.' : 'A decade of scientific pedagogy.'}
        </motion.h2>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left: Accordion */}
          <div className="space-y-0 divide-y divide-gray-200">
            {promises.map((promise, index) => {
              const Icon = promise.icon;
              const isActive = activeIndex === index;

              return (
                <motion.div
                  key={promise.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setActiveIndex(index)}
                    className={`w-full py-5 flex items-start gap-4 text-left transition-all group ${
                      isActive ? '' : 'hover:bg-gray-100/50'
                    }`}
                  >
                    {/* Checkmark */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-[#00c2ff]/15' : 'bg-gray-100 group-hover:bg-[#00c2ff]/15'
                    }`}>
                      <Check size={14} strokeWidth={3} className={`transition-colors ${
                        isActive ? 'text-[#00c2ff]' : 'text-gray-400 group-hover:text-[#00c2ff]'
                      }`} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-lg transition-colors ${
                          isActive ? 'text-[#00c2ff]' : 'text-gray-900 group-hover:text-[#00c2ff]'
                        }`}>
                          {language === 'fr' ? promise.titleFr : promise.titleEn}
                        </h3>
                        <ChevronDown 
                          className={`w-5 h-5 shrink-0 ml-2 transition-transform duration-300 ${
                            isActive ? 'rotate-180 text-[#00c2ff]' : 'text-gray-400'
                          }`}
                        />
                      </div>
                      
                      {/* Description (visible when active) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-600 mt-2 pr-4 leading-relaxed overflow-hidden"
                          >
                            {language === 'fr' ? promise.descFr : promise.descEn}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Sticky Illustration */}
          <div className="lg:sticky lg:top-32 h-[400px] md:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <ActiveIllustration />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
