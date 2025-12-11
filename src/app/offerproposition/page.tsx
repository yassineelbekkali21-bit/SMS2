'use client';

import React, { useState } from 'react';
import { GraduationCap, Target, Sparkles, Gift, Eye, CheckCircle, Check, Star, Trophy, Zap, Users, TrendingUp, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfferPropositions() {
  const [activeProposal, setActiveProposal] = useState(1);

  const proposals = [
    { id: 1, name: 'Apple Style', description: 'Minimaliste premium, spacieux' },
    { id: 2, name: 'Stripe Style', description: 'Ultra-clean, business pro' },
    { id: 3, name: 'Linear Style', description: 'Dark mode, tech moderne' },
    { id: 4, name: 'Notion Style', description: 'Bento box, playful' },
    { id: 5, name: 'Khan Academy', description: 'Éducatif, accessible, coloré' },
    { id: 6, name: 'Adobe Style', description: 'Créatif, gradients vibrants' },
    { id: 7, name: 'Duolingo Style', description: 'Fun, gamifié, engageant' },
    { id: 8, name: 'Airbnb Style', description: 'Social proof, trust-first' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Propositions de Design - Section Offre
          </h1>
          <p className="text-gray-600 text-lg">
            8 styles inspirés des marques qui convertissent le mieux
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4">
          {proposals.map((proposal) => (
            <button
              key={proposal.id}
              onClick={() => setActiveProposal(proposal.id)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeProposal === proposal.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {proposal.name}
            </button>
          ))}
        </div>

        {/* Proposals */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          {activeProposal === 1 && <AppleStyle />}
          {activeProposal === 2 && <StripeStyle />}
          {activeProposal === 3 && <LinearStyle />}
          {activeProposal === 4 && <NotionStyle />}
          {activeProposal === 5 && <KhanAcademyStyle />}
          {activeProposal === 6 && <AdobeStyle />}
          {activeProposal === 7 && <DuolingoStyle />}
          {activeProposal === 8 && <AirbnbStyle />}
        </div>
      </div>
    </div>
  );
}

// Style 1: Apple - Spacieux, épuré, premium
function AppleStyle() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-7xl font-semibold text-center text-gray-900 mb-6 tracking-tight">
          Deux ambitions.
        </h2>
        <h2 className="text-7xl font-semibold text-center mb-16 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Une seule plateforme.
        </h2>

        {/* Urgency - Apple minimal pills */}
        <div className="flex justify-center gap-8 mb-24 text-sm text-gray-600">
          <span className="flex items-center gap-2"><Check size={16} className="text-blue-600" />Diagnostic gratuit</span>
          <span className="flex items-center gap-2"><Check size={16} className="text-blue-600" />Boosters offerts</span>
          <span className="flex items-center gap-2"><Check size={16} className="text-blue-600" />Previews disponibles</span>
        </div>

        {/* Offers - Apple card style */}
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
              <GraduationCap className="text-white" size={40} />
            </div>
            <h3 className="text-3xl font-semibold mb-3">Programmes Mastery</h3>
            <p className="text-gray-600 mb-8">Un objectif : la maîtrise totale.</p>
            
            <div className="space-y-8 text-left mb-8">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Programme</div>
                <div className="space-y-2 text-gray-700">
                  <div>Slides manuscrits & Q&A</div>
                  <div>Exercices + corrections</div>
                  <div>Communauté & cercles</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Mastery Boosters</div>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div>Planning · Study Rooms</div>
                  <div>Examens blancs · Learning Path</div>
                </div>
              </div>
            </div>
            
            <button className="w-full py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors">
              Voir le catalogue
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl">
              <Target className="text-white" size={40} />
            </div>
            <h3 className="text-3xl font-semibold mb-3">Prépa Épreuves</h3>
            <p className="text-gray-600 mb-8">Réussite aux épreuves.</p>
            
            <div className="space-y-8 text-left mb-8">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Programme</div>
                <div className="space-y-2 text-gray-700">
                  <div>Slides manuscrits</div>
                  <div>Exercices progressifs</div>
                  <div>Suivi de progression</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Mastery Boosters</div>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div>Planning · Study Rooms</div>
                  <div>Examens blancs</div>
                </div>
              </div>
            </div>
            
            <button className="w-full py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors">
              Découvrir les épreuves
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Style 2: Stripe - Business, clean, professionnel
function StripeStyle() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Deux ambitions, <span className="text-blue-600">une seule plateforme</span>
          </h2>
          <div className="flex gap-4 mt-6">
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-200">✓ Diagnostic gratuit</span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200">✓ Boosters 4 semaines</span>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium border border-purple-200">✓ Previews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mastery */}
          <div className="border border-gray-200 rounded-lg p-8 hover:border-blue-300 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Programmes Mastery</h3>
                <p className="text-sm text-gray-600">Maîtrise totale</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Inclus</h4>
                <div className="space-y-2">
                  {['Slides manuscrits & Q&A', 'Exercices + corrections', 'Communauté', 'Support WhatsApp'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Mastery Boosters</h4>
                <div className="space-y-2">
                  {['Planning', 'Study Rooms', 'Examens blancs', 'Learning Path'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Sparkles size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 border-2 border-blue-600 text-blue-600 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition-colors">
              Voir le catalogue →
            </button>
          </div>

          {/* Exam Prep */}
          <div className="border border-gray-200 rounded-lg p-8 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Prépa Épreuves</h3>
                <p className="text-sm text-gray-600">Réussite garantie</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Inclus</h4>
                <div className="space-y-2">
                  {['Slides manuscrits', 'Exercices progressifs', 'Suivi progression', 'Support WhatsApp'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Mastery Boosters</h4>
                <div className="space-y-2">
                  {['Planning', 'Study Rooms', 'Examens blancs'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Sparkles size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 border-2 border-purple-600 text-purple-600 rounded-md font-semibold hover:bg-purple-600 hover:text-white transition-colors">
              Découvrir les épreuves →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Style 3: Linear - Dark mode, tech, moderne
function LinearStyle() {
  return (
    <section className="py-16 bg-gray-900 -m-8 rounded-3xl">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
            Deux ambitions,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">une seule plateforme</span>
          </h2>
          <div className="flex justify-center gap-8 text-gray-400 text-sm">
            <span>→ Diagnostic gratuit</span>
            <span>→ Boosters 4 semaines</span>
            <span>→ Previews disponibles</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mastery */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Programmes Mastery</h3>
                <p className="text-sm text-gray-400">Maîtrise totale</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {['Slides manuscrits & Q&A', 'Exercices + corrections', 'Communauté & cercles', 'Support WhatsApp'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 mb-6">
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                <Sparkles size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">Mastery Boosters</span>
              </div>
              {['Planning', 'Study Rooms', 'Examens blancs', 'Learning Path'].map((item, i) => (
                <div key={i} className="text-sm text-gray-400 mb-1">• {item}</div>
              ))}
            </div>

            <button className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-semibold hover:bg-blue-400 transition-colors">
              Voir le catalogue →
            </button>
          </div>

          {/* Exam Prep */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Prépa Épreuves</h3>
                <p className="text-sm text-gray-400">Réussite garantie</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {['Slides manuscrits', 'Exercices progressifs', 'Suivi progression', 'Support WhatsApp'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 mb-6">
              <div className="flex items-center gap-2 mb-3 text-purple-400">
                <Sparkles size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">Mastery Boosters</span>
              </div>
              {['Planning', 'Study Rooms', 'Examens blancs'].map((item, i) => (
                <div key={i} className="text-sm text-gray-400 mb-1">• {item}</div>
              ))}
            </div>

            <button className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-semibold hover:bg-purple-400 transition-colors">
              Découvrir les épreuves →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Style 4: Notion - Bento box, playful
function NotionStyle() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4">
          Deux ambitions, <span className="text-blue-600">une seule plateforme</span>
        </h2>
        
        <div className="flex justify-center gap-3 mb-12">
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">🎁 Diagnostic gratuit</span>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">✨ Boosters offerts</span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">👀 Previews dispos</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Mastery - Large card */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🎓</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Programmes Mastery</h3>
                  <p className="text-gray-600">Maîtrise totale</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Programme</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    {['Slides manuscrits', 'Exercices corrigés', 'Communauté', 'Support 24/7'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
                  <h4 className="font-bold mb-3 text-sm flex items-center gap-1">
                    ✨ Boosters
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    {['Planning', 'Study Rooms', 'Examens', 'Learning Path'].map((item, i) => (
                      <div key={i}>→ {item}</div>
                    ))}
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Voir le catalogue
              </button>
            </div>
          </div>

          {/* Exam Prep - Sidebar */}
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Prépa Épreuves</h3>
            <p className="text-gray-600 text-sm mb-6">Réussite garantie</p>

            <div className="space-y-3 mb-6">
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-500 mb-2">Programme</div>
                {['Slides', 'Exercices', 'Suivi', 'Support'].map((item, i) => (
                  <div key={i} className="text-sm text-gray-700">• {item}</div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-3">
                <div className="text-xs font-semibold mb-2">✨ Boosters</div>
                <div className="text-sm space-y-0.5">
                  <div>→ Planning</div>
                  <div>→ Study Rooms</div>
                  <div>→ Examens</div>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors">
              Découvrir →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Style 5: Khan Academy - Éducatif, accessible
function KhanAcademyStyle() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Deux ambitions, une seule plateforme
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Commence gratuitement. Progresse à ton rythme.
          </p>
          
          <div className="inline-flex gap-4 bg-green-50 px-8 py-4 rounded-2xl border border-green-200">
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <Gift size={20} />
              <span>Diagnostic gratuit</span>
            </div>
            <div className="w-px bg-green-200" />
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <Sparkles size={20} />
              <span>Boosters offerts</span>
            </div>
            <div className="w-px bg-green-200" />
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <Eye size={20} />
              <span>Previews dispos</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mastery */}
          <div className="bg-blue-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Programmes Mastery</h3>
                <p className="text-blue-100">Maîtrise chaque concept</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
              <h4 className="font-bold mb-4 text-lg">Ce que tu apprends :</h4>
              <div className="space-y-3">
                {[
                  { icon: '📚', text: 'Slides manuscrits & Q&A' },
                  { icon: '✍️', text: 'Exercices + corrections' },
                  { icon: '👥', text: 'Communauté d\'entraide' },
                  { icon: '💬', text: 'Support WhatsApp 24/7' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-blue-50">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-400 text-gray-900 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3 font-bold">
                <Sparkles size={18} />
                <span>Mastery Boosters</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                {['Planning', 'Study Rooms', 'Examens blancs', 'Learning Path'].map((item, i) => (
                  <div key={i} className="bg-white/50 rounded-lg px-3 py-2">{item}</div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
              Commencer gratuitement
            </button>
          </div>

          {/* Exam Prep */}
          <div className="bg-green-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Prépa Épreuves</h3>
                <p className="text-green-100">Réussis tes examens</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
              <h4 className="font-bold mb-4 text-lg">Ce que tu obtiens :</h4>
              <div className="space-y-3">
                {[
                  { icon: '📝', text: 'Slides manuscrits' },
                  { icon: '📊', text: 'Exercices progressifs' },
                  { icon: '📈', text: 'Suivi de progression' },
                  { icon: '💬', text: 'Support WhatsApp 24/7' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-green-50">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-400 text-gray-900 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3 font-bold">
                <Sparkles size={18} />
                <span>Mastery Boosters</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                {['Planning', 'Study Rooms', 'Examens blancs'].map((item, i) => (
                  <div key={i} className="bg-white/50 rounded-lg px-3 py-2">{item}</div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors">
              Commencer gratuitement
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Style 6: Adobe - Créatif, gradients vibrants
function AdobeStyle() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 -m-8 rounded-3xl">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            DEUX AMBITIONS
          </h2>
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Une seule plateforme</h2>
          
          <div className="flex justify-center gap-4">
            {[
              { gradient: 'from-green-400 to-emerald-600', icon: Gift, text: 'Diagnostic gratuit' },
              { gradient: 'from-blue-400 to-indigo-600', icon: Zap, text: 'Boosters offerts' },
              { gradient: 'from-purple-400 to-pink-600', icon: Eye, text: 'Previews dispos' }
            ].map((item, i) => (
              <div key={i} className={`px-6 py-3 bg-gradient-to-r ${item.gradient} text-white rounded-full font-bold flex items-center gap-2 shadow-lg`}>
                <item.icon size={18} />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mastery */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <GraduationCap className="text-white" size={32} />
                </div>
                
                <h3 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PROGRAMMES MASTERY
                </h3>
                <p className="text-gray-600 mb-6">Maîtrise totale garantie</p>

                <div className="space-y-3 mb-6">
                  {['Slides manuscrits', 'Exercices corrigés', 'Communauté', 'Support 24/7'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Check size={14} className="text-white font-bold" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3 font-bold text-gray-900">
                    <Sparkles className="text-purple-600" size={18} />
                    Mastery Boosters
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {['Planning', 'Study Rooms', 'Examens', 'Learning Path'].map((item, i) => (
                      <div key={i} className="text-gray-700 font-medium">✦ {item}</div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                  Voir le catalogue →
                </button>
              </div>
            </div>
          </div>

          {/* Exam Prep */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <Trophy className="text-white" size={32} />
                </div>
                
                <h3 className="text-3xl font-black mb-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  PRÉPA ÉPREUVES
                </h3>
                <p className="text-gray-600 mb-6">Réussite garantie</p>

                <div className="space-y-3 mb-6">
                  {['Slides manuscrits', 'Exercices progressifs', 'Suivi progression', 'Support 24/7'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Check size={14} className="text-white font-bold" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3 font-bold text-gray-900">
                    <Sparkles className="text-pink-600" size={18} />
                    Mastery Boosters
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {['Planning', 'Study Rooms', 'Examens'].map((item, i) => (
                      <div key={i} className="text-gray-700 font-medium">✦ {item}</div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                  Découvrir les épreuves →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Style 7: Duolingo - Fun, gamifié
function DuolingoStyle() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-black text-gray-900 mb-4">
            🎯 Deux ambitions
          </h2>
          <h3 className="text-4xl font-bold text-green-600 mb-8">
            Une seule plateforme ! 🚀
          </h3>
          
          <div className="flex justify-center gap-4">
            <div className="bg-yellow-400 px-6 py-3 rounded-2xl font-bold text-gray-900 shadow-lg transform hover:scale-105 transition-transform">
              🎁 100% Gratuit pour commencer
            </div>
            <div className="bg-green-400 px-6 py-3 rounded-2xl font-bold text-gray-900 shadow-lg transform hover:scale-105 transition-transform">
              ✨ Boosters offerts
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mastery */}
          <div className="bg-white border-4 border-blue-500 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-black text-gray-900">Programmes Mastery</h3>
              <p className="text-blue-600 font-bold">Deviens un expert !</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { emoji: '📚', text: 'Slides manuscrits' },
                { emoji: '✍️', text: 'Exercices fun' },
                { emoji: '👥', text: 'Communauté active' },
                { emoji: '💬', text: 'Support 24/7' }
              ].map((item, i) => (
                <div key={i} className="bg-blue-50 rounded-xl p-4 flex items-center gap-3 border-2 border-blue-200">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-bold text-gray-900">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 mb-6 text-white">
              <div className="font-black mb-3 flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" size={20} />
                BOOSTERS PREMIUM
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm font-bold">
                {['⏰ Planning', '🏠 Study Rooms', '📝 Examens', '🎯 Learning Path'].map((item, i) => (
                  <div key={i}>{item}</div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all">
              C'EST PARTI ! 🚀
            </button>
          </div>

          {/* Exam Prep */}
          <div className="bg-white border-4 border-purple-500 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-black text-gray-900">Prépa Épreuves</h3>
              <p className="text-purple-600 font-bold">Réussis à 100% !</p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { emoji: '📖', text: 'Slides manuscrits' },
                { emoji: '📊', text: 'Exercices ciblés' },
                { emoji: '📈', text: 'Suivi progression' },
                { emoji: '💬', text: 'Support 24/7' }
              ].map((item, i) => (
                <div key={i} className="bg-purple-50 rounded-xl p-4 flex items-center gap-3 border-2 border-purple-200">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-bold text-gray-900">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 mb-6 text-white">
              <div className="font-black mb-3 flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" size={20} />
                BOOSTERS PREMIUM
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm font-bold">
                {['⏰ Planning', '🏠 Study Rooms', '📝 Examens'].map((item, i) => (
                  <div key={i}>{item}</div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-orange-600 transform hover:scale-105 transition-all">
              JE FONCE ! 💪
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Style 8: Airbnb - Social proof, trust-first
function AirbnbStyle() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-semibold text-gray-900 mb-6 leading-tight">
            Deux ambitions, <span className="text-pink-600">une seule plateforme</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoins 2,400+ étudiants qui ont transformé leurs résultats
          </p>
          
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="flex -space-x-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white" />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 font-medium">4.9/5 sur 1,200+ avis</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <Shield className="text-green-600" size={16} />
              <span className="text-sm font-medium text-green-700">Diagnostic gratuit</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              <Award className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-700">Boosters offerts 4 semaines</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mastery */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Programmes Mastery</h3>
                  <p className="text-gray-600">Maîtrise totale</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500">+800 étudiants</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { icon: Check, text: 'Slides manuscrits & Q&A', badge: 'Populaire' },
                { icon: Check, text: 'Exercices + corrections détaillées' },
                { icon: Check, text: 'Communauté & cercles d\'entraide' },
                { icon: Check, text: 'Support WhatsApp 24/7' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-blue-600" />
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-blue-600" size={18} />
                <span className="font-semibold text-gray-900">Mastery Boosters inclus</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {['Planning', 'Study Rooms', 'Examens blancs', 'Learning Path'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-blue-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Users className="text-blue-600" size={20} />
              <p className="text-sm text-blue-700 font-medium">
                👤 Sarah, Lucas et 823 autres ont choisi ce programme
              </p>
            </div>

            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              Voir le catalogue
              <TrendingUp size={18} />
            </button>
          </div>

          {/* Exam Prep */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
                  <Trophy className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Prépa Épreuves</h3>
                  <p className="text-gray-600">Réussite garantie</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-500">+600 étudiants</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { icon: Check, text: 'Slides manuscrits calibrés', badge: 'Nouveau' },
                { icon: Check, text: 'Exercices progressifs' },
                { icon: Check, text: 'Suivi de progression détaillé' },
                { icon: Check, text: 'Support WhatsApp 24/7' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-purple-600" />
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-purple-600" size={18} />
                <span className="font-semibold text-gray-900">Mastery Boosters inclus</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {['Planning', 'Study Rooms', 'Examens blancs'].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-purple-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <Users className="text-purple-600" size={20} />
              <p className="text-sm text-purple-700 font-medium">
                👤 Emma, Marc et 612 autres ont choisi ce programme
              </p>
            </div>

            <button className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              Découvrir les épreuves
              <TrendingUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
