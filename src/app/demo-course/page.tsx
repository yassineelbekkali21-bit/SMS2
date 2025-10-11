'use client';

import { useState } from 'react';
import { CourseMapView } from '@/components/CourseMapView';
import { LessonQuiz } from '@/components/LessonQuiz';
import { mockUser, mockCourses, getQuizByLessonId } from '@/lib/mock-data';

export default function DemoCoursePage() {
  const [user, setUser] = useState(mockUser);
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set(['course-suites']));
  const [showQuiz, setShowQuiz] = useState(false);
  
  const course = mockCourses[0]; // "Loi de Gauss"

  const handlePurchase = (itemType: string, itemId: string, price: number) => {
    setPurchasedItems(prev => new Set([...prev, `${itemType}-${itemId}`]));
  };

  const handleBack = () => {
    console.log('Retour au dashboard');
  };

  const quizQuestions = getQuizByLessonId('lesson-gauss-plan');

  return (
    <div>
      <CourseMapView
        course={course}
        user={user}
        onBack={handleBack}
        onUpdateUser={setUser}
        purchasedItems={purchasedItems}
        onPurchase={handlePurchase}
      />

      {/* Bouton pour tester le quiz */}
      <button
        onClick={() => setShowQuiz(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition-colors"
      >
        Tester le Quiz
      </button>

      {showQuiz && (
        <LessonQuiz
          lessonTitle="Les fondamentaux essentiels"
          questions={quizQuestions}
          onClose={() => setShowQuiz(false)}
          onComplete={(score) => {
            console.log(`Quiz terminé avec un score de ${score}%`);
            setShowQuiz(false);
          }}
        />
      )}
    </div>
  );
}









