'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Users, BookOpen, Award, Clock, MessageCircle, Target } from 'lucide-react';

export function MethodSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Problem points
  const problems = [
    "Tu es perdu dans tes cours, les profs vont trop vite ou expliquent mal.",
    "Tu as l'impression de ne jamais comprendre vraiment, juste de réciter.",
    "Tu galères sur des exercices que tout le monde semble trouver faciles.",
    "Tu as peur de rater, tu procrastines, et ta confiance est au plus bas.",
    "Tu as déjà raté un examen et tu ne sais pas par où recommencer."
  ];

  // Benefits grid
  const benefits = [
    {
      icon: BookOpen,
      title: "Des cours clairs et structurés",
      description: "Pas de jargon. Des explications directes, manuscrites, avec 90% de pratique."
    },
    {
      icon: Users,
      title: "Un accompagnement humain 24/7",
      description: "Tu n'es jamais seul. WhatsApp, communauté vivante, mentor accessible."
    },
    {
      icon: Target,
      title: "Un parcours 100% sur mesure",
      description: "On diagnostique tes blocages, on construit ton plan personnalisé."
    },
    {
      icon: Award,
      title: "Une méthode éprouvée",
      description: "Des milliers d'étudiants ont transformé leurs résultats avec nous."
    },
    {
      icon: Clock,
      title: "Garantie jusqu'à la réussite",
      description: "On t'accompagne jusqu'à ce que tu réussisses. Pas d'abandon."
    },
    {
      icon: CheckCircle,
      title: "Aucun prérequis nécessaire",
      description: "Tu viens tel que tu es. On part de ton niveau actuel."
    }
  ];

  // Process steps
  const steps = [
    {
      number: 1,
      title: "Tu nous expliques ta situation",
      description: "Matières, niveau, examens, blocages. On prend le temps de comprendre.",
      details: ["Discussion perso en 10 min", "Diagnostic complet", "Zéro jugement"]
    },
    {
      number: 2,
      title: "On construit ton plan sur mesure",
      description: "Cours manuscrits, exercices progressifs, planning adapté à ton rythme.",
      details: ["90% pratique / 10% théorie", "Slides manuscrits", "Méthode éprouvée"]
    },
    {
      number: 3,
      title: "On t'accompagne jusqu'à la réussite",
      description: "WhatsApp 24/7, communauté motivée, suivi personnalisé de ta progression.",
      details: ["Support quotidien", "Garantie réussite", "Communauté vivante"]
    }
  ];

  // Why us points
  const whyUs = [
    "Pas de catalogue froid où tu choisis au hasard, mais un diagnostic personnalisé",
    "Pas une simple vidéo en ligne, mais un mentor accessible sur WhatsApp 24/7",
    "Pas un accompagnement qui s'arrête après paiement, mais une garantie jusqu'à la réussite",
    "Pas des cours théoriques ennuyeux, mais 90% de pratique concrète",
    "Pas besoin de prérequis, on part de ton niveau actuel",
    "Pas un prof distant et inaccessible, mais un rôle modèle inspirant",
    "Pas une plateforme froide, mais une relation humaine médecin/patient",
    "Pas de promesses vagues, mais un track record de réussites massives"
  ];

  return (
    <section id="method" className="py-20 md:py-32">
      {/* PROBLEM SECTION */}
      <div className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Si tu lis ceci, il y a de grandes chances que tu sois dans un de ces cas.
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Le système éducatif laisse tomber les étudiants motivés. Tu n'es pas nul, tu n'as juste pas eu la bonne méthode ni le bon accompagnement.
          </p>

          {/* Problem list */}
          <ul className="space-y-4 max-w-3xl mx-auto">
            {problems.map((problem, index) => (
              <li key={index} className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex-shrink-0 mt-1">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <span className="text-gray-700 text-lg">{problem}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SOLUTION SECTION */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Une alternative complète au système classique,<br />pensée pour ceux qu'il a laissés tomber.
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Nous savons ce que tu ressens. Nous avons été là. Et nous savons qu'avec la bonne méthode et le bon accompagnement humain, <strong>tout étudiant peut non seulement réussir, mais viser l'excellence</strong>.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Science Made Simple, c'est une méthode complète, un accompagnement humain quotidien et un environnement qui combine exigence et bienveillance. <strong>On ne complète pas tes cours, on les remplace</strong>. Tu peux réussir sans mettre un pied en auditoire.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                Des centaines d'étudiants ont transformé leurs résultats avec nous. Pas parce qu'on a une recette magique, mais parce qu'on prend le temps de <strong>comprendre tes blocages, nettoyer tes croyances limitantes, et t'accompagner jusqu'à la réussite</strong>.
              </p>
            </div>

            {/* Image placeholder */}
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-gray-200 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Image: Mentor + Student</p>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFITS SECTION */}
      <div className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Ce que tu obtiens concrètement avec Science Made Simple
          </h2>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6">
              Tu veux voir comment cela s'applique à ton cas ?
            </p>
            <button
              onClick={scrollToContact}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
            >
              Parler à un mentor sur WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* PROCESS SECTION */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Comment on t'amène de la confusion à la maîtrise
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Pas de plateforme anonyme. Pas de perte de temps. Trois étapes simples.
          </p>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step) => (
              <div key={step.number} className="bg-slate-50 p-8 rounded-2xl border border-gray-200 relative">
                {/* Number badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">
                  {step.number}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="text-blue-600 flex-shrink-0" size={16} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={scrollToContact}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
            >
              Commencer par un diagnostic gratuit
            </button>
          </div>
        </div>
      </div>

      {/* WHY US SECTION */}
      <div className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Pourquoi les étudiants nous choisissent,<br />et restent avec nous
          </h2>

          <ul className="grid md:grid-cols-2 gap-4">
            {whyUs.map((point, index) => (
              <li key={index} className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}




