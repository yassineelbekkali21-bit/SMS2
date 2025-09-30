'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Users, 
  BookOpen, 
  Target, 
  Zap,
  Star,
  Brain,
  Sparkles,
  Globe,
  Shield,
  Compass,
  Heart,
  TrendingUp,
  Award,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

// Composant Bento Card réutilisable
const BentoCard = ({ 
  children, 
  className = "", 
  gradient = "from-white/80 to-white/40",
  blur = true 
}: { 
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  blur?: boolean;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className={`
      relative overflow-hidden rounded-3xl border border-white/20
      ${blur ? 'backdrop-blur-lg' : ''}
      bg-gradient-to-br ${gradient}
      shadow-xl hover:shadow-2xl transition-all duration-500
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// Particules flottantes d'arrière-plan
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-white/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Statistiques animées
const AnimatedStat = ({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className="text-center"
  >
    <motion.div 
      className="text-3xl font-bold text-white mb-2"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.2, type: "spring" }}
    >
      {value}
    </motion.div>
    <div className="text-white/80 text-sm">{label}</div>
  </motion.div>
);

export function LandingPage({ onEnterApp }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Design épuré sans éléments décoratifs */}

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900">Science Made Simple</span>
          </motion.div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center gap-8">
            {['Cours', 'Communauté', 'Pricing', 'À propos'].map((item, i) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={onEnterApp}
              className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              Connexion
            </motion.button>
          </div>

          {/* Menu mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu mobile overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 p-6 md:hidden"
            >
              <div className="space-y-4">
                {['Cours', 'Communauté', 'Pricing', 'À propos'].map((item) => (
                  <a key={item} href="#" className="block text-white/80 hover:text-white py-2">
                    {item}
                  </a>
                ))}
                <button
                  onClick={onEnterApp}
                  className="w-full px-6 py-3 bg-white/20 backdrop-blur-lg text-white rounded-xl hover:bg-white/30 transition-all border border-white/30 mt-4"
                >
                  Connexion
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              L'apprentissage
              <br />
              <span className="text-black">
                réinventé
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez une nouvelle façon d'apprendre les sciences avec des quiz interactifs, 
              une communauté d'entraide et un suivi personnalisé de votre progression.
            </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={onEnterApp}
                className="group px-8 py-4 bg-black text-white rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center gap-3"
              >
                Commencer gratuitement
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform" 
                />
              </button>
              <button className="group px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center gap-3">
                <Play size={20} />
                Voir la démo
              </button>
            </motion.div>
          </div>

          {/* Bento Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {/* Statistiques principales */}
            <div className="lg:col-span-2 p-8 bg-white border border-gray-200 rounded-2xl">
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
                  <div className="text-gray-600 text-sm">Étudiants actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                  <div className="text-gray-600 text-sm">Cours disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
                  <div className="text-gray-600 text-sm">Taux de réussite</div>
                </div>
              </div>
            </div>

            {/* Quiz interactifs */}
            <BentoCard className="p-6" gradient="from-blue-500/80 to-purple-600/80">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Quiz Interactifs</h3>
                <p className="text-white/80 text-sm">
                  Des quiz intégrés dans les vidéos pour vérifier votre compréhension en temps réel
                </p>
              </div>
            </BentoCard>

            {/* Communauté */}
            <BentoCard className="p-6" gradient="from-green-500/80 to-emerald-600/80">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Communauté</h3>
                <p className="text-white/80 text-sm">
                  Posez vos questions et aidez d'autres étudiants dans un environnement bienveillant
                </p>
              </div>
            </BentoCard>

            {/* Suivi personnalisé */}
            <BentoCard className="lg:col-span-2 p-6" gradient="from-orange-500/80 to-red-500/80">
              <div className="flex items-center gap-6 text-white">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Target size={40} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Suivi Personnalisé</h3>
                  <p className="text-white/80">
                    Votre progression est analysée pour vous proposer un parcours d'apprentissage sur mesure
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Web 3.0 Ready */}
            <BentoCard className="lg:col-span-2 p-6" gradient="from-purple-600/80 to-pink-600/80">
              <div className="flex items-center gap-6 text-white">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Globe size={40} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Futur Web 3.0</h3>
                  <p className="text-white/80">
                    Prêt pour l'intégration avec les wallets crypto et les certifications on-chain
                  </p>
                </div>
              </div>
            </BentoCard>
          </motion.div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Une expérience d'apprentissage
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                révolutionnaire
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Chaque fonctionnalité a été pensée pour maximiser votre engagement et votre réussite
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <BentoCard className="p-8 h-full" gradient="from-white/90 to-white/70">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligence Adaptative</h3>
                <p className="text-gray-700 mb-6">
                  Notre IA analyse votre style d'apprentissage et adapte automatiquement le contenu 
                  pour optimiser votre compréhension et mémorisation.
                </p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <span>En savoir plus</span>
                  <ArrowRight size={16} />
                </div>
              </BentoCard>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <BentoCard className="p-8 h-full" gradient="from-white/90 to-white/70">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sécurité & Confiance</h3>
                <p className="text-gray-700 mb-6">
                  Vos données sont protégées et vos certifications peuvent être vérifiées 
                  de manière décentralisée grâce à la blockchain.
                </p>
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <span>Découvrir</span>
                  <ArrowRight size={16} />
                </div>
              </BentoCard>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <BentoCard className="p-8 h-full" gradient="from-white/90 to-white/70">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Communauté Bienveillante</h3>
                <p className="text-gray-700 mb-6">
                  Rejoignez une communauté d'apprenants passionnés où l'entraide et le partage 
                  de connaissances sont au cœur de l'expérience.
                </p>
                <div className="flex items-center gap-2 text-orange-600 font-semibold">
                  <span>Rejoindre</span>
                  <ArrowRight size={16} />
                </div>
              </BentoCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BentoCard className="p-12" gradient="from-white/95 to-white/80">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Prêt à transformer votre
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  façon d'apprendre ?
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'étudiants qui ont déjà révolutionné leur apprentissage
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onEnterApp}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                >
                  Commencer maintenant
                </button>
                <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all">
                  Découvrir les tarifs
                </button>
              </div>
            </BentoCard>
          </motion.div>
        </div>
      </section>

      {/* Footer minimaliste */}
      <footer className="relative z-10 py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <span className="text-white font-semibold">Science Made Simple</span>
            </div>
            <div className="flex items-center gap-8 text-white/60">
              <a href="#" className="hover:text-white transition-colors">Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center mt-8 text-white/60">
            <p>© 2024 Science Made Simple. Révolutionnons l'apprentissage ensemble.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
