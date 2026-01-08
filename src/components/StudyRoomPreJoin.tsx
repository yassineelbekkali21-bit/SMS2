'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown,
  Volume2,
  ArrowRight,
  X
} from 'lucide-react';

interface StudyRoomPreJoinProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  roomTitle: string;
  roomId: string;
}

export function StudyRoomPreJoin({ 
  isOpen, 
  onClose, 
  onJoin, 
  roomTitle,
  roomId 
}: StudyRoomPreJoinProps) {
  const [microphoneSource, setMicrophoneSource] = useState('Microphone MacBook Air (Built-in)');
  const [speakerSource, setSpeakerSource] = useState('Par défaut - Haut-parleurs MacBook Air (Built-in)');
  const [cameraSource, setCameraSource] = useState('Caméra FaceTime HD');
  const [videoQuality, setVideoQuality] = useState('720p');
  const [videoTransform, setVideoTransform] = useState('Aucun');
  const [backgroundReplacement, setBackgroundReplacement] = useState('Aucun');
  const [micLevel, setMicLevel] = useState(0);
  const [showMicDropdown, setShowMicDropdown] = useState(false);
  const [showSpeakerDropdown, setShowSpeakerDropdown] = useState(false);
  const [showCameraDropdown, setShowCameraDropdown] = useState(false);
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);
  const [showTransformDropdown, setShowTransformDropdown] = useState(false);
  const [showBackgroundDropdown, setShowBackgroundDropdown] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simuler l'activité du microphone
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setMicLevel(Math.random() * 100);
    }, 100);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  // Accéder à la caméra
  useEffect(() => {
    if (!isOpen) return;

    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log('Impossible d\'accéder à la caméra:', err);
      }
    };

    getCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const handleTestSpeakers = () => {
    const audio = new Audio('/test-sound.mp3');
    audio.play().catch(() => {
      // Fallback: créer un son de test simple
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    });
  };

  const handleJoin = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onJoin();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Parafina, serif' }}>
              Configuration des appareils
            </h1>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-12">
              {/* Audio Section */}
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Audio</h2>
                
                {/* Microphone source */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Source du microphone
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowMicDropdown(!showMicDropdown)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left text-sm text-gray-700 flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <span className="truncate">{microphoneSource}</span>
                      <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                    </button>
                    {showMicDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                        {['Microphone MacBook Air (Built-in)', 'Microphone externe USB', 'Casque Bluetooth'].map((source) => (
                          <button
                            key={source}
                            onClick={() => { setMicrophoneSource(source); setShowMicDropdown(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {source}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Microphone activity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Activité du microphone
                  </label>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ backgroundColor: '#00c2ff' }}
                      animate={{ width: `${micLevel}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>

                {/* Speaker source */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Source des haut-parleurs
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeakerDropdown(!showSpeakerDropdown)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left text-sm text-gray-700 flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <span className="truncate">{speakerSource}</span>
                      <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                    </button>
                    {showSpeakerDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                        {['Par défaut - Haut-parleurs MacBook Air (Built-in)', 'Casque Bluetooth', 'Écran externe'].map((source) => (
                          <button
                            key={source}
                            onClick={() => { setSpeakerSource(source); setShowSpeakerDropdown(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {source}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Test speakers button */}
                <button
                  onClick={handleTestSpeakers}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-colors flex items-center gap-2"
                  style={{ backgroundColor: '#00c2ff' }}
                >
                  <Volume2 size={16} />
                  Tester les haut-parleurs
                </button>
              </div>

              {/* Video Section */}
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Vidéo</h2>
                
                {/* Camera source */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Source de la caméra
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCameraDropdown(!showCameraDropdown)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left text-sm text-gray-700 flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <span className="truncate">{cameraSource}</span>
                      <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                    </button>
                    {showCameraDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                        {['Caméra FaceTime HD', 'Webcam USB', 'iPhone (Continuity)'].map((source) => (
                          <button
                            key={source}
                            onClick={() => { setCameraSource(source); setShowCameraDropdown(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {source}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video quality */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Qualité vidéo
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityDropdown(!showQualityDropdown)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left text-sm text-gray-700 flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <span>{videoQuality}</span>
                      <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                    </button>
                    {showQualityDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                        {['480p', '720p', '1080p'].map((quality) => (
                          <button
                            key={quality}
                            onClick={() => { setVideoQuality(quality); setShowQualityDropdown(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {quality}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video transform */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Transformation vidéo
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowTransformDropdown(!showTransformDropdown)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left text-sm text-gray-700 flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <span>{videoTransform}</span>
                      <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                    </button>
                    {showTransformDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                        {['Aucun', 'Miroir', 'Flou léger'].map((transform) => (
                          <button
                            key={transform}
                            onClick={() => { setVideoTransform(transform); setShowTransformDropdown(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {transform}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Background replacement */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Remplacement d'arrière-plan
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowBackgroundDropdown(!showBackgroundDropdown)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left text-sm text-gray-700 flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <span>{backgroundReplacement}</span>
                      <ChevronDown size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                    </button>
                    {showBackgroundDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                        {['Aucun', 'Flou', 'Bibliothèque', 'Bureau moderne'].map((bg) => (
                          <button
                            key={bg}
                            onClick={() => { setBackgroundReplacement(bg); setShowBackgroundDropdown(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {bg}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Aperçu vidéo
                  </label>
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleJoin}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#00c2ff' }}
            >
              Rejoindre la room
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

