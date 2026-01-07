'use client';

import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DiagnosticProvider } from '@/contexts/DiagnosticContext';
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
import { ExploreSectionMultilang } from './sections/ExploreSectionMultilang';

interface NewMarketingLandingMultilangProps {
  onEnterApp?: () => void;
  onDiagnosticComplete?: (data: Record<string, unknown>) => void;
}

function LandingContent({ onEnterApp }: { onEnterApp?: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <HeroSectionMultilang 
        onEnterApp={onEnterApp}
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
      <ExploreSectionMultilang />
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
      <DiagnosticProvider onComplete={onDiagnosticComplete} onEnterApp={onEnterApp}>
        <LandingContent onEnterApp={onEnterApp} />
      </DiagnosticProvider>
    </LanguageProvider>
  );
}
