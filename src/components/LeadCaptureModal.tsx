'use client';

/**
 * LeadCaptureModal - Popup de capture de leads style MasterClass
 * 
 * Apparaît après le clic sur "Débloquer 10h gratuites"
 * Flow: Form → OTP Verification → Success
 * Collecte: Prénom, Email, Téléphone, Établissement
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

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
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    }
    
    if (!formData.school.trim()) {
      newErrors.school = 'Établissement requis';
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
    console.log('Sending OTP to:', formData.phone);
    
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
    console.log('Resending OTP to:', formData.phone);
    
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
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md bg-[#0d1317] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Back Button (OTP step only) */}
          {step === 'otp' && (
            <button
              onClick={() => setStep('form')}
              className="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
          )}

          {/* Success State */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-600 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold !text-white mb-3">
                Bienvenue chez SMS ! 🎉
              </h2>
              <p className="!text-white/70">
                Ton accès gratuit est activé. Prépare-toi à transformer ta façon d'apprendre.
              </p>
            </motion.div>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              {/* Header */}
              <div className="text-center mb-8 pt-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h2 className="text-2xl font-bold !text-white mb-2">
                  Vérifie ton numéro
                </h2>
                <p className="!text-white/60">
                  Un code de vérification a été envoyé au{' '}
                  <span className="!text-white font-medium">{formData.phone}</span>
                </p>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleOtpSubmit} className="space-y-6">
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
                      className={`w-12 h-14 rounded-xl border-2 bg-white/10 text-center text-xl font-bold !text-white focus:outline-none transition-all ${
                        otpError 
                          ? 'border-red-500' 
                          : digit 
                            ? 'border-blue-500 bg-blue-500/20' 
                            : 'border-white/20 focus:border-blue-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {otpError && (
                  <p className="text-red-400 text-sm text-center">{otpError}</p>
                )}

                {/* Resend Link */}
                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <p className="!text-white/50 text-sm">
                      Renvoyer le code dans <span className="!text-white">{resendCooldown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm !text-white/60 hover:!text-white transition-colors"
                    >
                      Pas reçu le code ?{' '}
                      <span className="font-semibold underline">Renvoyer</span>
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={otp.some(d => !d) || isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    otp.every(d => d) && !isSubmitting
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white/10 !text-white/40 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    'Vérifier et accéder'
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Form Step */}
          {step === 'form' && (
            <>
              {/* Content */}
              <div className="p-6 md:p-8 pt-12">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold !text-white mb-2">
                    Débloque tout le catalogue
                  </h2>
                  <p className="!text-white/60 text-sm md:text-base">
                    Accède gratuitement à tous nos cours pendant 10 heures.
                    <br />Zak t'accompagne vers la maîtrise.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  {/* First Name */}
                  <div>
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                      className={`w-full px-4 py-3.5 bg-white/10 rounded-xl !text-white placeholder-white/40 text-base border-2 transition-all ${
                        errors.firstName 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-transparent focus:border-blue-500 focus:bg-white/15'
                      } focus:outline-none`}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      placeholder="email@exemple.com"
                      value={formData.email}
                      onChange={handleChange('email')}
                      className={`w-full px-4 py-3.5 bg-white/10 rounded-xl !text-white placeholder-white/40 text-base border-2 transition-all ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-transparent focus:border-blue-500 focus:bg-white/15'
                      } focus:outline-none`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      placeholder="Numéro de téléphone"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      className={`w-full px-4 py-3.5 bg-white/10 rounded-xl !text-white placeholder-white/40 text-base border-2 transition-all ${
                        errors.phone 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-transparent focus:border-blue-500 focus:bg-white/15'
                      } focus:outline-none`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* School */}
                  <div>
                    <input
                      type="text"
                      placeholder="Ton établissement (Université, École...)"
                      value={formData.school}
                      onChange={handleChange('school')}
                      className={`w-full px-4 py-3.5 bg-white/10 rounded-xl !text-white placeholder-white/40 text-base border-2 transition-all ${
                        errors.school 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-transparent focus:border-blue-500 focus:bg-white/15'
                      } focus:outline-none`}
                    />
                    {errors.school && (
                      <p className="text-red-400 text-xs mt-1">{errors.school}</p>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="mt-2">
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
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          acceptedTerms 
                            ? 'bg-blue-600 border-blue-600' 
                            : errors.terms
                            ? 'border-red-500 bg-transparent'
                            : 'border-white/30 bg-transparent group-hover:border-white/50'
                        }`}>
                          {acceptedTerms && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm !text-white/70">
                        J'accepte les{' '}
                        <a href="/terms" target="_blank" className="underline hover:!text-white transition-colors">
                          conditions d'utilisation
                        </a>
                        {' '}et la{' '}
                        <a href="/privacy" target="_blank" className="underline hover:!text-white transition-colors">
                          politique de confidentialité
                        </a>
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-red-400 text-xs mt-1 ml-8">{errors.terms}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 !text-white font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi du code...
                      </>
                    ) : (
                      'Recevoir mon code d\'accès'
                    )}
                  </button>
                </form>

                {/* Trust Signals */}
                <p className="text-center !text-white/40 text-xs mt-5">
                  🔒 Tes données sont protégées. Pas de spam, promis.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LeadCaptureModal;
