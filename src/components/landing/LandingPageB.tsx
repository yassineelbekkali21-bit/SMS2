'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X } from 'lucide-react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DiagnosticProvider, useDiagnostic } from '@/contexts/DiagnosticContext';
import { HeroSectionMultilang } from './sections/HeroSectionMultilang';
import { WhyUsSectionMultilang } from './sections/WhyUsSectionMultilang';
import { OfferModelSectionMultilang } from './sections/OfferModelSectionMultilang';
import { TestimonialsSectionMultilang } from './sections/TestimonialsSectionMultilang';
import { WhatsAppContactFormMultilang } from './sections/WhatsAppContactFormMultilang';
import { FAQSectionMultilang } from './sections/FAQSectionMultilang';
import { FooterMultilang } from './sections/FooterMultilang';
import { MentorSectionMultilang } from './sections/MentorSectionMultilang';
import { CurriculumSectionMultilang } from './sections/CurriculumSectionMultilang';
import { StartJourneySectionMultilang } from './sections/StartJourneySectionMultilang';
import { MasteryBoostersSection } from './sections/MasteryBoostersSection';
import { WhoIsSMSSectionMultilang } from './sections/WhoIsSMSSectionMultilang';
import { DiagnosticSectionMultilang } from './sections/DiagnosticSectionMultilang';
import { ExploreSectionMultilang } from './sections/ExploreSectionMultilang';

/**
 * Landing Page B - Version avec nouvel ordre optimisé
 * 
 * Ordre: HERO → ZAK → PROGRAM → FORYOU → DIAGNOSTIC → SOCIAL → BOOSTERS → CTA → WHY → OFFRE → CONTACT → FAQ
 * 
 * Différences avec Landing A:
 * - Section "On commence par toi" (Diagnostic) déplacée après FORYOU
 * - HOW (How it works) supprimé
 * - Ordre réorganisé pour meilleure conversion
 */

interface LandingPageBProps {
  onEnterApp?: () => void;
  onDiagnosticComplete?: (data: Record<string, unknown>) => void;
}

function LandingContentB({ onEnterApp }: { onEnterApp?: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true);
  const [urgencyTimeLeft, setUrgencyTimeLeft] = useState({ hours: 71, minutes: 59, seconds: 59 });
  const { openDiagnostic } = useDiagnostic();
  
  // Timer pour le countdown d'urgence
  useEffect(() => {
    if (!showUrgencyBanner) return;
    
    const timer = setInterval(() => {
      setUrgencyTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showUrgencyBanner]);

  // Option: 'above' = au-dessus du header, 'below' = en-dessous du header
  const bannerPosition: 'above' | 'below' = 'below'; // ← CHANGE ICI POUR TESTER

  const UrgencyBannerContent = () => (
    <div className="flex items-center justify-center gap-3 sm:gap-6 py-4 sm:py-5 px-4" style={{ fontSize: '16px' }}>
      <span className="text-[#48c6ed] font-bold tracking-wide uppercase whitespace-nowrap text-xs sm:text-[16px]">
        OFFRE DE LANCEMENT
      </span>
      <span className="hidden sm:inline text-white font-medium uppercase text-[16px]">
        SUR CHAQUE MASTERY PROGRAM
      </span>
      <span className="px-3 py-1.5 border border-[#48c6ed] rounded-full text-[#48c6ed] font-bold">
        -60%
      </span>
      <span className="hidden md:inline text-white font-medium uppercase">
        EXPIRE DANS
      </span>
      <div className="flex items-center gap-1 text-white font-bold tabular-nums">
        <span>{String(Math.floor(urgencyTimeLeft.hours / 24)).padStart(2, '0')}</span>
        <span className="text-white text-xs font-normal">j</span>
        <span>{String(urgencyTimeLeft.hours % 24).padStart(2, '0')}</span>
        <span className="text-white text-xs font-normal">h</span>
        <span>{String(urgencyTimeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-white text-xs font-normal">m</span>
        <span>{String(urgencyTimeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-white text-xs font-normal">s</span>
      </div>
      <button
        onClick={() => setShowUrgencyBanner(false)}
        className="ml-2 text-gray-600 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Bandeau d'urgence - Position: AU-DESSUS du header */}
      {bannerPosition === 'above' && (
        <AnimatePresence>
          {showUrgencyBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0a] overflow-hidden"
            >
              <UrgencyBannerContent />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 1. HERO - Accroche + promesse */}
      <HeroSectionMultilang 
        onEnterApp={onEnterApp}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        hasUrgencyBanner={bannerPosition === 'above' && showUrgencyBanner}
        urgencyBannerBelow={bannerPosition === 'below' && showUrgencyBanner ? <UrgencyBannerContent /> : undefined}
      />
      
      {/* 2. ZAK - Confiance humaine immédiate */}
      <MentorSectionMultilang />
      
      {/* 3. PROGRAM - Montrer le contenu */}
      <CurriculumSectionMultilang />
      
      {/* 4. FORYOU - Qualification "c'est pour moi" */}
      <WhoIsSMSSectionMultilang />
      
      {/* 5. DIAGNOSTIC - "On commence par toi" - Engagement actif */}
      <DiagnosticSectionMultilang />
      
      {/* 6. SOCIAL - Preuve sociale */}
      <TestimonialsSectionMultilang />
      
      {/* 7. BOOSTERS - Valeur ajoutée */}
      <MasteryBoostersSection />
      
      {/* 8. CTA - Premier push conversion */}
      <StartJourneySectionMultilang />
      
      {/* 8.5. EXPLORE - Explorer les programmes */}
      <ExploreSectionMultilang />
      
      {/* 9. WHY - Renforcer la décision */}
      <WhyUsSectionMultilang />
      
      {/* 10. OFFRE - Détail pricing */}
      <OfferModelSectionMultilang />
      
      {/* 11. CONTACT - Rassurer hésitants */}
      <WhatsAppContactFormMultilang />
      
      {/* 12. FAQ - Lever objections */}
      <FAQSectionMultilang />
      
      {/* Footer */}
      <FooterMultilang />
    </div>
  );
}

export function LandingPageB({ onEnterApp, onDiagnosticComplete }: LandingPageBProps) {
  return (
    <LanguageProvider>
      <DiagnosticProvider onComplete={onDiagnosticComplete} onEnterApp={onEnterApp}>
        <LandingContentB onEnterApp={onEnterApp} />
      </DiagnosticProvider>
    </LanguageProvider>
  );
}

