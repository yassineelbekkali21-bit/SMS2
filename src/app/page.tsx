'use client';

import React, { useState, useRef } from 'react';
import { SimpleLanding } from '@/components/SimpleLanding';
import { SimpleDashboard } from '@/components/SimpleDashboard';
import { CourseMapView } from '@/components/CourseMapView';
import { LoginScreen } from '@/components/LoginScreen';
import { useAuth } from '@/hooks/useAuth';
import { mockDashboardData, toggleCourseFavorite, reorderPrimaryCourses, enrollInCourse, mockUser } from '@/lib/mock-data';
import { DashboardData, Course, User } from '@/types';

export default function Home() {
  const auth = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>(mockDashboardData);
  const [showApp, setShowApp] = useState(false);
  const [user, setUser] = useState<User>(mockUser);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const isTogglingRef = useRef<Set<string>>(new Set());

  // Si l'utilisateur n'est pas authentifié et que l'auth n'est pas en cours de chargement
  if (!auth.isLoading && !auth.isAuthenticated) {
    return <LoginScreen onLogin={auth.login} />;
  }

  // Écran de chargement pendant la vérification de l'auth
  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de Science Made Simple...</p>
        </div>
      </div>
    );
  }

  const handleUpdateCourseOrder = (courseId: string, newIndex: number) => {
    console.log(`Reordering course ${courseId} to position ${newIndex}`);
    // Ici vous pourriez faire un appel API pour sauvegarder l'ordre
  };

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handlePurchase = (itemType: string, itemId: string, price: number) => {
    // itemId contient déjà le préfixe (ex: "course-gauss"), pas besoin de le redoubler
    const purchaseKey = itemId.startsWith(itemType) ? itemId : `${itemType}-${itemId}`;
    console.log('🔑 PURCHASE: Ajout à purchasedItems:', purchaseKey, '(itemType:', itemType, 'itemId:', itemId, ')');
    setPurchasedItems(prev => new Set([...prev, purchaseKey]));
    
    // 🔄 SYNC: Retirer le cours des suggestions s'il est acheté
    if (itemType === 'course') {
      setDashboardData(prevData => ({
        ...prevData,
        suggestedCourses: prevData.suggestedCourses.filter(suggestion => suggestion.course.id !== itemId)
      }));
      console.log('🔄 PURCHASE: Cours retiré des suggestions:', itemId);
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleToggleCourseFavorite = (courseId: string) => {
    // Protection absolue contre les appels multiples
    if (isTogglingRef.current.has(courseId)) {
      console.log(`🚫 BLOCKED: Already toggling course ${courseId}`);
      return;
    }

    console.log(`❤️ STARTING: Toggling favorite for course ${courseId}`);
    
    // Marquer ce cours comme en cours de traitement
    isTogglingRef.current.add(courseId);
    
    // Simulation de la mise à jour avec protection contre la double exécution
    setDashboardData(prevData => {
      console.log('🔍 Before update:', {
        primaryCourses: prevData.primaryCourses.map(c => ({ id: c.id, title: c.title, isPrimary: c.isPrimary })),
        suggestedCourses: prevData.suggestedCourses.map(s => ({ id: s.course.id, title: s.course.title, isPrimary: s.course.isPrimary }))
      });

      const allCourses = prevData.primaryCourses.concat(
        prevData.suggestedCourses.map(s => s.course)
      );
      
      console.log('📚 All courses:', allCourses.map(c => ({ id: c.id, title: c.title, isPrimary: c.isPrimary })));
      console.log('🎯 Looking for course ID:', courseId);
      
      const targetCourse = allCourses.find(course => course.id === courseId);
      console.log('🎯 Found target course:', targetCourse ? { id: targetCourse.id, title: targetCourse.title, isPrimary: targetCourse.isPrimary } : 'NOT FOUND');

      // Vérifier si le cours a déjà l'état opposé (éviter la double modification)
      if (!targetCourse) {
        console.log('⚠️ Course not found, returning unchanged data');
        return prevData;
      }

      // Si le cours est déjà dans l'état désiré, ne pas modifier
      const desiredState = !targetCourse.isPrimary;
      const currentState = targetCourse.isPrimary;
      
      console.log(`🔄 Current state: ${currentState}, Desired state: ${desiredState}`);
      
      const updatedCourses = allCourses.map(course => {
        if (course.id === courseId) {
          const updated = { 
            ...course, 
            isPrimary: desiredState
            // NE PAS modifier isOwned - ajouter aux favoris ne donne pas la propriété du cours
          };
          console.log(`✨ Updating course ${courseId}: isPrimary ${course.isPrimary} -> ${updated.isPrimary} (isOwned unchanged: ${course.isOwned})`);
          return updated;
        }
        return course;
      });

      const newPrimaryCourses = updatedCourses.filter(course => course.isPrimary);
      const newSuggestedCourses = prevData.suggestedCourses.map(suggestion => ({
        ...suggestion,
        course: updatedCourses.find(course => course.id === suggestion.course.id) || suggestion.course
      })).filter(suggestion => !suggestion.course.isPrimary);

      console.log('✅ After update:', {
        primaryCourses: newPrimaryCourses.map(c => ({ id: c.id, title: c.title, isPrimary: c.isPrimary })),
        suggestedCourses: newSuggestedCourses.map(s => ({ id: s.course.id, title: s.course.title, isPrimary: s.course.isPrimary }))
      });

      return {
        ...prevData,
        primaryCourses: newPrimaryCourses,
        suggestedCourses: newSuggestedCourses
      };
    });

    // Nettoyer le flag après un délai
    setTimeout(() => {
      isTogglingRef.current.delete(courseId);
      console.log(`🧹 CLEANUP: Removed protection for course ${courseId}`);
    }, 1000);

    console.log(`✅ COMPLETED: Favorite toggle for course ${courseId}`);
  };

  const handlePreviewCourse = (courseId: string) => {
    console.log(`Opening preview for course ${courseId}`);
    // Ici vous ouvririez un modal de preview ou navigueriez vers la page de preview
  };

  const handleEnrollCourse = (courseId: string) => {
    console.log(`Enrolling in course ${courseId}`);
    
    // Simulation de l'inscription
    setDashboardData(prevData => {
      const enrolledCourse = enrollInCourse(courseId);
      if (!enrolledCourse) return prevData;

      const updatedCourses = prevData.primaryCourses.concat(
        prevData.suggestedCourses.map(s => s.course)
      ).map(course => {
        if (course.id === courseId) {
          return enrolledCourse;
        }
        return course;
      });

      return {
        ...prevData,
        primaryCourses: updatedCourses.filter(course => course.isPrimary),
        suggestedCourses: prevData.suggestedCourses.filter(suggestion => suggestion.course.id !== courseId)
      };
    });
  };

  if (!showApp) {
    return (
      <SimpleLanding onEnterApp={() => setShowApp(true)} />
    );
  }

  if (selectedCourse) {
    return (
      <CourseMapView
        course={selectedCourse}
        user={user}
        onBack={() => setSelectedCourse(null)}
        onUpdateUser={handleUpdateUser}
        purchasedItems={purchasedItems}
        onPurchase={handlePurchase}
      />
    );
  }

  return (
    <SimpleDashboard
      data={dashboardData}
      user={user}
      onUpdateCourseOrder={handleUpdateCourseOrder}
      onToggleCourseFavorite={handleToggleCourseFavorite}
      onPreviewCourse={handlePreviewCourse}
      onEnrollCourse={handleEnrollCourse}
      onStartCourse={handleStartCourse}
      onUpdateUser={handleUpdateUser}
      purchasedItems={purchasedItems}
      onPurchase={handlePurchase}
      onLogout={auth.logout}
    />
  );
}