'use client';

import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

// TODO: Replace with actual WhatsApp number
const WHATSAPP_NUMBER = '+324XXXXXXXX';

export function ContactSection() {
  const [situation, setSituation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [country, setCountry] = useState('');
  const [university, setUniversity] = useState('');
  const [studyLevel, setStudyLevel] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build WhatsApp message
    let message = 'Bonjour Science Made Simple,\n\n';
    
    if (situation.trim()) {
      message += `Ma situation:\n${situation.trim()}\n\n`;
    }

    if (country) message += `Pays: ${country}\n`;
    if (university) message += `Université: ${university}\n`;
    if (studyLevel) message += `Niveau: ${studyLevel}\n`;

    if (uploadedFiles.length > 0) {
      message += `\nJ'ai ${uploadedFiles.length} document(s) à partager.\n`;
    }

    message += '\nMerci de me répondre rapidement !';

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.location.href = whatsappUrl;
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
          Parle-nous de ta situation,<br />on te répond en direct sur WhatsApp
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 text-center">
          On répond personnellement, on fait un diagnostic complet et on te propose un début de plan adapté avec accès à des leçons gratuites pour tester.
        </p>

        {/* Form Card */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-gray-200 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Situation Textarea */}
            <div>
              <label htmlFor="situation" className="block text-lg font-semibold text-gray-900 mb-3">
                Explique ta situation en quelques phrases
              </label>
              <textarea
                id="situation"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Ex : Je suis en Bac 1 médecine à l'ULB, je galère en physique quantique et en stats. J'ai raté mon premier partiel avec 6/20 et je veux absolument réussir la deuxième session..."
                rows={6}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none text-gray-900 placeholder-gray-400 resize-none"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Partage tes documents (optionnel)
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
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-1">
                      Clique pour ajouter tes cours, examens, syllabus
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, Word, Images
                    </p>
                  </div>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={20} />
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
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
                </div>
              )}
            </div>

            {/* Optional fields */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Pays (optionnel)
                </label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Belgique, France..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  Université (optionnel)
                </label>
                <input
                  type="text"
                  id="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="ULB, UCL, ULg..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="studyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau (optionnel)
                </label>
                <input
                  type="text"
                  id="studyLevel"
                  value={studyLevel}
                  onChange={(e) => setStudyLevel(e.target.value)}
                  placeholder="Bac 1, Bac 2..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/30"
            >
              Envoyer sur WhatsApp
            </button>

            {/* Trust elements */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6 border-t border-gray-300 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <span>100 % gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                <span>Tes infos restent privées. On te contacte uniquement pour t'aider.</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}




