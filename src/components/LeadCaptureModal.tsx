'use client';

/**
 * LeadCaptureModal - Popup de capture de leads style SMS
 * 
 * Apparaît après le clic sur "Débloquer 10h gratuites" ou sur un cours
 * Flow: Form → OTP Verification → Success
 * Collecte: Prénom, Email, Téléphone, Établissement
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';
import { LogoIntro } from './landing/logo-intro/LogoIntro';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ModalStep = 'form' | 'otp' | 'success';

export function LeadCaptureModal({ isOpen, onClose, onSuccess }: LeadCaptureModalProps) {
  const [step, setStep] = useState<ModalStep>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    school: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpInputRefs, setOtpInputRefs] = useState<React.RefObject<HTMLInputElement>[]>([]);
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Terms acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Initialize OTP input refs
  useEffect(() => {
    setOtpInputRefs(Array(6).fill(null).map(() => React.createRef<HTMLInputElement>()));
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'otp' && otpInputRefs[0]?.current) {
      setTimeout(() => otpInputRefs[0]?.current?.focus(), 100);
    }
  }, [step, otpInputRefs]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('form');
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setErrors({});
      setAcceptedTerms(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!acceptedTerms) {
      newErrors.terms = 'Veuillez accepter les conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Send OTP via SMS/Email
    console.log('Sending OTP to:', formData.email);
    
    setIsSubmitting(false);
    setStep('otp');
    setResendCooldown(60);
  };

  // OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.some(d => !d)) return;
    
    setIsSubmitting(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Verify OTP with backend
    const enteredOtp = otp.join('');
    console.log('Verifying OTP:', enteredOtp);
    
    // For demo, accept any 6-digit code
    // In production, validate against server
    if (enteredOtp.length === 6) {
      // Save lead data
      console.log('Lead captured:', formData);
      
      setIsSubmitting(false);
      setStep('success');
      
      // Auto-close after success
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } else {
      setOtpError('Code invalide. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    
    // Simulate resend
    console.log('Resending OTP to:', formData.email);
    
    setResendCooldown(60);
    otpInputRefs[0]?.current?.focus();
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal - Loop Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl"
        >
          
          {/* Close Button - Loop style */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Back Button (OTP step only) */}
          {step === 'otp' && (
            <button
              onClick={() => setStep('form')}
              className="absolute top-5 left-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </button>
          )}

          {/* Success State */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 py-12 text-center"
            >
              {/* Big Welcome Title */}
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-5xl md:text-6xl font-black !text-white mb-6 uppercase tracking-wide"
                style={{ fontFamily: "'Parafina', sans-serif" }}
              >
                Welcome
              </motion.h1>

              {/* Animated Logo - Same as lesson player intro */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-48 h-48 mx-auto mb-6"
              >
                <LogoIntro 
                  variant="star-shoot"
                  autoPlay={true}
                  loop={true}
                  loopDelay={2000}
                  darkMode={true}
                />
              </motion.div>

              {/* Quote */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-xl md:text-2xl italic"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                "Learning shouldn't be that boring."
              </motion.p>
            </motion.div>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 pt-16"
            >
              {/* Header */}
              <div className="text-center mb-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00c2ff]/20 to-blue-600/20 border border-[#00c2ff]/30 flex items-center justify-center">
                  <span className="text-4xl">📧</span>
                </div>
                <h2 className="text-2xl font-bold !text-white mb-3">
                  Vérifie ton email
                </h2>
                <p className="!text-white/50">
                  Un code à 6 chiffres a été envoyé à<br />
                  <span className="!text-white font-medium">{formData.email}</span>
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleOtpSubmit} className="space-y-8">
                {/* OTP Inputs */}
                <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpInputRefs[index]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-14 h-16 rounded-xl border-2 bg-white/5 text-center text-2xl font-bold !text-white focus:outline-none transition-all ${
                        otpError 
                          ? 'border-red-500/50 bg-red-500/10' 
                          : digit 
                            ? 'border-[#00c2ff] bg-[#00c2ff]/10' 
                            : 'border-white/10 focus:border-[#00c2ff] focus:bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {otpError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {otpError}
                  </motion.p>
                )}

                {/* Resend Link */}
                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <p className="!text-white/40 text-sm">
                      Renvoyer le code dans <span className="!text-white font-medium">{resendCooldown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm !text-white/50 hover:!text-white transition-colors"
                    >
                      Pas reçu le code ?{' '}
                      <span className="font-semibold text-[#00c2ff] underline">Renvoyer</span>
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={otp.some(d => !d) || isSubmitting}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                    otp.every(d => d) && !isSubmitting
                      ? 'bg-gradient-to-r from-[#00c2ff] to-blue-600 hover:from-[#3ab5dc] hover:to-blue-700 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/5 !text-white/30 cursor-not-allowed border border-white/10'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      Accéder aux cours
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Form Step - Loop Style */}
          {step === 'form' && (
            <div className="p-10 pt-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 relative">
                  <Image 
                    src="/brand/onboarding-logo.svg" 
                    alt="SMS" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Header - Parafina style */}
              <div className="text-center mb-8">
                <h2 
                  className="text-3xl md:text-4xl font-normal !text-white mb-3"
                  style={{ fontFamily: 'var(--font-parafina)' }}
                >
                  Teste ton parcours – 10h offertes
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }} className="text-base">
                  Accède à tous nos programmes. Sans engagement.
                </p>
              </div>

              {/* Form - Loop style inputs */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* First Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Ton prénom"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    className={`w-full px-5 py-4 bg-transparent rounded-full !text-white placeholder-white/40 text-base border transition-all ${
                      errors.firstName 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-white/20 focus:border-white/40'
                    } focus:outline-none`}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1.5 ml-4">{errors.firstName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Ton email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    className={`w-full px-5 py-4 bg-transparent rounded-full !text-white placeholder-white/40 text-base border transition-all ${
                      errors.email 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-white/20 focus:border-white/40'
                    } focus:outline-none`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1.5 ml-4">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    className="w-full px-5 py-4 bg-transparent rounded-full !text-white placeholder-white/40 text-base border border-white/20 focus:border-white/40 focus:outline-none transition-all"
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked);
                          if (e.target.checked && errors.terms) {
                            setErrors(prev => ({ ...prev, terms: '' }));
                          }
                        }}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        acceptedTerms 
                          ? 'bg-[#00c2ff] border-[#00c2ff]' 
                          : errors.terms
                          ? 'border-red-500/50 bg-red-500/10'
                          : 'border-white/20 bg-transparent group-hover:border-white/40'
                      }`}>
                        {acceptedTerms && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm !text-white/50 leading-relaxed">
                      J'accepte les{' '}
                      <a href="/terms" target="_blank" className="text-[#00c2ff] hover:underline">
                        conditions
                      </a>
                      {' '}et la{' '}
                      <a href="/privacy" target="_blank" className="text-[#00c2ff] hover:underline">
                        politique de confidentialité
                      </a>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-400 text-xs mt-1.5 ml-8">{errors.terms}</p>
                  )}
                </div>

                {/* Submit Button - Loop style pill */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#00c2ff] hover:bg-[#00b0e8] disabled:opacity-50 !text-white font-semibold text-base rounded-full transition-all flex items-center justify-center gap-3 mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Play size={20} fill="currentColor" />
                      Commence maintenant
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LeadCaptureModal;
