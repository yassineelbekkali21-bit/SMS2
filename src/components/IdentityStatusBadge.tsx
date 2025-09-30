'use client';

import React from 'react';
import { Shield, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { IdentityVerificationService } from '@/lib/identity-verification-service';

interface IdentityStatusBadgeProps {
  className?: string;
  showLabel?: boolean;
}

export function IdentityStatusBadge({ className = '', showLabel = true }: IdentityStatusBadgeProps) {
  const state = IdentityVerificationService.getState();
  const statusLabel = IdentityVerificationService.getStatusLabel();
  const statusColor = IdentityVerificationService.getStatusColor();

  const getIcon = () => {
    switch (state.status) {
      case 'verified':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-blue-600" />;
      case 'rejected':
        return <X size={16} className="text-red-600" />;
      case 'required':
        return <AlertCircle size={16} className="text-orange-600" />;
      default:
        return <Shield size={16} className="text-gray-400" />;
    }
  };

  const getBadgeColor = () => {
    switch (state.status) {
      case 'verified':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-blue-50 border-blue-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'required':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (state.status === 'not_required') {
    return null;
  }

  const getImprovedCopywriting = () => {
    switch (state.status) {
      case 'verified':
        return {
          title: 'Identité vérifiée',
          subtitle: 'Compte sécurisé ✓'
        };
      case 'pending':
        return {
          title: 'Vérification en cours',
          subtitle: 'Document en cours d\'analyse'
        };
      case 'rejected':
        return {
          title: 'Document à renouveler',
          subtitle: 'Merci de soumettre un nouveau document'
        };
      case 'required':
        return {
          title: 'Vérification requise',
          subtitle: 'Sécurisez votre compte en 2 minutes'
        };
      default:
        return {
          title: 'Vérification d\'identité',
          subtitle: 'Statut non défini'
        };
    }
  };

  const copywriting = getImprovedCopywriting();

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border ${getBadgeColor()} ${className}`}>
      {getIcon()}
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {copywriting.title}
          </span>
          <span className={`text-xs ${statusColor} font-medium`}>
            {copywriting.subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
