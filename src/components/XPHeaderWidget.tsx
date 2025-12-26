'use client';

import { UserXPProfile } from '@/lib/xp-service';

interface XPHeaderWidgetProps {
  profile: UserXPProfile;
  onClick: () => void;
}

export function XPHeaderWidget({ profile, onClick }: XPHeaderWidgetProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-target flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
    >
      <span className="text-sm font-semibold">
        Niveau {profile.currentLevel.level}
      </span>
      <span className="text-gray-400">•</span>
      <span className="text-sm font-bold text-gray-900">
        {profile.totalXP.toLocaleString()} XP
      </span>
      {profile.dailyStreak > 3 && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-base">🔥</span>
          <span className="text-sm font-medium">{profile.dailyStreak}</span>
        </>
      )}
    </button>
  );
}

