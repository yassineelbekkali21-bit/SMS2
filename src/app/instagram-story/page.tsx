'use client';

import React from 'react';
import InstagramStoryRebranding from '@/components/InstagramStoryRebranding';

export default function InstagramStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Instagram Story - Rebranding Announcement
          </h1>
          <p className="text-gray-400 text-lg">
            Premium announcement for Science Made Simple
          </p>
        </div>

        {/* Story Component */}
        <div className="flex justify-center">
          <InstagramStoryRebranding />
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              📱 How to Use
            </h2>
            <div className="text-gray-300 space-y-2">
              <p>• Use the arrows to navigate between frames</p>
              <p>• Click on the progress indicators to jump to specific frames</p>
              <p>• Stories auto-advance every 5 seconds</p>
              <p>• Optimized for mobile viewing (9:16 aspect ratio)</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎨 Design Features
            </h2>
            <div className="text-gray-300 space-y-2">
              <p>• Apple-level minimalism with elegant transitions</p>
              <p>• Brand colors: Deep Blue (#0A0F2C), Soft Gold (#E4C77F)</p>
              <p>• Premium animations using Framer Motion</p>
              <p>• Subtle scientific-inspired background elements</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              📤 Export for Instagram
            </h2>
            <div className="text-gray-300 space-y-2">
              <p>• Use screen recording software to capture each frame</p>
              <p>• Or screenshot each frame and create a carousel</p>
              <p>• Recommended: 1080×1920px for Instagram Stories</p>
              <p>• Test on mobile device for best preview</p>
            </div>
          </div>
        </div>

        {/* Color Palette Reference */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Brand Color Palette
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{ backgroundColor: '#FFFFFF' }} />
              <p className="text-xs text-gray-400 text-center">White</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{ backgroundColor: '#000000' }} />
              <p className="text-xs text-gray-400 text-center">Black</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{ backgroundColor: '#0A0F2C' }} />
              <p className="text-xs text-gray-400 text-center">Deep Blue</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{ backgroundColor: '#E4C77F' }} />
              <p className="text-xs text-gray-400 text-center">Soft Gold</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg" style={{ backgroundColor: '#E5E7EB' }} />
              <p className="text-xs text-gray-400 text-center">Light Grey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


