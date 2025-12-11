'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './sections/HeroSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { WhyUsSection } from './sections/WhyUsSection';
import { ContentCarousel } from './sections/ContentCarousel';
import { OfferModelSection } from './sections/OfferModelSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { WhatsAppContactForm } from './sections/WhatsAppContactForm';
import { FAQSection } from './sections/FAQSection';
import { Footer } from './sections/Footer';

interface NewMarketingLandingProps {
  onEnterApp?: () => void;
}

export function NewMarketingLanding({ onEnterApp }: NewMarketingLandingProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection 
        onEnterApp={onEnterApp} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
      />
      <HowItWorksSection />
      <WhyUsSection />
      <ContentCarousel />
      <OfferModelSection />
      <TestimonialsSection />
      <WhatsAppContactForm />
      <FAQSection />
      <Footer />
    </div>
  );
}

