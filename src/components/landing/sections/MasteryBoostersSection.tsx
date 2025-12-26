'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Calendar, FileCheck, Users, ArrowRight, CheckCircle2, Clock, Zap, BrainCircuit, Target, MessageCircle, BarChart3, Mic, MicOff, Video, VideoOff, Monitor, Volume2, LogOut, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function MasteryBoostersSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  const boosters = [
    {
      id: 'planner',
      title: t('boosters.planner.title'),
      subtitle: t('boosters.planner.subtitle'),
      description: t('boosters.planner.desc'),
      icon: Calendar,
      color: 'purple',
      comingSoon: false
    },
    {
      id: 'path',
      title: t('boosters.path.title'),
      subtitle: t('boosters.path.subtitle'),
      description: t('boosters.path.desc'),
      icon: Map,
      color: 'blue',
      comingSoon: true
    },
    {
      id: 'exams',
      title: t('boosters.exams.title'),
      subtitle: t('boosters.exams.subtitle'),
      description: t('boosters.exams.desc'),
      icon: FileCheck,
      color: 'green',
      comingSoon: true
    },
    {
      id: 'community',
      title: t('boosters.community.title'),
      subtitle: t('boosters.community.subtitle'),
      description: t('boosters.community.desc'),
      icon: Users,
      color: 'orange',
      comingSoon: true
    }
  ];

  // Auto-rotate tabs every 8 seconds if user hasn't interacted recently
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % boosters.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [boosters.length]);

  return (
    <section className="py-24 bg-gray-100 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 
            className="font-title text-4xl mb-6 leading-tight tracking-wide"
            style={{ fontSize: 'clamp(1.5rem, 6vw, 52px)' }}
          >
            {t('boosters.title')} <span>{t('boosters.title.highlight')}</span>.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN - Navigation List */}
          <div className="lg:col-span-5 space-y-4">
            {boosters.map((booster, index) => {
              const isActive = activeTab === index;
              const Icon = booster.icon;
              
              return (
                <button
                  key={booster.id}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                    isActive 
                      ? 'bg-gray-50 shadow-sm border border-gray-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {/* Progress Bar Background for Active Tab */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabBg"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                      isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-md'
                    }`}>
                      <Icon size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-bold transition-colors whitespace-nowrap ${isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                          {booster.title}
                        </h3>
                        {booster.comingSoon && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider text-gray-500 bg-gray-100 border border-gray-200 whitespace-nowrap flex-shrink-0">
                            Coming soon
                          </span>
                        )}
                      </div>
                      <p className={`text-sm font-medium mb-2 mt-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                        {booster.subtitle}
                      </p>
                      
                      <div className={`grid transition-all duration-300 ${isActive ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {booster.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN - Dynamic Visuals */}
          <div className="lg:col-span-7 h-[500px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {/* Visual Container */}
                <div className="w-full h-full bg-gray-50 rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden relative flex flex-col">
                  
                  {/* macOS/Browser Header Mockup */}
                  <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4 gap-2 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    <div className="ml-4 px-3 py-1 bg-gray-50 rounded-md text-[10px] font-medium text-gray-400 flex items-center gap-2">
                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                       sciencemadesimple.app
                    </div>
                  </div>

                  {/* Content Area - Specific to each booster */}
                  <div className="flex-1 p-8 relative">
                    
                    {/* 1. PLANNER VISUAL (maintenant en premier) */}
                    {activeTab === 0 && (
                      <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-gray-900">Your Week</h4>
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Optimized for Energy</span>
                        </div>
                        <div className="space-y-3 flex-1">
                             {[
                                { day: 'Mon', task: 'Thermodynamics', time: '2h', type: 'Deep Work', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                                { day: 'Tue', task: 'Math Practice', time: '1h', type: 'Review', color: 'bg-green-100 text-green-700 border-green-200' },
                                { day: 'Wed', task: 'Physics Quiz', time: '30m', type: 'Quick', color: 'bg-orange-100 text-orange-700 border-orange-200' },
                                { day: 'Thu', task: 'Exam Simulation', time: '3h', type: 'Focus', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                             ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-3 rounded-xl border ${item.color} flex items-center justify-between`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-sm w-8">{item.day}</span>
                                        <div className="h-4 w-px bg-current opacity-20"/>
                                        <span className="font-medium text-sm">{item.task}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">{item.type}</span>
                                        <span className="bg-white/50 px-2 py-0.5 rounded text-xs font-bold">{item.time}</span>
                                    </div>
                                </motion.div>
                             ))}
                        </div>
                        <div className="mt-4 p-3 bg-gray-900 text-white rounded-xl text-xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-yellow-400"/>
                                <span>AI adjusted based on your last quiz score</span>
                            </div>
                            <button className="font-bold hover:underline">View details</button>
                        </div>
                      </div>
                    )}

                    {/* 2. LEARNING PATH CREATOR VISUAL (maintenant en second) */}
                    {activeTab === 1 && (
                      <div className="h-full flex flex-col items-center justify-center relative">
                         {/* Path Nodes */}
                         <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 400 300">
                               <path d="M 50 150 C 100 150, 100 50, 200 50 C 300 50, 300 250, 350 250" fill="none" stroke="#E5E7EB" strokeWidth="4" strokeDasharray="8 8" />
                               <motion.path 
                                 d="M 50 150 C 100 150, 100 50, 200 50 C 300 50, 300 250, 350 250" 
                                 fill="none" 
                                 stroke="#3B82F6" 
                                 strokeWidth="4"
                                 initial={{ pathLength: 0 }}
                                 animate={{ pathLength: 1 }}
                                 transition={{ duration: 2, ease: "easeInOut" }}
                               />
                            </svg>
                         </div>

                         {/* Nodes Cards */}
                         <motion.div 
                           initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                           className="absolute left-[10%] top-[45%] bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 z-10"
                         >
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle2 size={16}/></div>
                            <div><div className="text-xs font-bold text-gray-900">Basics</div><div className="text-[10px] text-gray-400">Completed</div></div>
                         </motion.div>

                         <motion.div 
                           initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}
                           className="absolute left-[45%] top-[10%] bg-blue-600 text-white p-4 rounded-xl shadow-xl shadow-blue-600/30 flex items-center gap-3 z-20"
                         >
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><BrainCircuit size={20}/></div>
                            <div><div className="text-sm font-bold">Current Module</div><div className="text-xs text-blue-200">Recommended for you</div></div>
                         </motion.div>

                         <motion.div 
                           initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}
                           className="absolute right-[10%] bottom-[10%] bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 opacity-50 grayscale z-10"
                         >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><Target size={16}/></div>
                            <div><div className="text-xs font-bold text-gray-900">Mastery Exam</div><div className="text-[10px] text-gray-400">Locked</div></div>
                         </motion.div>
                      </div>
                    )}

                    {/* 3. EXAMS VISUAL */}
                    {activeTab === 2 && (
                      <div className="h-full flex flex-col items-center justify-center">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mock Exam #42</span>
                                <div className="flex items-center gap-1 text-red-500 font-mono text-sm font-bold bg-red-50 px-2 py-1 rounded">
                                    <Clock size={14} />
                                    <span>45:00</span>
                                </div>
                            </div>
                            
                            <h4 className="font-bold text-lg mb-4">Calculate the entropy change...</h4>
                            
                            <div className="space-y-2 mb-6">
                                {[1,2,3].map((_, i) => (
                                    <div key={i} className="h-10 rounded-lg bg-gray-50 border border-gray-100 w-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="w-[60%] h-full bg-blue-600 rounded-full" />
                                </div>
                                <span className="text-xs font-bold text-gray-400">Q 12/20</span>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 flex gap-4"
                        >
                            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
                                <span className="text-xs text-gray-400 font-bold uppercase">Difficulty</span>
                                <span className="font-bold text-blue-600">Adaptive</span>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
                                <span className="text-xs text-gray-400 font-bold uppercase">Focus</span>
                                <span className="font-bold text-purple-600">Weak spots</span>
                            </div>
                        </motion.div>
                      </div>
                    )}

                    {/* 4. STUDY ROOMS VISUAL - Video Conference Style */}
                    {activeTab === 3 && (
                      <div className="h-full flex flex-col">
                        {/* Main Video Area */}
                        <div className="flex-1 flex gap-3">
                          {/* Sidebar - Participants & Chat */}
                          <div className="w-[140px] flex flex-col gap-2">
                            {/* Participants */}
                            <div className="bg-gray-100 rounded-xl p-2">
                              <div className="text-[10px] font-bold text-gray-500 mb-2 flex items-center gap-1">
                                <Users size={10} /> 3 Present
                              </div>
                              {[
                                { name: 'Yassine (Host)', isMuted: false, hasVideo: true },
                                { name: 'Sarah', isMuted: true, hasVideo: true },
                                { name: 'Tom', isMuted: false, hasVideo: false },
                              ].map((p, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center gap-2 py-1.5 px-1 text-[10px]"
                                >
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                    {p.name[0]}
                                  </div>
                                  <span className="text-gray-700 truncate flex-1">{p.name}</span>
                                  {p.isMuted && <MicOff size={10} className="text-gray-400" />}
                                </motion.div>
                              ))}
                            </div>
                            
                            {/* Mini Chat */}
                            <div className="flex-1 bg-gray-100 rounded-xl p-2 flex flex-col">
                              <div className="text-[10px] font-bold text-gray-500 mb-2 flex items-center gap-1">
                                <MessageSquare size={10} /> Chat
                              </div>
                              <div className="flex-1 space-y-1 text-[9px] overflow-hidden">
                                <div className="bg-white rounded p-1.5"><span className="font-bold text-blue-600">Yassine:</span> <span className="text-gray-600">Welcome!</span></div>
                                <div className="bg-white rounded p-1.5"><span className="font-bold">Sarah:</span> <span className="text-gray-600">Question about Q3</span></div>
                              </div>
                            </div>
                          </div>

                          {/* Main Content - Whiteboard */}
                          <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Monitor size={14} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-700">Tableau blanc partagé</span>
                              </div>
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Live</span>
                            </div>
                            <div className="flex-1 p-4 relative">
                              {/* Whiteboard content simulation */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-400 text-xs absolute top-4 left-4"
                              >
                                ∫ f(x)dx = F(x) + C
                              </motion.div>
                              <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2 }}
                                className="absolute top-12 left-4"
                              >
                                <svg width="200" height="80" viewBox="0 0 200 80">
                                  <motion.path
                                    d="M 10 60 Q 50 10, 100 40 T 190 30"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                  />
                                </svg>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute bottom-8 right-8 bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-xs text-yellow-800"
                              >
                                💡 Hint: Use substitution!
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Controls Bar */}
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-3 bg-white rounded-xl border border-gray-200 shadow-lg p-2 flex items-center justify-center gap-2"
                        >
                          {[
                            { icon: Mic, label: 'Mute', active: true },
                            { icon: Video, label: 'Video', active: true },
                            { icon: Monitor, label: 'Whiteboard', active: true, highlight: true },
                            { icon: Volume2, label: 'Speaker', active: true },
                            { icon: LogOut, label: 'Leave', active: false, danger: true },
                          ].map((ctrl, i) => (
                            <button
                              key={i}
                              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                                ctrl.danger 
                                  ? 'hover:bg-red-50 text-gray-500 hover:text-red-600' 
                                  : ctrl.highlight 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'hover:bg-gray-100 text-gray-500'
                              }`}
                            >
                              <ctrl.icon size={16} />
                              <span className="text-[9px] font-medium">{ctrl.label}</span>
                            </button>
                          ))}
                        </motion.div>
                      </div>
                    )}
                    
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

