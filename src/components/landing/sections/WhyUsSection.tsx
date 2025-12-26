'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Users, TrendingUp, Brain, Shield, MessageCircle, RefreshCw, Target } from 'lucide-react';

const WHATSAPP_NUMBER = '33123456789';
const WHATSAPP_DEFAULT_MESSAGE = 'Salut Science Made Simple 👋, je veux voir comment votre méthode s\'applique à mon cas. Pouvez-vous m\'aider ?';

const reasons = [
  {
    icon: Heart,
    title: "Parce qu'on commence par toi, pas par un catalogue",
    description: "Diagnostic humain. On t'écoute, on te comprend, on t'oriente. Une progression logique, construite, qui t'amène vers la maîtrise."
  },
  {
    icon: BookOpen,
    title: "Parce qu'on explique enfin les sciences comme un plaisir",
    description: "Des explications manuscrites, simples, humaines. Pas de jargon. Pas de flou. 90% de pratique."
  },
  {
    icon: Users,
    title: "Parce que tu n'es plus jamais seul",
    description: "Accès instantané à la communauté WhatsApp : entraide entre étudiants, réponses rapides, et interventions directes de Zak quand tu bloques."
  },
  {
    icon: Brain,
    title: "Parce qu'on répare ton cerveau avant tes notes",
    description: "On remplace \"je suis nul\" par \"je peux réussir\", \"je peux viser haut\"."
  },
  {
    icon: RefreshCw,
    title: "Parce que le cours évolue avec toi",
    description: "Chaque question que tu poses enrichit le programme Mastery. Nos cours vivent, se mettent à jour et deviennent plus clairs grâce aux étudiants comme toi."
  },
  {
    icon: Target,
    title: "Parce qu'on t'entraîne sur de vrais examens",
    description: "Corrigés détaillés, exercices ciblés et aucune surprise le jour J. Tu arrives confiant."
  }
];

export function WhyUsSection() {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className="py-20 md:py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Pourquoi on t'offre pas juste des cours.<br />
            Mais on t'offre une <span>transformation</span>.
          </h2>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={handleWhatsAppClick}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl inline-flex items-center gap-3"
          >
            <MessageCircle size={22} />
            Parler à un mentor sur WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  );
}

