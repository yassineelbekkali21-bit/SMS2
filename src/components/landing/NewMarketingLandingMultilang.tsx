'use client';

import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { HeroSectionMultilang } from './sections/HeroSectionMultilang';
import { HowItWorksSectionMultilang } from './sections/HowItWorksSectionMultilang';
import { WhyUsSectionMultilang } from './sections/WhyUsSectionMultilang';
import { ContentCarouselMultilang } from './sections/ContentCarouselMultilang';
import { OfferModelSectionMultilang } from './sections/OfferModelSectionMultilang';
import { TestimonialsSectionMultilang } from './sections/TestimonialsSectionMultilang';
import { WhatsAppContactFormMultilang } from './sections/WhatsAppContactFormMultilang';
import { FAQSectionMultilang } from './sections/FAQSectionMultilang';
import { FooterMultilang } from './sections/FooterMultilang';
import { MentorSectionMultilang } from './sections/MentorSectionMultilang';
import { TargetSectionMultilang } from './sections/TargetSectionMultilang';
import { CurriculumSectionMultilang } from './sections/CurriculumSectionMultilang';
import { StartJourneySectionMultilang } from './sections/StartJourneySectionMultilang';
import { MasteryBoostersSection } from './sections/MasteryBoostersSection';
import { WhoIsSMSSectionMultilang } from './sections/WhoIsSMSSectionMultilang';

interface NewMarketingLandingMultilangProps {
  onEnterApp?: () => void;
  onDiagnosticComplete?: (data: Record<string, unknown>) => void;
}

function LandingContent({ onEnterApp, onDiagnosticComplete }: NewMarketingLandingMultilangProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <HeroSectionMultilang 
        onEnterApp={onEnterApp}
        onDiagnosticComplete={onDiagnosticComplete}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <MentorSectionMultilang />
      {/* <TargetSectionMultilang /> */}
      <HowItWorksSectionMultilang />
      <WhyUsSectionMultilang />
      <WhoIsSMSSectionMultilang />
      <TestimonialsSectionMultilang />
      <StartJourneySectionMultilang />
      <CurriculumSectionMultilang />
      <MasteryBoostersSection />
      <OfferModelSectionMultilang />
      <WhatsAppContactFormMultilang />
      <FAQSectionMultilang />
      <FooterMultilang />
    </div>
  );
}

export function NewMarketingLandingMultilang({ onEnterApp, onDiagnosticComplete }: NewMarketingLandingMultilangProps) {
  return (
    <LanguageProvider>
      <LandingContent onEnterApp={onEnterApp} onDiagnosticComplete={onDiagnosticComplete} />
    </LanguageProvider>
  );
}
