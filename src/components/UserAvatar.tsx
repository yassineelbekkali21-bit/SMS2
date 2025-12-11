'use client';

import React from 'react';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | null;
  className?: string;
}

export function UserAvatar({ name, size = 'md', status = null, className = '' }: UserAvatarProps) {
  // Extraire les initiales (première lettre du prénom et du nom)
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Fond gris uniforme pour tous les avatars
  const getBackgroundColor = (fullName: string): string => {
    return 'bg-gray-200';
  };

  // Tailles
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  // Status indicator sizes
  const statusSizes = {
    sm: 'w-2 h-2 border',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-4 h-4 border-2',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  };

  const initials = getInitials(name);
  const bgColor = getBackgroundColor(name);

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-gray-900 font-bold shadow-sm`}
      >
        {initials}
      </div>
      {status && (
        <div
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-white`}
        />
      )}
    </div>
  );
}

