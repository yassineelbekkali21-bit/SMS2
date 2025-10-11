# Implementation Plan

## Overview

Ce plan d'implémentation transforme les requirements et le design en tâches concrètes de développement. Chaque tâche s'appuie sur l'architecture existante de Science Made Simple pour ajouter le système de diagnostic et d'onboarding personnalisé, en respectant l'identité visuelle du site web existant.

## Tasks

- [x] 1. Créer le nouveau projet Science-Made-Simple-Kiro
  - Créer un nouveau dossier "Science-Made-Simple-Kiro" 
  - Copier l'architecture existante de "science-made-simple-next" comme base
  - Configurer le nouveau projet Next.js avec TypeScript
  - Migrer les composants existants (SimpleLanding, SimpleDashboard, Community, etc.)
  - Conserver toute l'identité visuelle et les fonctionnalités existantes
  - _Requirements: Toutes les requirements_

- [x] 1.1 Initialiser le projet et migrer la base
  - Créer le nouveau dossier "Science-Made-Simple-Kiro"
  - Copier package.json, tsconfig.json, tailwind.config.js
  - Migrer src/types/index.ts avec tous les types existants
  - Copier src/lib/mock-data.ts et src/hooks/useCreditSystem.ts
  - Configurer l'environnement de développement
  - _Requirements: Base technique_

- [x] 1.2 Migrer tous les composants existants
  - Copier src/components/ complet (SimpleLanding, SimpleDashboard, Community, etc.)
  - Migrer src/app/page.tsx et la structure des pages
  - Copier public/ avec tous les assets (course-backgrounds, etc.)
  - Vérifier que tout fonctionne identiquement à l'original
  - Tester la compilation et l'exécution
  - _Requirements: Compatibilité existante_

- [x] 2. Améliorer SimpleLanding avec intégration WhatsApp
  - Modifier le composant SimpleLanding migré pour ajouter le workflow de diagnostic
  - Remplacer le bouton "Commencer gratuitement" par "Commencer mon diagnostic"
  - Intégrer la redirection WhatsApp avec message pré-rempli
  - Conserver l'identité visuelle existante (cartes noires, fond gris clair)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2.1 Créer le composant WhatsAppDiagnosticCTA
  - Développer un composant réutilisable pour les CTA WhatsApp
  - Implémenter la génération de liens WhatsApp avec messages pré-remplis
  - Ajouter le tracking des clics vers WhatsApp
  - Respecter le style des boutons existants du site web
  - _Requirements: 1.1, 1.2_

- [x] 2.2 Mettre à jour les copies et messages
  - Remplacer "Essayer gratuitement" par "Commencer mon diagnostic"
  - Ajouter le message WhatsApp : "Bonjour ! Je viens du site Science Made Simple et j'aimerais faire mon diagnostic personnalisé (ambitions, blocages). Pouvez-vous m'aider ?"
  - Adapter les textes pour refléter l'approche diagnostic-first
  - Conserver le ton "exigence bienveillante" existant
  - _Requirements: 1.3, 1.4_

- [x] 3. Étendre les types existants pour le diagnostic
  - Enrichir les interfaces PersonalProfile, Blocage, Ambition existantes
  - Ajouter les types WhatsAppSession et DiagnosticData
  - Créer les interfaces pour l'intégration WhatsApp
  - Maintenir la compatibilité avec le code existant
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3.1 Étendre PersonalProfile pour le diagnostic WhatsApp
  - Ajouter les champs university, faculty, section, year au type existant
  - Intégrer stressLevel et urgentDeadlines
  - Créer les liens avec les conversations WhatsApp existantes
  - Assurer la compatibilité avec getPersonalProfile() existant
  - _Requirements: 2.1, 2.2_

- [x] 3.2 Créer les types d'intégration WhatsApp
  - Développer WhatsAppSession avec gestion des messages
  - Implémenter DiagnosticData basé sur PersonalProfile existant
  - Ajouter les types pour la synchronisation WhatsApp ↔ App
  - Créer les interfaces pour les webhooks WhatsApp
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 4. Améliorer SimpleDashboard avec section diagnostic
  - Étendre le SimpleDashboard migré avec les données de diagnostic
  - Ajouter l'onglet "Mon Diagnostic" dans la navigation existante
  - Intégrer les sections "Tes blocages", "Tes ambitions", "Ton chemin"
  - Conserver le style des cartes noires arrondies du site web
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4.1 Créer le composant DiagnosticSection
  - Développer l'affichage des blocages avec style cohérent au site
  - Implémenter la visualisation des ambitions avec progression
  - Créer l'affichage du chemin recommandé
  - Utiliser les cartes noires arrondies de l'identité visuelle
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4.2 Intégrer les données de diagnostic dans le dashboard
  - Modifier DashboardData pour inclure PersonalProfile
  - Adapter les métriques existantes avec les données de diagnostic
  - Enrichir les CourseCard avec les raisons de recommandation
  - Maintenir la compatibilité avec mockDashboardData existant
  - _Requirements: 3.4, 3.5_

