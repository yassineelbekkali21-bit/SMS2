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
import { getCoursePacks, getIndividualLessons } from '@/lib/mock-data';
import { PersonalizedSelection } from './PersonalizedSelection';
import { SmartPackOffer } from './SmartPackOffer';
import { LessonPurchaseCard } from './LessonPurchaseCard';
import { SmartContentComparison } from './SmartContentComparison';
import { getLessonRecommendations } from '@/lib/smart-recommendations';
import { IndividualCourseCard } from './IndividualCourseCard';
import { CourseUpsellModal } from './CourseUpsellModal';

interface PurchaseSystemProps {
  data: DashboardData;
  userCredits: number;
  onCreditChange: (newCredits: number) => void;
  onCourseUnlock: (courseId: string) => void;
  onPackUnlock: (packId: string, courseIds: string[]) => void;
  ownedCourses: string[];
  ownedPacks: string[];
}

type FilterType = 'all' | 'courses' | 'packs' | 'lessons' | 'affordable';
type SortType = 'price-asc' | 'price-desc' | 'popular' | 'new';
type ItemType = { item: Course | CoursePack | Lesson; type: 'course' | 'pack' | 'lesson' };

export function PurchaseSystem({
  data,
  userCredits,
  onCreditChange,
  onCourseUnlock,
  onPackUnlock,
  ownedCourses,
  ownedPacks
}: PurchaseSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('popular');
  const [selectedItem, setSelectedItem] = useState<Course | CoursePack | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'course' | 'pack'>('course');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [creditAnimation, setCreditAnimation] = useState<{ amount: number; type: 'gain' | 'spend' } | null>(null);
  
  // États pour les offres spéciales
  const [selectedCourseForOffer, setSelectedCourseForOffer] = useState<Course | null>(null);
  const [showSmartOffer, setShowSmartOffer] = useState(false);

  // États pour la comparaison intelligente des leçons
  const [selectedLessonForComparison, setSelectedLessonForComparison] = useState<Lesson | null>(null);
  const [showSmartComparison, setShowSmartComparison] = useState(false);

  // États pour l'upsell modal des cours individuels
  const [selectedCourseForUpsell, setSelectedCourseForUpsell] = useState<Course | null>(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  
  // Récupération des données
  const availableCourses = data.courseSuggestions?.map(suggestion => suggestion.course) || [];
  const coursePacks = getCoursePacks();
  const individualLessons = getIndividualLessons();

  // Animation des crédits
  useEffect(() => {
    if (creditAnimation) {
      const timer = setTimeout(() => setCreditAnimation(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [creditAnimation]);

  // Filtrage et tri - PRIORISE les packs et cours
  const getFilteredAndSortedItems = () => {
    let items: ItemType[] = [];

    // Toujours ajouter les packs EN PREMIER (recommandés)
    if (filter === 'all' || filter === 'packs') {
      items.push(...coursePacks.map(pack => ({ item: pack, type: 'pack' as const })));
    }

    // Ensuite ajouter les cours complets
    if (filter === 'all' || filter === 'courses') {
      items.push(...availableCourses.map(course => ({ item: course, type: 'course' as const })));
    }

    // Ajouter les leçons UNIQUEMENT si filtre spécifique OU recherche active
    if (filter === 'lessons' || (filter === 'all' && searchQuery)) {
      items.push(...individualLessons.map(lesson => ({ item: lesson, type: 'lesson' as const })));
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
        let cost = 5; // Prix par défaut des leçons
        if (type === 'course') {
          cost = (item as Course).creditCost || 20;
        } else if (type === 'pack') {
          cost = (item as CoursePack).creditCost;
        }
        return cost <= userCredits;
      });
    }

    // Trier
    items.sort(({ item: a, type: typeA }, { item: b, type: typeB }) => {
      let costA = 5; // Prix par défaut des leçons
      let costB = 5;
      
      if (typeA === 'course') costA = (a as Course).creditCost || 20;
      else if (typeA === 'pack') costA = (a as CoursePack).creditCost;
      
      if (typeB === 'course') costB = (b as Course).creditCost || 20;
      else if (typeB === 'pack') costB = (b as CoursePack).creditCost;

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

    return items;
  };

  const filteredItems = getFilteredAndSortedItems();

  // Gestion des achats
  const handlePurchase = (itemId: string, itemType: 'course' | 'pack') => {
    const item = itemType === 'course' 
      ? availableCourses.find(c => c.id === itemId)
      : coursePacks.find(p => p.id === itemId);
    
    if (!item) return;
    
    setSelectedItem(item);
    setSelectedItemType(itemType);
    setShowPurchaseModal(true);
  };

  // Gestion intelligente des leçons - intercepte et propose des alternatives
  const handleLessonUnlock = (lessonId: string) => {
    const lesson = individualLessons.find(l => l.id === lessonId);
    if (!lesson) return;

    // Au lieu de débloquer directement, on propose la comparaison intelligente
    setSelectedLessonForComparison(lesson);
    setShowSmartComparison(true);
  };

  // Déblocage direct d'une leçon (après comparaison)
  const handleDirectLessonUnlock = (lessonId: string) => {
    const lessonCost = 5;
    if (userCredits >= lessonCost) {
      onCreditChange(userCredits - lessonCost);
      setCreditAnimation({ type: 'spend', amount: lessonCost });
      setShowSmartComparison(false);
      
      // TODO: Ajouter la leçon aux leçons possédées
      console.log('Leçon débloquée:', lessonId);
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
    const item = itemType === 'course' 
      ? availableCourses.find(c => c.id === itemId)
      : coursePacks.find(p => p.id === itemId);
    
    if (!item) return;

    const cost = itemType === 'course' 
      ? (item as Course).creditCost || 20
      : (item as CoursePack).creditCost;

    if (userCredits >= cost) {
      // Déduire les crédits
      onCreditChange(userCredits - cost);
      setCreditAnimation({ amount: cost, type: 'spend' });

      // Débloquer le contenu
      if (itemType === 'course') {
        onCourseUnlock(itemId);
      } else {
        const pack = item as CoursePack;
        onPackUnlock(itemId, pack.courses);
      }
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
      creditCost: (course.creditCost || 20) + 25,
      originalCreditCost: (course.creditCost || 20) * 3,
      savings: (course.creditCost || 20) + 15,
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
      {/* Header avec compteur de crédits */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Débloquer du contenu</h2>
          <p className="text-gray-600">Cours individuels ou packs avec valeur ajoutée</p>
        </div>
        
        {/* Compteur de crédits avec animation */}
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

      {/* Bloc sélection personnalisée */}
      <PersonalizedSelection
        suggestedCourses={data.suggestedCourses}
        facultyName={data.user.faculty}
        totalStudents={data.facultyStats.totalStudents}
        onUnlockCourse={onCourseUnlock}
        onPreviewCourse={() => {}} // TODO: Implémenter preview
        onSelectCourse={handleCourseSelection}
        canAfford={(cost) => userCredits >= cost}
        unlockedCourses={ownedCourses}
      />

      {/* Grille des items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map(({ item, type }, index) => (
            <motion.div
              key={`${type}-${item.id}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              {type === 'course' ? (
                filter === 'courses' ? (
                  <IndividualCourseCard
                    course={item as Course}
                    userCredits={userCredits}
                    onPurchase={handleCourseUpsell}
                    onPreview={(course) => console.log('Preview course:', course.id)}
                    canAfford={userCredits >= ((item as Course).creditCost || 15)}
                  />
                ) : (
                  <CoursePurchaseCard
                    course={item as Course}
                    isOwned={ownedCourses.includes(item.id)}
                    packBadge={getCoursePackBadge(item.id)}
                    onPurchase={(courseId) => handlePurchase(courseId, 'course')}
                    onPreview={(courseId) => console.log('Preview course:', courseId)}
                  />
                )
              ) : type === 'pack' ? (
                <CoursePackCard
                  pack={item as CoursePack}
                  courses={getIncludedCourses(item as CoursePack)}
                  isOwned={ownedPacks.includes(item.id)}
                  onPurchase={(packId) => handlePurchase(packId, 'pack')}
                  onPreview={(packId) => console.log('Preview pack:', packId)}
                  className="md:col-span-2 lg:col-span-1"
                />
              ) : (
                <LessonPurchaseCard
                  lesson={item as Lesson}
                  isOwned={false} // TODO: Implémenter la logique des leçons possédées
                  canAfford={userCredits >= 5}
                  onUnlock={(lessonId) => handleLessonUnlock(lessonId)}
                  onPreview={(lessonId) => console.log('Preview lesson:', lessonId)}
                />
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
        userCredits={userCredits}
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
          canAffordCourse={userCredits >= (selectedCourseForOffer.creditCost || 20)}
          canAffordPack={userCredits >= getSuggestedPack(selectedCourseForOffer).creditCost}
        />
      )}

      {/* Comparaison intelligente pour les leçons */}
      {selectedLessonForComparison && (
        <SmartContentComparison
          isVisible={showSmartComparison}
          onClose={handleCloseSmartComparison}
          selectedLesson={selectedLessonForComparison}
          relatedCourse={getLessonRecommendations(selectedLessonForComparison).relatedCourse}
          recommendedPack={getLessonRecommendations(selectedLessonForComparison).recommendedPack}
          onSelectLesson={() => handleDirectLessonUnlock(selectedLessonForComparison.id)}
          onSelectCourse={handleSmartComparisonCourse}
          onSelectPack={handleSmartComparisonPack}
          canAffordLesson={userCredits >= 5}
          canAffordCourse={userCredits >= (getLessonRecommendations(selectedLessonForComparison).relatedCourse.creditCost || 20)}
          canAffordPack={userCredits >= getLessonRecommendations(selectedLessonForComparison).recommendedPack.creditCost}
        />
      )}

      {/* Modal d'upsell pour cours individuels */}
      {selectedCourseForUpsell && (
        <CourseUpsellModal
          isOpen={showUpsellModal}
          onClose={handleCloseUpsellModal}
          selectedCourse={selectedCourseForUpsell}
          recommendedPacks={coursePacks.filter(pack => 
            pack.courses.includes(selectedCourseForUpsell.id)
          )}
          userCredits={userCredits}
          onPurchaseCourse={handleUpsellPurchaseCourse}
          onPurchasePack={handleUpsellPurchasePack}
          canAffordCourse={userCredits >= (selectedCourseForUpsell.creditCost || 15)}
          canAffordPacks={coursePacks
            .filter(pack => pack.courses.includes(selectedCourseForUpsell.id))
            .map(pack => userCredits >= pack.creditCost)
          }
        />
      )}
    </div>
  );
}
