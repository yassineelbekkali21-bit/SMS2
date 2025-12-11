'use client';

import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Download, Share2, Copy, Check } from 'lucide-react';

interface InviteQRCodeProps {
  inviteUrl: string;
  inviterName: string;
  size?: number;
}

export function InviteQRCode({ inviteUrl, inviterName, size = 200 }: InviteQRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Créer un canvas plus grand avec texte et logo
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    const padding = 40;
    const textHeight = 60;
    finalCanvas.width = size + padding * 2;
    finalCanvas.height = size + padding * 2 + textHeight;

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Dessiner le QR Code
    ctx.drawImage(canvas, padding, padding);

    // Texte en bas
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${inviterName} t'invite sur`,
      finalCanvas.width / 2,
      size + padding + 25
    );
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(
      'Science Made Simple',
      finalCanvas.width / 2,
      size + padding + 45
    );

    // Télécharger
    finalCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invitation-sms-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  const handleShare = async () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        const file = new File([blob], 'invitation-sms.png', { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Invitation de ${inviterName}`,
            text: `Rejoins ${inviterName} sur Science Made Simple !`,
            url: inviteUrl,
            files: [file]
          });
        } else {
          // Fallback: télécharger
          handleDownload();
        }
      } catch (error) {
        console.error('Erreur partage:', error);
        handleDownload();
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* QR Code avec bordure élégante */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div 
          ref={qrRef}
          className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-lg inline-block"
        >
          <QRCodeCanvas
            value={inviteUrl}
            size={size}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "/logo.svg", // Votre logo au centre (optionnel)
              height: size * 0.15,
              width: size * 0.15,
              excavate: true,
            }}
          />
        </div>

        {/* Badge "Scanne-moi" */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
        >
          📱 Scanne-moi !
        </motion.div>
      </motion.div>

      {/* Texte descriptif */}
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-gray-900">
          {inviterName} t'invite à rejoindre
        </p>
        <p className="text-sm font-semibold text-blue-600">
          Science Made Simple
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download size={18} className="text-gray-700" />
          <span className="text-xs font-medium text-gray-700">
            Télécharger
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Share2 size={18} className="text-gray-700" />
          <span className="text-xs font-medium text-gray-700">
            Partager
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyLink}
          className="flex flex-col items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check size={18} className="text-green-600" />
              <span className="text-xs font-medium text-green-600">
                Copié !
              </span>
            </>
          ) : (
            <>
              <Copy size={18} className="text-gray-700" />
              <span className="text-xs font-medium text-gray-700">
                Copier lien
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}









