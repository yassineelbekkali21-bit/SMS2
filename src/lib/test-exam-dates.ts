'use client';

import { ExamDatesService } from './exam-dates-service';

export function testExamDatesData() {
  console.log('🎮 Test des nouvelles données d\'examens');
  console.log('================================================');
  
  const facultyId = 'Faculté Sciences';
  
  // Force le rechargement des données
  ExamDatesService.forceReloadData(facultyId);
  
  // Récupère toutes les données
  const examDates = ExamDatesService.getAllExamDates(facultyId);
  
  examDates.forEach(exam => {
    console.log(`\n📚 ${exam.courseName}`);
    console.log(`   Statut: ${exam.status}`);
    
    if (exam.status === 'official' && exam.officialDate) {
      console.log(`   ✅ Date officielle: ${exam.officialDate.toLocaleDateString('fr-FR')}`);
      console.log(`   🏛️ Source: ${exam.officialSource}`);
    } else if (exam.currentProposal) {
      console.log(`   ⏳ Date proposée: ${exam.currentProposal.proposedDate.toLocaleDateString('fr-FR')}`);
      console.log(`   👤 Proposé par: ${exam.currentProposal.proposedByName}`);
      console.log(`   ✅ Confirmations: ${exam.currentProposal.confirmations.length}/3`);
    } else {
      console.log(`   ❌ Aucune date définie`);
    }
  });
  
  console.log('\n🎯 Données mises à jour avec succès !');
}

// Fonction pour réinitialiser les données si nécessaire
export function resetExamDatesData() {
  ExamDatesService.resetData();
  console.log('🔄 Données d\'examens réinitialisées');
}