- [ ] 5. Enrichir Community avec social proof par faculté
  - Étendre le composant Community existant avec données par faculté
  - Ajouter "X étudiants de ta faculté ont pris ce cours" aux CourseCard
  - Intégrer les statistiques de diagnostic par faculté
  - Conserver l'architecture des cercles et study rooms existante
  - _Requirements: 5.3, 16.1, 16.2, 16.3_

- [ ] 5.1 Créer FacultySocialProof component
  - Développer l'affichage du social proof par faculté
  - Implémenter CoursePopularityByFaculty avec données réelles
  - Ajouter FacultyDiagnosticStats pour les tendances
  - Intégrer avec les Circle existants pour organiser par faculté
  - _Requirements: 5.3, 16.2_

- [ ] 5.2 Enrichir les CourseCard avec social proof
  - Modifier SuggestedCourseCard pour afficher "27 étudiants de ta faculté"
  - Ajouter les raisons de recommandation basées sur le diagnostic
  - Intégrer avec le système de crédits existant
  - Conserver le style et les interactions existantes
  - _Requirements: 5.1, 5.2, 5.4_

- [ ] 6. Étendre CourseStaircaseView avec nouveaux thèmes et bloc de progression par défaut
  - Ajouter de nouveaux thèmes Mario Map à ceux existants
  - Créer les SVG pour galaxie-constellation, ville-campus, aventure-medievale
  - Intégrer le sélecteur de thème dans les paramètres existants
  - Mettre en évidence les leçons recommandées par le diagnostic
  - **Implémenter l'affichage par défaut du bloc de progression de la dernière leçon**
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 6.1 Créer les nouveaux thèmes Mario Map
  - Développer les SVG pour les nouveaux thèmes (galaxie, ville, aventure)
  - Ajouter les fichiers dans /public/course-backgrounds/
  - Étendre BACKGROUND_OPTIONS dans SimpleDashboard
  - Maintenir la compatibilité avec les thèmes existants
  - _Requirements: 10.2, 10.8_

- [ ] 6.2 Intégrer les recommandations de diagnostic dans la map
  - Modifier CourseStaircaseView pour highlighter les leçons recommandées
  - Ajouter diagnosticPriority aux Lesson existantes
  - Créer des indicateurs visuels pour les blocages couverts
  - Utiliser les couleurs cohérentes avec l'identité visuelle
  - _Requirements: 10.1, 10.3, 10.4_

- [ ] 6.3 Implémenter le bloc de progression par défaut
  - Créer le composant ProgressBlock pour afficher les détails de la leçon actuelle
  - Implémenter la logique pour identifier la dernière leçon où l'étudiant s'est arrêté
  - Ajouter le bouton "Continuer" qui amène directement à la leçon suivante
  - Afficher les informations contextuelles (temps estimé, difficulté, objectifs)
  - Intégrer avec le système de progression existant
  - _Requirements: 10.6, 10.7_

- [ ] 6. Améliorer IntegratedCourseViewer avec slides interactifs
  - Étendre le viewer existant avec overlay professeur
  - Ajouter le mode manuscrit pour les slides
  - Intégrer l'adaptation basée sur le diagnostic
  - Enrichir les VideoQuizQuestion existants avec adaptation
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 6.1 Créer le composant ProfessorOverlay
  - Développer l'overlay vidéo du professeur sur les slides
  - Implémenter les positions (overlay, side, corner)
  - Ajouter les contrôles de lecture et transcript
  - Intégrer avec le lecteur de slides existant
  - _Requirements: 12.1, 12.2_

- [ ] 6.2 Implémenter le mode manuscrit
  - Créer les slides manuscrits avec style "écrit à la main"
  - Ajouter les animations d'écriture progressive
  - Intégrer avec le contenu existant des leçons
  - Conserver la lisibilité et l'accessibilité
  - _Requirements: 12.2, 15.4_

