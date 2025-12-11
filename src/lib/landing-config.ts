/**
 * Configuration centralisée de la Landing Page Marketing
 * 
 * ⚠️ IMPORTANT : Modifier ces valeurs avant la mise en production
 */

export const LANDING_CONFIG = {
  /**
   * Configuration WhatsApp
   * Format: [code pays][numéro sans 0]
   * Exemples:
   * - France: 33612345678
   * - Belgique: 32412345678
   */
  whatsapp: {
    number: '33123456789', // ← REMPLACER PAR VOTRE VRAI NUMÉRO
    defaultMessage: 'Salut Science Made Simple 👋, j\'aimerais qu\'on regarde ensemble ma situation en [matière / faculté] pour voir comment vous pouvez m\'aider.',
  },

  /**
   * URL de la vidéo VSL (Video Sales Letter)
   * Format YouTube: https://www.youtube.com/embed/VIDEO_ID
   * Format Vimeo: https://player.vimeo.com/video/VIDEO_ID
   */
  video: {
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ← REMPLACER
    thumbnailUrl: '/video-thumbnail.jpg', // ← Optionnel : thumbnail custom
  },

  /**
   * Logos des établissements partenaires
   * Format: { name: string, logoUrl: string }
   */
  partnerLogos: [
    { name: 'ULB', logoUrl: '/logos/ulb.png' },
    { name: 'UCL', logoUrl: '/logos/ucl.png' },
    { name: 'ULiège', logoUrl: '/logos/uliege.png' },
    { name: 'KU Leuven', logoUrl: '/logos/kuleuven.png' },
    { name: 'EPHEC', logoUrl: '/logos/ephec.png' },
    { name: 'HEC Liège', logoUrl: '/logos/hec.png' },
  ],

  /**
   * Statistiques affichées dans le Hero
   */
  stats: {
    students: '1,200+',
    successRate: '92%',
    support: '24/7',
  },

  /**
   * Liens réseaux sociaux
   */
  social: {
    instagram: 'https://instagram.com/sciencemadesimple',
    tiktok: 'https://tiktok.com/@sciencemadesimple',
    linkedin: 'https://linkedin.com/company/sciencemadesimple',
    youtube: 'https://youtube.com/@sciencemadesimple',
  },

  /**
   * Contact
   */
  contact: {
    email: 'contact@sciencemadesimple.io',
    supportEmail: 'support@sciencemadesimple.io',
  },

  /**
   * Analytics
   */
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX', // ← REMPLACER
    facebookPixelId: 'XXXXXXXXXX', // ← REMPLACER
    enableTracking: true,
  },

  /**
   * SEO
   */
  seo: {
    title: 'Science Made Simple - Transforme la confusion en maîtrise',
    description: 'Cours ultra-pédago + accompagnement WhatsApp 7j/7 pour réussir tes études scientifiques. Maths, Physique, Chimie, Économie.',
    keywords: 'cours sciences, accompagnement scolaire, maths physique chimie, prépa concours médecine ingénieur, soutien scolaire belgique',
    ogImage: '/og-image.png',
  },
};

/**
 * Helper pour construire l'URL WhatsApp
 */
export function buildWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || LANDING_CONFIG.whatsapp.defaultMessage;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${LANDING_CONFIG.whatsapp.number}?text=${encodedMessage}`;
}

/**
 * Helper pour tracker les conversions
 */
export function trackWhatsAppClick(source: string): void {
  if (!LANDING_CONFIG.analytics.enableTracking) return;

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'whatsapp_click', {
      event_category: 'conversion',
      event_label: source,
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      content_name: 'WhatsApp Contact',
      source: source,
    });
  }

  // Console log pour debug
  console.log(`📊 WhatsApp CTA clicked from: ${source}`);
}




