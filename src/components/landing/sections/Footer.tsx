'use client';

import React from 'react';
import { Instagram, MessageCircle, Linkedin, Video, Mail } from 'lucide-react';
import Image from 'next/image';

const WHATSAPP_NUMBER = '33123456789';
const WHATSAPP_MESSAGE = 'Salut Science Made Simple 👋, j\'aimerais en savoir plus sur vos services.';

export function Footer() {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <footer className="bg-gray-50 text-gray-900 py-12 px-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Column */}
          <div className="flex justify-center md:justify-start">
            <div className="w-48 h-48 md:w-64 md:h-64 relative -mt-8 md:-mt-16">
              <Image 
                src="/brand/sms-logo2.svg" 
                alt="Science Made Simple"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  Comment ça marche
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('content-carousel')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  Programme
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('offre')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  Offre
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-gray-900 transition-colors"
                >
                  Témoignages
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
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600 text-sm mb-4">
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
              <p className="text-sm text-gray-600 mb-2">Suis-nous</p>
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
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            © 2024 Science Made Simple. Transformons tes études ensemble.
          </p>
          <div className="flex items-center gap-4">
            <a href="/mentions-legales" className="hover:text-gray-900 transition-colors">
              Mentions légales
            </a>
            <a href="/cgu" className="hover:text-gray-900 transition-colors">
              CGU
            </a>
            <a href="/confidentialite" className="hover:text-gray-900 transition-colors">
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