- [ ] 6.3 Ajouter l'adaptation basée sur le diagnostic
  - Étendre VideoQuizQuestion avec adaptation aux réponses
  - Implémenter les slides supplémentaires pour les lacunes
  - Créer les règles d'adaptation selon les blocages identifiés
  - Intégrer avec le système de quiz existant
  - _Requirements: 12.4, 13.1, 13.2, 13.3_

- [ ] 7. Enrichir SmartPlanning avec données de diagnostic
  - Intégrer les blocages dans la génération de planning existante
  - Prioriser automatiquement les cours recommandés par le diagnostic
  - Enrichir les ChatMessage avec contexte diagnostic
  - Utiliser les échéances d'ambitions pour ajuster le planning
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

- [ ] 7.1 Intégrer le diagnostic dans l'IA de planification
  - Modifier SmartPlanning pour utiliser PersonalProfile
  - Enrichir les StudyPreferences avec diagnosticRecommendations
  - Adapter les CalendarEvent avec contexte diagnostic
  - Maintenir la compatibilité avec le chat IA existant
  - _Requirements: 17.1, 17.2, 17.3_

- [ ] 7.2 Prioriser les cours selon le diagnostic
  - Modifier la génération de planning pour prioriser les blocages
  - Intégrer les échéances d'ambitions dans le calendrier
  - Ajouter les raisons de recommandation dans les événements
  - Conserver l'interface conversationnelle existante
  - _Requirements: 17.4, 17.5, 17.6_

- [ ] 8. Créer le système de contenu gratuit et awareness
  - Implémenter les aperçus gratuits pour la stratégie d'awareness
  - Créer les mini-quiz gratuits pour la prise de conscience des lacunes
  - Intégrer avec le système de crédits existant
  - Ajouter les PreviewModal avec limitation de temps
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 8.1 Développer les aperçus gratuits
  - Créer PreviewSession avec limitation de temps (5-10 min)
  - Implémenter le tracking du temps de visionnage
  - Ajouter les CTA vers déblocage avec crédits
  - Intégrer avec les Course existants
  - _Requirements: 6.1, 6.2, 6.6_

- [ ] 8.2 Créer les mini-quiz d'awareness
  - Développer des quiz gratuits pour identifier les lacunes
  - Implémenter l'affichage des résultats pour prise de conscience
  - Intégrer avec le système de diagnostic existant
  - Ajouter les recommandations post-quiz
  - _Requirements: 6.3, 6.4, 6.5_

- [ ] 9. Implémenter la mise à jour continue du profil
  - Créer le système de synchronisation WhatsApp ↔ App
  - Implémenter la mise à jour automatique des blocages/ambitions
  - Ajouter l'historique des conversations IA et WhatsApp
  - Intégrer avec les types ConversationIA et ConversationWhatsApp existants
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 9.1 Créer le système de synchronisation WhatsApp
  - Développer les webhooks pour recevoir les messages WhatsApp
  - Implémenter la mise à jour automatique du PersonalProfile
  - Créer l'interface de gestion des conversations
  - Intégrer avec les types existants ConversationWhatsApp
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 9.2 Implémenter la mise à jour continue du diagnostic
  - Créer la logique de mise à jour des blocages selon les quiz
  - Implémenter l'évolution des ambitions selon la progression
  - Ajouter la réajustement automatique du chemin recommandé
  - Intégrer avec les données de progression existantes
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10. Ajouter l'accès WhatsApp 24/7 dans l'app
  - Intégrer les boutons WhatsApp dans tous les composants pertinents
  - Créer le widget WhatsApp flottant
  - Implémenter le contexte automatique (profil + progression)
  - Conserver le style cohérent avec l'identité visuelle
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 10.1 Créer le widget WhatsApp flottant
  - Développer un bouton WhatsApp persistant dans l'app
  - Implémenter l'envoi automatique du contexte utilisateur
  - Ajouter les messages pré-remplis selon la situation
  - Utiliser le style vert WhatsApp cohérent avec l'identité
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 10.2 Intégrer WhatsApp dans les moments clés
  - Ajouter les CTA WhatsApp quand l'utilisateur bloque sur une leçon
  - Implémenter les suggestions de contact mentor selon la progression
  - Créer les messages contextuels selon la situation
  - Maintenir l'accompagnement humain 24/7
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 11. Optimiser l'interface pour l'identité visuelle
  - Appliquer la palette noir/blanc/gris du site web
  - Implémenter les cartes arrondies cohérentes
  - Ajouter les touches de couleur stratégiques
  - Assurer la cohérence typographique avec le site
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 11.1 Créer le système de design cohérent
  - Développer les composants UI basés sur l'identité du site
  - Implémenter les cartes noires arrondies réutilisables
  - Créer la palette de couleurs et variables CSS
  - Ajouter les animations subtiles cohérentes
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 11.2 Adapter la typographie et espacement
  - Implémenter la même hiérarchie typographique que le site
  - Ajouter les espacements généreux cohérents
  - Créer les styles pour les titres, sous-titres, corps de texte
  - Assurer la lisibilité sur tous les appareils
  - _Requirements: 15.4, 15.5_

