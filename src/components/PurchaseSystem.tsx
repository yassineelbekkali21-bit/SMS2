'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Package, 
  BookOpen,
  Filter,
  Search,
  Star,
  TrendingUp,
  Sparkles,
  Crown
} from 'lucide-react';
import { Course, CoursePack, DashboardData, Lesson } from '@/types';
import { CoursePurchaseCard } from './CoursePurchaseCard';
import { CoursePackCard } from './CoursePackCard';
import { PurchaseModal } from './PurchaseModal';
import { getCoursePacks, getIndividualLessons, getExternalCourses, getExternalLessons, isExternalContent } from '@/lib/mock-data';
import { NextYearCoursesSection } from './NextYearCoursesSection';
import { SmartPackOffer } from './SmartPackOffer';
import { LessonPurchaseCard } from './LessonPurchaseCard';
import { SmartContentComparison } from './SmartContentComparison';
import { getLessonRecommendations } from '@/lib/smart-recommendations';
import { IndividualCourseCard } from './IndividualCourseCard';
import { CourseUpsellModal } from './CourseUpsellModal';
import { ModernUpsellModal } from './ModernUpsellModal';
import { PurchaseUpsellModal } from './PurchaseUpsellModal';
import { ExternalCourseCard } from './ExternalCourseCard';
import { ExternalLessonCard } from './ExternalLessonCard';
import { PurchaseOption } from '@/types';

interface PurchaseSystemProps {
  data: DashboardData;
  userBalance: number; // Changé de userCredits à userBalance (en euros)
  onBalanceChange: (newBalance: number) => void; // Changé de onCreditChange à onBalanceChange
  onCourseUnlock: (courseId: string) => void;
  onPackUnlock: (packId: string, courseIds: string[]) => void;
  ownedCourses: string[];
  ownedPacks: string[];
  onOpenCourseViewer?: (courseId: string) => void; // Nouvelle prop pour ouvrir IntegratedCourseViewer
}

type FilterType = 'all' | 'courses' | 'packs' | 'lessons' | 'affordable' | 'faculty' | 'external';
type SortType = 'price-asc' | 'price-desc' | 'popular' | 'new';
type ItemType = { item: Course | CoursePack | Lesson; type: 'course' | 'pack' | 'lesson'; isExternal?: boolean };

