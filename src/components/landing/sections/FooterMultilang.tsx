'use client';

import React from 'react';
import { Instagram, MessageCircle, Linkedin, Video, Mail } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '32477025622';

export function FooterMultilang() {
  const { language, t } = useLanguage();

  const handleWhatsAppClick = () => {
    const message = language === 'fr'
      ? 'Salut Science Made Simple 👋, j\'aimerais en savoir plus sur vos services.'
      : 'Hi Science Made Simple 👋, I\'d like to know more about your services.';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <footer className="bg-gray-50 text-gray-900 py-8 md:py-12 px-6 md:px-8 lg:px-10 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto">
        {/* Logo centré sur mobile */}
        <div className="flex justify-center mb-6 md:hidden">
          <div className="w-32 h-32 relative -mt-4">
            <Image 
              src="/brand/sms-logo2.svg" 
              alt="Science Made Simple"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand Column - Desktop only */}
          <div className="hidden md:flex justify-start">
            <div className="w-64 h-64 relative -mt-16">
              <Image 
                src="/brand/sms-logo2.svg" 
                alt="Science Made Simple"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Programs Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 md:mb-4 text-base md:text-lg">{t('footer.programs')}</h3>
            <ul className="space-y-1.5 md:space-y-2 text-gray-600 text-sm md:text-base font-medium">
              <li className="hover:text-gray-900 transition-colors cursor-default underline underline-offset-2">
                {t('footer.program.physics')}
              </li>
              <li className="hover:text-gray-900 transition-colors cursor-default underline underline-offset-2">
                {t('footer.program.mathematics')}
              </li>
              <li className="hover:text-gray-900 transition-colors cursor-default underline underline-offset-2">
                {t('footer.program.chemistry')}
              </li>
              <li className="hover:text-gray-900 transition-colors cursor-default underline underline-offset-2">
                {t('footer.program.economics')}
              </li>
              <li className="hover:text-gray-900 transition-colors cursor-default underline underline-offset-2">
                {t('footer.program.statistics')}
              </li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 md:mb-4 text-base md:text-lg">{t('footer.nav')}</h3>
            <ul className="space-y-1.5 md:space-y-2 text-gray-600 text-sm">
              <li>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  {t('footer.nav.how')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('content-carousel')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  {t('footer.nav.program')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('offre')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  {t('footer.nav.offer')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  {t('footer.nav.testimonials')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 md:mb-4 text-base md:text-lg">{t('footer.contact')}</h3>
            <ul className="space-y-1.5 md:space-y-2 text-gray-600 text-sm mb-3 md:mb-4">
              <li>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  WhatsApp Support
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@sciencemadesimple.io"
                  className="hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <Mail size={16} />
                  Email
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div>
              <p className="text-sm text-gray-600 mb-2">{t('footer.follow')}</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com/sciencemadesimple"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://tiktok.com/@sciencemadesimple"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all"
                >
                  <Video size={16} />
                </a>
                <a
                  href="https://linkedin.com/company/sciencemadesimple"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-4 md:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
          <p className="text-center md:text-left">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
            <a href="/mentions-legales" className="hover:text-gray-900 transition-colors">
              {t('footer.legal')}
            </a>
            <a href="/cgu" className="hover:text-gray-900 transition-colors">
              {t('footer.terms')}
            </a>
            <a href="/confidentialite" className="hover:text-gray-900 transition-colors">
              {t('footer.privacy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}




