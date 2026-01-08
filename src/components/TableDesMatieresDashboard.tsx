'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight,
  Plus, 
  Upload, 
  MessageCircle, 
  MoreHorizontal,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Calendar,
  Users,
  Mail,
  X,
  Check,
  FileText,
  Send,
  List,
  Map,
  Flag,
  Menu,
  BookOpen,
  Video,
  MessageSquare,
  Clock,
  UserPlus,
  Search,
  Copy,
  Link2,
  Crown,
  UserMinus,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import { SmartSearchPrompt } from './SmartSearchPrompt';

// ============================================================================
// TYPES
// ============================================================================
interface LearningTrackStep {
  id: string;
  status: 'done' | 'current' | 'todo';
  title: string;
}

// Types pour le module Social
interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;
}

interface TrackMember {
  user: User;
  role: 'owner' | 'member';
  joinedAt: Date;
}

interface TrackInvitation {
  id: string;
  trackId: string;
  inviterId: string;
  inviteeEmail?: string;
  inviteeName?: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
}

interface LearningTrack {
  id: string;
  name: string;
  subject: string;
  steps: LearningTrackStep[];
  unreadMessages: number;
  createdAt: Date;
  // Social fields
  ownerId: string;
  members: TrackMember[];
  invitations: TrackInvitation[];
}

interface Subject {
  id: string;
  name: string;
  color: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  name: string;
  subChapters: SubChapter[];
}

interface SubChapter {
  id: string;
  name: string;
  items: string[];
}

// ============================================================================
// MOCK DATA
// ============================================================================
const SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathématiques',
    color: '#8B5CF6',
    chapters: [
      {
        id: 'analyse',
        name: 'Analyse',
        subChapters: [
          { id: 'limites', name: 'Limites & Continuité', items: ['Définitions', 'Théorèmes', 'Exercices'] },
          { id: 'derivees', name: 'Dérivées', items: ['Règles de dérivation', 'Applications', 'Optimisation'] },
          { id: 'integrales', name: 'Intégrales', items: ['Primitives', 'Intégration par parties', 'Applications'] },
        ]
      },
      {
        id: 'algebre',
        name: 'Algèbre linéaire',
        subChapters: [
          { id: 'matrices', name: 'Matrices', items: ['Opérations', 'Déterminants', 'Inverse'] },
          { id: 'espaces', name: 'Espaces vectoriels', items: ['Bases', 'Dimension', 'Applications'] },
        ]
      },
    ]
  },
  {
    id: 'physics',
    name: 'Physique',
    color: '#3B82F6',
    chapters: [
      {
        id: 'mecanique',
        name: 'Mécanique',
        subChapters: [
          { id: 'cinematique', name: 'Cinématique', items: ['Mouvement rectiligne', 'Mouvement circulaire'] },
          { id: 'dynamique', name: 'Dynamique', items: ['Lois de Newton', 'Forces', 'Travail & Énergie'] },
        ]
      },
      {
        id: 'thermo',
        name: 'Thermodynamique',
        subChapters: [
          { id: 'premier', name: 'Premier principe', items: ['Énergie interne', 'Enthalpie'] },
          { id: 'second', name: 'Second principe', items: ['Entropie', 'Machines thermiques'] },
        ]
      },
    ]
  },
  {
    id: 'chemistry',
    name: 'Chimie',
    color: '#10B981',
    chapters: [
      {
        id: 'generale',
        name: 'Chimie générale',
        subChapters: [
          { id: 'atome', name: 'Structure atomique', items: ['Modèles', 'Configuration électronique'] },
          { id: 'liaison', name: 'Liaisons chimiques', items: ['Covalente', 'Ionique', 'Métallique'] },
        ]
      },
      {
        id: 'organique',
        name: 'Chimie organique',
        subChapters: [
          { id: 'fonctions', name: 'Fonctions organiques', items: ['Alcools', 'Acides', 'Amines'] },
        ]
      },
    ]
  },
  {
    id: 'statistics',
    name: 'Statistiques',
    color: '#EC4899',
    chapters: [
      {
        id: 'descriptive',
        name: 'Statistiques descriptives',
        subChapters: [
          { id: 'mesures', name: 'Mesures de tendance', items: ['Moyenne', 'Médiane', 'Mode'] },
          { id: 'dispersion', name: 'Mesures de dispersion', items: ['Variance', 'Écart-type'] },
        ]
      },
      {
        id: 'inferentielle',
        name: 'Statistiques inférentielles',
        subChapters: [
          { id: 'tests', name: 'Tests d\'hypothèse', items: ['Test t', 'Test chi-carré'] },
          { id: 'regression', name: 'Régression', items: ['Linéaire', 'Multiple'] },
        ]
      },
    ]
  },
  {
    id: 'informatics',
    name: 'Informatique',
    color: '#6366F1',
    chapters: [
      {
        id: 'algo',
        name: 'Algorithmique',
        subChapters: [
          { id: 'bases', name: 'Bases', items: ['Variables', 'Boucles', 'Conditions'] },
          { id: 'structures', name: 'Structures de données', items: ['Tableaux', 'Listes', 'Arbres'] },
        ]
      },
      {
        id: 'programmation',
        name: 'Programmation',
        subChapters: [
          { id: 'python', name: 'Python', items: ['Syntaxe', 'Fonctions', 'Classes'] },
        ]
      },
    ]
  },
  {
    id: 'economics',
    name: 'Économie',
    color: '#F59E0B',
    chapters: [
      {
        id: 'micro',
        name: 'Microéconomie',
        subChapters: [
          { id: 'offre', name: 'Offre & Demande', items: ['Équilibre', 'Élasticité'] },
          { id: 'marches', name: 'Structures de marché', items: ['Concurrence', 'Monopole'] },
        ]
      },
      {
        id: 'macro',
        name: 'Macroéconomie',
        subChapters: [
          { id: 'pib', name: 'PIB & Croissance', items: ['Calcul', 'Facteurs'] },
        ]
      },
    ]
  },
  {
    id: 'accounting',
    name: 'Comptabilité',
    color: '#14B8A6',
    chapters: [
      {
        id: 'generale',
        name: 'Comptabilité générale',
        subChapters: [
          { id: 'bilan', name: 'Bilan', items: ['Actif', 'Passif', 'Capitaux propres'] },
          { id: 'resultat', name: 'Compte de résultat', items: ['Charges', 'Produits'] },
        ]
      },
      {
        id: 'analytique',
        name: 'Comptabilité analytique',
        subChapters: [
          { id: 'couts', name: 'Calcul des coûts', items: ['Coûts complets', 'Coûts partiels'] },
        ]
      },
    ]
  },
];

// Mock users for search
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Marie Dupont', username: 'marie.d', email: 'marie@example.com' },
  { id: 'u2', name: 'Thomas Martin', username: 'thomas.m', email: 'thomas@example.com' },
  { id: 'u3', name: 'Sophie Bernard', username: 'sophie.b', email: 'sophie@example.com' },
  { id: 'u4', name: 'Lucas Petit', username: 'lucas.p', email: 'lucas@example.com' },
  { id: 'u5', name: 'Emma Robert', username: 'emma.r', email: 'emma@example.com' },
];