export function PurchaseSystem({
  data,
  userBalance,
  onBalanceChange,
  onCourseUnlock,
  onPackUnlock,
  ownedCourses,
  ownedPacks,
  onOpenCourseViewer
}: PurchaseSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('popular');
  const [selectedItem, setSelectedItem] = useState<Course | CoursePack | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'course' | 'pack'>('course');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [balanceAnimation, setBalanceAnimation] = useState<{ amount: number; type: 'gain' | 'spend' } | null>(null);
  
  // États pour les offres spéciales
  const [selectedCourseForOffer, setSelectedCourseForOffer] = useState<Course | null>(null);
  const [showSmartOffer, setShowSmartOffer] = useState(false);

  // États pour la comparaison intelligente des leçons
  const [selectedLessonForComparison, setSelectedLessonForComparison] = useState<Lesson | null>(null);
  const [showSmartComparison, setShowSmartComparison] = useState(false);

  // États pour l'upsell modal des cours individuels
  const [selectedCourseForUpsell, setSelectedCourseForUpsell] = useState<Course | null>(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  
  // États pour l'upsell modal des leçons (nouveau système euros)
  const [selectedLessonForPurchase, setSelectedLessonForPurchase] = useState<Lesson | null>(null);
  const [showPurchaseUpsell, setShowPurchaseUpsell] = useState(false);
  
  // Récupération des données (faculté + externes)
  const facultyCourses = data.suggestedCourses?.map(suggestion => suggestion.course) || [];
  const externalCourses = getExternalCourses();
  const availableCourses = [...facultyCourses, ...externalCourses];
  
  const coursePacks = getCoursePacks(); // Seulement pour contenu faculté
  const facultyLessons = getIndividualLessons();
  const externalLessons = getExternalLessons();
  const individualLessons = [...facultyLessons, ...externalLessons];
  
  // Debug temporaire
  console.log('🔍 DEBUG: Available courses:', availableCourses.length);
  console.log('🔍 DEBUG: Current filter:', filter);

  // Animation du solde
  useEffect(() => {
    if (balanceAnimation) {
      const timer = setTimeout(() => setBalanceAnimation(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [balanceAnimation]);

  // Filtrage et tri - PRIORISE les packs et cours
  const getFilteredAndSortedItems = () => {
    let items: ItemType[] = [];

    // Toujours ajouter les packs EN PREMIER (recommandés) - SEULEMENT pour contenu faculté
    if ((filter === 'all' || filter === 'packs' || filter === 'faculty') && filter !== 'external') {
      items.push(...coursePacks.map(pack => ({ item: pack, type: 'pack' as const, isExternal: false })));
    }

    // Ensuite ajouter les cours complets (faculté + externes selon filtre)
    if (filter === 'all' || filter === 'courses' || filter === 'faculty' || filter === 'external') {
      console.log('🎯 Adding courses to items, count:', availableCourses.length);
      
      const coursesToAdd = availableCourses.filter(course => {
        const isExt = isExternalContent(course);
        if (filter === 'faculty') return !isExt;
        if (filter === 'external') return isExt;
        return true; // 'all' ou 'courses'
      });
      
      items.push(...coursesToAdd.map(course => ({ 
        item: course, 
        type: 'course' as const, 
        isExternal: isExternalContent(course)
      })));
    }

    // Ajouter les leçons UNIQUEMENT si filtre spécifique OU recherche active
    if (filter === 'lessons' || filter === 'faculty' || filter === 'external' || (filter === 'all' && searchQuery)) {
      const lessonsToAdd = individualLessons.filter(lesson => {
        const isExt = isExternalContent(lesson);
        if (filter === 'faculty') return !isExt;
        if (filter === 'external') return isExt;
        return true; // 'all', 'lessons'
      });
      
      items.push(...lessonsToAdd.map(lesson => ({ 
        item: lesson, 
        type: 'lesson' as const, 
        isExternal: isExternalContent(lesson)
      })));
    }

    // Filtrer par recherche
    if (searchQuery) {
      items = items.filter(({ item }) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrer par prix abordable
    if (filter === 'affordable') {
      items = items.filter(({ item, type }) => {
        let cost = 70; // Prix par défaut des leçons en euros
        if (type === 'course') {
          cost = 700; // Prix cours en euros
        } else if (type === 'pack') {
          cost = 1200; // Prix pack en euros
        }
        return cost <= (userBalance || 0);
      });
    }

    // Trier
    items.sort(({ item: a, type: typeA }, { item: b, type: typeB }) => {
      let costA = 70; // Prix par défaut des leçons en euros
      let costB = 70;
      
      if (typeA === 'course') costA = 700; // Prix cours en euros
      else if (typeA === 'pack') costA = 1200; // Prix pack en euros
      
      if (typeB === 'course') costB = 700; // Prix cours en euros
      else if (typeB === 'pack') costB = 1200; // Prix pack en euros

      switch (sort) {
        case 'price-asc': 
          // Prioriser packs > cours > leçons, puis par prix
          if (typeA !== typeB) {
            if (typeA === 'pack') return -1;
            if (typeB === 'pack') return 1;
            if (typeA === 'course' && typeB === 'lesson') return -1;
            if (typeA === 'lesson' && typeB === 'course') return 1;
          }
          return costA - costB;
        case 'price-desc': 
          // Prioriser packs > cours > leçons, puis par prix décroissant
          if (typeA !== typeB) {
            if (typeA === 'pack') return -1;
            if (typeB === 'pack') return 1;
            if (typeA === 'course' && typeB === 'lesson') return -1;
            if (typeA === 'lesson' && typeB === 'course') return 1;
          }
          return costB - costA;
        case 'popular':
        case 'new':
        default:
          // Ordre par défaut : Pack > Course > Lesson
          if (typeA === 'pack' && typeB !== 'pack') return -1;
          if (typeB === 'pack' && typeA !== 'pack') return 1;
          if (typeA === 'course' && typeB === 'lesson') return -1;
          if (typeA === 'lesson' && typeB === 'course') return 1;
          return a.title.localeCompare(b.title);
      }
    });

    console.log('✅ Final filtered items:', items.length, 'items for filter:', filter);
    return items;
  };

  const filteredItems = getFilteredAndSortedItems();

  // Gestion des achats
  const handlePurchase = (itemId: string, itemType: 'course' | 'pack') => {
    const item = itemType === 'course' 
      ? availableCourses.find(c => c.id === itemId)
      : coursePacks.find(p => p.id === itemId);
    
    if (!item) return;

    // Vérifier le prix en euros
    const cost = itemType === 'course' ? 700 : 1200;
    
    if ((userBalance || 0) >= cost) {
      // Déduire du solde
      onBalanceChange((userBalance || 0) - cost);
      setBalanceAnimation({ type: 'spend', amount: cost });
      
      // Débloquer le contenu
      if (itemType === 'course') {
        onCourseUnlock(itemId);
      } else {
        onPackUnlock(itemId, (item as CoursePack).courses);
      }
      
      console.log(`✅ Achat réussi: ${itemType} ${itemId} pour ${cost}€`);
    } else {
      console.log(`❌ Solde insuffisant: ${cost}€ requis, ${userBalance || 0}€ disponible`);
      alert(`Solde insuffisant. Il vous faut ${cost}€ pour cet achat.`);
    }
  };

  // Gestion moderne des leçons - nouvelle modale euros
  const handleLessonUnlock = (lessonId: string) => {
    const lesson = individualLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    // Ouvrir la nouvelle modale d'upsell en euros
    setSelectedLessonForPurchase(lesson);
    setShowPurchaseUpsell(true);
  };

  // Déblocage direct d'une leçon (après comparaison)
  const handleDirectLessonUnlock = (lessonId: string) => {
    const lessonCost = 70; // Prix en euros
    if ((userBalance || 0) >= lessonCost) {
      onBalanceChange((userBalance || 0) - lessonCost);
      setBalanceAnimation({ type: 'spend', amount: lessonCost });
      setShowSmartComparison(false);
      
      // TODO: Ajouter la leçon aux leçons possédées
      console.log(`✅ Leçon débloquée: ${lessonId} pour ${lessonCost}€`);
    } else {
      alert(`Solde insuffisant. Il vous faut ${lessonCost}€ pour cette leçon.`);
    }
  };

  // Gestion des choix dans la comparaison intelligente
  const handleSmartComparisonCourse = () => {
    if (!selectedLessonForComparison) return;
    
    const { relatedCourse } = getLessonRecommendations(selectedLessonForComparison);
    handlePurchase(relatedCourse.id, 'course');
    setShowSmartComparison(false);
  };

  const handleSmartComparisonPack = () => {
    if (!selectedLessonForComparison) return;
    
    const { recommendedPack } = getLessonRecommendations(selectedLessonForComparison);
    handlePurchase(recommendedPack.id, 'pack');
    setShowSmartComparison(false);
  };

  const handleCloseSmartComparison = () => {
    setShowSmartComparison(false);
    setSelectedLessonForComparison(null);
  };

  // Handler pour l'upsell des cours individuels
  const handleCourseUpsell = (course: Course) => {
    // Trouver les packs qui contiennent ce cours
    const relevantPacks = coursePacks.filter(pack => 
      pack.courses.includes(course.id)
    );
    
    if (relevantPacks.length > 0) {
      setSelectedCourseForUpsell(course);
      setShowUpsellModal(true);
    } else {
      // Si aucun pack disponible, acheter directement
      handlePurchase(course.id, 'course');
    }
  };

  const handleUpsellPurchaseCourse = (course: Course) => {
    setShowUpsellModal(false);
    handlePurchase(course.id, 'course');
  };

  const handleUpsellPurchasePack = (pack: CoursePack) => {
    setShowUpsellModal(false);
    handlePurchase(pack.id, 'pack');
  };

  const handleCloseUpsellModal = () => {
    setShowUpsellModal(false);
    setSelectedCourseForUpsell(null);
  };

  const handleConfirmPurchase = (itemId: string, itemType: 'course' | 'pack') => {
    // Utiliser la nouvelle logique d'achat en euros
    handlePurchase(itemId, itemType);
  };

  // Génération des options d'upsell pour les leçons (comme dans SimpleDashboard)
  const generateUpsellOptions = (lessonId: string): PurchaseOption[] => {
    const lesson = individualLessons.find(l => l.id === lessonId);
    if (!lesson) return [];

    // Trouver le cours parent via courseId de la leçon
    const parentCourse = availableCourses.find(course => 
      course.id === lesson.courseId || 
      course.lessons?.some(l => l.id === lessonId)
    );

    // Trouver les packs qui contiennent ce cours
    const relevantPacks = coursePacks.filter(pack => 
      parentCourse && pack.courses.includes(parentCourse.id)
    );

    const options: PurchaseOption[] = [];

    // Option 1: Leçon seule
    options.push({
      type: 'lesson',
      itemId: lessonId,
      title: lesson.title,
      price: 70,
      description: 'Accès à cette leçon uniquement',
      features: [
        'Vidéo de cours complète',
        'Quiz d\'évaluation',
        'Accès limité à 1 leçon'
      ],
      badge: null
    });

    // Option 2: Cours complet (si cours parent trouvé)
    if (parentCourse) {
      options.push({
        type: 'course',
        itemId: parentCourse.id,
        title: `Cours ${parentCourse.title}`,
        price: 700,
        description: 'Maîtrise complète du sujet',
        features: [
          `${parentCourse.lessons?.length || 12} leçons complètes`,
          'Exercices pratiques inclus',
          'Suivi de progression détaillé',
          'Accès aux quiz d\'évaluation'
        ],
        badge: 'Recommandé'
      });
    } else {
      // Fallback: Cours générique si pas de cours parent trouvé
      options.push({
        type: 'course',
        itemId: 'course-generic-math',
        title: 'Cours Complet Mathématiques',
        price: 700,
        description: 'Maîtrise complète du sujet',
        features: [
          '12 leçons complètes',
          'Exercices pratiques inclus',
          'Suivi de progression détaillé',
          'Accès aux quiz d\'évaluation'
        ],
        badge: 'Recommandé'
      });
    }

    // Option 3: Pack complet (toujours proposer)
    if (relevantPacks.length > 0) {
      const pack = relevantPacks[0];
      const totalLessons = pack.courses.reduce((total, courseId) => {
        const course = availableCourses.find(c => c.id === courseId);
        return total + (course?.lessons?.length || 0);
      }, 0);

      options.push({
        type: 'pack',
        itemId: pack.id,
        title: pack.title,
        price: 1200,
        description: 'Accompagnement complet',
        features: [
          `${pack.courses.length} cours complémentaires`,
          `${totalLessons} leçons au total`,
          'Coaching personnalisé inclus',
          'Planificateur stratégique',
          'Support prioritaire'
        ],
        badge: 'Meilleur investissement'
      });
    } else {
      // Fallback: Pack générique
      options.push({
        type: 'pack',
        itemId: 'pack-math-complete',
        title: 'Pack Mathématiques Complet',
        price: 1200,
        description: 'Accompagnement complet',
        features: [
          '4 cours complémentaires',
          '48 leçons au total',
          'Coaching personnalisé inclus',
          'Planificateur stratégique',
          'Support prioritaire'
        ],
        badge: 'Meilleur investissement'
      });
    }

    return options;
  };

  // Gestion de l'achat depuis la modale d'upsell
  const handleLessonPurchase = (option: PurchaseOption) => {
    console.log('🛒 ACHAT depuis modale upsell:', option);

    const cost = option.price;

    if ((userBalance || 0) >= cost) {
      onBalanceChange((userBalance || 0) - cost);
      setBalanceAnimation({ type: 'spend', amount: cost });
      
      console.log(`✅ ${option.type} débloqué: ${option.title} pour ${cost}€`);
      
      // Fermer la modale
      setShowPurchaseUpsell(false);
      setSelectedLessonForPurchase(null);
      
      // TODO: Logique de déblocage réel selon le type
      if (option.type === 'lesson') {
        // Débloquer juste la leçon
        console.log('Leçon débloquée:', option.itemId);
      } else if (option.type === 'course') {
        // Débloquer le cours complet
        onCourseUnlock(option.itemId);
      } else if (option.type === 'pack') {
        // Débloquer le pack
        const pack = coursePacks.find(p => p.id === option.itemId);
        if (pack) {
          onPackUnlock(option.itemId, pack.courses);
        }
      }
    } else {
      alert(`Solde insuffisant. Il vous faut ${cost}€ pour cet achat.`);
    }
  };

  const getIncludedCourses = (pack: CoursePack): Course[] => {
    return availableCourses.filter(course => pack.courses.includes(course.id));
  };

  const getCoursePackBadge = (courseId: string): string | undefined => {
    const pack = coursePacks.find(p => 
      p.courses.includes(courseId) && ownedPacks.includes(p.id)
    );
    return pack ? `Inclus dans ${pack.title}` : undefined;
  };

  // Fonction pour déclencher les offres spéciales
  const handleCourseSelection = (course: Course) => {
    setSelectedCourseForOffer(course);
    setShowSmartOffer(true);
  };

  // Fonction pour obtenir le pack recommandé pour un cours
  const getSuggestedPack = (course: Course) => {
    // Logique pour trouver le pack le plus pertinent
    const relevantPacks = coursePacks.filter(pack => 
      pack.courses.includes(course.id)
    );
    
    if (relevantPacks.length > 0) {
      const pack = relevantPacks[0];
      return {
        ...pack,
        includedCourses: pack.courses.map(courseId => 
          availableCourses.find(c => c.id === courseId) || course
        ).filter(Boolean),
        bonusCourses: availableCourses.filter(c => 
          pack.features.some(feature => feature.includes(c.title.split(' ')[0]))
        ).slice(0, 2)
      };
    }
    
    // Pack par défaut si aucun pack spécifique trouvé
    return {
      id: 'suggested-pack',
      title: `Pack ${course.faculty} Premium`,
      description: 'Une sélection de cours complémentaires avec des bonus exclusifs',
      courses: [course.id],
      creditCost: 700, // Prix fixe en euros
      originalCreditCost: 1400,
      savings: 700,
      badge: 'Recommandé',
      icon: '🎓',
      color: 'blue',
      features: [
        'Support prioritaire 24/7',
        'Séances de coaching individuel',
        'Certificats NFT de réussite',
        'Accès aux masterclass exclusives'
      ],
      includedCourses: [course, ...availableCourses.filter(c => 
        c.faculty === course.faculty && c.id !== course.id
      ).slice(0, 2)],
      bonusCourses: availableCourses.filter(c => 
        c.faculty === course.faculty && c.difficulty === 'advanced'
      ).slice(0, 2)
    };
  };

  const handleSelectCourseFromOffer = () => {
    if (selectedCourseForOffer) {
      handlePurchase(selectedCourseForOffer.id, 'course');
      setShowSmartOffer(false);
    }
  };

  const handleSelectPackFromOffer = () => {
    if (selectedCourseForOffer) {
      const suggestedPack = getSuggestedPack(selectedCourseForOffer);
      // Simulation d'achat de pack
      handleConfirmPurchase(suggestedPack.id, 'pack');
      setShowSmartOffer(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Débloquer du contenu</h2>
        <p className="text-gray-600">Cours individuels ou packs avec valeur ajoutée</p>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher un cours, pack ou leçon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tout</option>
            <option value="courses">Cours seuls</option>
            <option value="packs">Packs</option>
            <option value="lessons">Leçons</option>
            <option value="affordable">Abordables</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="popular">Populaires</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="new">Nouveautés</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="text-blue-600" size={16} />
            <span className="text-sm text-gray-600">Cours disponibles</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{availableCourses.length}</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-purple-600" size={16} />
            <span className="text-sm text-gray-600">Packs disponibles</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{coursePacks.length}</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="text-green-600" size={16} />
            <span className="text-sm text-gray-600">Leçons disponibles</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{individualLessons.length}</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-yellow-600" size={16} />
            <span className="text-sm text-gray-600">Cours possédés</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{ownedCourses.length}</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="text-orange-600" size={16} />
            <span className="text-sm text-gray-600">Packs possédés</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{ownedPacks.length}</div>
        </div>
      </div>

      {/* Section des cours de l'année prochaine */}
      <NextYearCoursesSection
        facultyName={data.user.faculty}
        currentYear={new Date().getFullYear()}
        onCourseClick={(courseId) => {
          console.log('🎯 Cours année prochaine cliqué:', courseId);
          // Ouvrir l'IntegratedCourseViewer si la fonction est disponible
          if (onOpenCourseViewer) {
            onOpenCourseViewer(courseId);
          } else {
            console.warn('onOpenCourseViewer non disponible');
          }
        }}
      />


      {/* Grille des items */}
      <div className={`grid gap-6 ${
        filteredItems.some(({ type }) => type === 'pack') 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' // Packs: 3 colonnes max
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' // Cours (normaux et externes): 4 colonnes dès 1024px
      }`}>
        <AnimatePresence mode="popLayout">
          {filteredItems.map(({ item, type, isExternal }, index) => (
            <motion.div
              key={`${type}-${item.id}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              {type === 'course' ? (
                isExternal ? (
                  <ExternalCourseCard
                    course={item as Course & { catalogInfo: any }}
                    userBalance={userBalance || 0}
                  />
                ) : filter === 'courses' ? (
                  <IndividualCourseCard
                    course={item as Course}
                    userBalance={userBalance || 0}
                    onPurchase={handleCourseUpsell}
                    onPreview={(course) => console.log('Preview course:', course.id)}
                    canAfford={(userBalance || 0) >= 700}
                  />
                ) : (
                  <CoursePurchaseCard
                    course={item as Course}
                    isOwned={ownedCourses.includes(item.id)}
                    packBadge={getCoursePackBadge(item.id)}
                    onPurchase={(courseId) => handlePurchase(courseId, 'course')}
                    onPreview={(courseId) => console.log('Preview course:', courseId)}
                    onToggleFavorite={(courseId) => console.log('Toggle favorite course:', courseId)}
                    onClick={(courseId) => onOpenCourseViewer?.(courseId)}
                  />
                )
              ) : type === 'pack' ? (
                <CoursePackCard
                  pack={item as CoursePack}
                  courses={getIncludedCourses(item as CoursePack)}
                  isOwned={ownedPacks.includes(item.id)}
                  onPurchase={(packId) => handlePurchase(packId, 'pack')}
                  onPreview={(packId) => console.log('Preview pack:', packId)}
                  onCoursePreview={(courseId) => onOpenCourseViewer?.(courseId)}
                  className="md:col-span-2 lg:col-span-1"
                />
              ) : (
                isExternal ? (
                  <ExternalLessonCard
                    lesson={item as Lesson & { catalogInfo: any }}
                    userBalance={userBalance || 0}
                  />
                ) : (
                  <LessonPurchaseCard
                    lesson={item as Lesson}
                    isOwned={false} // TODO: Implémenter la logique des leçons possédées
                    canAfford={(userBalance || 0) >= 70}
                    onUnlock={(lessonId) => handleLessonUnlock(lessonId)}
                    onPreview={(lessonId) => console.log('Preview lesson:', lessonId)}
                  />
                )
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Message si aucun résultat */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
          <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      )}

      {/* Modal d'achat */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        item={selectedItem}
        itemType={selectedItemType}
        userBalance={userBalance || 0}
        onConfirmPurchase={handleConfirmPurchase}
        includedCourses={selectedItemType === 'pack' && selectedItem ? getIncludedCourses(selectedItem as CoursePack) : []}
      />

      {/* Offre spéciale intelligente */}
      {selectedCourseForOffer && (
        <SmartPackOffer
          selectedCourse={selectedCourseForOffer}
          suggestedPack={getSuggestedPack(selectedCourseForOffer)}
          isVisible={showSmartOffer}
          onClose={() => setShowSmartOffer(false)}
          onSelectCourse={handleSelectCourseFromOffer}
          onSelectPack={handleSelectPackFromOffer}
          canAffordCourse={(userBalance || 0) >= 700}
          canAffordPack={(userBalance || 0) >= 1200}
        />
      )}

      {/* Nouvelle modale d'upsell euros pour les leçons */}
      {showPurchaseUpsell && selectedLessonForPurchase && (
        <PurchaseUpsellModal
          isOpen={showPurchaseUpsell}
          onClose={() => setShowPurchaseUpsell(false)}
          userBalance={userBalance || 0}
          purchaseOptions={generateUpsellOptions(selectedLessonForPurchase.id)}
          onPurchase={handleLessonPurchase}
          onAddFunds={() => {
            // TODO: Intégrer système de recharge
            alert('Fonction de recharge à implémenter');
          }}
        />
      )}

      {/* Modal d'upsell moderne pour cours individuels */}
      {selectedCourseForUpsell && (
        <ModernUpsellModal
          isOpen={showUpsellModal}
          onClose={handleCloseUpsellModal}
          selectedCourse={selectedCourseForUpsell}
          recommendedPack={coursePacks.filter(pack => 
            pack.courses.includes(selectedCourseForUpsell.id)
          )[0] || coursePacks[0]} // Premier pack comme fallback
          userBalance={userBalance || 0}
          onPurchaseCourse={handleUpsellPurchaseCourse}
          onPurchasePack={handleUpsellPurchasePack}
          canAffordCourse={(userBalance || 0) >= 700}
          canAffordPack={(userBalance || 0) >= 1200}
        />
      )}
    </div>
  );
}