- [ ] 12. Implémenter les standards techniques et accessibilité
  - Assurer la conformité WCAG 2.1 AA
  - Optimiser les performances (Core Web Vitals)
  - Implémenter le responsive design complet
  - Ajouter la sécurité et protection des données
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 12.1 Assurer l'accessibilité et performance
  - Implémenter les standards WCAG 2.1 AA
  - Optimiser les images et assets pour la performance
  - Ajouter les alt texts et navigation clavier
  - Tester sur différents appareils et navigateurs
  - _Requirements: 18.1, 18.2, 18.3_

- [ ] 12.2 Sécuriser les données et intégrations
  - Implémenter le chiffrement pour les données WhatsApp
  - Ajouter la conformité RGPD avec consentements
  - Sécuriser les API et webhooks
  - Créer les audit trails pour les modifications
  - _Requirements: 18.4, 18.5_

- [ ] 13. Préparer l'architecture Web 3.0
  - Créer l'infrastructure pour les intégrations décentralisées
  - Préparer le support des wallets et blockchain
  - Implémenter l'architecture évolutive
  - Maintenir la simplicité d'usage actuelle
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 13.1 Créer l'architecture évolutive
  - Développer les interfaces pour les futures intégrations Web 3.0
  - Implémenter l'architecture modulaire pour la blockchain
  - Préparer les hooks pour les wallets et certifications
  - Maintenir la compatibilité avec l'architecture actuelle
  - _Requirements: 20.1, 20.2, 20.3_

- [ ] 13.2 Préparer les certifications blockchain
  - Créer les interfaces pour les certificats vérifiables
  - Implémenter la structure pour les NFT de réussite
  - Ajouter les métadonnées pour la vérification
  - Conserver la simplicité pour les utilisateurs non-crypto
  - _Requirements: 20.4, 20.5_

## Mise à jour des numéros de tâches

**Note importante :** Tous les numéros de tâches ont été décalés de +1 pour tenir compte de la nouvelle tâche 1 "Créer le nouveau projet Science-Made-Simple-Kiro". 

**Structure finale :**
1. Créer le nouveau projet (nouveau)
2. Améliorer SimpleLanding (anciennement 1)
3. Étendre les types (anciennement 2)
4. Améliorer SimpleDashboard (anciennement 3)
5. Enrichir Community (anciennement 4)
6. Étendre CourseStaircaseView (anciennement 5)
7. Améliorer IntegratedCourseViewer (anciennement 6)
8. Enrichir SmartPlanning (anciennement 7)
9. Créer le système de contenu gratuit (anciennement 8)
10. Implémenter la mise à jour continue (anciennement 9)
11. Ajouter l'accès WhatsApp 24/7 (anciennement 10)
12. Optimiser l'interface (anciennement 11)
13. Standards techniques (anciennement 12)
14. Architecture Web 3.0 (anciennement 13)

## Avantages du nouveau projet séparé

1. **Versions parallèles** : Garder l'original intact pendant le développement
2. **Tests sécurisés** : Expérimenter sans risquer la version existante
3. **Comparaison facile** : Pouvoir comparer les deux versions
4. **Déploiement progressif** : Migrer graduellement vers la nouvelle version
5. **Rollback possible** : Revenir à l'ancienne version si nécessaire

## Prochaines étapes

1. **Commencer par la tâche 1** : Créer le nouveau projet et migrer la base
2. **Vérifier la compatibilité** : S'assurer que tout fonctionne identiquement
3. **Implémenter progressivement** : Ajouter les nouvelles fonctionnalités une par une
4. **Tester régulièrement** : Valider chaque étape avant de passer à la suivante