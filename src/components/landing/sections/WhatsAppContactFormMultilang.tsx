'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Upload, FileText, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '32477025622';

export function WhatsAppContactFormMultilang() {
  const [situation, setSituation] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language, t } = useLanguage();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let message = language === 'fr' 
      ? '👋 Bonjour Science Made Simple !\n\n'
      : '👋 Hello Science Made Simple!\n\n';
    
    if (situation.trim()) {
      message += language === 'fr'
        ? `📝 **Ma situation :**\n${situation.trim()}\n\n`
        : `📝 **My situation:**\n${situation.trim()}\n\n`;
    } else {
      message += language === 'fr'
        ? `J'aimerais un diagnostic personnalisé pour voir comment vous pouvez m'aider.\n\n`
        : `I'd like a personalized diagnosis to see how you can help me.\n\n`;
    }

    if (uploadedFiles.length > 0) {
      message += language === 'fr'
        ? `📎 **Documents joints :** ${uploadedFiles.length} fichier(s) (${uploadedFiles.map(f => f.name).join(', ')})\nJe vais vous les envoyer juste après ce message.\n\n`
        : `📎 **Attached documents:** ${uploadedFiles.length} file(s) (${uploadedFiles.map(f => f.name).join(', ')})\nI will send them right after this message.\n\n`;
    }
    
    message += language === 'fr' ? `Merci de me répondre rapidement ! 🙏` : `Thanks for responding quickly! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  const isFormValid = situation.trim().length > 0;

  return (
    <section id="whatsapp-contact" className="py-20 md:py-28 px-6 md:px-8 lg:px-10 bg-gradient-to-br from-gray-50 to-white scroll-mt-32">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('contact.title')}
            <br />
            <span className="text-blue-600">{t('contact.title.highlight')}</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm md:text-base text-gray-700"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{t('contact.point1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{t('contact.point2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{t('contact.point3')}</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="situation" className="block text-lg font-semibold text-gray-900 mb-4">
                {t('contact.label')}
              </label>
              <textarea
                id="situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder={t('contact.placeholder')}
                rows={6}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none text-gray-900 placeholder-gray-400 resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 {t('contact.tip')}
              </p>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                {t('contact.files.label')}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                    <Upload className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-1">
                      {t('contact.files.cta')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t('contact.files.formats')}
                    </p>
                  </div>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    {t('contact.files.count')} ({uploadedFiles.length}) :
                  </p>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">
                    💡 {t('contact.files.tip')}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-5 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                isFormValid && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('contact.submitting')}
                </>
              ) : (
                <>
                  <MessageCircle size={22} />
                  {t('contact.submit')}
                </>
              )}
            </button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mt-8"
        >
          🔒 {t('contact.privacy')}
        </motion.p>
      </div>
    </section>
  );
}




