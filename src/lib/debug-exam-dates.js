// Script de debug pour les dates d'examen
// À exécuter dans la console du navigateur

console.log('🔍 Debug des dates d\'examen participatives');

// Vérifier le localStorage
const examDatesKey = 'exam_dates_v1';
const storedData = localStorage.getItem(examDatesKey);

if (storedData) {
  try {
    const examDates = JSON.parse(storedData);
    console.log('📊 Données stockées trouvées:', examDates.length, 'cours');
    
    examDates.forEach((exam, index) => {
      console.log(`\n${index + 1}. 📚 ${exam.courseName}`);
      console.log(`   🏷️ ID: ${exam.courseId}`);
      console.log(`   📊 Statut: ${exam.status}`);
      
      if (exam.status === 'official' && exam.officialDate) {
        console.log(`   ✅ Date officielle: ${new Date(exam.officialDate).toLocaleDateString('fr-FR')}`);
        console.log(`   🏛️ Source: ${exam.officialSource}`);
      } else if (exam.currentProposal) {
        console.log(`   ⏳ Date proposée: ${new Date(exam.currentProposal.proposedDate).toLocaleDateString('fr-FR')}`);
        console.log(`   👤 Proposé par: ${exam.currentProposal.proposedByName}`);
        console.log(`   ✅ Confirmations: ${exam.currentProposal.confirmations.length}/3`);
        console.log(`   📊 Statut proposition: ${exam.currentProposal.status}`);
      } else {
        console.log(`   ❌ Aucune date définie`);
      }
      
      console.log(`   👥 Étudiants: ${exam.totalStudentsInCourse} total, ${exam.participatingStudents} participants`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du parsing des données:', error);
  }
} else {
  console.log('⚠️ Aucune donnée trouvée dans le localStorage');
  console.log('💡 Rafraîchissez la page ou naviguez vers le module Planification');
}

// Fonction pour forcer le rechargement des données
window.forceReloadExamDates = function() {
  localStorage.removeItem(examDatesKey);
  console.log('🔄 Données supprimées, rechargez la page pour voir les nouvelles données');
};

console.log('\n💡 Utilisez forceReloadExamDates() pour reset les données');



