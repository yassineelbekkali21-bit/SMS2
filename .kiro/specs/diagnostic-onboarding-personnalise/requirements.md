# Requirements Document

## Introduction

Le système de diagnostic et d'onboarding personnalisé est le cœur de l'expérience Science Made Simple. Il suit une métaphore médicale : diagnostic humain via WhatsApp d'abord, puis prescription personnalisée dans l'application. Ce système permet d'identifier précisément les blocages de chaque étudiant via un échange humain, de comprendre ses ambitions et de créer un parcours sur-mesure qui maximise ses chances de réussite aux examens. L'étudiant arrive depuis le site web, est dirigé vers WhatsApp pour le diagnostic, puis revient sur l'app avec sa prescription personnalisée.

## Requirements

### Requirement 1

**User Story:** En tant qu'étudiant venant du site web, je veux être dirigé vers WhatsApp pour un diagnostic humain personnalisé afin de recevoir une prescription adaptée à ma situation académique.

#### Acceptance Criteria

1. WHEN un étudiant clique sur "Commencer" depuis le site web THEN le système SHALL le rediriger vers WhatsApp avec un message pré-rempli
2. WHEN l'étudiant contacte via WhatsApp THEN un mentor SHALL collecter ses informations (université, faculté, section, année d'étude, situation actuelle)
3. WHEN le mentor termine le diagnostic THEN il SHALL créer un profil personnalisé dans l'application avec les résultats
4. WHEN le profil est créé THEN l'étudiant SHALL recevoir un lien pour accéder à son tableau de bord personnalisé
5. WHEN l'étudiant accède à l'app THEN il SHALL voir immédiatement sa prescription avec "Tes blocages", "Tes ambitions", "Ton chemin"

### Requirement 2

**User Story:** En tant qu'étudiant diagnostiqué, je veux voir mes blocages clairement identifiés avec des explications et des recommandations pour que je comprenne exactement où je dois progresser et prendre conscience de mes lacunes.

#### Acceptance Criteria

