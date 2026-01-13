'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowRight, Loader2, ArrowLeft, Mail, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AccountCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AccountCreationModal({ isOpen, onClose, onSuccess }: AccountCreationModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<'info' | 'otp'>('info');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+33'); // France par défaut
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const countryCodes = [
    { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
    { code: '+32', country: 'BE', flag: '🇧🇪', name: 'Belgique' },
    { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Suisse' },
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'États-Unis' },
    { code: '+44', country: 'GB', flag: '🇬🇧', name: 'Royaume-Uni' },
    { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Allemagne' },
    { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italie' },
    { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Espagne' },
    { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Pays-Bas' },
    { code: '+212', country: 'MA', flag: '🇲🇦', name: 'Maroc' },
    { code: '+213', country: 'DZ', flag: '🇩🇿', name: 'Algérie' },
    { code: '+216', country: 'TN', flag: '🇹🇳', name: 'Tunisie' },
  ];

  const validateInfoStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Téléphone requis';
    }
    
    if (!acceptedTerms) {
      newErrors.terms = 'Tu dois accepter les conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTPStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (!otpVerified) {
      newErrors.otp = 'Code OTP non vérifié';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = () => {
    if (validateInfoStep() && formData.phone.trim()) {
      // TODO: Send OTP via SMS
      const fullPhoneNumber = `${selectedCountryCode}${formData.phone.replace(/\s/g, '')}`;
      console.log('Sending OTP to:', fullPhoneNumber);
      setOtpSent(true);
      setOtpError('');
      setResendCountdown(60); // 60 secondes
      setCurrentStep('otp');
      
      // Countdown timer
      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Ne permet qu'un seul chiffre
    
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value.replace(/\D/g, '');
    setOtpCode(newOtpCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
    
    // Auto-verify when all fields are filled
    if (newOtpCode.every(digit => digit !== '') && newOtpCode.join('').length === 6) {
      handleVerifyOTP(newOtpCode.join(''));
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = (code?: string) => {
    const codeToVerify = code || otpCode.join('');
    // TODO: Verify OTP with backend
    if (codeToVerify === '123456' || (codeToVerify.length === 6 && codeToVerify.match(/^\d{6}$/))) {
      setOtpVerified(true);
      setOtpError('');
      setErrors({});
    } else {
      setOtpError('Code invalide');
      setErrors({ otp: 'Code invalide' });
      // Clear OTP fields on error
      setOtpCode(['', '', '', '', '', '']);
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTPStep()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store user data in localStorage
    localStorage.setItem('sms_user', JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      createdAt: new Date().toISOString(),
      hasCompletedDiagnostic: false
    }));
    
    // Set flag to auto-open diagnostic popup after redirect
    sessionStorage.setItem('sms_auto_open_diagnostic', 'true');
    
    setIsSubmitting(false);
    
    if (onSuccess) {
      onSuccess();
    } else {
      // Default: redirect to Simple Dashboard
      window.location.href = '/dashboard';
    }
    
    onClose();
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
        
        {/* Modal - Style LeadCapture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl ${currentStep === 'info' ? 'max-w-2xl' : 'max-w-lg'}`}
        >
          {/* Header avec Favicon et X - Only for step 1 */}
          {currentStep === 'info' && (
            <div className="flex items-center justify-between px-8 pt-8">
              <div className="w-20 h-20 relative">
                <Image 
                  src="/brand/onboarding-logo.svg" 
                  alt="SMS" 
                  fill 
                  className="object-contain"
                />
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className={`px-10 pb-10 ${currentStep === 'info' ? 'pt-6' : 'pt-8'}`}>
            {/* Title - Parafina style - Only for step 1 */}
            {currentStep === 'info' && (
              <div className="text-center mb-8">
                <h2 
                  className="font-normal !text-white mb-3"
                  style={{ fontFamily: 'var(--font-parafina)', fontSize: '40px' }}
                >
                  Créons tes premiers<br />
                  parcours d'apprentissage
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px', lineHeight: '1.5' }}>
                  Accède à tous nos programmes.<br />
                  Gratuitement. Sans engagement.
                </p>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 'info' && (
              <div className="space-y-4">
                {/* First Name & Last Name - 2 columns */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Ton prénom"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                  <div>
                    <input
                      type="text"
                      placeholder="Ton nom"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full px-5 py-4 bg-transparent rounded-full !text-white placeholder-white/40 text-base border transition-all ${
                        errors.lastName 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-white/20 focus:border-white/40'
                      } focus:outline-none`}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1.5 ml-4">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Ton email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className={`flex items-center gap-2 px-4 py-4 bg-transparent rounded-full !text-white text-base border transition-all ${
                          errors.phone 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : 'border-white/20 focus:border-white/40'
                        } focus:outline-none hover:border-white/40`}
                      >
                        <span className="text-lg">
                          {countryCodes.find(c => c.code === selectedCountryCode)?.flag || '🇫🇷'}
                        </span>
                        <span className="text-sm">{selectedCountryCode}</span>
                        <ChevronDown size={16} className="text-white/60" />
                      </button>
                      
                      {/* Dropdown */}
                      {showCountryDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowCountryDropdown(false)}
                          />
                          <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto">
                            {countryCodes.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountryCode(country.code);
                                  setShowCountryDropdown(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                                  selectedCountryCode === country.code ? 'bg-white/10' : ''
                                }`}
                              >
                                <span className="text-xl">{country.flag}</span>
                                <span className="text-white/80 text-sm">{country.name}</span>
                                <span className="ml-auto text-white/60 text-sm">{country.code}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Phone Number Input */}
                    <input
                      type="tel"
                      placeholder="6 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => {
                        // Format: only digits and spaces
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, phone: value });
                      }}
                      className={`flex-1 px-5 py-4 bg-transparent rounded-full !text-white placeholder-white/40 text-base border transition-all ${
                        errors.phone 
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-white/20 focus:border-white/40'
                      } focus:outline-none`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1.5 ml-4">{errors.phone}</p>
                  )}
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all relative ${
                        acceptedTerms 
                          ? 'bg-[#00c2ff]' 
                          : 'bg-transparent'
                      }`} style={{
                        border: acceptedTerms ? '2px solid #00c2ff' : '2px solid rgba(255, 255, 255, 0.4)',
                        boxShadow: acceptedTerms ? 'inset 0 0 0 1px rgba(255, 255, 255, 0.3)' : 'none'
                      }}>
                        {acceptedTerms && (
                          <svg className="w-3 h-3 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-white/70 leading-relaxed">
                      J'accepte les{' '}
                      <a href="/terms" target="_blank" className="text-[#00c2ff] hover:text-[#00d4ff] underline">
                        Conditions Générales d'Utilisation
                      </a>{' '}
                      et la{' '}
                      <a href="/privacy" target="_blank" className="text-[#00c2ff] hover:text-[#00d4ff] underline">
                        Politique de Confidentialité
                      </a>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-400 text-xs mt-1.5 ml-8">{errors.terms}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={!formData.phone.trim() || !acceptedTerms}
                  className={`w-full mt-3 px-5 py-4 rounded-full font-medium transition-all ${
                    formData.phone.trim() && acceptedTerms
                      ? 'bg-[#00c2ff] hover:bg-[#00d4ff] text-white'
                      : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
                  }`}
                >
                  Envoyer code
                </button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 'otp' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center justify-start mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('info');
                      setOtpCode(['', '', '', '', '', '']);
                      setOtpError('');
                      setOtpVerified(false);
                      setOtpSent(false);
                      setErrors({});
                      setResendCountdown(0);
                    }}
                    className="flex items-center justify-center text-white/60 hover:text-white transition-all"
                  >
                    <ArrowLeft size={24} />
                  </button>
                </div>

                {/* SMS Logo */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 relative">
                    <Image 
                      src="/brand/onboarding-logo.svg" 
                      alt="SMS" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold !text-white mb-3">
                    Vérifie ton téléphone
                  </h2>
                  <p className="text-white/90 text-sm !text-white/90">
                    Un code à 6 chiffres a été envoyé à<br />
                    {selectedCountryCode} {formData.phone}
                  </p>
                </div>

                {/* OTP Input - 6 separate fields */}
                <div className="flex justify-center gap-3 mb-4">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className={`w-12 h-14 rounded-lg bg-transparent border-2 text-white text-center text-2xl font-semibold focus:outline-none transition-all ${
                        otpError || errors.otp
                          ? 'border-red-500/50 focus:border-red-500' 
                          : 'border-white/20 focus:border-white/60 focus:border-[#00c2ff]'
                      }`}
                    />
                  ))}
                </div>

                {(otpError || errors.otp) && (
                  <p className="text-red-400 text-xs text-center">{otpError || errors.otp}</p>
                )}

                {/* Resend Code */}
                <div className="text-center">
                  {resendCountdown > 0 ? (
                    <p className="text-white/90 text-sm !text-white/90">
                      Renvoyer le code dans {resendCountdown}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Resending OTP to:', formData.phone);
                        setOtpCode(['', '', '', '', '', '']);
                        setOtpError('');
                        setErrors({});
                        setOtpVerified(false);
                        setResendCountdown(60);
                        
                        // Countdown timer
                        const interval = setInterval(() => {
                          setResendCountdown((prev) => {
                            if (prev <= 1) {
                              clearInterval(interval);
                              return 0;
                            }
                            return prev - 1;
                          });
                        }, 1000);
                      }}
                      className="text-[#00c2ff] hover:text-[#00d4ff] text-sm transition-colors"
                    >
                      Renvoyer le code
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !otpVerified || otpCode.some(d => !d)}
                  className="w-full py-4 bg-[#00c2ff] hover:bg-[#00b0e8] disabled:opacity-50 !text-white font-semibold text-base rounded-full transition-all flex items-center justify-center gap-3 mt-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      Accéder aux cours
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AccountCreationModal;
