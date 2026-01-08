/**
 * Données mockées pour la Landing Page
 * 
 * ⚠️ Ces données sont des exemples. Remplacez-les par vos vraies données !
 */

export interface Course {
  id: string;
  title: string;
  subject: 'Maths' | 'Physique' | 'Chimie' | 'Économie' | 'Statistiques';
  level: string;
  lessonCount: number;
  hours: number;
  description: string;
  color: string; // Tailwind gradient classes
}

export interface Testimonial {
  id: string;
  name: string;
  initial: string;
  school: string;
  level: string;
  rating: number;
  text: string;
  result: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'linkedin';
  username: string;
  handle: string;
  date: string;
  message: string;
}

/**
 * COURS - À personnaliser avec vos vrais cours
 */
export const coursesData: Course[] = [
  {
    id: 'physique-quantique-bac1',
    title: 'Physique Quantique - Les Fondamentaux',
    subject: 'Physique',
    level: 'Bac 1 / Médecine',
    lessonCount: 24,
    hours: 12,
    description: 'Comprendre enfin les ondes, particules et dualité',
    color: 'from-blue-500 to-[#00c2ff]'
  },
  {
    id: 'analyse-math-1',
    title: 'Analyse Mathématique I',
    subject: 'Maths',
    level: 'Bac 1 / Ingénieur',
    lessonCount: 32,
    hours: 18,
    description: 'Limites, dérivées, intégrales expliquées simplement',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'micro-economie',
    title: 'Micro-économie : Offre & Demande',
    subject: 'Économie',
    level: 'Bac 1 / Gestion',
    lessonCount: 18,
    hours: 10,
    description: 'Maîtrise les marchés et l\'équilibre économique',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'chimie-organique',
    title: 'Chimie Organique - Réactions',
    subject: 'Chimie',
    level: 'Bac 2 / Sciences',
    lessonCount: 28,
    hours: 15,
    description: 'Mécanismes réactionnels et nomenclature',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'stats-inferentielles',
    title: 'Statistiques Inférentielles',
    subject: 'Statistiques',
    level: 'Bac 2 / Tous',
    lessonCount: 20,
    hours: 11,
    description: 'Tests d\'hypothèses et intervalles de confiance',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'algebre-lineaire',
    title: 'Algèbre Linéaire Avancée',
    subject: 'Maths',
    level: 'Bac 2 / Ingénieur',
    lessonCount: 26,
    hours: 14,
    description: 'Espaces vectoriels, matrices et transformations',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'thermodynamique',
    title: 'Thermodynamique',
    subject: 'Physique',
    level: 'Bac 1 / Sciences',
    lessonCount: 22,
    hours: 13,
    description: 'Énergies, entropie et cycles thermodynamiques',
    color: 'from-blue-500 to-[#00c2ff]'
  },
  {
    id: 'macro-economie',
    title: 'Macro-économie Avancée',
    subject: 'Économie',
    level: 'Bac 2 / Économie',
    lessonCount: 24,
    hours: 13,
    description: 'PIB, inflation, politique monétaire et fiscale',
    color: 'from-green-500 to-emerald-500'
  }
];

/**
 * TÉMOIGNAGES - À remplacer par de vrais témoignages d'étudiants
 */
