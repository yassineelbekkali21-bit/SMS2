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

interface NewMarketingLandingMultilangProps {
  onEnterApp?: () => void;
}

function LandingContent({ onEnterApp }: NewMarketingLandingMultilangProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <HeroSectionMultilang 
        onEnterApp={onEnterApp}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <HowItWorksSectionMultilang />
      <WhyUsSectionMultilang />
      <TestimonialsSectionMultilang />
      <ContentCarouselMultilang />
      <OfferModelSectionMultilang />
      <WhatsAppContactFormMultilang />
      <FAQSectionMultilang />
      <FooterMultilang />
    </div>
  );
}

export function NewMarketingLandingMultilang({ onEnterApp }: NewMarketingLandingMultilangProps) {
  return (
    <LanguageProvider>
      <LandingContent onEnterApp={onEnterApp} />
    </LanguageProvider>
  );
}




