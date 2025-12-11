'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Traductions
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.method': 'Méthode',
    'nav.offer': 'Offre',
    'nav.results': 'Résultats',
    'nav.faq': 'FAQ',
    'nav.start': 'Commencer gratuitement',

    // Hero Section
    'hero.title.line1': "Toutes les sciences que vous désirez apprendre.",
    'hero.title.line2.start': 'Une plateforme. ',
    'hero.title.line2.highlight': 'Une solution.',
    'hero.bullet1.bold': 'Diagnostic',
    'hero.bullet1.text': 'qui t\'oriente',
    'hero.bullet2.bold': 'Parcours d\'apprentissage',
    'hero.bullet2.text': 'structuré par niveaux',
    'hero.bullet3.bold': 'Méthode éprouvée,',
    'hero.bullet3.text': 'zéro prérequis',
    'hero.bullet4.bold': 'Communauté qui t\'élève',
    'hero.bullet4.text': '& mentor accessible',
    'hero.subtitle.line1': '',
    'hero.subtitle.line2': 'Tu vas comprendre, progresser, kiffer les sciences et viser plus haut',
    'hero.subtitle.line2.highlight': 'que tu ne l\'imaginais.',
    'hero.cta': 'Rejoins le mouvement',
    'hero.microcopy': 'Accès à vie • Mises à jour gratuites • Leçons offertes',
    'hero.social_proof': 'étudiants ont déjà décollé avec nous',
    'hero.see_how': 'Voir comment ça marche en 2 minutes',

    // Pitch Section
    'pitch.1': 'Tout le monde peut réussir. Je te le garantis. Quelles que soient tes ambitions, quelles que soient tes difficultés, on y arrivera ensemble.',
    'pitch.2': 'Si tu es motivé, je vais te faire bosser dur. Mais tu verras vite qu\'on peut dépasser ce que tu croyais possible.',
    'pitch.3': 'On t\'expliquera les maths, la physique, la chimie et l\'économie comme personne ne te les a jamais expliquées. Pas de jargon. Pas de flou. Pas d\'ennui. Juste une méthode claire, directe, et des résultats concrets.',
    'pitch.4': 'Nos étudiants ne se contentent pas de réussir : ils visent les meilleures écoles. Et ils y arrivent.',
    'pitch.5': 'Notre mission est simple : dévoiler ton véritable potentiel. Te faire comprendre. Te faire progresser. Et peut-être même... te faire aimer ces matières.',
    'pitch.6': 'Alors oui, tu vas bosser. Oui, ce sera exigeant. Mais tu ne seras jamais seul. Et tu ne reconnaîtras plus ton niveau d\'ici quelques semaines.',
    'pitch.7': 'Tout commence par un simple message WhatsApp.',
    'pitch.8': 'Les autres ont déjà commencé. Pourquoi pas toi ?',
    'pitch.cta': 'Commencer gratuitement',

    // How it works
    'how.title': 'Comment on t\'aide à passer de la',
    'how.title.highlight': 'confusion à la maîtrise',
    'how.subtitle': 'On t\'accompagne avec exigence et bienveillance.',
    'how.step1.title': 'On commence par toi',
    'how.step1.desc': 'On identifie tes difficultés, ton niveau et ce que tu veux vraiment maîtriser.\nPas de jugement, pas de prérequis — [[juste un diagnostic clair pour comprendre d\'où tu pars.]]',
    'how.step2.title': 'On t\'oriente dans ton programme Mastery',
    'how.step2.desc': '[[Tu accèdes au programme complet]] (Beginner → Advanced).\nOn t\'oriente vers le bon niveau du programme Mastery, selon ton niveau actuel et tes objectifs.',
    'how.step3.title': 'On t\'accompagne jusqu\'à la maîtrise',
    'how.step3.desc': '[[Tu n\'avances jamais seul.]] Notre équipe et la communauté t\'accompagnent jusqu\'à ce que tu comprennes, progresses et maîtrises vraiment.',
    'how.cta': 'Parler de ma situation sur WhatsApp',

    // Why us
    'why.title': 'Pourquoi on t\'offre pas juste des cours.',
    'why.title.line2': 'Mais on t\'offre une',
    'why.title.highlight': 'transformation',
    'why.reason1.title': 'Parce qu\'on commence par toi, pas par un catalogue',
    'why.reason1.desc': 'Diagnostic humain. On t\'écoute, on te comprend, on t\'oriente. Une progression logique, construite, qui t\'amène vers la maîtrise.',
    'why.reason2.title': 'Parce qu\'on redonne enfin du plaisir à comprendre les sciences',
    'why.reason2.desc': 'Des explications manuscrites, simples, humaines. Pas de jargon. Pas de flou. 90% de pratique.',
    'why.reason3.title': 'Parce que tu n\'es plus jamais seul',
    'why.reason3.desc': 'Accès instantané à la communauté WhatsApp : entraide entre étudiants, réponses rapides, et interventions directes de Zak quand tu bloques.',
    'why.reason4.title': 'Parce qu\'on répare ton cerveau avant tes notes',
    'why.reason4.desc': 'On remplace "je suis nul" par "je peux réussir", "je peux viser haut".',
    'why.reason5.title': 'Parce que le cours évolue avec toi',
    'why.reason5.desc': 'Chaque question que tu poses enrichit le programme Mastery. Nos cours vivent, se mettent à jour et deviennent plus clairs grâce aux étudiants comme toi.',
    'why.reason6.title': 'Parce qu\'on t\'entraîne sur de vrais examens',
    'why.reason6.desc': 'Corrigés détaillés, exercices ciblés et aucune surprise le jour J. Tu arrives confiant.',
    'why.cta': 'Parler à un mentor',

    // Content Carousel
    'carousel.title': 'Un programme complet pour maîtriser les sciences.',
    'carousel.title.line2.part1': 'Organisé',
    'carousel.title.line2.highlight1': 'par matière',
    'carousel.title.line2.part2': ', structuré',
    'carousel.title.line2.highlight2': 'par niveaux',
    'carousel.subtitle': 'Tu progresses du niveau Beginner → Intermediate → Advanced,\navec des contenus construits à partir des difficultés réelles de milliers d\'étudiants.',
    'carousel.cta_text': 'Entraînement sur de vrais examens avec corrections détaillées.',
    'carousel.test_btn': 'Me tester',
    'carousel.subjects.maths': 'Maths',
    'carousel.subjects.physics': 'Physique',
    'carousel.subjects.chemistry': 'Chimie',
    'carousel.subjects.economics': 'Économie',
    'carousel.subjects.statistics': 'Statistiques',

    // Offer Section
    'offer.title': 'Deux ambitions,',
    'offer.title.highlight': 'une seule plateforme',
    'offer.subtitle': '',
    'offer.mastery.title': 'Un objectif : la maîtrise totale.',
    'offer.mastery.block1.title': 'Mastery Programs',
    'offer.mastery.block1.intro': 'Accès à vie à l\'intégralité des matières débloquées.\nUn environnement pensé pour comprendre, progresser et performer depuis ton niveau actuel jusqu\'à une véritable maîtrise scientifique :',
    'offer.mastery.block2.title': 'Mastery Levels',
    'offer.mastery.block2.intro': '3 niveaux pour s\'adapter à la difficulté réelle de chaque matière :',
    'offer.mastery.cta': 'Commencer gratuitement',
    'offer.exam.title': 'Réussite aux épreuves standardisées\net concours sélectifs.',
    'offer.exam.block1.title': 'Prépa Épreuves & Concours',
    'offer.exam.block1.intro': 'Accès complet au programme calibré sur les exigences officielles, pensé pour te mener au score visé :',
    'offer.exam.cta': 'Découvrir les épreuves disponibles',
    'offer.addons.title': 'Mastery Boosters',
    'offer.addons.desc': 'Les modules qui accélèrent ta progression — accessibles pour les deux programmes.',
    'offer.addons.highlight': '',
    'offer.addons.desc2': 'Conçus pour maximiser tes résultats, ton organisation et ton efficacité :',
    'offer.addons.1': 'Outil de planification',
    'offer.addons.2': 'Accès aux Study Rooms',
    'offer.addons.3': 'Générateur d\'examens blancs',
    'offer.addons.4': 'Learning Path adapté à ton objectif',

    // Testimonials
    'testimonials.title': 'Ils ont transformé leurs résultats grâce à Science Made Simple.',
    'testimonials.title.highlight': 'Demain, c\'est peut-être toi.',
    'testimonials.cta': 'Commencer gratuitement',
    'testimonials.video.title': 'SMS vous remercie pour votre confiance',

    // WhatsApp Contact
    'contact.title': 'C\'est ici que ça commence,',
    'contact.title.highlight': 'on te répond sur WhatsApp',
    'contact.point1': 'Diagnostic 100% gratuit',
    'contact.point2': 'Premières leçons offertes',
    'contact.point3': 'Réponse personnalisée rapide',
    'contact.label': 'Explique-nous ta situation pour t\'orienter dans le bon Mastery Program',
    'contact.placeholder': 'Ex : Je suis en Bac 1 médecine à l\'ULB, je galère en physique quantique et en stats...',
    'contact.tip': 'Plus tu es précis(e), mieux on pourra t\'aider : matières, fac, difficultés, examens...',
    'contact.files.label': 'Partage tes documents (optionnel) :',
    'contact.files.cta': 'Clique pour ajouter tes cours, examens, syllabus...',
    'contact.files.formats': 'PDF, Word, Images • Max 10 fichiers',
    'contact.files.count': 'Fichiers à envoyer',
    'contact.files.tip': 'Tu pourras envoyer ces fichiers directement dans WhatsApp après connexion',
    'contact.submit': 'Commencer gratuitement',
    'contact.submitting': 'Ouverture de WhatsApp...',
    'contact.privacy': 'Tes infos restent privées. On te contacte uniquement pour t\'aider.',

    // FAQ
    'faq.title': 'Questions fréquentes',
    'faq.subtitle': 'Tout ce que tu dois savoir avant de commencer',
    'faq.q1': 'Qu\'est-ce que Science Made Simple ?',
    'faq.a1': 'Science Made Simple est une plateforme de tutorat en ligne spécialisée dans l\'accompagnement des étudiants en sciences, économie et gestion.\n\nNous aidons aussi bien les étudiants du secondaire, ceux qui préparent leur bac ou concours d\'entrée, que les étudiants du supérieur dans les filières les plus exigeantes (Business Schools, ingénieurs, médecine, polytechnique...).\n\nNotre mission : ne jamais te laisser seul face à tes difficultés. Tu bénéficies d\'un accompagnement personnalisé, d\'une communauté active et de supports clairs, construits à partir de milliers de vraies questions posées par nos étudiants au fil des années.',
    'faq.q2': 'En quoi Science Made Simple est différent d\'un cours particulier ?',
    'faq.a2': 'Un cours particulier, c\'est souvent une heure par semaine avec un prof. Chez nous, c\'est tout un système qui t\'accompagne au quotidien :\n\n• Accès direct au prof via WhatsApp pour poser tes questions quand tu veux.\n• Un parcours sur mesure, défini ensemble en fonction de tes ambitions et de tes blocages.\n• Une communauté d\'entraide qui te motive et t\'évite l\'isolement.\n• Des supports vivants, qui évoluent sans cesse grâce aux retours des étudiants et aux nouveaux examens.\n• Une méthode claire et directe, centrée sur le concret et les anciens examens, pour éviter toute mauvaise surprise.\n\nBref : ce n\'est pas juste un cours, c\'est un accompagnement complet.',
    'faq.q3': 'Quelles matières sont couvertes ?',
    'faq.a3': 'Nous couvrons toutes les matières clés : Mathématiques, Physique, Chimie, Statistiques, Informatique, Économie, Comptabilité et Finance.\n\nDe la fin du secondaire aux années universitaires, en passant par les concours d\'entrée et les premières années de hautes écoles, nous accompagnons chaque année des étudiants dans les filières les plus exigeantes.',
    'faq.q4': 'Quelle est la promesse de Science Made Simple ? Est-ce vraiment pour moi ?',
    'faq.a4': 'Oui. Peu importe ton niveau ou tes difficultés, si tu es motivé, nous t\'accompagnons jusqu\'au résultat.\n\nNotre promesse :\n• Tu passes de la confusion à la maîtrise.\n• Tu comprends enfin les matières, sans jargon inutile.\n• Tu découvres que tu es capable de viser beaucoup plus haut que ce que tu croyais.\n\nAvec nous, tu n\'es jamais laissé seul, et tu avances étape par étape jusqu\'à la réussite.',
    'faq.q5': 'Quels résultats puis-je espérer ?',
    'faq.a5': 'Avec Science Made Simple :\n\n• Tu réussis tes examens sans mauvaises surprises.\n• Tu gagnes en confiance, autonomie et sérénité.\n• Tu progresses vite grâce à une méthode testée sur des milliers d\'étudiants.\n• Et surtout, tu découvres ton véritable potentiel : tu es capable de beaucoup plus que tu ne le penses.',
    'faq.q6': 'Puis-je vous faire confiance ? (Question fréquente des parents)',
    'faq.a6': 'Oui. Nous avons plus de 10 ans d\'expérience et avons déjà accompagné plusieurs milliers d\'étudiants. Nos supports sont construits à partir des anciens examens officiels, constamment mis à jour et adaptés aux programmes réels.\n\nCe qui fait notre force, c\'est que les cours ne sont pas figés : chaque question d\'étudiant enrichit nos supports. Résultat : les étudiants ont souvent l\'impression que le cours a été écrit spécialement pour eux.\n\nLes témoignages, écrits et vidéos, de nos anciens étudiants parlent d\'eux-mêmes : nos méthodes les ont menés de l\'échec à la réussite, parfois jusqu\'à devenir majeurs de promotion, alors qu\'ils partaient de très loin.',
    'faq.q7': 'Comment se passe l\'accompagnement au quotidien ?',
    'faq.a7': '• Après ton arrivée, nous définissons ensemble tes ambitions et tes points de blocage.\n• Tu reçois un Learning Path sur mesure.\n• À tout moment, tu peux poser tes questions sur WhatsApp et recevoir une réponse rapide : tu ne restes jamais bloqué.\n• Tu avances toujours plus vite, tu retrouves confiance, parfois même le goût d\'aimer les sciences et l\'économie.\n• Tu rejoins une communauté motivante et bienveillante.\n\nNous faisons plus que donner cours : nous coachons nos étudiants, nous adaptons ton parcours en continu, et chaque question que tu poses enrichit nos supports pour les suivants.',
    'faq.q8': 'Comment nous rejoindre ?',
    'faq.a8': 'C\'est très simple :\n\n👉 Tu envoies un message sur WhatsApp.\n👉 On discute ensemble de tes ambitions et de tes difficultés.\n👉 On définit ton parcours personnalisé.\n👉 Tu commences immédiatement avec tes premiers cours offerts, sans engagement.',
    'faq.cta': 'Parler à un mentor',

    // Footer
    'footer.programs': 'Nos Programmes Mastery',
    'footer.program.physics': 'Physics Mastery',
    'footer.program.mathematics': 'Mathematics Mastery',
    'footer.program.chemistry': 'Chemistry Mastery',
    'footer.program.economics': 'Economics Mastery',
    'footer.program.statistics': 'Statistics Mastery',
    'footer.nav': 'Navigation',
    'footer.nav.how': 'Comment ça marche',
    'footer.nav.program': 'Programme',
    'footer.nav.offer': 'Offre',
    'footer.nav.testimonials': 'Témoignages',
    'footer.contact': 'Contact',
    'footer.follow': 'Suis-nous',
    'footer.copyright': '© 2024 Science Made Simple. Transformons tes études ensemble.',
    'footer.legal': 'Mentions légales',
    'footer.terms': 'CGU',
    'footer.privacy': 'Confidentialité',
  },
  en: {
    // Navigation
    'nav.method': 'Method',
    'nav.offer': 'Offer',
    'nav.results': 'Results',
    'nav.faq': 'FAQ',
    'nav.start': 'Start for free',

    // Hero Section
    'hero.title.line1': "Whatever science you have to learn.",
    'hero.title.line2.start': 'One platform. ',
    'hero.title.line2.highlight': 'One solution.',
    'hero.bullet1.bold': 'Diagnosis',
    'hero.bullet1.text': 'that guides you',
    'hero.bullet2.bold': 'Learning path',
    'hero.bullet2.text': 'structured by levels',
    'hero.bullet3.bold': 'Proven method,',
    'hero.bullet3.text': 'zero prerequisites',
    'hero.bullet4.bold': 'Community that lifts you up',
    'hero.bullet4.text': '& accessible mentor',
    'hero.subtitle.line1': '',
    'hero.subtitle.line2': 'You will understand, progress, love science, and aim higher',
    'hero.subtitle.line2.highlight': 'than you ever imagined.',
    'hero.cta': 'Join the movement',
    'hero.microcopy': 'Lifetime access • Free updates • Free lessons',
    'hero.social_proof': 'students have already taken off with us',
    'hero.see_how': 'See how it works in 2 minutes',

    // Pitch Section
    'pitch.1': 'Everyone can succeed. I guarantee it. Whatever your ambitions, whatever your difficulties, we will get there together.',
    'pitch.2': 'If you are motivated, I will make you work hard. But you will quickly see that we can exceed what you thought possible.',
    'pitch.3': 'We will explain math, physics, chemistry and economics like no one has ever explained them to you. No jargon. No blur. No boredom. Just a clear, direct method, and concrete results.',
    'pitch.4': 'Our students don\'t just pass: they aim for the best schools. And they make it.',
    'pitch.5': 'Our mission is simple: reveal your true potential. Make you understand. Make you progress. And maybe even... make you love these subjects.',
    'pitch.6': 'So yes, you will work. Yes, it will be demanding. But you will never be alone. And you won\'t recognize your level in a few weeks.',
    'pitch.7': 'It all starts with a simple WhatsApp message.',
    'pitch.8': 'Others have already started. Why not you?',
    'pitch.cta': 'Start for free',

    // How it works
    'how.title': 'How we help you go from',
    'how.title.highlight': 'confusion to mastery',
    'how.subtitle': 'We support you with rigor and kindness.',
    'how.step1.title': 'We start with you',
    'how.step1.desc': 'We identify your difficulties, your level and what you really want to master.\nNo judgment, no prerequisites — [[just a clear diagnosis to understand where you\'re starting from.]]',
    'how.step2.title': 'We guide you through your Mastery program',
    'how.step2.desc': '[[You access the complete program]] (Beginner → Advanced).\nWe guide you to the right level of the Mastery program, based on your current level and goals.',
    'how.step3.title': 'We support you until mastery',
    'how.step3.desc': '[[You never progress alone.]] Our team and community support you until you understand, progress and truly master.',
    'how.cta': 'Discuss my situation on WhatsApp',

    // Why us
    'why.title': 'Why we don\'t just offer you courses.',
    'why.title.line2': 'But we offer you a',
    'why.title.highlight': 'transformation',
    'why.reason1.title': 'Because we start with you, not a catalog',
    'why.reason1.desc': 'Human diagnosis. We listen to you, we understand you, we guide you. A logical, structured progression that leads you to mastery.',
    'why.reason2.title': 'Because we finally bring back the joy of understanding science',
    'why.reason2.desc': 'Handwritten explanations, simple, human. No jargon. No blur. 90% practice.',
    'why.reason3.title': 'Because you\'re never alone again',
    'why.reason3.desc': 'Instant access to the WhatsApp community: peer support, quick answers, and direct interventions from Zak when you\'re stuck.',
    'why.reason4.title': 'Because we fix your brain before your grades',
    'why.reason4.desc': 'We replace "I\'m bad at this" with "I can succeed", "I can aim high".',
    'why.reason5.title': 'Because the course evolves with you',
    'why.reason5.desc': 'Every question you ask enriches the Mastery program. Our courses live, update and become clearer thanks to students like you.',
    'why.reason6.title': 'Because we train you on real exams',
    'why.reason6.desc': 'Detailed corrections, targeted exercises and no surprises on D-day. You arrive confident.',
    'why.cta': 'Talk to a mentor',

    // Content Carousel
    'carousel.title': 'A complete program to master science.',
    'carousel.title.line2.part1': 'Organized',
    'carousel.title.line2.highlight1': 'by subject',
    'carousel.title.line2.part2': ', structured',
    'carousel.title.line2.highlight2': 'by levels',
    'carousel.subtitle': 'You progress from Beginner → Intermediate → Advanced,\nwith content built from the real difficulties of thousands of students.',
    'carousel.cta_text': 'Training on real exams with detailed corrections.',
    'carousel.test_btn': 'Test me',
    'carousel.subjects.maths': 'Math',
    'carousel.subjects.physics': 'Physics',
    'carousel.subjects.chemistry': 'Chemistry',
    'carousel.subjects.economics': 'Economics',
    'carousel.subjects.statistics': 'Statistics',

    // Offer Section
    'offer.title': 'Two ambitions,',
    'offer.title.highlight': 'one platform',
    'offer.subtitle': '',
    'offer.mastery.title': 'One goal: total mastery.',
    'offer.mastery.block1.title': 'Mastery Programs',
    'offer.mastery.block1.intro': 'Lifetime access to all unlocked subjects.\nAn environment designed to understand, progress and perform from your current level to true scientific mastery:',
    'offer.mastery.block2.title': 'Mastery Levels',
    'offer.mastery.block2.intro': '3 levels to adapt to the real difficulty of each subject:',
    'offer.mastery.cta': 'Start for free',
    'offer.exam.title': 'Success in standardized tests\nand selective exams.',
    'offer.exam.block1.title': 'Exam Prep Program',
    'offer.exam.block1.intro': 'Full access to the program calibrated to official requirements, designed to get you to your target score:',
    'offer.exam.cta': 'Discover available tests',
    'offer.addons.title': 'Mastery Boosters',
    'offer.addons.desc': 'Modules that accelerate your progress — available for both programs.',
    'offer.addons.highlight': '',
    'offer.addons.desc2': 'Designed to maximize your results, organization and efficiency:',
    'offer.addons.1': 'Planning tool',
    'offer.addons.2': 'Study Rooms access',
    'offer.addons.3': 'Mock exam generator',
    'offer.addons.4': 'Learning Path adapted to your goal',

    // Testimonials
    'testimonials.title': 'They transformed their results thanks to Science Made Simple.',
    'testimonials.title.highlight': 'Tomorrow, it could be you.',
    'testimonials.cta': 'Start for free',
    'testimonials.video.title': 'SMS thanks you for your trust',

    // WhatsApp Contact
    'contact.title': 'This is where it starts,',
    'contact.title.highlight': 'we reply on WhatsApp',
    'contact.point1': '100% free diagnosis',
    'contact.point2': 'First lessons free',
    'contact.point3': 'Fast personalized response',
    'contact.label': 'Tell us about your situation to guide you to the right Mastery Program',
    'contact.placeholder': 'Ex: I\'m in first year medicine, struggling with quantum physics and stats...',
    'contact.tip': 'The more precise you are, the better we can help: subjects, school, difficulties, exams...',
    'contact.files.label': 'Share your documents (optional):',
    'contact.files.cta': 'Click to add your courses, exams, syllabus...',
    'contact.files.formats': 'PDF, Word, Images • Max 10 files',
    'contact.files.count': 'Files to send',
    'contact.files.tip': 'You can send these files directly in WhatsApp after connecting',
    'contact.submit': 'Start for free',
    'contact.submitting': 'Opening WhatsApp...',
    'contact.privacy': 'Your info stays private. We only contact you to help.',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Everything you need to know before starting',
    'faq.q1': 'What is Science Made Simple?',
    'faq.a1': 'Science Made Simple is an online tutoring platform specialized in supporting students in science, economics and business.\n\nWe help high school students, those preparing for their exams or entrance tests, as well as university students in the most demanding fields (Business Schools, engineering, medicine, polytechnic...).\n\nOur mission: never leave you alone with your difficulties. You benefit from personalized support, an active community and clear materials, built from thousands of real questions asked by our students over the years.',
    'faq.q2': 'How is Science Made Simple different from private tutoring?',
    'faq.a2': 'Private tutoring is often one hour per week with a tutor. With us, it\'s a complete system that supports you daily:\n\n• Direct access to the tutor via WhatsApp to ask your questions whenever you want.\n• A custom-made path, defined together based on your ambitions and challenges.\n• A support community that motivates you and prevents isolation.\n• Living materials that constantly evolve thanks to student feedback and new exams.\n• A clear and direct method, focused on concrete content and past exams, to avoid any unpleasant surprise.\n\nIn short: it\'s not just a course, it\'s complete support.',
    'faq.q3': 'Which subjects are covered?',
    'faq.a3': 'We cover all key subjects: Mathematics, Physics, Chemistry, Statistics, Computer Science, Economics, Accounting and Finance.\n\nFrom the end of high school to university years, including entrance exams and first years of higher education, we support students each year in the most demanding fields.',
    'faq.q4': 'What is Science Made Simple\'s promise? Is it really for me?',
    'faq.a4': 'Yes. No matter your level or difficulties, if you are motivated, we support you to the result.\n\nOur promise:\n• You go from confusion to mastery.\n• You finally understand the subjects, without useless jargon.\n• You discover that you are capable of aiming much higher than you thought.\n\nWith us, you are never left alone, and you progress step by step to success.',
    'faq.q5': 'What results can I expect?',
    'faq.a5': 'With Science Made Simple:\n\n• You pass your exams without bad surprises.\n• You gain confidence, autonomy and serenity.\n• You progress quickly thanks to a method tested on thousands of students.\n• And above all, you discover your true potential: you are capable of much more than you think.',
    'faq.q6': 'Can I trust you? (Common question from parents)',
    'faq.a6': 'Yes. We have more than 10 years of experience and have already supported several thousand students. Our materials are built from official past exams, constantly updated and adapted to real programs.\n\nWhat makes our strength is that courses are not static: each student question enriches our materials. Result: students often feel that the course was written specifically for them.\n\nThe testimonials, written and videos, of our former students speak for themselves: our methods took them from failure to success, sometimes even becoming top of their class, when they started from very far.',
    'faq.q7': 'How does daily support work?',
    'faq.a7': '• After your arrival, we define together your ambitions and blocking points.\n• You receive a custom Learning Path.\n• At any time, you can ask your questions on WhatsApp and receive a quick response: you never stay blocked.\n• You always move faster, you regain confidence, sometimes even the taste for loving science and economics.\n• You join a motivating and caring community.\n\nWe do more than give courses: we coach our students, we adapt your path continuously, and each question you ask enriches our materials for the next ones.',
    'faq.q8': 'How do I join?',
    'faq.a8': 'It\'s very simple:\n\n👉 You send a message on WhatsApp.\n👉 We discuss together your ambitions and difficulties.\n👉 We define your personalized path.\n👉 You start immediately with your first free courses, without commitment.',
    'faq.cta': 'Talk to a mentor',

    // Footer
    'footer.programs': 'Our Mastery Programs',
    'footer.program.physics': 'Physics Mastery',
    'footer.program.mathematics': 'Mathematics Mastery',
    'footer.program.chemistry': 'Chemistry Mastery',
    'footer.program.economics': 'Economics Mastery',
    'footer.program.statistics': 'Statistics Mastery',
    'footer.nav': 'Navigation',
    'footer.nav.how': 'How it works',
    'footer.nav.program': 'Program',
    'footer.nav.offer': 'Offer',
    'footer.nav.testimonials': 'Testimonials',
    'footer.contact': 'Contact',
    'footer.follow': 'Follow us',
    'footer.copyright': '© 2024 Science Made Simple. Let\'s transform your studies together.',
    'footer.legal': 'Legal notice',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}