export const testimonialsData: Testimonial[] = [
  {
    id: 'temoignage-1',
    name: 'Sophie',
    initial: 'L.',
    school: 'ULB',
    level: 'Ingénieur de gestion, Bac 1',
    rating: 5,
    text: 'J\'étais complètement perdue en stats et micro-éco. Les cours allaient trop vite et je n\'osais pas poser de questions. Avec Science Made Simple, j\'ai enfin compris les concepts de base. Les vidéos sont ultra-claires et je pouvais réécouter autant que nécessaire.',
    result: '15/20 en stats (contre 7/20 au partiel)'
  },
  {
    id: 'temoignage-2',
    name: 'Thomas',
    initial: 'M.',
    school: 'UCL',
    level: 'Médecine, Bac 1',
    rating: 5,
    text: 'La physique quantique me donnait des cauchemars. Je ne comprenais rien aux ondes et particules. En 3 semaines avec SMS, j\'ai rattrapé tout mon retard. Le support WhatsApp est génial : réponse en 1h max même le dimanche soir !',
    result: 'Réussite de l\'exam avec 14/20'
  },
  {
    id: 'temoignage-3',
    name: 'Amina',
    initial: 'K.',
    school: 'ULiège',
    level: 'Sciences, Bac 2',
    rating: 5,
    text: 'J\'avais raté ma première session en chimie orga et je paniquais total pour la deuxième. L\'équipe m\'a fait un plan sur mesure, j\'ai bossé leurs exercices tous les jours. Résultat : non seulement j\'ai réussi, mais j\'ai eu une des meilleures notes de ma promo.',
    result: '16/20 en seconde session'
  },
  {
    id: 'temoignage-4',
    name: 'Lucas',
    initial: 'D.',
    school: 'EPHEC',
    level: 'Informatique de gestion, Bac 1',
    rating: 5,
    text: 'Les maths m\'ont toujours fait peur. Limites, dérivées, intégrales... c\'était du chinois. Mais les profs de SMS expliquent tellement bien que même moi j\'ai pigé ! Je me suis même découvert une passion pour l\'analyse.',
    result: 'Passé de 5/20 à 13/20 en 2 mois'
  },
  {
    id: 'temoignage-5',
    name: 'Léa',
    initial: 'R.',
    school: 'ULB',
    level: 'Économie, Bac 2',
    rating: 5,
    text: 'La macro-éco avancée était mon cauchemar. Je comprenais rien aux modèles IS-LM et à la politique monétaire. Grâce au planning personnalisé et aux vidéos progressives, j\'ai enfin tout connecté. La communauté m\'a aussi hyper motivée.',
    result: 'Grande distinction (16/20)'
  },
  {
    id: 'temoignage-6',
    name: 'Maxime',
    initial: 'B.',
    school: 'Polytechnique',
    level: 'Ingénieur civil, Bac 1',
    rating: 5,
    text: 'En prépa ingé, le rythme est infernal. J\'avais besoin d\'un boost en algèbre linéaire. SMS m\'a donné les méthodes qui marchent vraiment, pas de la théorie inutile. Les exos sont pile au niveau des examens. Ça m\'a sauvé la vie.',
    result: 'Réussite avec 15/20'
  }
];

/**
 * POSTS RÉSEAUX SOCIAUX - À remplacer par de vrais posts
 * Conseil : Capturez de vrais messages de vos étudiants sur Instagram, TikTok, LinkedIn
 */
export const socialPostsData: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'instagram',
    username: 'Marie_etudes',
    handle: '@marie.etudes',
    date: 'Il y a 2 jours',
    message: 'OMG merci @sciencemadesimple pour l\'aide en physique ! J\'ai enfin compris les ondes et j\'ai eu 14/20 😭🎉 Vous êtes incroyables !'
  },
  {
    id: 'post-2',
    platform: 'linkedin',
    username: 'Antoine Mercier',
    handle: 'antoine-mercier',
    date: 'Il y a 5 jours',
    message: 'Grâce à @ScienceMadeSimple, j\'ai rattrapé mon retard en maths et réussi ma 1ère année d\'ingé. Leur méthode est vraiment efficace et le suivi personnalisé fait toute la différence.'
  },
  {
    id: 'post-3',
    platform: 'tiktok',
    username: 'study.vibes',
    handle: '@study.vibes',
    date: 'Il y a 1 semaine',
    message: 'POV: tu passes de 5/20 à 15/20 en chimie grâce à SMS 🔥 Les vidéos sont tellement bien expliquées que même moi j\'ai capté ! #studytok #sciencemadesimple'
  },
  {
    id: 'post-4',
    platform: 'instagram',
    username: 'julien_eco',
    handle: '@julien_eco',
    date: 'Il y a 1 semaine',
    message: 'Best investment de mon année : Science Made Simple 💯 Le support WhatsApp est dispo H24 et ils répondent toujours super vite. J\'ai carrément amélioré ma moyenne de 4 points !'
  },
  {
    id: 'post-5',
    platform: 'tiktok',
    username: 'medstudent2024',
    handle: '@medstudent2024',
    date: 'Il y a 2 semaines',
    message: 'À tous ceux qui galèrent en médecine : testez Science Made Simple ! Ils m\'ont sauvé la vie pour la physique quantique. Les concepts sont expliqués de manière hyper claire 🙏'
  },
  {
    id: 'post-6',
    platform: 'linkedin',
    username: 'Sarah Dubois',
    handle: 'sarah-dubois',
    date: 'Il y a 3 semaines',
    message: 'Mention spéciale à Science Made Simple qui propose un accompagnement sur-mesure pour les étudiants en difficulté. Approche pédagogique moderne et résultats au rendez-vous. Très satisfaite !'
  }
];

