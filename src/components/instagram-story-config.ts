// InstagramStoryRebranding - Easy Customization Guide
// Copy this file and modify the values below to customize your story

export const STORY_CONFIG = {
  // ===== BRAND COLORS =====
  colors: {
    deepBlue: '#0A0F2C',    // Primary brand color
    softGold: '#E4C77F',    // Accent color
    lightGrey: '#E5E7EB',   // Light backgrounds
    white: '#FFFFFF',
    black: '#000000',
  },

  // ===== TIMING =====
  timing: {
    frameAutoAdvance: 5000,        // Auto-advance delay (milliseconds)
    fadeTransitionDuration: 0.5,   // Transition between frames (seconds)
    textAnimationDelay: 0.3,       // Text reveal delay (seconds)
    textAnimationDuration: 0.8,    // Text reveal speed (seconds)
  },

  // ===== TYPOGRAPHY =====
  fonts: {
    titleFont: 'Georgia, serif',      // Serif font for titles
    bodyFont: 'Inter, sans-serif',    // Sans-serif for body text
  },

  // ===== FRAME 1: ANNOUNCEMENT =====
  frame1: {
    title: {
      line1: 'Les Classes Scientifiques',
      line2: 'deviennent',
      line3: 'Science Made Simple',
    },
    caption: 'A new chapter begins',
    background: 'gradient', // 'gradient' or 'solid'
  },

  // ===== FRAME 2: LEGACY & TRUST =====
  frame2: {
    quotes: [
      'Pendant des années, vous nous avez confié vos doutes, vos difficultés, vos ambitions.',
      'Ensemble, nous avons construit une méthode, une communauté, et des milliers de réussites.',
      'Nous vous avons aidés à passer de la confusion à la maîtrise.',
    ],
    showUnderline: true,
  },

  // ===== FRAME 3: THE EVOLUTION =====
  frame3: {
    title: 'Aujourd\'hui, nous franchissons une nouvelle étape.',
    body: [
      'Nous avons créé une plateforme, une application et une identité qui reflètent enfin ce que nous sommes devenus :',
      'un endroit où les sciences sont enseignées comme elles auraient toujours dû l\'être : claires, accessibles, maîtrisables.',
    ],
    showScientificBackground: true,
  },

  // ===== FRAME 4: WHAT CHANGES =====
  frame4: {
    title: 'Concrètement pour toi :',
    features: [
      { text: 'même équipe', highlight: false },
      { text: 'même pédagogie', highlight: false },
      { text: 'même accompagnement humain', highlight: false },
      { text: 'simplement mieux. Plus clair. Plus puissant.', highlight: true },
    ],
    backgroundColor: 'white', // 'white' or 'deepBlue'
  },

  // ===== FRAME 5: THANK YOU =====
  frame5: {
    message: 'Merci à tous ceux qui ont grandi avec nous.',
    emoji: '✨',
    showTransitionGraphic: true,
  },

  // ===== FRAME 6: NEW IDENTITY =====
  frame6: {
    logo: {
      type: 'text', // 'text' or 'image'
      text: 'SMS',
      imagePath: '/path-to-logo.svg', // Used if type is 'image'
    },
    title: {
      line1: 'Bienvenue dans',
      line2: 'Science Made Simple',
    },
    tagline: 'La même passion, une nouvelle énergie, et l\'ambition d\'aller encore plus loin ensemble.',
    showAccentLine: true,
  },
};

// ===== ANIMATION PRESETS =====
export const ANIMATION_PRESETS = {
  // Fade In (default)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Slide Up
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },

  // Scale In
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },

  // Slide from Right
  slideRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
};

// ===== HOW TO USE THIS CONFIG =====
/*

1. Import this config in your component:
   import { STORY_CONFIG } from './story-config';

2. Replace hardcoded values with config values:
   // Before:
   const title = "Bienvenue dans Science Made Simple";
   
   // After:
   const title = STORY_CONFIG.frame6.title.line2;

3. Use color variables:
   // Before:
   style={{ backgroundColor: '#0A0F2C' }}
   
   // After:
   style={{ backgroundColor: STORY_CONFIG.colors.deepBlue }}

4. Customize timing:
   // Before:
   setTimeout(() => {...}, 5000);
   
   // After:
   setTimeout(() => {...}, STORY_CONFIG.timing.frameAutoAdvance);

*/

// ===== COMMON CUSTOMIZATIONS =====
/*

1. CHANGE BRAND COLORS:
   - Modify STORY_CONFIG.colors object
   - All frames will automatically update

2. ADJUST TIMING:
   - Change frameAutoAdvance for different display duration
   - Modify animation delays for faster/slower reveals

3. UPDATE TEXT CONTENT:
   - Edit frame1-6 objects with your content
   - Maintain structure for animations to work

4. SWITCH FONTS:
   - Change titleFont and bodyFont
   - Ensure fonts are loaded in your project

5. DISABLE AUTO-ADVANCE:
   - Set frameAutoAdvance to null
   - Component will require manual navigation

6. ADD YOUR LOGO:
   - Change frame6.logo.type to 'image'
   - Update imagePath with your logo location

*/

export default STORY_CONFIG;


