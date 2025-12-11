'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Est-ce que c\'est pour le secondaire ou l\'université ?',
    answer: 'Les deux ! On accompagne les étudiants du secondaire supérieur (rhéto, 5e, 6e) jusqu\'au Bac 2-3 universitaire. Que tu sois en sciences générales, en médecine, en ingé, en gestion ou en économie, on a des cours et du support adaptés à ton niveau.'
  },
  {
    id: '2',
    question: 'Est-ce que je dois déjà être bon en maths / physique pour commencer ?',
    answer: 'Pas du tout ! Au contraire, on est là justement pour les étudiants qui galèrent. Que tu partes de zéro ou que tu aies juste besoin de consolider, on adapte le contenu à ton niveau. Nos vidéos reprennent tout depuis les bases.'
  },
  {
    id: '3',
    question: 'Comment ça se passe concrètement après mon message WhatsApp ?',
    answer: 'Simple : on te répond en 2h max (même le week-end). On discute 10-15 min de ta situation : matières, examens, blocages. Ensuite on te propose un plan de travail personnalisé avec accès à des leçons gratuites pour tester. Si ça te plaît, on te guide pour la suite !'
  },
  {
    id: '4',
    question: 'Est-ce que je peux tester avant de payer quoi que ce soit ?',
    answer: 'Oui, absolument ! Après notre premier échange sur WhatsApp, on te donne accès à 2-3 leçons gratuites pour que tu puisses tester notre méthode. Pas de carte bancaire demandée, pas de piège. Si ça te convient, on en discute après.'
  },
  {
    id: '5',
    question: 'Comment sont choisis les cours que vous me proposez ?',
    answer: 'On construit ton plan en fonction de ta fac, de tes matières, de tes examens et de ton niveau actuel. Pas de "pack standard" : tout est sur-mesure. Si tu nous dis "je suis en Bac 1 médecine ULB et je galère en physique quantique", on te fait un plan pile pour ça.'
  },
  {
    id: '6',
    question: 'Est-ce que vous préparez aussi aux concours (médecine, ingénieur, etc.) ?',
    answer: 'Oui ! On a des modules spécifiques pour les concours d\'entrée en médecine, ingénieur civil, dentisterie, etc. On te prépare sur les matières clés (maths, physique, chimie, bio) avec des exercices types concours et des stratégies d\'exam.'
  },
  {
    id: '7',
    question: 'Et si je suis très en retard dans mes études ?',
    answer: 'C\'est notre spécialité ! Beaucoup de nos étudiants étaient largués ou avaient raté leur première session. On te fait un diagnostic, on identifie les priorités, et on te construit un plan de rattrapage intensif. Avec du boulot régulier et notre accompagnement, tu peux rattraper plusieurs semaines de retard en quelques semaines.'
  },
  {
    id: '8',
    question: 'C\'est quoi la différence avec YouTube ou d\'autres cours en ligne ?',
    answer: 'Trois choses : 1) Un plan personnalisé (pas juste des vidéos dans le désordre), 2) Un accompagnement humain sur WhatsApp 7j/7 (tu peux poser des questions en direct), 3) Du contenu ciblé sur les programmes belges/français (pas des cours américains qui ne correspondent pas à ta matière).'
  }
];

const WHATSAPP_NUMBER = '33123456789';
const WHATSAPP_MESSAGE = 'Salut Science Made Simple 👋, j\'ai une question qui n\'est pas dans la FAQ...';

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="faq" className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Questions fréquentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Tout ce que tu dois savoir avant de commencer
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">
                  {item.question}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 text-gray-500 transition-transform ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              
              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-gray-700 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={handleWhatsAppClick}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all inline-flex items-center gap-3 shadow-lg shadow-blue-600/30"
          >
            <MessageCircle size={22} />
            Poser ma question sur WhatsApp
          </button>
        </motion.div>
      </div>
    </section>
  );
}

