'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Users, 
  BookOpen, 
  Target, 
  Zap,
  Star,
  Brain,
  Globe,
  Shield,
  Heart,
  Award,
  MessageCircle,
  Menu,
  X
} from 'lucide-react';

interface SimpleLandingProps {
  onEnterApp: () => void;
}

export function SimpleLanding({ onEnterApp }: SimpleLandingProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation épurée */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={16} />
              </div>
              <span className="text-lg font-bold text-gray-900">Science Made Simple</span>
            </div>
            
            {/* Menu desktop */}
            <div className="hidden md:flex items-center gap-8">
              {['Cours', 'Communauté', 'Pricing', 'À propos'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
              <button
                onClick={onEnterApp}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Connexion
              </button>
            </div>

            {/* Menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu mobile dropdown */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 mt-4 pt-4 pb-4">
              <div className="space-y-4">
                {['Cours', 'Communauté', 'Pricing', 'À propos'].map((item) => (
                  <a key={item} href="#" className="block text-gray-600 hover:text-gray-900 py-2">
                    {item}
                  </a>
                ))}
                <button
                  onClick={onEnterApp}
                  className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mt-4"
                >
                  Connexion
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section épuré */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              L'apprentissage scientifique
              <br />
              <span className="text-black">réinventé</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Quiz interactifs, communauté d'entraide, certifications blockchain.
              <br />
              Rejoignez la révolution de l'éducation Web 3.0.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onEnterApp}
                className="px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all flex items-center gap-3"
              >
                Commencer gratuitement
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all flex items-center gap-3">
                <Play size={20} />
                Voir la démo
              </button>
            </div>
          </motion.div>

          {/* Statistiques simples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Étudiants actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Cours disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Taux de réussite</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités principales */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pensée pour l'apprentissage moderne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quiz Interactifs */}
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-gray-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Quiz Interactifs</h3>
              <p className="text-gray-600">
                Des quiz intégrés dans les vidéos pour vérifier votre compréhension en temps réel
              </p>
            </div>

            {/* Communauté */}
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-gray-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Communauté</h3>
              <p className="text-gray-600">
                Posez vos questions et aidez d'autres étudiants dans un environnement bienveillant
              </p>
            </div>

            {/* Suivi Personnalisé */}
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Target size={32} className="text-gray-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">IA Personnalisée</h3>
              <p className="text-gray-600">
                Un assistant IA qui planifie vos études selon vos préférences et contraintes
              </p>
            </div>

            {/* Web 3.0 */}
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Globe size={32} className="text-gray-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Web 3.0 Ready</h3>
              <p className="text-gray-600">
                Certifications NFT et intégration avec les wallets crypto pour vos accomplissements
              </p>
            </div>

            {/* Sécurité */}
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-gray-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Sécurité & Confiance</h3>
              <p className="text-gray-600">
                Vos données protégées et vos certifications vérifiables sur la blockchain
              </p>
            </div>

            {/* Support 24/7 */}
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={32} className="text-gray-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Support 24/7</h3>
              <p className="text-gray-600">
                Notre équipe disponible sur WhatsApp pour vous accompagner à tout moment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-50 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prêt à transformer votre apprentissage ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'étudiants qui ont déjà révolutionné leur façon d'apprendre
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onEnterApp}
                className="px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all"
              >
                Commencer maintenant
              </button>
              <button className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all">
                Découvrir les tarifs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* À propos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain size={20} className="text-gray-900" />
                <span className="font-bold text-gray-900">Science Made Simple</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                L'apprentissage scientifique réinventé pour la génération Web 3.0
              </p>
              <a
                href="https://wa.me/33123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium w-fit"
              >
                <MessageCircle size={16} />
                Support WhatsApp
              </a>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/courses" className="text-gray-600 hover:text-gray-900">Mes cours</a></li>
                <li><a href="/community" className="text-gray-600 hover:text-gray-900">Communauté</a></li>
                <li><a href="/planning" className="text-gray-600 hover:text-gray-900">Planification</a></li>
                <li><a href="/progress" className="text-gray-600 hover:text-gray-900">Progression</a></li>
              </ul>
            </div>

            {/* Web 3.0 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Web 3.0</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/wallet" className="text-gray-600 hover:text-gray-900">Connecter wallet</a></li>
                <li><a href="/certificates" className="text-gray-600 hover:text-gray-900">Certificats NFT</a></li>
                <li><a href="/dao" className="text-gray-600 hover:text-gray-900">DAOs d'apprentissage</a></li>
                <li><a href="/reputation" className="text-gray-600 hover:text-gray-900">Réputation</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/help" className="text-gray-600 hover:text-gray-900">Centre d'aide</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a></li>
                <li>
                  <a 
                    href="https://wa.me/33123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    WhatsApp 24/7
                  </a>
                </li>
                <li><a href="/accessibility" className="text-gray-600 hover:text-gray-900">Accessibilité</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2024 Science Made Simple. Révolutionnons l'apprentissage ensemble.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-500 text-sm hover:text-gray-700">Confidentialité</a>
              <a href="/terms" className="text-gray-500 text-sm hover:text-gray-700">Conditions</a>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Web3 Ready</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

