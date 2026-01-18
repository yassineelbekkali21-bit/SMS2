'use client';

/**
 * PlanningSetupPopup - Configuration de planification
 * Style SMS OnboardingPopup - Proposition 2
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronRight, Plus, Search } from 'lucide-react';

interface LearningTrack {
  id: string;
  title: string;
  subtitle: string;
  lessons: number;
  duration: string;
}

interface TrackPlanConfig {
  trackId: string;
  targetDate: string;
  intensity: 'light' | 'moderate' | 'intense';
  isSelected: boolean;
}

interface PlanningSetupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: PlanningConfig) => void;
  programId: string;
  programName: string;
  userId: string;
  designedForYouTracks?: LearningTrack[];
  recommendedTracks?: LearningTrack[];
}

interface PlanningConfig {
  programId: string;
  preferredDays: string[];
  globalIntensity: 'light' | 'moderate' | 'intense';
  trackConfigs: TrackPlanConfig[];
  motivationBuddyId: string | null;
}

// Program-specific tracks data
const PROGRAM_TRACKS: Record<string, LearningTrack[]> = {
  chemistry: [
    // Chimie générale (10)
    { id: 'chem-1', title: 'Structure atomique', subtitle: 'Chimie générale', lessons: 8, duration: '4h' },
    { id: 'chem-2', title: 'Tableau périodique', subtitle: 'Chimie générale', lessons: 6, duration: '3h' },
    { id: 'chem-3', title: 'Liaisons chimiques', subtitle: 'Chimie générale', lessons: 10, duration: '5h' },
    { id: 'chem-4', title: 'Géométrie moléculaire', subtitle: 'Chimie générale', lessons: 8, duration: '4h' },
    { id: 'chem-5', title: 'États de la matière', subtitle: 'Chimie générale', lessons: 7, duration: '3.5h' },
    { id: 'chem-6', title: 'Solutions et solubilité', subtitle: 'Chimie générale', lessons: 9, duration: '4.5h' },
    { id: 'chem-7', title: 'Stœchiométrie', subtitle: 'Chimie générale', lessons: 12, duration: '6h' },
    { id: 'chem-8', title: 'Gaz parfaits', subtitle: 'Chimie générale', lessons: 8, duration: '4h' },
    { id: 'chem-9', title: 'Thermochimie', subtitle: 'Chimie générale', lessons: 10, duration: '5h' },
    { id: 'chem-10', title: 'Cinétique chimique', subtitle: 'Chimie générale', lessons: 11, duration: '5.5h' },
    // Chimie organique (15)
    { id: 'chem-11', title: 'Alcanes et cycloalcanes', subtitle: 'Chimie organique', lessons: 8, duration: '4h' },
    { id: 'chem-12', title: 'Alcènes et alcynes', subtitle: 'Chimie organique', lessons: 10, duration: '5h' },
    { id: 'chem-13', title: 'Composés aromatiques', subtitle: 'Chimie organique', lessons: 12, duration: '6h' },
    { id: 'chem-14', title: 'Stéréochimie', subtitle: 'Chimie organique', lessons: 14, duration: '7h' },
    { id: 'chem-15', title: 'Halogénoalcanes', subtitle: 'Chimie organique', lessons: 9, duration: '4.5h' },
    { id: 'chem-16', title: 'Alcools et éthers', subtitle: 'Chimie organique', lessons: 10, duration: '5h' },
    { id: 'chem-17', title: 'Aldéhydes et cétones', subtitle: 'Chimie organique', lessons: 11, duration: '5.5h' },
    { id: 'chem-18', title: 'Acides carboxyliques', subtitle: 'Chimie organique', lessons: 10, duration: '5h' },
    { id: 'chem-19', title: 'Dérivés d\'acides', subtitle: 'Chimie organique', lessons: 12, duration: '6h' },
    { id: 'chem-20', title: 'Amines', subtitle: 'Chimie organique', lessons: 8, duration: '4h' },
    { id: 'chem-21', title: 'Réactions SN1 et SN2', subtitle: 'Chimie organique', lessons: 14, duration: '7h' },
    { id: 'chem-22', title: 'Réactions E1 et E2', subtitle: 'Chimie organique', lessons: 12, duration: '6h' },
    { id: 'chem-23', title: 'Additions électrophiles', subtitle: 'Chimie organique', lessons: 10, duration: '5h' },
    { id: 'chem-24', title: 'Polymères', subtitle: 'Chimie organique', lessons: 8, duration: '4h' },
    { id: 'chem-25', title: 'Synthèse organique', subtitle: 'Chimie organique', lessons: 16, duration: '8h' },
    // Acides-Bases et Équilibres (10)
    { id: 'chem-26', title: 'Acides et bases de Brønsted', subtitle: 'Acides-Bases', lessons: 10, duration: '5h' },
    { id: 'chem-27', title: 'pH et pOH', subtitle: 'Acides-Bases', lessons: 8, duration: '4h' },
    { id: 'chem-28', title: 'Tampons', subtitle: 'Acides-Bases', lessons: 9, duration: '4.5h' },
    { id: 'chem-29', title: 'Titrages acido-basiques', subtitle: 'Acides-Bases', lessons: 12, duration: '6h' },
    { id: 'chem-30', title: 'Équilibres chimiques', subtitle: 'Équilibres', lessons: 14, duration: '7h' },
    { id: 'chem-31', title: 'Constante d\'équilibre', subtitle: 'Équilibres', lessons: 10, duration: '5h' },
    { id: 'chem-32', title: 'Principe de Le Chatelier', subtitle: 'Équilibres', lessons: 8, duration: '4h' },
    { id: 'chem-33', title: 'Équilibres de solubilité', subtitle: 'Équilibres', lessons: 10, duration: '5h' },
    { id: 'chem-34', title: 'Équilibres complexes', subtitle: 'Équilibres', lessons: 9, duration: '4.5h' },
    { id: 'chem-35', title: 'Diagrammes de prédominance', subtitle: 'Équilibres', lessons: 8, duration: '4h' },
    // Électrochimie (10)
    { id: 'chem-36', title: 'Oxydation et réduction', subtitle: 'Électrochimie', lessons: 10, duration: '5h' },
    { id: 'chem-37', title: 'Équilibrage redox', subtitle: 'Électrochimie', lessons: 8, duration: '4h' },
    { id: 'chem-38', title: 'Piles électrochimiques', subtitle: 'Électrochimie', lessons: 12, duration: '6h' },
    { id: 'chem-39', title: 'Potentiels standards', subtitle: 'Électrochimie', lessons: 10, duration: '5h' },
    { id: 'chem-40', title: 'Équation de Nernst', subtitle: 'Électrochimie', lessons: 9, duration: '4.5h' },
    { id: 'chem-41', title: 'Électrolyse', subtitle: 'Électrochimie', lessons: 11, duration: '5.5h' },
    { id: 'chem-42', title: 'Corrosion', subtitle: 'Électrochimie', lessons: 7, duration: '3.5h' },
    { id: 'chem-43', title: 'Batteries et accumulateurs', subtitle: 'Électrochimie', lessons: 8, duration: '4h' },
    { id: 'chem-44', title: 'Diagrammes E-pH', subtitle: 'Électrochimie', lessons: 10, duration: '5h' },
    { id: 'chem-45', title: 'Applications industrielles', subtitle: 'Électrochimie', lessons: 6, duration: '3h' },
    // Chimie analytique (10)
    { id: 'chem-46', title: 'Spectroscopie UV-Visible', subtitle: 'Analytique', lessons: 10, duration: '5h' },
    { id: 'chem-47', title: 'Spectroscopie IR', subtitle: 'Analytique', lessons: 12, duration: '6h' },
    { id: 'chem-48', title: 'RMN du proton', subtitle: 'Analytique', lessons: 14, duration: '7h' },
    { id: 'chem-49', title: 'RMN du carbone-13', subtitle: 'Analytique', lessons: 10, duration: '5h' },
    { id: 'chem-50', title: 'Spectrométrie de masse', subtitle: 'Analytique', lessons: 11, duration: '5.5h' },
    { id: 'chem-51', title: 'Chromatographie', subtitle: 'Analytique', lessons: 9, duration: '4.5h' },
    { id: 'chem-52', title: 'Électrophorèse', subtitle: 'Analytique', lessons: 7, duration: '3.5h' },
    { id: 'chem-53', title: 'Analyse gravimétrique', subtitle: 'Analytique', lessons: 6, duration: '3h' },
    { id: 'chem-54', title: 'Analyse volumétrique', subtitle: 'Analytique', lessons: 8, duration: '4h' },
    { id: 'chem-55', title: 'Méthodes électrochimiques', subtitle: 'Analytique', lessons: 10, duration: '5h' },
  ],
  biology: [
    // Biologie cellulaire (12)
    { id: 'bio-1', title: 'Structure cellulaire', subtitle: 'Biologie cellulaire', lessons: 10, duration: '5h' },
    { id: 'bio-2', title: 'Membrane plasmique', subtitle: 'Biologie cellulaire', lessons: 12, duration: '6h' },
    { id: 'bio-3', title: 'Noyau et chromosomes', subtitle: 'Biologie cellulaire', lessons: 11, duration: '5.5h' },
    { id: 'bio-4', title: 'Réticulum endoplasmique', subtitle: 'Biologie cellulaire', lessons: 8, duration: '4h' },
    { id: 'bio-5', title: 'Appareil de Golgi', subtitle: 'Biologie cellulaire', lessons: 7, duration: '3.5h' },
    { id: 'bio-6', title: 'Mitochondries', subtitle: 'Biologie cellulaire', lessons: 14, duration: '7h' },
    { id: 'bio-7', title: 'Cytosquelette', subtitle: 'Biologie cellulaire', lessons: 10, duration: '5h' },
    { id: 'bio-8', title: 'Division cellulaire - Mitose', subtitle: 'Biologie cellulaire', lessons: 12, duration: '6h' },
    { id: 'bio-9', title: 'Méiose', subtitle: 'Biologie cellulaire', lessons: 14, duration: '7h' },
    { id: 'bio-10', title: 'Cycle cellulaire', subtitle: 'Biologie cellulaire', lessons: 10, duration: '5h' },
    { id: 'bio-11', title: 'Apoptose', subtitle: 'Biologie cellulaire', lessons: 8, duration: '4h' },
    { id: 'bio-12', title: 'Signalisation cellulaire', subtitle: 'Biologie cellulaire', lessons: 16, duration: '8h' },
    // Génétique (15)
    { id: 'bio-13', title: 'Lois de Mendel', subtitle: 'Génétique', lessons: 10, duration: '5h' },
    { id: 'bio-14', title: 'Structure de l\'ADN', subtitle: 'Génétique', lessons: 12, duration: '6h' },
    { id: 'bio-15', title: 'Réplication de l\'ADN', subtitle: 'Génétique', lessons: 14, duration: '7h' },
    { id: 'bio-16', title: 'Transcription', subtitle: 'Génétique', lessons: 12, duration: '6h' },
    { id: 'bio-17', title: 'Traduction', subtitle: 'Génétique', lessons: 14, duration: '7h' },
    { id: 'bio-18', title: 'Régulation génique', subtitle: 'Génétique', lessons: 16, duration: '8h' },
    { id: 'bio-19', title: 'Mutations', subtitle: 'Génétique', lessons: 10, duration: '5h' },
    { id: 'bio-20', title: 'Génétique des populations', subtitle: 'Génétique', lessons: 12, duration: '6h' },
    { id: 'bio-21', title: 'Hérédité liée au sexe', subtitle: 'Génétique', lessons: 8, duration: '4h' },
    { id: 'bio-22', title: 'Épigénétique', subtitle: 'Génétique', lessons: 10, duration: '5h' },
    { id: 'bio-23', title: 'Génie génétique', subtitle: 'Génétique', lessons: 14, duration: '7h' },
    { id: 'bio-24', title: 'PCR et séquençage', subtitle: 'Génétique', lessons: 12, duration: '6h' },
    { id: 'bio-25', title: 'CRISPR-Cas9', subtitle: 'Génétique', lessons: 8, duration: '4h' },
    { id: 'bio-26', title: 'Clonage', subtitle: 'Génétique', lessons: 10, duration: '5h' },
    { id: 'bio-27', title: 'Thérapie génique', subtitle: 'Génétique', lessons: 9, duration: '4.5h' },
    // Physiologie (13)
    { id: 'bio-28', title: 'Système nerveux', subtitle: 'Physiologie', lessons: 18, duration: '9h' },
    { id: 'bio-29', title: 'Système cardiovasculaire', subtitle: 'Physiologie', lessons: 16, duration: '8h' },
    { id: 'bio-30', title: 'Système respiratoire', subtitle: 'Physiologie', lessons: 12, duration: '6h' },
    { id: 'bio-31', title: 'Système digestif', subtitle: 'Physiologie', lessons: 14, duration: '7h' },
    { id: 'bio-32', title: 'Système rénal', subtitle: 'Physiologie', lessons: 12, duration: '6h' },
    { id: 'bio-33', title: 'Système endocrinien', subtitle: 'Physiologie', lessons: 14, duration: '7h' },
    { id: 'bio-34', title: 'Système immunitaire', subtitle: 'Physiologie', lessons: 16, duration: '8h' },
    { id: 'bio-35', title: 'Système musculaire', subtitle: 'Physiologie', lessons: 10, duration: '5h' },
    { id: 'bio-36', title: 'Système squelettique', subtitle: 'Physiologie', lessons: 8, duration: '4h' },
    { id: 'bio-37', title: 'Homéostasie', subtitle: 'Physiologie', lessons: 10, duration: '5h' },
    { id: 'bio-38', title: 'Thermorégulation', subtitle: 'Physiologie', lessons: 6, duration: '3h' },
    { id: 'bio-39', title: 'Reproduction', subtitle: 'Physiologie', lessons: 12, duration: '6h' },
    { id: 'bio-40', title: 'Développement embryonnaire', subtitle: 'Physiologie', lessons: 14, duration: '7h' },
    // Écologie et Évolution (10)
    { id: 'bio-41', title: 'Écosystèmes', subtitle: 'Écologie', lessons: 12, duration: '6h' },
    { id: 'bio-42', title: 'Chaînes alimentaires', subtitle: 'Écologie', lessons: 8, duration: '4h' },
    { id: 'bio-43', title: 'Cycles biogéochimiques', subtitle: 'Écologie', lessons: 10, duration: '5h' },
    { id: 'bio-44', title: 'Biodiversité', subtitle: 'Écologie', lessons: 9, duration: '4.5h' },
    { id: 'bio-45', title: 'Évolution et sélection naturelle', subtitle: 'Évolution', lessons: 14, duration: '7h' },
    { id: 'bio-46', title: 'Spéciation', subtitle: 'Évolution', lessons: 10, duration: '5h' },
    { id: 'bio-47', title: 'Phylogénie', subtitle: 'Évolution', lessons: 12, duration: '6h' },
    { id: 'bio-48', title: 'Origine de la vie', subtitle: 'Évolution', lessons: 8, duration: '4h' },
    { id: 'bio-49', title: 'Adaptation', subtitle: 'Évolution', lessons: 10, duration: '5h' },
    { id: 'bio-50', title: 'Coévolution', subtitle: 'Évolution', lessons: 7, duration: '3.5h' },
  ],
  accounting: [
    // Comptabilité générale (15)
    { id: 'acc-1', title: 'Principes comptables', subtitle: 'Comptabilité générale', lessons: 8, duration: '4h' },
    { id: 'acc-2', title: 'Plan comptable', subtitle: 'Comptabilité générale', lessons: 10, duration: '5h' },
    { id: 'acc-3', title: 'Journal et grand livre', subtitle: 'Comptabilité générale', lessons: 12, duration: '6h' },
    { id: 'acc-4', title: 'Balance et bilan', subtitle: 'Comptabilité générale', lessons: 14, duration: '7h' },
    { id: 'acc-5', title: 'Compte de résultat', subtitle: 'Comptabilité générale', lessons: 12, duration: '6h' },
    { id: 'acc-6', title: 'Annexe', subtitle: 'Comptabilité générale', lessons: 8, duration: '4h' },
    { id: 'acc-7', title: 'Opérations courantes', subtitle: 'Comptabilité générale', lessons: 16, duration: '8h' },
    { id: 'acc-8', title: 'TVA', subtitle: 'Comptabilité générale', lessons: 14, duration: '7h' },
    { id: 'acc-9', title: 'Stocks et inventaire', subtitle: 'Comptabilité générale', lessons: 12, duration: '6h' },
    { id: 'acc-10', title: 'Immobilisations', subtitle: 'Comptabilité générale', lessons: 14, duration: '7h' },
    { id: 'acc-11', title: 'Amortissements', subtitle: 'Comptabilité générale', lessons: 16, duration: '8h' },
    { id: 'acc-12', title: 'Provisions', subtitle: 'Comptabilité générale', lessons: 10, duration: '5h' },
    { id: 'acc-13', title: 'Créances et dettes', subtitle: 'Comptabilité générale', lessons: 12, duration: '6h' },
    { id: 'acc-14', title: 'Trésorerie', subtitle: 'Comptabilité générale', lessons: 10, duration: '5h' },
    { id: 'acc-15', title: 'Clôture des comptes', subtitle: 'Comptabilité générale', lessons: 14, duration: '7h' },
    // Analyse financière (12)
    { id: 'acc-16', title: 'Analyse du bilan', subtitle: 'Analyse financière', lessons: 14, duration: '7h' },
    { id: 'acc-17', title: 'Analyse du compte de résultat', subtitle: 'Analyse financière', lessons: 12, duration: '6h' },
    { id: 'acc-18', title: 'Soldes intermédiaires de gestion', subtitle: 'Analyse financière', lessons: 10, duration: '5h' },
    { id: 'acc-19', title: 'Capacité d\'autofinancement', subtitle: 'Analyse financière', lessons: 8, duration: '4h' },
    { id: 'acc-20', title: 'Ratios financiers', subtitle: 'Analyse financière', lessons: 16, duration: '8h' },
    { id: 'acc-21', title: 'Tableau de financement', subtitle: 'Analyse financière', lessons: 14, duration: '7h' },
    { id: 'acc-22', title: 'Tableau des flux de trésorerie', subtitle: 'Analyse financière', lessons: 12, duration: '6h' },
    { id: 'acc-23', title: 'Fonds de roulement', subtitle: 'Analyse financière', lessons: 10, duration: '5h' },
    { id: 'acc-24', title: 'BFR', subtitle: 'Analyse financière', lessons: 12, duration: '6h' },
    { id: 'acc-25', title: 'Seuil de rentabilité', subtitle: 'Analyse financière', lessons: 10, duration: '5h' },
    { id: 'acc-26', title: 'Effet de levier', subtitle: 'Analyse financière', lessons: 8, duration: '4h' },
    { id: 'acc-27', title: 'Diagnostic financier', subtitle: 'Analyse financière', lessons: 14, duration: '7h' },
    // Comptabilité analytique (10)
    { id: 'acc-28', title: 'Coûts complets', subtitle: 'Comptabilité analytique', lessons: 14, duration: '7h' },
    { id: 'acc-29', title: 'Coûts partiels', subtitle: 'Comptabilité analytique', lessons: 12, duration: '6h' },
    { id: 'acc-30', title: 'Coût marginal', subtitle: 'Comptabilité analytique', lessons: 10, duration: '5h' },
    { id: 'acc-31', title: 'Imputation rationnelle', subtitle: 'Comptabilité analytique', lessons: 8, duration: '4h' },
    { id: 'acc-32', title: 'Méthode ABC', subtitle: 'Comptabilité analytique', lessons: 12, duration: '6h' },
    { id: 'acc-33', title: 'Centres d\'analyse', subtitle: 'Comptabilité analytique', lessons: 10, duration: '5h' },
    { id: 'acc-34', title: 'Écarts sur coûts', subtitle: 'Comptabilité analytique', lessons: 14, duration: '7h' },
    { id: 'acc-35', title: 'Budget et contrôle budgétaire', subtitle: 'Comptabilité analytique', lessons: 16, duration: '8h' },
    { id: 'acc-36', title: 'Tableaux de bord', subtitle: 'Comptabilité analytique', lessons: 10, duration: '5h' },
    { id: 'acc-37', title: 'Prix de cession interne', subtitle: 'Comptabilité analytique', lessons: 8, duration: '4h' },
    // Fiscalité (8)
    { id: 'acc-38', title: 'Impôt sur les sociétés', subtitle: 'Fiscalité', lessons: 14, duration: '7h' },
    { id: 'acc-39', title: 'Impôt sur le revenu', subtitle: 'Fiscalité', lessons: 12, duration: '6h' },
    { id: 'acc-40', title: 'TVA approfondie', subtitle: 'Fiscalité', lessons: 16, duration: '8h' },
    { id: 'acc-41', title: 'Droits d\'enregistrement', subtitle: 'Fiscalité', lessons: 8, duration: '4h' },
    { id: 'acc-42', title: 'Contribution économique territoriale', subtitle: 'Fiscalité', lessons: 6, duration: '3h' },
    { id: 'acc-43', title: 'Plus-values', subtitle: 'Fiscalité', lessons: 10, duration: '5h' },
    { id: 'acc-44', title: 'Déficits fiscaux', subtitle: 'Fiscalité', lessons: 8, duration: '4h' },
    { id: 'acc-45', title: 'Optimisation fiscale', subtitle: 'Fiscalité', lessons: 12, duration: '6h' },
    // Consolidation et IFRS (10)
    { id: 'acc-46', title: 'Périmètre de consolidation', subtitle: 'Consolidation', lessons: 10, duration: '5h' },
    { id: 'acc-47', title: 'Méthodes de consolidation', subtitle: 'Consolidation', lessons: 14, duration: '7h' },
    { id: 'acc-48', title: 'Retraitements', subtitle: 'Consolidation', lessons: 12, duration: '6h' },
    { id: 'acc-49', title: 'Écart d\'acquisition', subtitle: 'Consolidation', lessons: 10, duration: '5h' },
    { id: 'acc-50', title: 'États financiers consolidés', subtitle: 'Consolidation', lessons: 14, duration: '7h' },
    { id: 'acc-51', title: 'IFRS - Cadre conceptuel', subtitle: 'IFRS', lessons: 8, duration: '4h' },
    { id: 'acc-52', title: 'IFRS - Immobilisations', subtitle: 'IFRS', lessons: 12, duration: '6h' },
    { id: 'acc-53', title: 'IFRS - Instruments financiers', subtitle: 'IFRS', lessons: 14, duration: '7h' },
    { id: 'acc-54', title: 'IFRS - Revenus', subtitle: 'IFRS', lessons: 10, duration: '5h' },
    { id: 'acc-55', title: 'IFRS - Contrats de location', subtitle: 'IFRS', lessons: 8, duration: '4h' },
  ],
  statistics: [
    // Statistiques descriptives (10)
    { id: 'stat-1', title: 'Types de variables', subtitle: 'Descriptives', lessons: 6, duration: '3h' },
    { id: 'stat-2', title: 'Mesures de tendance centrale', subtitle: 'Descriptives', lessons: 10, duration: '5h' },
    { id: 'stat-3', title: 'Mesures de dispersion', subtitle: 'Descriptives', lessons: 10, duration: '5h' },
    { id: 'stat-4', title: 'Représentations graphiques', subtitle: 'Descriptives', lessons: 8, duration: '4h' },
    { id: 'stat-5', title: 'Statistiques bivariées', subtitle: 'Descriptives', lessons: 12, duration: '6h' },
    { id: 'stat-6', title: 'Corrélation', subtitle: 'Descriptives', lessons: 10, duration: '5h' },
    { id: 'stat-7', title: 'Régression linéaire simple', subtitle: 'Descriptives', lessons: 14, duration: '7h' },
    { id: 'stat-8', title: 'Séries chronologiques', subtitle: 'Descriptives', lessons: 12, duration: '6h' },
    { id: 'stat-9', title: 'Indices statistiques', subtitle: 'Descriptives', lessons: 8, duration: '4h' },
    { id: 'stat-10', title: 'Tableaux croisés', subtitle: 'Descriptives', lessons: 10, duration: '5h' },
    // Probabilités (12)
    { id: 'stat-11', title: 'Axiomes des probabilités', subtitle: 'Probabilités', lessons: 8, duration: '4h' },
    { id: 'stat-12', title: 'Probabilités conditionnelles', subtitle: 'Probabilités', lessons: 12, duration: '6h' },
    { id: 'stat-13', title: 'Théorème de Bayes', subtitle: 'Probabilités', lessons: 10, duration: '5h' },
    { id: 'stat-14', title: 'Variables aléatoires discrètes', subtitle: 'Probabilités', lessons: 14, duration: '7h' },
    { id: 'stat-15', title: 'Variables aléatoires continues', subtitle: 'Probabilités', lessons: 14, duration: '7h' },
    { id: 'stat-16', title: 'Loi binomiale', subtitle: 'Probabilités', lessons: 10, duration: '5h' },
    { id: 'stat-17', title: 'Loi de Poisson', subtitle: 'Probabilités', lessons: 8, duration: '4h' },
    { id: 'stat-18', title: 'Loi normale', subtitle: 'Probabilités', lessons: 14, duration: '7h' },
    { id: 'stat-19', title: 'Loi exponentielle', subtitle: 'Probabilités', lessons: 8, duration: '4h' },
    { id: 'stat-20', title: 'Théorème central limite', subtitle: 'Probabilités', lessons: 12, duration: '6h' },
    { id: 'stat-21', title: 'Loi des grands nombres', subtitle: 'Probabilités', lessons: 10, duration: '5h' },
    { id: 'stat-22', title: 'Couples de variables aléatoires', subtitle: 'Probabilités', lessons: 12, duration: '6h' },
    // Inférence statistique (13)
    { id: 'stat-23', title: 'Échantillonnage', subtitle: 'Inférence', lessons: 10, duration: '5h' },
    { id: 'stat-24', title: 'Estimation ponctuelle', subtitle: 'Inférence', lessons: 12, duration: '6h' },
    { id: 'stat-25', title: 'Intervalles de confiance', subtitle: 'Inférence', lessons: 14, duration: '7h' },
    { id: 'stat-26', title: 'Tests d\'hypothèses - Principes', subtitle: 'Inférence', lessons: 14, duration: '7h' },
    { id: 'stat-27', title: 'Tests sur une moyenne', subtitle: 'Inférence', lessons: 12, duration: '6h' },
    { id: 'stat-28', title: 'Tests sur une proportion', subtitle: 'Inférence', lessons: 10, duration: '5h' },
    { id: 'stat-29', title: 'Tests sur deux moyennes', subtitle: 'Inférence', lessons: 12, duration: '6h' },
    { id: 'stat-30', title: 'Tests sur deux proportions', subtitle: 'Inférence', lessons: 10, duration: '5h' },
    { id: 'stat-31', title: 'Test du Chi-deux', subtitle: 'Inférence', lessons: 14, duration: '7h' },
    { id: 'stat-32', title: 'ANOVA', subtitle: 'Inférence', lessons: 16, duration: '8h' },
    { id: 'stat-33', title: 'Tests non paramétriques', subtitle: 'Inférence', lessons: 12, duration: '6h' },
    { id: 'stat-34', title: 'Puissance des tests', subtitle: 'Inférence', lessons: 10, duration: '5h' },
    { id: 'stat-35', title: 'Tests multiples', subtitle: 'Inférence', lessons: 8, duration: '4h' },
    // Régression et modélisation (10)
    { id: 'stat-36', title: 'Régression linéaire multiple', subtitle: 'Modélisation', lessons: 16, duration: '8h' },
    { id: 'stat-37', title: 'Diagnostic de régression', subtitle: 'Modélisation', lessons: 12, duration: '6h' },
    { id: 'stat-38', title: 'Régression logistique', subtitle: 'Modélisation', lessons: 14, duration: '7h' },
    { id: 'stat-39', title: 'Analyse de variance à deux facteurs', subtitle: 'Modélisation', lessons: 12, duration: '6h' },
    { id: 'stat-40', title: 'Modèles mixtes', subtitle: 'Modélisation', lessons: 10, duration: '5h' },
    { id: 'stat-41', title: 'Analyse en composantes principales', subtitle: 'Modélisation', lessons: 14, duration: '7h' },
    { id: 'stat-42', title: 'Analyse factorielle', subtitle: 'Modélisation', lessons: 12, duration: '6h' },
    { id: 'stat-43', title: 'Classification hiérarchique', subtitle: 'Modélisation', lessons: 10, duration: '5h' },
    { id: 'stat-44', title: 'K-means', subtitle: 'Modélisation', lessons: 8, duration: '4h' },
    { id: 'stat-45', title: 'Analyse discriminante', subtitle: 'Modélisation', lessons: 12, duration: '6h' },
    // Statistiques avancées (10)
    { id: 'stat-46', title: 'Analyse de survie', subtitle: 'Avancé', lessons: 14, duration: '7h' },
    { id: 'stat-47', title: 'Modèles de durée', subtitle: 'Avancé', lessons: 12, duration: '6h' },
    { id: 'stat-48', title: 'Statistique bayésienne', subtitle: 'Avancé', lessons: 16, duration: '8h' },
    { id: 'stat-49', title: 'Bootstrap', subtitle: 'Avancé', lessons: 10, duration: '5h' },
    { id: 'stat-50', title: 'Méthodes de rééchantillonnage', subtitle: 'Avancé', lessons: 10, duration: '5h' },
    { id: 'stat-51', title: 'Plans d\'expériences', subtitle: 'Avancé', lessons: 14, duration: '7h' },
    { id: 'stat-52', title: 'Contrôle qualité statistique', subtitle: 'Avancé', lessons: 12, duration: '6h' },
    { id: 'stat-53', title: 'Séries temporelles avancées', subtitle: 'Avancé', lessons: 14, duration: '7h' },
    { id: 'stat-54', title: 'Données manquantes', subtitle: 'Avancé', lessons: 8, duration: '4h' },
    { id: 'stat-55', title: 'Big Data et statistiques', subtitle: 'Avancé', lessons: 10, duration: '5h' },
  ],
};

// Default tracks for programs not yet defined
const DEFAULT_TRACKS: LearningTrack[] = [
  { id: 'track-1', title: 'Introduction', subtitle: 'Fondamentaux', lessons: 8, duration: '4h' },
  { id: 'track-2', title: 'Concepts de base', subtitle: 'Fondamentaux', lessons: 10, duration: '5h' },
  { id: 'track-3', title: 'Applications', subtitle: 'Avancé', lessons: 12, duration: '6h' },
];

// Get tracks for a specific program
const getTracksForProgram = (programId: string): LearningTrack[] => {
  return PROGRAM_TRACKS[programId] || DEFAULT_TRACKS;
};

// Get designed-for-you tracks (first 3-5 based on common needs)
const getDesignedForYouIds = (programId: string): string[] => {
  const tracks = getTracksForProgram(programId);
  // Return first 3 tracks as "designed for you"
  return tracks.slice(0, 3).map(t => t.id);
};

// Get recommended tracks (next 2-3 popular ones)
const getRecommendedIds = (programId: string): string[] => {
  const tracks = getTracksForProgram(programId);
  // Return tracks 4-5 as recommended
  return tracks.slice(3, 5).map(t => t.id);
};

const DAYS = [
  { id: 'mon', label: 'Lundi' },
  { id: 'tue', label: 'Mardi' },
  { id: 'wed', label: 'Mercredi' },
  { id: 'thu', label: 'Jeudi' },
  { id: 'fri', label: 'Vendredi' },
  { id: 'sat', label: 'Samedi' },
  { id: 'sun', label: 'Dimanche' },
];

export function PlanningSetupPopup({
  isOpen,
  onClose,
  onComplete,
  programId,
  programName,
}: PlanningSetupPopupProps) {
  // Get program-specific data
  const programTracks = getTracksForProgram(programId);
  const designedForYouIds = getDesignedForYouIds(programId);
  const recommendedIds = getRecommendedIds(programId);

  const [preferredDays, setPreferredDays] = useState<string[]>(['mon', 'wed', 'fri']);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set(designedForYouIds));
  const [trackConfigs, setTrackConfigs] = useState<Map<string, { date: string; intensity: string }>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize track configs when program changes
  useEffect(() => {
    const tracks = getTracksForProgram(programId);
    const configs = new Map<string, { date: string; intensity: string }>();
    const defaultDate = getDefaultTargetDate();
    tracks.forEach(track => {
      configs.set(track.id, { date: defaultDate, intensity: 'moderate' });
    });
    setTrackConfigs(configs);
    // Reset selected tracks based on new program
    setSelectedTracks(new Set(getDesignedForYouIds(programId)));
  }, [programId]);

  const getDefaultTargetDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 2);
    return date.toISOString().split('T')[0];
  };

  const toggleDay = (dayId: string) => {
    setPreferredDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const toggleTrack = (trackId: string) => {
    setSelectedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const updateTrackConfig = (trackId: string, field: 'date' | 'intensity', value: string) => {
    setTrackConfigs(prev => {
      const newConfigs = new Map(prev);
      const existing = newConfigs.get(trackId) || { date: getDefaultTargetDate(), intensity: 'moderate' };
      newConfigs.set(trackId, { ...existing, [field]: value });
      return newConfigs;
    });
  };

  const handleComplete = () => {
    const trackConfigsArray = Array.from(selectedTracks).map(trackId => {
      const config = trackConfigs.get(trackId);
      return {
        trackId,
        targetDate: config?.date || getDefaultTargetDate(),
        intensity: (config?.intensity || 'moderate') as 'light' | 'moderate' | 'intense',
        isSelected: true,
      };
    });

    onComplete({
      programId,
      preferredDays,
      globalIntensity: 'moderate',
      trackConfigs: trackConfigsArray,
      motivationBuddyId: null,
    });
  };

  if (!isOpen) return null;

  // Filter tracks based on current selections
  const designedForYouTracks = programTracks.filter(t => selectedTracks.has(t.id));
  const recommendedTracks = programTracks.filter(t => recommendedIds.includes(t.id) && !selectedTracks.has(t.id));
  const allOtherTracks = programTracks.filter(t => 
    !selectedTracks.has(t.id) && 
    !recommendedIds.includes(t.id) &&
    (searchQuery === '' || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '5%',
              left: '5%',
              right: '5%',
              bottom: '5%',
              background: '#0d1317',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Gradient background effects */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,194,255,0.08) 0%, transparent 60%)', filter: 'blur(60px)' }} />
              <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)', filter: 'blur(60px)' }} />
            </div>

            {/* Header */}
            <header style={{
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 10,
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(13,19,23,0.95)',
              backdropFilter: 'blur(10px)',
            }}>
              <Image src="/brand/onboarding-logo.svg" alt="SMS" width={70} height={70} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.85)', margin: 0 }}>Planification</span>
                <span style={{ fontSize: '32px', color: 'rgba(255,255,255,0.5)', fontWeight: 900, lineHeight: 1 }}>•</span>
                <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-parafina), system-ui', textTransform: 'uppercase' }}>{programName}</h1>
              </div>

              <button 
                onClick={onClose}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: 'none', 
                  color: 'rgba(255,255,255,0.5)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <X size={20} />
              </button>
            </header>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '24px 40px', display: 'flex', gap: '20px', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
              
              {/* Panel 1: Jours d'étude */}
              <div style={{ 
                width: '180px',
                flexShrink: 0,
                borderRight: '1px solid rgba(255,255,255,0.05)',
                paddingRight: '16px',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>Jours d'étude</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {DAYS.map((day) => {
                    const isSelected = preferredDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '15px',
                          fontFamily: 'var(--font-parafina), system-ui',
                          fontWeight: 900,
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#00c2ff' : 'rgba(255,255,255,0.05)',
                          color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                          transition: 'all 0.2s',
                          textTransform: 'uppercase',
                          textAlign: 'left',
                        }}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Panel 2: Conçus pour toi - FEATURED SECTION */}
              <div style={{ 
                flex: 1.3,
                background: 'linear-gradient(145deg, rgba(0,194,255,0.12) 0%, rgba(0,194,255,0.03) 50%, rgba(0,100,200,0.08) 100%)', 
                borderRadius: '24px', 
                padding: '28px',
                border: '2px solid rgba(0,194,255,0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                margin: '0 12px',
                boxShadow: '0 8px 32px rgba(0,194,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                position: 'relative',
              }}>
                {/* Glow effect in corner */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, rgba(0,194,255,0.2) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '8px',
                    height: '32px',
                    borderRadius: '4px',
                    background: 'linear-gradient(180deg, #00c2ff 0%, #0088cc 100%)',
                    boxShadow: '0 0 12px rgba(0,194,255,0.5)',
                  }} />
                  <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Conçus pour toi</h3>
                  <span style={{ 
                    padding: '4px 10px', 
                    background: 'rgba(0,194,255,0.2)', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    color: '#00c2ff',
                    fontWeight: 600,
                    marginLeft: 'auto',
                  }}>
                    {designedForYouTracks.length} tracks
                  </span>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
                  {designedForYouTracks.map((track, i) => {
                    const config = trackConfigs.get(track.id);
                    return (
                      <motion.div 
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                        style={{ 
                          padding: '16px 20px', 
                          borderRadius: '14px', 
                          background: 'rgba(255,255,255,0.03)',
                          display: 'flex',
                          gap: '16px',
                        }}
                      >
                        {/* Timeline indicator */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingTop: '6px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00c2ff', boxShadow: '0 0 12px rgba(0,194,255,0.5)' }} />
                          <div style={{ width: '2px', flex: 1, background: 'linear-gradient(180deg, #00c2ff 0%, transparent 100%)', minHeight: '40px' }} />
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          {/* Header row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <h4 style={{ fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{track.title}</h4>
                              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{track.duration}</span>
                            </div>
                            <button 
                              onClick={() => toggleTrack(track.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                              <X size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                            </button>
                          </div>
                          
                          {/* Editable fields */}
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginBottom: '4px', display: 'block' }}>Date objectif</label>
                              <input 
                                type="date" 
                                value={config?.date || ''}
                                onChange={(e) => updateTrackConfig(track.id, 'date', e.target.value)}
                                style={{ 
                                  width: '100%',
                                  padding: '8px 12px', 
                                  fontSize: '13px', 
                                  background: 'rgba(0,0,0,0.3)', 
                                  border: '1px solid rgba(255,255,255,0.1)', 
                                  borderRadius: '8px', 
                                  color: '#FFF',
                                  cursor: 'pointer',
                                }} 
                              />
                            </div>
                            <div style={{ width: '120px' }}>
                              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', marginBottom: '4px', display: 'block' }}>Intensité</label>
                              <select 
                                value={config?.intensity || 'moderate'}
                                onChange={(e) => updateTrackConfig(track.id, 'intensity', e.target.value)}
                                style={{ 
                                  width: '100%',
                                  padding: '8px 12px', 
                                  fontSize: '13px', 
                                  background: 'rgba(0,194,255,0.1)', 
                                  border: '1px solid rgba(0,194,255,0.3)', 
                                  borderRadius: '8px', 
                                  color: '#00c2ff',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                }}
                              >
                                <option value="light">Tranquille</option>
                                <option value="moderate">Modéré</option>
                                <option value="intense">Intense</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Panel 3: Recommandés - Secondary */}
              <div style={{ 
                flex: 0.85,
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: '16px', 
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                marginRight: '8px',
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>Recommandés</h3>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                  {recommendedTracks.map(track => (
                    <div key={track.id} style={{ 
                      padding: '14px 16px', 
                      borderRadius: '14px', 
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                      <div>
                        <span style={{ fontSize: '17px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '2px' }}>{track.title}</span>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>{track.duration}</span>
                      </div>
                      <button 
                        onClick={() => toggleTrack(track.id)}
                        style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '10px', 
                          background: '#00c2ff', 
                          border: 'none', 
                          color: '#FFF', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ))}
                  {recommendedTracks.length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                      Tous les tracks recommandés ont été ajoutés
                    </p>
                  )}
                </div>
              </div>

              {/* Panel 4: Tous les sujets - Secondary */}
              <div style={{ 
                flex: 0.85,
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: '16px', 
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Tous les sujets</h3>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{allOtherTracks.length} disponibles</span>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px 12px 42px', 
                      fontSize: '14px', 
                      background: 'rgba(255,255,255,0.04)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '12px', 
                      color: '#FFF',
                    }} 
                  />
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                  {allOtherTracks.map(track => (
                    <div key={track.id} style={{ 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      background: 'rgba(255,255,255,0.04)',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                      <div>
                        <span style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', display: 'block' }}>{track.title}</span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{track.duration}</span>
                      </div>
                      <button 
                        onClick={() => toggleTrack(track.id)}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          background: 'rgba(255,255,255,0.08)', 
                          border: 'none', 
                          color: 'rgba(255,255,255,0.5)', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer style={{ 
              padding: '20px 40px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 10,
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#00c2ff', fontFamily: 'var(--font-parafina)' }}>{selectedTracks.size}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>tracks</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-parafina)' }}>{preferredDays.length}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>jours/semaine</span>
                </div>
              </div>
              <button 
                onClick={handleComplete}
                disabled={selectedTracks.size === 0}
                style={{ 
                  padding: '16px 32px', 
                  background: '#00c2ff', 
                  color: '#FFF', 
                  border: 'none', 
                  borderRadius: '9999px', 
                  fontWeight: 600, 
                  fontSize: '16px',
                  cursor: selectedTracks.size === 0 ? 'not-allowed' : 'pointer',
                  opacity: selectedTracks.size === 0 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                Générer mon planning
                <ChevronRight size={18} />
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PlanningSetupPopup;
