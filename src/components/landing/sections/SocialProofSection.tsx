'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Linkedin, Video } from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'linkedin';
  username: string;
  handle: string;
  date: string;
  message: string;
  icon: typeof Instagram;
  color: string;
}

const socialPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    username: 'Marie_etudes',
    handle: '@marie.etudes',
    date: 'Il y a 2 jours',
    message: 'OMG merci @sciencemadesimple pour l\'aide en physique ! J\'ai enfin compris les ondes et j\'ai eu 14/20 😭🎉 Vous êtes incroyables !',
    icon: Instagram,
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: '2',
    platform: 'linkedin',
    username: 'Antoine Mercier',
    handle: 'antoine-mercier',
    date: 'Il y a 5 jours',
    message: 'Grâce à @ScienceMadeSimple, j\'ai rattrapé mon retard en maths et réussi ma 1ère année d\'ingé. Leur méthode est vraiment efficace et le suivi personnalisé fait toute la différence.',
    icon: Linkedin,
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: '3',
    platform: 'tiktok',
    username: 'study.vibes',
    handle: '@study.vibes',
    date: 'Il y a 1 semaine',
    message: 'POV: tu passes de 5/20 à 15/20 en chimie grâce à SMS 🔥 Les vidéos sont tellement bien expliquées que même moi j\'ai capté ! #studytok #sciencemadesimple',
    icon: Video,
    color: 'from-gray-800 to-gray-900'
  },
  {
    id: '4',
    platform: 'instagram',
    username: 'julien_eco',
    handle: '@julien_eco',
    date: 'Il y a 1 semaine',
    message: 'Best investment de mon année : Science Made Simple 💯 Le support WhatsApp est dispo H24 et ils répondent toujours super vite. J\'ai carrément amélioré ma moyenne de 4 points !',
    icon: Instagram,
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: '5',
    platform: 'tiktok',
    username: 'medstudent2024',
    handle: '@medstudent2024',
    date: 'Il y a 2 semaines',
    message: 'À tous ceux qui galèrent en médecine : testez Science Made Simple ! Ils m\'ont sauvé la vie pour la physique quantique. Les concepts sont expliqués de manière hyper claire 🙏',
    icon: Video,
    color: 'from-gray-800 to-gray-900'
  },
  {
    id: '6',
    platform: 'linkedin',
    username: 'Sarah Dubois',
    handle: 'sarah-dubois',
    date: 'Il y a 3 semaines',
    message: 'Mention spéciale à Science Made Simple qui propose un accompagnement sur-mesure pour les étudiants en difficulté. Approche pédagogique moderne et résultats au rendez-vous. Très satisfaite !',
    icon: Linkedin,
    color: 'from-blue-600 to-blue-700'
  }
];

export function SocialProofSection() {
  return (
    <section className="py-20 md:py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            On parle de nous sur les réseaux
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Une communauté vivante d'étudiants qui partagent leurs réussites
          </motion.p>
        </div>

        {/* Social Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPosts.map((post, index) => {
            const Icon = post.icon;
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                {/* Header with platform icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.username}</p>
                      <p className="text-sm text-gray-500">{post.handle}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>

                {/* Message */}
                <p className="text-gray-700 leading-relaxed">
                  {post.message}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 pt-12 border-t border-gray-200"
        >
          <p className="text-lg text-gray-700 mb-6">
            Rejoins la communauté sur les réseaux
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://instagram.com/sciencemadesimple"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-xl hover:scale-105 transition-transform"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://tiktok.com/@sciencemadesimple"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-900 text-white rounded-xl hover:scale-105 transition-transform"
            >
              <Video size={24} />
            </a>
            <a
              href="https://linkedin.com/company/sciencemadesimple"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-blue-600 text-white rounded-xl hover:scale-105 transition-transform"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://wa.me/33123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-blue-600 text-white rounded-xl hover:scale-105 transition-transform"
            >
              <MessageCircle size={24} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

