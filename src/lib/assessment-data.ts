import { Atom, Calculator, Zap, Thermometer, Box, Activity, Microscope, Scale, Beaker, PieChart, TrendingUp, DollarSign } from 'lucide-react';

export type TopicId = string;

export interface Topic {
  id: TopicId;
  label: string;
  icon: any; // Lucide icon
  category: 'physics' | 'math' | 'chemistry' | 'economy' | 'stats';
}

export interface Question {
  id: string;
  topicIds: TopicId[];
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export const TOPICS: Topic[] = [
  // Physics
  { id: 'mech', label: 'Mécanique Classique', icon: Box, category: 'physics' },
  { id: 'elec', label: 'Électricité & Magnétisme', icon: Zap, category: 'physics' },
  { id: 'thermo', label: 'Thermodynamique', icon: Thermometer, category: 'physics' },
  { id: 'waves', label: 'Ondes & Optique', icon: Activity, category: 'physics' },
  { id: 'quantum', label: 'Physique Quantique', icon: Atom, category: 'physics' },
  
  // Math
  { id: 'calc', label: 'Analyse (Calculus)', icon: Scale, category: 'math' },
  { id: 'alg', label: 'Algèbre Linéaire', icon: Calculator, category: 'math' },
  
  // Chemistry
  { id: 'org', label: 'Chimie Organique', icon: Microscope, category: 'chemistry' },
  { id: 'atom_chem', label: 'Atomistique', icon: Atom, category: 'chemistry' },
  { id: 'acid', label: 'Acides & Bases', icon: Beaker, category: 'chemistry' },

  // Stats/Eco
  { id: 'prob', label: 'Probabilités', icon: PieChart, category: 'stats' },
  { id: 'micro', label: 'Microéconomie', icon: TrendingUp, category: 'economy' },
  { id: 'macro', label: 'Macroéconomie', icon: DollarSign, category: 'economy' },
];

export const QUESTIONS: Question[] = [
  // Mécanique
  {
    id: 'q1',
    topicIds: ['mech'],
    difficulty: 'easy',
    text: "Si la somme des forces extérieures appliquées à un système est nulle, que peut-on dire de sa quantité de mouvement ?",
    options: [
      "Elle est nulle",
      "Elle est constante",
      "Elle augmente linéairement",
      "Elle diminue exponentiellement"
    ],
    correctAnswer: 1,
    explanation: "C'est la première loi de Newton (principe d'inertie) généralisée : dp/dt = Somme(F_ext) = 0, donc p est constante."
  },
  {
    id: 'q2',
    topicIds: ['mech'],
    difficulty: 'medium',
    text: "Dans un choc élastique, quelle grandeur est conservée ?",
    options: [
      "Uniquement la quantité de mouvement",
      "Uniquement l'énergie cinétique",
      "La quantité de mouvement ET l'énergie cinétique",
      "L'énergie mécanique totale (potentielle + cinétique)"
    ],
    correctAnswer: 2,
    explanation: "Par définition, un choc élastique conserve l'énergie cinétique globale du système, en plus de la quantité de mouvement qui est toujours conservée dans un système isolé."
  },
  // Électricité
  {
    id: 'q3',
    topicIds: ['elec'],
    difficulty: 'easy',
    text: "Quelle est l'unité de la résistance électrique ?",
    options: ["Ampère (A)", "Volt (V)", "Ohm (Ω)", "Watt (W)"],
    correctAnswer: 2,
    explanation: "La résistance se mesure en Ohm (Ω)."
  },
  {
    id: 'q4',
    topicIds: ['elec'],
    difficulty: 'medium',
    text: "Dans un circuit en série, si une résistance augmente, que fait le courant total (à tension constante) ?",
    options: ["Il augmente", "Il diminue", "Il reste constant", "Il devient nul"],
    correctAnswer: 1,
    explanation: "Selon la loi d'Ohm I = U / R_total. Si R augmente, I diminue."
  },
  // Thermo
  {
    id: 'q5',
    topicIds: ['thermo'],
    difficulty: 'medium',
    text: "Le second principe de la thermodynamique introduit quelle fonction d'état ?",
    options: ["L'Enthalpie (H)", "L'Énergie interne (U)", "L'Entropie (S)", "L'Énergie libre (G)"],
    correctAnswer: 2,
    explanation: "Le second principe postule l'existence de l'entropie S, qui ne peut qu'augmenter pour un système isolé lors d'une transformation irréversible."
  },
  // Math
  {
    id: 'q6',
    topicIds: ['calc'],
    difficulty: 'easy',
    text: "Quelle est la dérivée de f(x) = x² ?",
    options: ["x", "2x", "2", "x/2"],
    correctAnswer: 1,
    explanation: "La dérivée de x^n est nx^(n-1)."
  }
];