/**
 * FAQ - Questions/Réponses
 * Conseil : Basez-vous sur les vraies questions que vos étudiants posent
 */
export const faqData = [
  {
    id: 'faq-1',
    question: 'Est-ce que c\'est pour le secondaire ou l\'université ?',
    answer: 'Les deux ! On accompagne les étudiants du secondaire supérieur (rhéto, 5e, 6e) jusqu\'au Bac 2-3 universitaire. Que tu sois en sciences générales, en médecine, en ingé, en gestion ou en économie, on a des cours et du support adaptés à ton niveau.'
  },
  {
    id: 'faq-2',
    question: 'Est-ce que je dois déjà être bon en maths / physique pour commencer ?',
    answer: 'Pas du tout ! Au contraire, on est là justement pour les étudiants qui galèrent. Que tu partes de zéro ou que tu aies juste besoin de consolider, on adapte le contenu à ton niveau. Nos vidéos reprennent tout depuis les bases.'
  },
  {
    id: 'faq-3',
    question: 'Comment ça se passe concrètement après mon message WhatsApp ?',
    answer: 'Simple : on te répond en 2h max (même le week-end). On discute 10-15 min de ta situation : matières, examens, blocages. Ensuite on te propose un plan de travail personnalisé avec accès à des leçons gratuites pour tester. Si ça te plaît, on te guide pour la suite !'
  },
  {
    id: 'faq-4',
    question: 'Est-ce que je peux tester avant de payer quoi que ce soit ?',
    answer: 'Oui, absolument ! Après notre premier échange sur WhatsApp, on te donne accès à 2-3 leçons gratuites pour que tu puisses tester notre méthode. Pas de carte bancaire demandée, pas de piège. Si ça te convient, on en discute après.'
  },
  {
    id: 'faq-5',
    question: 'Comment sont choisis les cours que vous me proposez ?',
    answer: 'On construit ton plan en fonction de ta fac, de tes matières, de tes examens et de ton niveau actuel. Pas de "pack standard" : tout est sur-mesure. Si tu nous dis "je suis en Bac 1 médecine ULB et je galère en physique quantique", on te fait un plan pile pour ça.'
  },
  {
    id: 'faq-6',
    question: 'Est-ce que vous préparez aussi aux concours (médecine, ingénieur, etc.) ?',
    answer: 'Oui ! On a des modules spécifiques pour les concours d\'entrée en médecine, ingénieur civil, dentisterie, etc. On te prépare sur les matières clés (maths, physique, chimie, bio) avec des exercices types concours et des stratégies d\'exam.'
  },
  {
    id: 'faq-7',
    question: 'Et si je suis très en retard dans mes études ?',
    answer: 'C\'est notre spécialité ! Beaucoup de nos étudiants étaient largués ou avaient raté leur première session. On te fait un diagnostic, on identifie les priorités, et on te construit un plan de rattrapage intensif. Avec du boulot régulier et notre accompagnement, tu peux rattraper plusieurs semaines de retard en quelques semaines.'
  },
  {
    id: 'faq-8',
    question: 'C\'est quoi la différence avec YouTube ou d\'autres cours en ligne ?',
    answer: 'Trois choses : 1) Un plan personnalisé (pas juste des vidéos dans le désordre), 2) Un accompagnement humain sur WhatsApp 7j/7 (tu peux poser des questions en direct), 3) Du contenu ciblé sur les programmes belges/français (pas des cours américains qui ne correspondent pas à ta matière).'
  }
];

/**
 * OBJECTIFS (pour le formulaire WhatsApp)
 */
export const goalsData = [
  {
    id: 'save',
    label: 'Je veux sauver mon année',
    emoji: '🆘'
  },
  {
    id: 'excel',
    label: 'Je veux viser une très bonne note',
    emoji: '🎯'
  },
  {
    id: 'exam',
    label: 'Je prépare un concours / examen d\'entrée',
    emoji: '📚'
  }
];