1. WHEN j'accède à mon tableau de bord THEN le système SHALL afficher une section "Tes blocages" basée sur le diagnostic WhatsApp
2. WHEN un blocage est affiché THEN le système SHALL inclure le titre, la description, la matière concernée et le niveau de difficulté
3. WHEN un blocage est présenté THEN le système SHALL fournir des recommandations spécifiques de cours/leçons pour le résoudre
4. WHEN je clique sur un blocage THEN le système SHALL me proposer un test gratuit pour prendre conscience de mes lacunes (stratégie d'awareness)
5. IF un blocage est critique pour mes échéances THEN le système SHALL le marquer comme prioritaire dans le parcours

### Requirement 3

**User Story:** En tant qu'étudiant, je veux définir et voir mes ambitions clairement pour que le système puisse adapter mon parcours à mes objectifs spécifiques.

#### Acceptance Criteria

1. WHEN l'utilisateur définit ses objectifs THEN le système SHALL créer une section "Tes ambitions" personnalisée
2. WHEN une ambition est créée THEN le système SHALL inclure le titre, la description, l'échéance et la priorité
3. WHEN une ambition est affichée THEN le système SHALL montrer le progrès actuel (0-100%) et les étapes nécessaires
4. WHEN l'utilisateur progresse THEN le système SHALL mettre à jour automatiquement le pourcentage d'accomplissement des ambitions
5. IF une échéance approche THEN le système SHALL prioriser les cours liés à cette ambition

### Requirement 4

**User Story:** En tant qu'étudiant, je veux recevoir un chemin personnalisé basé sur mon diagnostic pour que j'aie un plan clair et actionnable jusqu'à mon examen.

#### Acceptance Criteria

1. WHEN le diagnostic est complet THEN le système SHALL générer automatiquement un "Chemin recommandé" personnalisé
2. WHEN le chemin est créé THEN le système SHALL inclure des étapes ordonnées avec cours/packs recommandés
3. WHEN le chemin est affiché THEN le système SHALL montrer la progression globale et le temps estimé
4. WHEN l'utilisateur complète une étape THEN le système SHALL mettre à jour la progression et déverrouiller l'étape suivante
5. IF l'utilisateur dévie du chemin THEN le système SHALL proposer de réajuster le parcours

### Requirement 5

**User Story:** En tant qu'étudiant, je veux que le système me propose des cours et packs basés sur mon diagnostic et voir ce que d'autres étudiants de ma faculté ont pris pour que les recommandations soient pertinentes et rassurantes.

#### Acceptance Criteria

1. WHEN la prescription est générée THEN le système SHALL recommander des cours spécifiques pour chaque blocage identifié
2. WHEN des cours sont recommandés THEN le système SHALL expliquer la raison ("recommandé car lacune : intégrales")
3. WHEN je consulte les recommandations THEN le système SHALL afficher "27 étudiants de ta faculté ont pris ce cours" (social proof)
4. WHEN plusieurs cours traitent le même blocage THEN le système SHALL proposer des packs avec logique de valeur ajoutée (jamais de remises)
5. WHEN un pack est proposé THEN le système SHALL expliciter ce qui est ajouté ("En ajoutant Pack Analyse I, tu obtiens X, Y, Z")
6. IF j'ai des échéances proches THEN le système SHALL prioriser les cours les plus urgents

### Requirement 6

**User Story:** En tant qu'étudiant, je veux pouvoir accéder à du contenu gratuit (aperçus, mini-quiz) pour prendre conscience de mes lacunes et évaluer la qualité avant de consommer des crédits cognitifs.

#### Acceptance Criteria

1. WHEN un cours est recommandé THEN le système SHALL proposer un aperçu gratuit de 5-10 minutes
2. WHEN je demande un aperçu THEN le système SHALL donner accès au contenu sans débiter de crédits cognitifs
3. WHEN un aperçu est disponible THEN le système SHALL proposer un mini-quiz gratuit pour tester ma compréhension
4. WHEN je termine un mini-quiz THEN le système SHALL afficher mes résultats pour me faire prendre conscience de mes lacunes (stratégie d'awareness)
5. WHEN je veux aller plus loin THEN le système SHALL me proposer de débloquer le cours complet avec des crédits cognitifs
6. IF l'aperçu me convainc THEN le système SHALL faciliter le déblocage avec un message clair sur l'investissement en crédits

### Requirement 7

**User Story:** En tant qu'étudiant, je veux que mon profil soit mis à jour en continu basé sur mes interactions pour que les recommandations s'améliorent avec le temps.

#### Acceptance Criteria

1. WHEN l'utilisateur complète des quiz THEN le système SHALL mettre à jour automatiquement les forces/lacunes identifiées
2. WHEN l'utilisateur interagit avec l'IA ou WhatsApp THEN le système SHALL enrichir le profil avec les nouvelles découvertes
3. WHEN de nouveaux blocages sont identifiés THEN le système SHALL les ajouter à la section "Tes blocages"
4. WHEN des ambitions évoluent THEN le système SHALL réajuster le chemin recommandé
5. IF le profil change significativement THEN le système SHALL proposer une mise à jour de la prescription

### Requirement 8

**User Story:** En tant qu'étudiant, je veux avoir accès à un historique de mes conversations IA et WhatsApp pour que je puisse suivre l'évolution de mon diagnostic.

#### Acceptance Criteria

1. WHEN l'utilisateur a des conversations avec l'IA THEN le système SHALL enregistrer les résumés et découvertes clés
2. WHEN l'utilisateur échange via WhatsApp THEN le système SHALL synchroniser les points discutés dans son profil
3. WHEN l'utilisateur consulte son historique THEN le système SHALL afficher les conversations organisées par date
4. WHEN une conversation révèle de nouveaux insights THEN le système SHALL les intégrer automatiquement au diagnostic
5. IF un suivi est nécessaire THEN le système SHALL créer des rappels et actions dans le chemin personnalisé
##
# Requirement 9

**User Story:** En tant qu'étudiant, je veux avoir accès au catalogue complet des cours pour que je puisse choisir librement ce qui m'intéresse au-delà de ma prescription.

#### Acceptance Criteria

1. WHEN j'accède à l'application THEN le système SHALL me donner accès à un catalogue complet de tous les cours disponibles
2. WHEN je navigue dans le catalogue THEN le système SHALL afficher les cours organisés par matière, faculté et niveau
3. WHEN je consulte un cours du catalogue THEN le système SHALL indiquer s'il est recommandé pour moi ou pris par d'autres étudiants de ma faculté
4. WHEN je sélectionne un cours non-recommandé THEN le système SHALL me proposer quand même l'aperçu gratuit et le mini-quiz
5. IF je veux débloquer un cours non-recommandé THEN le système SHALL me permettre de le faire avec mes crédits cognitifs

### Requirement 10

**User Story:** En tant qu'étudiant, je veux vivre une expérience gamifiée avec une Mario Map personnalisable et des leçons interactives pour que mon apprentissage soit engageant et adapté à mes préférences visuelles.

#### Acceptance Criteria

1. WHEN j'accède à un cours débloqué THEN le système SHALL me présenter une Mario Map avec chaque node représentant une leçon
2. WHEN je configure ma Mario Map THEN le système SHALL me permettre de choisir parmi plusieurs thèmes (galaxie, aventure, forêt, ville, escalier diagonal, constellation)
3. WHEN je progresse dans un cours THEN le système SHALL déverrouiller les leçons suivantes de manière progressive sur la map
4. WHEN je clique sur un node/leçon THEN le système SHALL ouvrir la leçon avec des slides interactifs
5. WHEN je termine une leçon THEN le système SHALL marquer le node comme complété et débloquer les suivants
6. WHEN j'ouvre un cours THEN le système SHALL afficher par défaut le bloc descriptif de la dernière leçon où je me suis arrêté avec un bouton "Continuer"
7. WHEN je clique sur "Continuer" THEN le système SHALL m'amener directement à la leçon suivante à compléter
8. IF je change de thème THEN le système SHALL réorganiser visuellement la map tout en conservant ma progression

### Requirement 11

**User Story:** En tant qu'étudiant, je veux maintenir le contact avec mes mentors via WhatsApp pour un accompagnement continu et humain.

#### Acceptance Criteria

1. WHEN j'ai des questions pendant mon apprentissage THEN le système SHALL me permettre de contacter facilement un mentor via WhatsApp
2. WHEN je contacte un mentor THEN il SHALL avoir accès à mon profil et ma progression pour un accompagnement personnalisé
3. WHEN un mentor identifie de nouveaux blocages THEN il SHALL pouvoir mettre à jour ma prescription dans l'application
4. WHEN j'ai des difficultés THEN le mentor SHALL pouvoir ajuster mon chemin recommandé en temps réel
5. IF je progresse bien THEN le mentor SHALL pouvoir me proposer de nouveaux défis ou cours avancés#
## Requirement 12

**User Story:** En tant qu'étudiant, je veux suivre des leçons composées de slides interactifs avec le professeur pour que l'apprentissage soit personnel et engageant comme un cours particulier.

#### Acceptance Criteria

1. WHEN j'ouvre une leçon THEN le système SHALL me présenter une suite de slides interactifs avec le professeur visible
2. WHEN le professeur explique THEN il SHALL apparaître sur le slide pour expliquer la matière de manière manuscrite et personnalisée
3. WHEN je progresse dans les slides THEN le système SHALL intégrer des quiz interactifs pour tester ma compréhension
4. WHEN je réponds aux quiz THEN le système SHALL adapter le parcours selon mes réponses pour façonner mon apprentissage sur-mesure
5. WHEN je termine une série de slides THEN le système SHALL évaluer ma maîtrise et proposer des révisions si nécessaire
6. IF je ne comprends pas un concept THEN le système SHALL me proposer des slides supplémentaires ou un contact mentor

### Requirement 13

**User Story:** En tant qu'étudiant, je veux que les quiz intégrés dans les leçons affinent continuellement mon parcours pour que mon apprentissage soit de plus en plus personnalisé.

#### Acceptance Criteria

1. WHEN je réponds à un quiz dans une leçon THEN le système SHALL analyser mes réponses pour identifier de nouveaux blocages ou forces
2. WHEN le système détecte une lacune THEN il SHALL proposer automatiquement des slides de révision ou des leçons complémentaires
3. WHEN je maîtrise un concept THEN le système SHALL accélérer le parcours et proposer des défis plus avancés
4. WHEN mes résultats de quiz s'accumulent THEN le système SHALL mettre à jour ma prescription globale
5. IF mes performances changent significativement THEN le système SHALL suggérer de contacter un mentor pour réajuster le parcours### 
Requirement 14

**User Story:** En tant qu'étudiant, je veux avoir accès à un support WhatsApp disponible 24/7 pour que je me sente accompagné et rassuré à tout moment dans mon parcours.

#### Acceptance Criteria

1. WHEN j'ai une question ou difficulté THEN le système SHALL me permettre de contacter l'équipe via WhatsApp à tout moment
2. WHEN je contacte via WhatsApp THEN je SHALL recevoir une réponse humaine et personnalisée (pas de bot)
3. WHEN l'équipe répond THEN elle SHALL avoir accès à mon profil et progression pour un accompagnement contextualisé
4. WHEN je progresse THEN l'équipe SHALL pouvoir me féliciter et m'encourager via WhatsApp
5. IF je suis bloqué THEN l'équipe SHALL pouvoir ajuster ma prescription directement depuis WhatsApp

### Requirement 15

**User Story:** En tant qu'étudiant, je veux une interface minimaliste en noir et blanc avec des touches de couleur pour que l'expérience soit épurée et focalisée sur l'apprentissage.

#### Acceptance Criteria

1. WHEN j'utilise l'application THEN l'interface SHALL utiliser principalement du noir et blanc avec des touches de couleur stratégiques
2. WHEN je navigue THEN le design SHALL être minimaliste et épuré pour éviter les distractions
3. WHEN des éléments importants nécessitent de l'attention THEN le système SHALL utiliser des touches de couleur pour les mettre en valeur
4. WHEN je consulte les slides THEN ils SHALL apparaître manuscrits pour créer une proximité humaine
5. IF l'interface devient trop chargée THEN le système SHALL prioriser la simplicité et la lisibilité

### Requirement 16

**User Story:** En tant qu'étudiant, je veux participer à une communauté active d'étudiants pour que je puisse échanger, m'entraider et me sentir moins seul dans mon apprentissage.

#### Acceptance Criteria

1. WHEN j'accède à l'application THEN le système SHALL me donner accès à une section communauté active
2. WHEN je consulte la communauté THEN je SHALL voir les activités d'autres étudiants de ma faculté
3. WHEN j'ai des questions THEN je SHALL pouvoir les poser à la communauté et recevoir de l'aide
4. WHEN je progresse THEN mes accomplissements SHALL être partagés avec la communauté pour créer de l'émulation
5. WHEN d'autres étudiants ont des questions THEN je SHALL pouvoir les aider et gagner de la reconnaissance
6. IF je me sens isolé THEN la communauté SHALL me permettre de créer des liens avec d'autres étudiants

### Requirement 17

**User Story:** En tant qu'étudiant, je veux un outil de planification généré par IA selon mes préférences pour que mon emploi du temps soit optimisé et personnalisé.

#### Acceptance Criteria

1. WHEN je veux planifier mes études THEN le système SHALL me proposer un chat conversationnel avec l'IA
2. WHEN je discute avec l'IA THEN elle SHALL collecter mes préférences (horaires, rythme, contraintes, objectifs)
3. WHEN l'IA a mes préférences THEN elle SHALL générer automatiquement un planning personnalisé
4. WHEN le planning est créé THEN il SHALL être intégré à mon tableau de bord et exportable (ICS)
5. WHEN mes contraintes changent THEN je SHALL pouvoir rediscuter avec l'IA pour ajuster le planning
6. IF je ne respecte pas le planning THEN l'IA SHALL me proposer des ajustements bienveillants#
## Requirement 18

**User Story:** En tant qu'utilisateur, je veux une application qui respecte les standards modernes d'accessibilité, performance et sécurité pour que mon expérience soit optimale sur tous les appareils.

#### Acceptance Criteria

1. WHEN j'utilise l'application THEN elle SHALL respecter les standards WCAG 2.1 AA pour l'accessibilité
2. WHEN je navigue THEN l'application SHALL avoir des performances optimales (Core Web Vitals)
3. WHEN j'accède depuis différents appareils THEN l'interface SHALL être parfaitement responsive
4. WHEN je partage du contenu THEN l'application SHALL avoir un SEO optimisé
5. WHEN j'utilise l'application THEN mes données SHALL être sécurisées selon les standards actuels

### Requirement 19

**User Story:** En tant qu'utilisateur, je veux une interface ultra-intuitive sans surcharge visuelle pour que chaque écran soit immédiatement compréhensible et engageant.

#### Acceptance Criteria

1. WHEN j'arrive sur un écran THEN il SHALL être immédiatement compréhensible sans explication
2. WHEN je navigue THEN les transitions SHALL être naturelles et cohérentes
3. WHEN j'interagis THEN l'interface SHALL prioriser la simplicité et la hiérarchie de l'information
4. WHEN j'utilise l'application THEN elle SHALL donner envie d'être utilisée régulièrement
5. IF un écran devient complexe THEN le système SHALL privilégier la clarté sur les fonctionnalités

### Requirement 20

**User Story:** En tant qu'utilisateur futur, je veux une application préparée pour le Web 3.0 pour que je puisse bénéficier des innovations décentralisées et de la transparence blockchain.

#### Acceptance Criteria

1. WHEN l'application évolue THEN elle SHALL être préparée pour des intégrations décentralisées
2. WHEN des fonctionnalités Web 3.0 sont ajoutées THEN l'architecture SHALL supporter les wallets et interactions blockchain
3. WHEN je participe à la communauté THEN le système SHALL être orienté vers la transparence et la confiance
4. WHEN des certifications sont émises THEN elles SHALL pouvoir être vérifiables sur blockchain
5. IF des fonctionnalités décentralisées sont intégrées THEN elles SHALL maintenir la simplicité d'usage