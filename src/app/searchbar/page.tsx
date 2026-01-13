'use client';

import React, { useState } from 'react';
import { Paperclip, ArrowUp, Search, Sparkles } from 'lucide-react';

export default function SearchBarDemo() {
  const [selectedOption, setSelectedOption] = useState<string>('optionA');

  const options = [
    { id: 'optionA', label: 'Option A: Ombre cyan au focus' },
    { id: 'optionB', label: 'Option B: Bordure cyan visible' },
    { id: 'optionC', label: 'Option C: Fond légèrement coloré' },
    { id: 'optionD', label: 'Option D: Bordure épaisse cyan' },
    { id: 'optionE', label: 'Option E: Focus avec échelle' },
  ];

  const renderSearchBar = (option: string) => {
    const baseClasses = "relative bg-white rounded-xl transition-all duration-300 max-w-2xl mx-auto";
    
    switch(option) {
      case 'optionA':
        return (
          <div className={`${baseClasses} border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-[#00c2ff]/40 focus-within:border-[#00c2ff] focus-within:shadow-[0_0_32px_rgba(0,194,255,0.4)]`}>
            <div className="px-5 pt-4 pb-3">
              <input
                type="text"
                placeholder="Un concept, une difficulté, un point précis (Gauss, intégrales, Pythagore…)"
                className="w-full text-lg text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between px-5 pb-4">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all">
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        );
      
      case 'optionB':
        return (
          <div className={`${baseClasses} border-3 border-[#00c2ff]/60 shadow-xl hover:border-[#00c2ff] focus-within:border-[#00c2ff] focus-within:shadow-[0_0_24px_rgba(0,194,255,0.3)]`} style={{ borderWidth: '3px' }}>
            <div className="px-5 pt-4 pb-3">
              <input
                type="text"
                placeholder="Un concept, une difficulté, un point précis (Gauss, intégrales, Pythagore…)"
                className="w-full text-lg text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between px-5 pb-4">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all">
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        );
      
      case 'optionC':
        return (
          <div className={`${baseClasses} border-2 border-gray-200 shadow-xl hover:shadow-2xl focus-within:border-[#00c2ff] focus-within:shadow-[0_0_28px_rgba(0,194,255,0.35)]`} style={{ backgroundColor: '#f8fdff' }}>
            <div className="px-5 pt-4 pb-3">
              <input
                type="text"
                placeholder="Un concept, une difficulté, un point précis (Gauss, intégrales, Pythagore…)"
                className="w-full text-lg text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between px-5 pb-4">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#00c2ff]/10 text-gray-400 hover:text-[#00c2ff] transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#00c2ff] text-white hover:bg-[#00b0e8] transition-all shadow-lg shadow-[#00c2ff]/30">
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        );
      
      case 'optionD':
        return (
          <div className={`${baseClasses} border-4 border-[#00c2ff]/40 shadow-2xl hover:border-[#00c2ff]/60 focus-within:border-[#00c2ff] focus-within:shadow-[0_0_36px_rgba(0,194,255,0.45)] focus-within:scale-[1.01] transition-transform`} style={{ borderWidth: '4px' }}>
            <div className="px-5 pt-4 pb-3">
              <input
                type="text"
                placeholder="Un concept, une difficulté, un point précis (Gauss, intégrales, Pythagore…)"
                className="w-full text-lg text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between px-5 pb-4">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#00c2ff] text-white hover:bg-[#00b0e8] transition-all shadow-lg">
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        );
      
      case 'optionE':
        return (
          <div className={`${baseClasses} border-2 border-gray-200 shadow-lg hover:shadow-xl focus-within:border-[#00c2ff] focus-within:shadow-[0_0_30px_rgba(0,194,255,0.4)] focus-within:scale-[1.02] transition-transform`}>
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-center gap-3">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Un concept, une difficulté, un point précis (Gauss, intégrales, Pythagore…)"
                  className="flex-1 text-lg text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 pb-4">
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all">
                <ArrowUp size={18} />
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Variantes de la Search Bar
        </h1>
        
        {/* Options Selector */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOption(opt.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedOption === opt.id
                  ? 'bg-[#00c2ff] text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#00c2ff]/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Demo Area */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-8">
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-900 mb-2 text-center">
              Bonjour Yassine,
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              Qu&apos;est-ce qu&apos;on apprend aujourd&apos;hui ?
            </h2>
            <p className="text-base text-gray-600 text-center max-w-2xl mx-auto">
              Recherche un concept précis et avance avec des étudiants sur le même sujet.
            </p>
          </div>
          
          {renderSearchBar(selectedOption)}
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Description de l&apos;option {selectedOption}:
          </h3>
          {selectedOption === 'optionA' && (
            <p className="text-gray-600">
              Ombre cyan plus prononcée au focus, bordure cyan plus visible. Effet de glow plus fort pour attirer l&apos;attention.
            </p>
          )}
          {selectedOption === 'optionB' && (
            <p className="text-gray-600">
              Bordure cyan visible même au repos (60% opacity), devient plus prononcée au focus. Plus de contraste.
            </p>
          )}
          {selectedOption === 'optionC' && (
            <p className="text-gray-600">
              Fond légèrement coloré (bleu très clair), bouton submit en cyan SMS. Plus de présence visuelle.
            </p>
          )}
          {selectedOption === 'optionD' && (
            <p className="text-gray-600">
              Bordure épaisse (4px) cyan visible, effet scale au focus pour plus d&apos;engagement. Très visible.
            </p>
          )}
          {selectedOption === 'optionE' && (
            <p className="text-gray-600">
              Icône de recherche visible, effet scale au focus. Plus d&apos;indices visuels que c&apos;est une barre de recherche.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
