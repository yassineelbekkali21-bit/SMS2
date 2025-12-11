'use client';

import React from 'react';
import { Navbar } from './sections/Navbar';
import { HeroSection } from './sections/HeroSection';
import { MethodSection } from './sections/MethodSection';
import { ContentsSection } from './sections/ContentsSection';
import { ResultsSection } from './sections/ResultsSection';
import { ContactSection } from './sections/ContactSection';
import { FAQSection } from './sections/FAQSection';
import { FinalCTASection } from './sections/FinalCTASection';

export function MarketingV2Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Smooth scroll behavior */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      <Navbar />
      <HeroSection />
      <MethodSection />
      <ContentsSection />
      <ResultsSection />
      <ContactSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}