const CURRENT_USER: User = {
  id: 'current',
  name: 'Yassine',
  username: 'yassine',
  email: 'yassine@example.com'
};

const INITIAL_TRACKS: LearningTrack[] = [
  {
    id: 'lt1',
    name: 'Analyse - Intégrales',
    subject: 'math',
    steps: [
      { id: 's1', status: 'done', title: 'Introduction' },
      { id: 's2', status: 'done', title: 'Primitives' },
      { id: 's3', status: 'done', title: 'Techniques' },
      { id: 's4', status: 'current', title: 'Par parties' },
      { id: 's5', status: 'todo', title: 'Changement var.' },
      { id: 's6', status: 'todo', title: 'Applications' },
      { id: 's7', status: 'todo', title: 'Exercices' },
      { id: 's8', status: 'todo', title: 'Examen blanc' },
    ],
    unreadMessages: 2,
    createdAt: new Date(),
    ownerId: 'current',
    members: [
      { user: CURRENT_USER, role: 'owner', joinedAt: new Date() },
      { user: MOCK_USERS[0], role: 'member', joinedAt: new Date() },
    ],
    invitations: [
      { 
        id: 'inv1', 
        trackId: 'lt1', 
        inviterId: 'current', 
        inviteeEmail: 'ami@example.com',
        inviteeName: 'Mon ami',
        token: 'abc123',
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ],
  },
  {
    id: 'lt2',
    name: 'Mécanique du point',
    subject: 'physics',
    steps: [
      { id: 's1', status: 'done', title: 'Cinématique' },
      { id: 's2', status: 'done', title: 'Lois Newton' },
      { id: 's3', status: 'current', title: 'Forces' },
      { id: 's4', status: 'todo', title: 'Travail' },
      { id: 's5', status: 'todo', title: 'Énergie' },
      { id: 's6', status: 'todo', title: 'Oscillations' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [
      { user: CURRENT_USER, role: 'owner', joinedAt: new Date() },
    ],
    invitations: [],
  },
  {
    id: 'lt3',
    name: 'Algèbre linéaire - Matrices',
    subject: 'math',
    steps: [
      { id: 's1', status: 'done', title: 'Définitions' },
      { id: 's2', status: 'done', title: 'Opérations' },
      { id: 's3', status: 'done', title: 'Déterminants' },
      { id: 's4', status: 'done', title: 'Inverse' },
      { id: 's5', status: 'done', title: 'Diagonalisation' },
      { id: 's6', status: 'current', title: 'Applications' },
      { id: 's7', status: 'todo', title: 'Exercices' },
    ],
    unreadMessages: 1,
    createdAt: new Date(),
    ownerId: 'current',
    members: [
      { user: CURRENT_USER, role: 'owner', joinedAt: new Date() },
      { user: MOCK_USERS[1], role: 'member', joinedAt: new Date() },
      { user: MOCK_USERS[2], role: 'member', joinedAt: new Date() },
    ],
    invitations: [],
  },
  {
    id: 'lt4',
    name: 'Thermodynamique',
    subject: 'physics',
    steps: [
      { id: 's1', status: 'done', title: 'Concepts de base' },
      { id: 's2', status: 'current', title: 'Premier principe' },
      { id: 's3', status: 'todo', title: 'Second principe' },
      { id: 's4', status: 'todo', title: 'Entropie' },
      { id: 's5', status: 'todo', title: 'Machines thermiques' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt5',
    name: 'Chimie organique - Alcools',
    subject: 'chemistry',
    steps: [
      { id: 's1', status: 'done', title: 'Structure' },
      { id: 's2', status: 'done', title: 'Nomenclature' },
      { id: 's3', status: 'done', title: 'Propriétés' },
      { id: 's4', status: 'current', title: 'Réactions' },
      { id: 's5', status: 'todo', title: 'Synthèse' },
      { id: 's6', status: 'todo', title: 'Exercices' },
    ],
    unreadMessages: 3,
    createdAt: new Date(),
    ownerId: 'current',
    members: [
      { user: CURRENT_USER, role: 'owner', joinedAt: new Date() },
      { user: MOCK_USERS[3], role: 'member', joinedAt: new Date() },
    ],
    invitations: [],
  },
  {
    id: 'lt6',
    name: 'Statistiques descriptives',
    subject: 'statistics',
    steps: [
      { id: 's1', status: 'done', title: 'Moyenne' },
      { id: 's2', status: 'done', title: 'Médiane' },
      { id: 's3', status: 'done', title: 'Variance' },
      { id: 's4', status: 'done', title: 'Écart-type' },
      { id: 's5', status: 'done', title: 'Quartiles' },
      { id: 's6', status: 'done', title: 'Exercices' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt7',
    name: 'Python - Les bases',
    subject: 'informatics',
    steps: [
      { id: 's1', status: 'done', title: 'Variables' },
      { id: 's2', status: 'done', title: 'Conditions' },
      { id: 's3', status: 'done', title: 'Boucles' },
      { id: 's4', status: 'done', title: 'Fonctions' },
      { id: 's5', status: 'current', title: 'Listes' },
      { id: 's6', status: 'todo', title: 'Dictionnaires' },
      { id: 's7', status: 'todo', title: 'Classes' },
      { id: 's8', status: 'todo', title: 'Projet' },
    ],
    unreadMessages: 5,
    createdAt: new Date(),
    ownerId: 'current',
    members: [
      { user: CURRENT_USER, role: 'owner', joinedAt: new Date() },
      { user: MOCK_USERS[4], role: 'member', joinedAt: new Date() },
    ],
    invitations: [
      { 
        id: 'inv2', 
        trackId: 'lt7', 
        inviterId: 'current', 
        inviteeEmail: 'dev@example.com',
        inviteeName: 'Alex',
        token: 'def456',
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ],
  },
  {
    id: 'lt8',
    name: 'Microéconomie',
    subject: 'economics',
    steps: [
      { id: 's1', status: 'done', title: 'Offre & Demande' },
      { id: 's2', status: 'done', title: 'Élasticité' },
      { id: 's3', status: 'current', title: 'Équilibre' },
      { id: 's4', status: 'todo', title: 'Monopole' },
      { id: 's5', status: 'todo', title: 'Concurrence' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt9',
    name: 'Comptabilité générale',
    subject: 'accounting',
    steps: [
      { id: 's1', status: 'done', title: 'Le bilan' },
      { id: 's2', status: 'done', title: 'Compte de résultat' },
      { id: 's3', status: 'done', title: 'Écritures' },
      { id: 's4', status: 'done', title: 'TVA' },
      { id: 's5', status: 'done', title: 'Amortissements' },
      { id: 's6', status: 'current', title: 'Provisions' },
      { id: 's7', status: 'todo', title: 'Clôture' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt10',
    name: 'Limites et continuité',
    subject: 'math',
    steps: [
      { id: 's1', status: 'current', title: 'Définitions' },
      { id: 's2', status: 'todo', title: 'Théorèmes' },
      { id: 's3', status: 'todo', title: 'Calculs pratiques' },
      { id: 's4', status: 'todo', title: 'Formes indét.' },
      { id: 's5', status: 'todo', title: 'Exercices' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt11',
    name: 'Électromagnétisme',
    subject: 'physics',
    steps: [
      { id: 's1', status: 'done', title: 'Charges' },
      { id: 's2', status: 'done', title: 'Champ électrique' },
      { id: 's3', status: 'current', title: 'Potentiel' },
      { id: 's4', status: 'todo', title: 'Courant' },
      { id: 's5', status: 'todo', title: 'Magnétisme' },
      { id: 's6', status: 'todo', title: 'Induction' },
    ],
    unreadMessages: 1,
    createdAt: new Date(),
    ownerId: 'current',
    members: [
      { user: CURRENT_USER, role: 'owner', joinedAt: new Date() },
      { user: MOCK_USERS[0], role: 'member', joinedAt: new Date() },
    ],
    invitations: [],
  },
  {
    id: 'lt12',
    name: 'Liaisons chimiques',
    subject: 'chemistry',
    steps: [
      { id: 's1', status: 'done', title: 'Covalente' },
      { id: 's2', status: 'done', title: 'Ionique' },
      { id: 's3', status: 'done', title: 'Métallique' },
      { id: 's4', status: 'done', title: 'Van der Waals' },
      { id: 's5', status: 'current', title: 'Hydrogène' },
      { id: 's6', status: 'todo', title: 'Exercices' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt13',
    name: 'Tests d\'hypothèse',
    subject: 'statistics',
    steps: [
      { id: 's1', status: 'done', title: 'Principes' },
      { id: 's2', status: 'current', title: 'Test t' },
      { id: 's3', status: 'todo', title: 'Test chi-carré' },
      { id: 's4', status: 'todo', title: 'ANOVA' },
      { id: 's5', status: 'todo', title: 'Applications' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt14',
    name: 'Structures de données',
    subject: 'informatics',
    steps: [
      { id: 's1', status: 'done', title: 'Tableaux' },
      { id: 's2', status: 'done', title: 'Listes chaînées' },
      { id: 's3', status: 'done', title: 'Piles & Files' },
      { id: 's4', status: 'current', title: 'Arbres' },
      { id: 's5', status: 'todo', title: 'Graphes' },
      { id: 's6', status: 'todo', title: 'Tables de hachage' },
    ],
    unreadMessages: 2,
    createdAt: new Date(),
    ownerId: 'current',
    members: [
      { user: CURRENT_USER, role: 'owner', joinedAt: new Date() },
      { user: MOCK_USERS[1], role: 'member', joinedAt: new Date() },
    ],
    invitations: [],
  },
  {
    id: 'lt15',
    name: 'Macroéconomie',
    subject: 'economics',
    steps: [
      { id: 's1', status: 'done', title: 'PIB' },
      { id: 's2', status: 'done', title: 'Inflation' },
      { id: 's3', status: 'done', title: 'Chômage' },
      { id: 's4', status: 'done', title: 'Politique monétaire' },
      { id: 's5', status: 'current', title: 'Politique budgétaire' },
      { id: 's6', status: 'todo', title: 'Commerce international' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt16',
    name: 'Calcul des coûts',
    subject: 'accounting',
    steps: [
      { id: 's1', status: 'done', title: 'Coûts complets' },
      { id: 's2', status: 'current', title: 'Coûts partiels' },
      { id: 's3', status: 'todo', title: 'Seuil rentabilité' },
      { id: 's4', status: 'todo', title: 'Coût marginal' },
      { id: 's5', status: 'todo', title: 'Exercices' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt17',
    name: 'Suites et séries',
    subject: 'math',
    steps: [
      { id: 's1', status: 'done', title: 'Suites arithmétiques' },
      { id: 's2', status: 'done', title: 'Suites géométriques' },
      { id: 's3', status: 'done', title: 'Convergence' },
      { id: 's4', status: 'done', title: 'Séries numériques' },
      { id: 's5', status: 'done', title: 'Séries entières' },
      { id: 's6', status: 'done', title: 'Applications' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt18',
    name: 'Optique géométrique',
    subject: 'physics',
    steps: [
      { id: 's1', status: 'current', title: 'Réflexion' },
      { id: 's2', status: 'todo', title: 'Réfraction' },
      { id: 's3', status: 'todo', title: 'Miroirs' },
      { id: 's4', status: 'todo', title: 'Lentilles' },
      { id: 's5', status: 'todo', title: 'Instruments' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt19',
    name: 'Cinétique chimique',
    subject: 'chemistry',
    steps: [
      { id: 's1', status: 'done', title: 'Vitesse de réaction' },
      { id: 's2', status: 'done', title: 'Ordre de réaction' },
      { id: 's3', status: 'current', title: 'Mécanismes' },
      { id: 's4', status: 'todo', title: 'Catalyse' },
      { id: 's5', status: 'todo', title: 'Applications' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [{ user: CURRENT_USER, role: 'owner', joinedAt: new Date() }],
    invitations: [],
  },
  {
    id: 'lt20',
    name: 'Régression linéaire',
    subject: 'statistics',
    steps: [
      { id: 's1', status: 'done', title: 'Corrélation' },
      { id: 's2', status: 'done', title: 'Droite de régression' },
      { id: 's3', status: 'done', title: 'Coefficient R²' },
      { id: 's4', status: 'current', title: 'Régression multiple' },
      { id: 's5', status: 'todo', title: 'Prédictions' },
      { id: 's6', status: 'todo', title: 'Exercices' },
    ],
    unreadMessages: 0,
    createdAt: new Date(),
    ownerId: 'current',
    members: [
      { user: CURRENT_USER, role: 'owner', joinedAt: new Date() },
      { user: MOCK_USERS[2], role: 'member', joinedAt: new Date() },
    ],
    invitations: [],
  },
];

const QUICK_PILLS = [
  'Exercices intégrales',
  'Révision thermo',
  'QCM Chimie',
  'Formules méca',
];

// Navigation items for sidebar
const NAVIGATION_ITEMS = [
  { id: 'courses', label: 'Mes cours', icon: BookOpen },
  { id: 'planning', label: 'Planification', icon: Calendar },
  { id: 'study-rooms', label: 'Study Rooms', icon: Video },
  { id: 'community', label: 'Communauté', icon: Users },
  { id: 'messaging', label: 'Messages', icon: MessageCircle },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, isExternal: true },
];

// ============================================================================
// ENTRY MODULE - Zone d'entrée principale
// ============================================================================
interface EntryModuleProps {
  onOpenMenu: () => void;
  onSearch: (query: string) => void;
  selectedSubject: string | null;
  onSubjectClick: (subjectId: string) => void;
}

function EntryModule({ onOpenMenu, onSearch, selectedSubject, onSubjectClick }: EntryModuleProps) {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <div className="mb-8">
      {/* Title + Arrow */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <h1 className="font-title text-2xl md:text-3xl lg:text-4xl text-gray-900 text-center">
          What are we learning today?
        </h1>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronDown size={20} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Quick Actions Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
              >
                <button
                  onClick={() => { onOpenMenu(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <List size={18} className="text-gray-500" />
                  <span className="text-sm font-medium">Choose a subject</span>
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <Upload size={18} className="text-gray-500" />
                  <span className="text-sm font-medium">Upload a document</span>
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <MessageCircle size={18} className="text-gray-500" />
                  <span className="text-sm font-medium">Open chat</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
        <div className="relative bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 focus-within:border-gray-400 transition-colors shadow-sm">
          <div className="flex items-center px-5 py-4">
            <button type="button" className="text-gray-400 hover:text-gray-600 mr-3">
              <Plus size={22} />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a topic, upload a file, or ask a question..."
              className="flex-1 text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none text-base"
            />
            <div className="flex items-center gap-2">
              <button type="button" className="text-gray-400 hover:text-gray-600">
                <Upload size={20} />
              </button>
              <button 
                type="submit"
                className="w-9 h-9 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Quick Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {QUICK_PILLS.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => onSearch(pill)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Subject Selector */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.id}
            onClick={() => onSubjectClick(subject.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedSubject === subject.id
                ? 'text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
            }`}
            style={selectedSubject === subject.id ? { backgroundColor: subject.color } : {}}
          >
            {subject.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MODULE SOCIAL - Ajouter tes amis
// ============================================================================

// Génération d'un token unique pour les invitations
function generateInviteToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Modal de recherche et invitation d'amis
interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: LearningTrack;
  onInviteUser: (userId: string) => void;
  onCreateInvitation: (email: string, name: string) => void;
}

function AddFriendModal({ isOpen, onClose, track, onInviteUser, onCreateInvitation }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Recherche d'utilisateurs sur la plateforme
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    // Simuler une recherche
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results = MOCK_USERS.filter(
        u => u.name.toLowerCase().includes(query) ||
             u.username.toLowerCase().includes(query) ||
             (u.email && u.email.toLowerCase().includes(query))
      ).filter(u => !track.members.some(m => m.user.id === u.id));
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  }, [searchQuery, track.members]);

  // Effet pour recherche automatique
  useEffect(() => {
    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // Générer un lien d'invitation
  const handleGenerateLink = () => {
    if (!inviteEmail.trim()) return;
    const token = generateInviteToken();
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?invite=${token}&track=${track.id}`;
    setGeneratedLink(link);
    onCreateInvitation(inviteEmail, inviteName);
  };

  // Copier le lien
  const handleCopyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // Reset à la fermeture
  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowInviteForm(false);
    setInviteEmail('');
    setInviteName('');
    setGeneratedLink(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ajouter tes amis</h2>
              <p className="text-sm text-gray-500 mt-1">Pour : {track.name}</p>
            </div>
            <button onClick={handleClose} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5">
          {!showInviteForm && !generatedLink ? (
            <>
              {/* Recherche */}
              <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, username ou email..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Résultats de recherche */}
              <div className="max-h-64 overflow-y-auto">
                {isSearching ? (
                  <div className="py-8 text-center text-gray-500">
                    <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-2" />
                    Recherche...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            onInviteUser(user.id);
                            handleClose();
                          }}
                          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Inviter
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500 mb-4">Cette personne n'est pas sur la plateforme.</p>
                    <button
                      onClick={() => setShowInviteForm(true)}
                      className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Inviter par lien
                    </button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400">
                    <UserPlus size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Recherche un ami sur la plateforme</p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Bouton invitation externe */}
              <button
                onClick={() => setShowInviteForm(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                <Link2 size={18} />
                <span className="font-medium">Créer un lien d'invitation</span>
              </button>
            </>
          ) : !generatedLink ? (
            /* Formulaire d'invitation par lien */
            <div>
              <button
                onClick={() => setShowInviteForm(false)}
                className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
              >
                ← Retour
              </button>
              
              <h3 className="font-semibold text-gray-900 mb-4">Inviter par lien</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom (optionnel)
                  </label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Prénom de ton ami"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateLink}
                disabled={!inviteEmail.trim()}
                className="w-full mt-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Générer le lien d'invitation
              </button>
            </div>
          ) : (
            /* Lien généré */
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00c2ff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-[#00c2ff]" />
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-2">Lien créé !</h3>
              <p className="text-sm text-gray-500 mb-6">
                Partage ce lien avec {inviteName || 'ton ami'} pour l'inviter à rejoindre "{track.name}"
              </p>
              
              <div className="bg-gray-50 p-3 rounded-xl mb-4">
                <p className="text-sm text-gray-600 break-all font-mono">{generatedLink}</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                  {linkCopied ? 'Copié !' : 'Copier le lien'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Panneau des membres du Learning Track
interface MembersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  track: LearningTrack;
  currentUserId: string;
  onRemoveMember: (userId: string) => void;
  onCancelInvitation: (invitationId: string) => void;
  onResendInvitation: (invitationId: string) => void;
  onAddFriend: () => void;
}

function MembersPanel({ 
  isOpen, 
  onClose, 
  track, 
  currentUserId,
  onRemoveMember,
  onCancelInvitation,
  onResendInvitation,
  onAddFriend
}: MembersPanelProps) {
  const isOwner = track.ownerId === currentUserId;
  const pendingInvitations = track.invitations.filter(inv => inv.status === 'pending');

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Membres</h2>
            <p className="text-sm text-gray-500 mt-1">{track.name}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Section Membres */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{track.members.length} membre{track.members.length > 1 ? 's' : ''}</h3>
          </div>
          
          <div className="space-y-3">
            {track.members.map((member) => (
              <div
                key={member.user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    {member.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{member.user.name}</p>
                      {member.role === 'owner' && (
                        <Crown size={14} className="text-amber-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">@{member.user.username}</p>
                  </div>
                </div>
                
                {isOwner && member.role !== 'owner' && (
                  <button
                    onClick={() => onRemoveMember(member.user.id)}
                    className="w-9 h-9 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                    title="Retirer du Learning Track"
                  >
                    <UserMinus size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section Invitations en attente */}
        {pendingInvitations.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {pendingInvitations.length} invitation{pendingInvitations.length > 1 ? 's' : ''} en attente
            </h3>
            
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="p-3 bg-amber-50 border border-amber-100 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold">
                        {(invitation.inviteeName || invitation.inviteeEmail || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {invitation.inviteeName || 'Invitation envoyée'}
                        </p>
                        <p className="text-sm text-gray-500">{invitation.inviteeEmail}</p>
                      </div>
                    </div>
                    
                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onResendInvitation(invitation.id)}
                          className="w-8 h-8 rounded-lg hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors"
                          title="Renvoyer le lien"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => onCancelInvitation(invitation.id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                          title="Annuler l'invitation"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    Expire le {invitation.expiresAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Ajouter des amis */}
      {isOwner && (
        <div className="p-5 border-t border-gray-100">
          <button
            onClick={onAddFriend}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            <UserPlus size={18} />
            Ajouter des amis
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// TRACK CARD - Carte Learning Track
// ============================================================================
interface TrackCardProps {
  track: LearningTrack;
  onOpenMessages: (id: string) => void;
  onOpenStudyRoom: (id: string) => void;
  onOpenPlanning: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onOpenSocial: (id: string) => void;
}

function TrackCard({ 
  track, 
  onOpenMessages,
  onOpenStudyRoom,
  onOpenPlanning,
  onOpenDetail,
  onOpenSocial,
}: TrackCardProps) {
  const subject = SUBJECTS.find(s => s.id === track.subject);
  const progress = track.steps.filter(s => s.status === 'done').length;
  const total = track.steps.length;
  const memberCount = track.members.length;
  const pendingCount = track.invitations.filter(i => i.status === 'pending').length;

  return (
    <motion.div
      layout
      className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-gray-200 hover:-translate-y-1"
      onClick={() => onOpenDetail(track.id)}
    >
      {/* Top Row: Info + Actions */}
      <div className="flex items-center justify-between mb-5">
        {/* Left: Subject indicator + Name */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-1.5 h-12 rounded-full flex-shrink-0 bg-gray-900" />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-gray-700 transition-colors">{track.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                {subject?.name}
              </span>
              <span>·</span>
              <span>{progress}/{total} étapes</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {memberCount}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onOpenSocial(track.id)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
            title="Ajouter des amis"
          >
            <UserPlus size={18} />
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {pendingCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => onOpenMessages(track.id)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
            title="Messages"
          >
            <Mail size={18} />
            {track.unreadMessages > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#00c2ff] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {track.unreadMessages}
              </span>
            )}
          </button>
          <button 
            onClick={() => onOpenStudyRoom(track.id)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
            title="Study Room"
          >
            <Video size={18} />
          </button>
          <button 
            onClick={() => onOpenPlanning(track.id)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
            title="Planning"
          >
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Progress Steps - Full Width with better styling */}
      <div className="flex items-center w-full bg-gray-50 rounded-xl p-4">
        {track.steps.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                step.status === 'done' 
                  ? 'bg-gray-900 shadow-md' 
                  : step.status === 'current'
                    ? 'bg-[#00c2ff] ring-4 ring-[#00c2ff]/20 shadow-md'
                    : 'bg-gray-200'
              }`}
              title={step.title}
            >
              {step.status === 'done' && <Check size={16} className="text-white" />}
            </div>
            {idx < track.steps.length - 1 && (
              <div className={`flex-1 h-1.5 mx-2 rounded-full ${step.status === 'done' ? 'bg-gray-900' : 'bg-gray-200'}`} />
            )}
            {idx === track.steps.length - 1 && (
              <div className="ml-3 flex items-center gap-1.5 text-gray-400">
                <Flag size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// TRACK LIST - Liste des Learning Tracks
// ============================================================================
interface TrackListProps {
  tracks: LearningTrack[];
  onReorder: (tracks: LearningTrack[]) => void;
  onOpenMessages: (id: string) => void;
  onOpenStudyRoom: (id: string) => void;
  onOpenPlanning: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onOpenSocial: (id: string) => void;
  onAddTrack: () => void;
}

function TrackList({ 
  tracks, 
  onReorder, 
  onOpenMessages,
  onOpenStudyRoom,
  onOpenPlanning,
  onOpenDetail,
  onOpenSocial,
  onAddTrack 
}: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl">
        <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Plus size={32} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">Aucun Learning Track</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Crée ton premier parcours d'apprentissage personnalisé</p>
        <button
          onClick={onAddTrack}
          className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
        >
          Créer un Learning Track
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-title text-2xl text-gray-900">Les learning tracks conçus pour toi</h2>
        <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600">{tracks.length} track{tracks.length > 1 ? 's' : ''}</span>
      </div>

      <Reorder.Group axis="y" values={tracks} onReorder={onReorder} className="space-y-4">
        {tracks.map((track) => (
          <Reorder.Item key={track.id} value={track}>
            <TrackCard
              track={track}
              onOpenMessages={onOpenMessages}
              onOpenStudyRoom={onOpenStudyRoom}
              onOpenPlanning={onOpenPlanning}
              onOpenDetail={onOpenDetail}
              onOpenSocial={onOpenSocial}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add Track Button - Floating + */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onAddTrack}
          className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-110 hover:rotate-90"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// BROWSER - Navigateur Mastery Program
// ============================================================================
interface BrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToTrack: (subject: string, chapter: string, subChapter: string, item: string, trackId?: string) => void;
  existingTracks: LearningTrack[];
}

function Browser({ isOpen, onClose, onAddToTrack, existingTracks }: BrowserProps) {
  const [step, setStep] = useState<'subject' | 'chapter' | 'subchapter' | 'item' | 'action'>('subject');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedSubChapter, setSelectedSubChapter] = useState<SubChapter | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const reset = () => {
    setStep('subject');
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedSubChapter(null);
    setSelectedItem(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Browse Mastery Programs</h2>
            <p className="text-sm text-gray-500">
              {step === 'subject' && 'Choose a subject'}
              {step === 'chapter' && `${selectedSubject?.name} > Choose chapter`}
              {step === 'subchapter' && `${selectedChapter?.name} > Choose topic`}
              {step === 'item' && `${selectedSubChapter?.name} > Choose item`}
              {step === 'action' && 'What do you want to do?'}
            </p>
          </div>
          <button onClick={handleClose} className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {/* Step: Subject */}
          {step === 'subject' && (
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => { setSelectedSubject(subject); setStep('chapter'); }}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-400 text-left transition-colors"
                >
                  <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: subject.color }} />
                  <span className="font-semibold text-gray-900">{subject.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step: Chapter */}
          {step === 'chapter' && selectedSubject && (
            <div className="space-y-2">
              <button onClick={() => setStep('subject')} className="text-sm text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-1">
                ← Back
              </button>
              {selectedSubject.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => { setSelectedChapter(chapter); setStep('subchapter'); }}
                  className="w-full p-4 rounded-xl border border-gray-200 hover:border-gray-400 text-left transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{chapter.name}</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {/* Step: SubChapter */}
          {step === 'subchapter' && selectedChapter && (
            <div className="space-y-2">
              <button onClick={() => setStep('chapter')} className="text-sm text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-1">
                ← Back
              </button>
              {selectedChapter.subChapters.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => { setSelectedSubChapter(sub); setStep('item'); }}
                  className="w-full p-4 rounded-xl border border-gray-200 hover:border-gray-400 text-left transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{sub.name}</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {/* Step: Item */}
          {step === 'item' && selectedSubChapter && (
            <div className="space-y-2">
              <button onClick={() => setStep('subchapter')} className="text-sm text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-1">
                ← Back
              </button>
              {selectedSubChapter.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedItem(item); setStep('action'); }}
                  className="w-full p-4 rounded-xl border border-gray-200 hover:border-gray-400 text-left transition-colors"
                >
                  <span className="font-medium text-gray-900">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step: Action */}
          {step === 'action' && (
            <div className="space-y-4">
              <button onClick={() => setStep('item')} className="text-sm text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-1">
                ← Back
              </button>
              
              <div className="p-4 bg-gray-50 rounded-xl mb-4">
                <p className="text-sm text-gray-500 mb-1">Selected:</p>
                <p className="font-semibold text-gray-900">{selectedSubject?.name} → {selectedChapter?.name} → {selectedSubChapter?.name} → {selectedItem}</p>
              </div>

              <button
                onClick={() => { onAddToTrack(selectedSubject!.id, selectedChapter!.id, selectedSubChapter!.id, selectedItem!); handleClose(); }}
                className="w-full p-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Create new Learning Track
              </button>

              {existingTracks.length > 0 && (
                <>
                  <p className="text-center text-gray-400 text-sm">or add to existing track</p>
                  <div className="space-y-2">
                    {existingTracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => { onAddToTrack(selectedSubject!.id, selectedChapter!.id, selectedSubChapter!.id, selectedItem!, track.id); handleClose(); }}
                        className="w-full p-3 border border-gray-200 rounded-xl text-left hover:border-gray-400 transition-colors"
                      >
                        <span className="font-medium text-gray-700">{track.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// CREATE TRACK MODAL
// ============================================================================
interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, subject: string, source: string, steps: number) => void;
}

function CreateTrackModal({ isOpen, onClose, onCreate }: CreateTrackModalProps) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [source, setSource] = useState<'diagnostic' | 'manual' | 'document'>('manual');
  const [steps, setSteps] = useState(8);

  const handleCreate = () => {
    onCreate(name || `Learning Track ${Date.now()}`, subject || 'math', source, steps);
    setName('');
    setSubject('');
    setSource('manual');
    setSteps(8);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Create Learning Track</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Learning Track"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    subject === s.id ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={subject === s.id ? { backgroundColor: s.color } : {}}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <div className="flex gap-2">
              {[
                { id: 'diagnostic', label: 'Diagnostic' },
                { id: 'manual', label: 'Manual' },
                { id: 'document', label: 'Document' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSource(s.id as 'diagnostic' | 'manual' | 'document')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    source === s.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of steps: {steps}</label>
            <input
              type="range"
              min="4"
              max="12"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleCreate} className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">
            Create
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// CHAT PANEL
// ============================================================================
interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

function ChatPanel({ isOpen, onClose, context }: ChatPanelProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', content: `I understand you're asking about "${input}". Let me help you with that...` }]);
    }, 500);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">Chat</h3>
          {context && <p className="text-sm text-gray-500">{context}</p>}
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 py-8">Start a conversation...</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
          />
          <button onClick={handleSend} className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-gray-800">
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MASTERY PROGRAMS SECTION - Premium MasterClass Style
// 3 niveaux: Programmes (Mastery) → Cours (Learning Tracks) → Leçons
// ============================================================================
interface MasteryProgramsSectionProps {
  onSelectSubject: (subjectId: string) => void;
  darkMode?: boolean;
}

function MasteryProgramsSection({ onSelectSubject, darkMode = false }: MasteryProgramsSectionProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  const currentSubject = SUBJECTS.find(s => s.id === selectedSubject);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <div className="px-6 md:px-10 lg:px-12 py-12">
      {/* Hero Header - MasterClass Style */}
      <div className="mb-12">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#00c2ff] font-medium text-sm tracking-widest uppercase mb-3"
        >
          Catalogue complet
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-title text-4xl md:text-5xl !text-white mb-4"
        >
          Explorer les programmes
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg max-w-2xl"
        >
          Choisis un programme pour découvrir ses cours et leçons
        </motion.p>
      </div>

      {/* Niveau 1: Programmes (Mastery Programs) - Cards cinématiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
        {SUBJECTS.map((subject, index) => {
          const isSelected = selectedSubject === subject.id;
          const totalLessons = subject.chapters.reduce((acc, ch) => acc + ch.subChapters.length, 0);
          return (
            <motion.button
              key={subject.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedSubject(isSelected ? null : subject.id);
                setExpandedCourses([]);
                onSelectSubject(subject.id);
              }}
              className={`relative p-4 rounded-xl transition-all duration-300 text-left group overflow-hidden ${
                isSelected 
                  ? 'bg-white ring-2 ring-[#00c2ff] shadow-[0_0_30px_rgba(34,211,238,0.3)]'
                  : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800'
              }`}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${!isSelected ? 'bg-gradient-to-br from-[#00c2ff]/5 to-transparent' : ''}`} />
              
              <div className="relative z-10">
                <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-gray-900' : 'text-white'}`}>
                  {subject.name}
                </div>
                <div className={`text-xs ${isSelected ? 'text-gray-500' : 'text-gray-400'}`}>
                  {subject.chapters.length} cours · {totalLessons} leçons
                </div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div 
                  layoutId="selectedIndicator"
                  className="absolute top-2 right-2 w-5 h-5 bg-[#00c2ff] rounded-full flex items-center justify-center"
                >
                  <Check size={12} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Toggle Vue - Minimaliste */}
      <AnimatePresence>
        {currentSubject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-end mb-6"
          >
            <div className="flex bg-gray-800/50 rounded-full p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'list' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'
                }`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'map' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'
                }`}
              >
                Map
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Niveau 2 & 3: Cours (Learning Tracks) et Leçons */}
      <AnimatePresence mode="wait">
        {currentSubject && (
          <motion.div
            key={currentSubject.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="rounded-2xl overflow-hidden bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm"
          >
            {viewMode === 'list' ? (
              /* Vue Liste - Cours & Leçons */
              <div className="divide-y divide-gray-700/50">
                {currentSubject.chapters.map((course, courseIndex) => {
                  const isExpanded = expandedCourses.includes(course.id);
                  return (
                    <motion.div 
                      key={course.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: courseIndex * 0.1 }}
                    >
                      {/* Niveau 2: Cours Header */}
                      <button
                        onClick={() => toggleCourse(course.id)}
                        className="w-full flex items-center justify-between p-6 transition-all group hover:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-600 group-hover:border-[#00c2ff]/50 transition-colors">
                            <span className="text-white font-bold text-lg">{courseIndex + 1}</span>
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-lg text-white group-hover:text-[#00c2ff] transition-colors">
                              {course.name}
                            </h4>
                            <p className="text-gray-400 text-sm mt-0.5">
                              {course.subChapters.length} leçons
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">
                            Learning Track
                          </span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown size={20} className="text-gray-400" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Niveau 3: Leçons */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 space-y-3">
                              {course.subChapters.map((lesson, lessonIndex) => (
                                <motion.div 
                                  key={lesson.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: lessonIndex * 0.05 }}
                                  className="group/lesson relative pl-16"
                                >
                                  {/* Connector line */}
                                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-700" />
                                  <div className="absolute left-[21px] top-6 w-3 h-3 rounded-full bg-gray-700 group-hover/lesson:bg-[#00c2ff] transition-colors" />
                                  
                                  <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800 transition-all cursor-pointer">
                                    <div className="flex items-start justify-between mb-3">
                                      <h5 className="font-semibold text-white group-hover/lesson:text-[#00c2ff] transition-colors">
                                        {lesson.name}
                                      </h5>
                                      <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                                        Leçon {lessonIndex + 1}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {lesson.items.map((item, idx) => (
                                        <span 
                                          key={idx}
                                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200 hover:bg-[#00c2ff]/20 hover:text-[#00c2ff] transition-colors cursor-pointer"
                                        >
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
            /* Vue Mind Map - Arbre horizontal style */
            <div className="p-8 min-h-[600px] bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 relative overflow-x-auto">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '30px 30px'
                }} />
              </div>
              
              {/* Mind Map Tree Structure */}
              <div className="relative min-w-[1200px] py-8">
                <div className="flex items-start gap-0">
                  
                  {/* Niveau 1: Racine (Programme) */}
                  <div className="flex items-center">
                    <motion.div 
                      initial={{ scale: 0, x: -50 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="px-6 py-4 bg-gray-700 border-2 border-gray-600 rounded-xl text-white font-bold text-sm shadow-lg whitespace-nowrap"
                    >
                      {currentSubject.name}
                    </motion.div>
                    
                    {/* Ligne de connexion vers les chapitres */}
                    <svg className="w-12 h-4 flex-shrink-0" viewBox="0 0 48 16">
                      <path d="M0,8 Q24,8 48,8" stroke="#4B5563" strokeWidth="2" fill="none" />
                    </svg>
                  </div>

                  {/* Niveau 2 & 3: Chapitres et Leçons */}
                  <div className="flex flex-col gap-6">
                    {currentSubject.chapters.map((chapter, chapterIdx) => (
                      <motion.div 
                        key={chapter.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: chapterIdx * 0.1 }}
                        className="flex items-start"
                      >
                        {/* Chapitre Node */}
                        <div className="flex items-center">
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            className="px-5 py-3 bg-emerald-700 border border-emerald-600 rounded-xl text-white font-semibold text-sm shadow-md cursor-pointer hover:bg-emerald-600 transition-colors whitespace-nowrap"
                          >
                            {chapter.name}
                          </motion.div>
                          
                          {chapter.subChapters.length > 0 && (
                            <>
                              {/* Connecteur petit */}
                              <div className="w-4 h-px bg-gray-600 flex-shrink-0" />
                              <div className="text-gray-500 text-xs mx-1">{'<'}</div>
                            </>
                          )}
                        </div>

                        {/* Niveau 3: Leçons */}
                        {chapter.subChapters.length > 0 && (
                          <div className="flex flex-col gap-3 ml-2">
                            {chapter.subChapters.map((lesson, lessonIdx) => (
                              <motion.div 
                                key={lesson.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: chapterIdx * 0.1 + lessonIdx * 0.05 }}
                                className="flex items-center"
                              >
                                {/* Leçon Node */}
                                <div className="flex items-center">
                                  <motion.div 
                                    whileHover={{ scale: 1.03 }}
                                    className="px-4 py-2 bg-emerald-800/80 border border-emerald-700/60 rounded-lg text-white text-sm cursor-pointer hover:bg-emerald-700 transition-colors whitespace-nowrap"
                                  >
                                    {lesson.name}
                                  </motion.div>
                                  
                                  {lesson.items.length > 0 && (
                                    <>
                                      <div className="w-3 h-px bg-gray-600 flex-shrink-0" />
                                      <div className="text-gray-500 text-xs mx-1">{'<'}</div>
                                    </>
                                  )}
                                </div>

                                {/* Niveau 4: Items */}
                                {lesson.items.length > 0 && (
                                  <div className="flex flex-wrap gap-2 ml-2">
                                    {lesson.items.map((item, itemIdx) => (
                                      <motion.div
                                        key={itemIdx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: chapterIdx * 0.1 + lessonIdx * 0.05 + itemIdx * 0.02 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="px-3 py-1.5 bg-emerald-900/60 border border-emerald-800/50 rounded-lg text-emerald-200 text-xs cursor-pointer hover:bg-emerald-800 hover:text-white transition-all"
                                      >
                                        {item}
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
export function TableDesMatieresDashboard() {
  const [tracks, setTracks] = useState<LearningTrack[]>(INITIAL_TRACKS);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string>();
  
  // État collapsed/expanded pour le flow initial
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Header/Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('courses');
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  
  // Social state
  const [socialTrackId, setSocialTrackId] = useState<string | null>(null);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(false);
  
  // Click outside to close settings
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track Actions
  const handleReorder = useCallback((newTracks: LearningTrack[]) => {
    setTracks(newTracks);
  }, []);

  const handleRename = useCallback((id: string, name: string) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, name } : t));
  }, [tracks]);

  const handleDelete = useCallback((id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
  }, [tracks]);

  const handleMoveUp = useCallback((id: string) => {
    const idx = tracks.findIndex(t => t.id === id);
    if (idx > 0) {
      const newTracks = [...tracks];
      [newTracks[idx - 1], newTracks[idx]] = [newTracks[idx], newTracks[idx - 1]];
      setTracks(newTracks);
    }
  }, [tracks]);

  const handleMoveDown = useCallback((id: string) => {
    const idx = tracks.findIndex(t => t.id === id);
    if (idx < tracks.length - 1) {
      const newTracks = [...tracks];
      [newTracks[idx], newTracks[idx + 1]] = [newTracks[idx + 1], newTracks[idx]];
      setTracks(newTracks);
    }
  }, [tracks]);

  const handleOpenMessages = useCallback((id: string) => {
    const track = tracks.find(t => t.id === id);
    setChatContext(`Messages for: ${track?.name}`);
    setIsChatOpen(true);
  }, [tracks]);

  const handleOpenStudyRoom = useCallback((id: string) => {
    console.log('Open Study Room for:', id);
  }, []);

  const handleOpenPlanning = useCallback((id: string) => {
    console.log('Open Planning for:', id);
  }, []);

  const handleOpenDetail = useCallback((id: string) => {
    console.log('Open Detail for:', id);
  }, []);

  const handleCreateTrack = useCallback((name: string, subject: string, source: string, stepCount: number) => {
    const steps: LearningTrackStep[] = Array.from({ length: stepCount }, (_, i) => ({
      id: `step-${Date.now()}-${i}`,
      status: 'todo' as const,
      title: `Step ${i + 1}`
    }));
    steps[0].status = 'current';

    const newTrack: LearningTrack = {
      id: `lt-${Date.now()}`,
      name,
      subject,
      steps,
      unreadMessages: 0,
      createdAt: new Date()
    };
    setTracks([...tracks, newTrack]);
  }, [tracks]);

  const handleAddFromBrowser = useCallback((subject: string, chapter: string, subChapter: string, item: string, trackId?: string) => {
    if (trackId) {
      // Add to existing track
      console.log('Add to existing track:', trackId);
    } else {
      // Create new track
      const subjectData = SUBJECTS.find(s => s.id === subject);
      const chapterData = subjectData?.chapters.find(c => c.id === chapter);
      const subChapterData = chapterData?.subChapters.find(sc => sc.id === subChapter);
      
      handleCreateTrack(
        `${subjectData?.name} - ${subChapterData?.name}`,
        subject,
        'manual',
        8
      );
    }
  }, [handleCreateTrack]);

  const handleSearch = useCallback((query: string) => {
    console.log('Search:', query);
    // TODO: Implement search functionality
  }, []);

  const handleSubjectClick = useCallback((subjectId: string) => {
    setSelectedSubject(selectedSubject === subjectId ? null : subjectId);
  }, [selectedSubject]);

  // Social Handlers
  const handleOpenSocial = useCallback((trackId: string) => {
    setSocialTrackId(trackId);
    setIsMembersPanelOpen(true);
  }, []);

  const handleInviteUser = useCallback((userId: string) => {
    if (!socialTrackId) return;
    
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) return;

    // Ajouter l'utilisateur comme membre
    setTracks(tracks.map(t => {
      if (t.id !== socialTrackId) return t;
      
      // Vérifier s'il n'est pas déjà membre
      if (t.members.some(m => m.user.id === userId)) return t;
      
      return {
        ...t,
        members: [...t.members, { user, role: 'member', joinedAt: new Date() }]
      };
    }));
  }, [socialTrackId, tracks]);

  const handleCreateInvitation = useCallback((email: string, name: string) => {
    if (!socialTrackId) return;

    const newInvitation: TrackInvitation = {
      id: `inv-${Date.now()}`,
      trackId: socialTrackId,
      inviterId: CURRENT_USER.id,
      inviteeEmail: email,
      inviteeName: name,
      token: generateInviteToken(),
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    };

    setTracks(tracks.map(t => {
      if (t.id !== socialTrackId) return t;
      return {
        ...t,
        invitations: [...t.invitations, newInvitation]
      };
    }));
  }, [socialTrackId, tracks]);

  const handleRemoveMember = useCallback((userId: string) => {
    if (!socialTrackId) return;

    setTracks(tracks.map(t => {
      if (t.id !== socialTrackId) return t;
      return {
        ...t,
        members: t.members.filter(m => m.user.id !== userId)
      };
    }));
  }, [socialTrackId, tracks]);

  const handleCancelInvitation = useCallback((invitationId: string) => {
    if (!socialTrackId) return;

    setTracks(tracks.map(t => {
      if (t.id !== socialTrackId) return t;
      return {
        ...t,
        invitations: t.invitations.map(inv => 
          inv.id === invitationId ? { ...inv, status: 'cancelled' as const } : inv
        )
      };
    }));
  }, [socialTrackId, tracks]);

  const handleResendInvitation = useCallback((invitationId: string) => {
    // Dans un vrai système, on renverrait l'email ou régénérerait le lien
    console.log('Resend invitation:', invitationId);
  }, []);

  const socialTrack = tracks.find(t => t.id === socialTrackId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré bord à bord - pleine largeur */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between relative h-[72px] md:h-[85px]">
            {/* Left - Logo */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="relative h-[55px] w-[120px] md:h-[85px] md:w-[340px]">
                <Image 
                  src="/brand/sms-logo2.svg" 
                  alt="Science Made Simple"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            {/* Right - Timer + Inviter + Avatar */}
            <div className="flex items-center gap-4">
              {/* Timer - Style urgence */}
              <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-full border-2 border-gray-300 animate-pulse">
                <Clock size={22} className="text-gray-700" />
                <span className="text-xl font-bold text-gray-900 tabular-nums tracking-tight">00:00:00</span>
              </div>

              {/* Bouton Inviter */}
              <button
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
              >
                <Users size={16} />
                <span>Inviter</span>
              </button>

              {/* Profil utilisateur avec paramètres */}
              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold hover:bg-gray-800 transition-colors"
                >
                  Y
                </button>

                {/* Dropdown profil + paramètres */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6 w-80 md:w-80 z-50"
                    >
                      {/* Header profil */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                            Y
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">Yassine</h3>
                            <p className="text-xs text-gray-500">Étudiant</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowSettings(false)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>

                      <hr className="border-gray-100 mb-4" />

                      <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                          <BookOpen size={18} />
                          <span className="text-sm font-medium">Mon profil</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                          <Calendar size={18} />
                          <span className="text-sm font-medium">Paramètres</span>
                        </button>
                        <hr className="border-gray-100" />
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                          <X size={18} />
                          <span className="text-sm font-medium">Déconnexion</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar simplifiée pour desktop - fixée sous le header */}
        <nav className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed left-0 top-[85px] h-[calc(100vh-85px)] z-30">
          <div className="p-6">
            <div className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isExternal) {
                        window.open('https://wa.me/33123456789', '_blank');
                      } else {
                        setActiveSection(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      item.isExternal
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : isActive
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Sidebar */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="relative h-[40px] w-[120px]">
                      <Image 
                        src="/brand/sms-logo2.svg" 
                        alt="Science Made Simple"
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                    <button 
                      onClick={() => setSidebarOpen(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {NAVIGATION_ITEMS.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = activeSection === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.isExternal) {
                              window.open('https://wa.me/33123456789', '_blank');
                            } else {
                              setActiveSection(item.id);
                            }
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                            item.isExternal
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : isActive
                              ? 'bg-black text-white' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <IconComponent size={20} />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 mt-[72px] md:mt-[85px]">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              /* Vue Collapsed - Search Prompt centré avec bouton */
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4 }}
                className="min-h-[calc(100vh-85px)] bg-gray-900 flex flex-col items-center justify-center"
              >
                <div className="w-full max-w-4xl px-6 md:px-10">
                  <SmartSearchPrompt
                    onSearch={(query) => {
                      handleSearch(query);
                      setIsExpanded(true);
                    }}
                    onProgramSelect={(programId) => {
                      setSelectedSubject(programId);
                    }}
                    userName="Yassine"
                    compact={false}
                    darkMode={true}
                  />
                  
                  {/* Bouton "Voir mes learning tracks" */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mt-12"
                  >
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white hover:text-gray-900 transition-all duration-300"
                    >
                      <span>Voir mes learning tracks</span>
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* Vue Expanded - Page complète */
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Section 1: Search Bar - Dark Background (compact) */}
                <div className="bg-gray-900 py-10">
                  <div className="w-full px-6 md:px-10 lg:px-12">
                    <SmartSearchPrompt
                      onSearch={handleSearch}
                      onProgramSelect={(programId) => {
                        setSelectedSubject(programId);
                      }}
                      userName="Yassine"
                      compact={true}
                      darkMode={true}
                    />
                  </div>
                </div>

                {/* Section 2: Learning Tracks - Light Background */}
                <div className="bg-gray-50 py-12">
                  <div className="w-full px-6 md:px-10 lg:px-12">
                    <TrackList
                      tracks={tracks}
                      onReorder={handleReorder}
                      onOpenMessages={handleOpenMessages}
                      onOpenStudyRoom={handleOpenStudyRoom}
                      onOpenPlanning={handleOpenPlanning}
                      onOpenDetail={handleOpenDetail}
                      onOpenSocial={handleOpenSocial}
                      onAddTrack={() => setIsCreateModalOpen(true)}
                    />
                  </div>
                </div>

                {/* Section 3: Mastery Programs - Dark Background */}
                <div className="bg-gray-900 py-16">
                  <div className="w-full px-6 md:px-10 lg:px-12">
                    <MasteryProgramsSection onSelectSubject={handleSubjectClick} darkMode={true} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals & Panels */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateTrackModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreateTrack}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            context={chatContext}
          />
        )}
      </AnimatePresence>

      {/* Social: Add Friend Modal */}
      <AnimatePresence>
        {isAddFriendModalOpen && socialTrack && (
          <AddFriendModal
            isOpen={isAddFriendModalOpen}
            onClose={() => setIsAddFriendModalOpen(false)}
            track={socialTrack}
            onInviteUser={handleInviteUser}
            onCreateInvitation={handleCreateInvitation}
          />
        )}
      </AnimatePresence>

      {/* Social: Members Panel */}
      <AnimatePresence>
        {isMembersPanelOpen && socialTrack && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setIsMembersPanelOpen(false)}
            />
            <MembersPanel
              isOpen={isMembersPanelOpen}
              onClose={() => setIsMembersPanelOpen(false)}
              track={socialTrack}
              currentUserId={CURRENT_USER.id}
              onRemoveMember={handleRemoveMember}
              onCancelInvitation={handleCancelInvitation}
              onResendInvitation={handleResendInvitation}
              onAddFriend={() => {
                setIsMembersPanelOpen(false);
                setIsAddFriendModalOpen(true);
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
