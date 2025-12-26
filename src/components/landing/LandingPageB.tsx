'use client';

import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
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

function LandingContentB({ onEnterApp, onDiagnosticComplete }: LandingPageBProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO - Accroche + promesse */}
      <HeroSectionMultilang 
        onEnterApp={onEnterApp}
        onDiagnosticComplete={onDiagnosticComplete}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
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
      <LandingContentB onEnterApp={onEnterApp} onDiagnosticComplete={onDiagnosticComplete} />
    </LanguageProvider>
  );
}

