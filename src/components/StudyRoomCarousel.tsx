'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, PanInfo, useMotionValue } from 'framer-motion';
import { Play, Clock, Volume2, VolumeX, Globe, Lock } from 'lucide-react';

interface StudyRoomItem {
  id: string;
  userName: string;
  courseName?: string;
  participants?: Array<{ avatar: string; name: string; isBuddy: boolean }>;
  status?: 'live' | 'upcoming' | 'ended';
  scheduledTime?: Date;
  hasBuddies: boolean;
  isSilent: boolean;
  isPublic: boolean;
}

interface StudyRoomCarouselProps {
  items: StudyRoomItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
}

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

export default function StudyRoomCarousel({
  items,
  autoplay = false,
  autoplayDelay = 5000,
  pauseOnHover = true
}: StudyRoomCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dimensions for 3 visible items
  const containerWidth = 100; // percentage
  const itemWidth = (containerWidth - 2) / 3; // 3 items with gaps
  const trackItemOffset = itemWidth + 0.5; // item width + gap in percentage

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => {
          // Loop back to start when reaching the end
          if (prev >= items.length - 3) {
            return 0;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, items.length, pauseOnHover]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex(prev => Math.min(prev + 1, items.length - 3));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <motion.div
        className="flex"
        drag="x"
        dragConstraints={{
          left: -(trackItemOffset * (items.length - 3)),
          right: 0
        }}
        style={{
          gap: `${GAP}px`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: `${-(currentIndex * trackItemOffset)}%` }}
        transition={SPRING_OPTIONS}
      >
        {items.filter(s => s.status === 'live' || s.status === 'upcoming').map((story, index) => {
          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className="cursor-target relative group flex-shrink-0"
              style={{ width: `calc(${itemWidth}% - ${GAP * 2 / 3}px)` }}
              title={`${story.userName}\n${story.isSilent ? '🔇 Silencieux' : '🔊 Avec audio'} • ${story.isPublic ? '🌍 Public' : '🔒 Privé'}`}
            >
              <div className={`p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 ${
                story.hasBuddies ? 'border-yellow-300 shadow-md shadow-yellow-100' : 'border-blue-200'
              } hover:shadow-xl transition-all h-full flex flex-col`}>
                {/* Header avec status */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{story.userName}</h4>
                  </div>
                  
                  {/* Status Badge */}
                  {story.status === 'live' && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-red-600 px-2 py-1 rounded-full shadow-lg shadow-red-300"
                    >
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                      />
                      LIVE
                    </motion.div>
                  )}
                </div>

                {/* Room Info Icons + Avatars */}
                <div className="flex items-center justify-between mb-3">
                  {/* Icons à gauche */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      {story.isSilent ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      {story.isPublic ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Avatars à droite */}
                  {story.participants && story.participants.length > 0 && (
                    <div className="flex -space-x-2">
                      {story.participants.slice(0, 3).map((participant, idx) => (
                        <div
                          key={idx}
                          className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold shadow-sm ${
                            participant.isBuddy 
                              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                          title={participant.name}
                        >
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {story.participants.length > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center shadow-sm">
                          <span className="text-[9px] font-bold text-gray-700">+{story.participants.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {story.status === 'live' ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-bold rounded-lg shadow-md flex items-center justify-center gap-1 mt-auto"
                  >
                    <Play className="w-3 h-3" fill="white" />
                    Rejoindre
                  </motion.button>
                ) : story.scheduledTime ? (
                  <button className="w-full py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg flex items-center justify-center gap-1 mt-auto">
                    <Clock className="w-3 h-3" />
                    {formatTime(story.scheduledTime)}
                  </button>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dots Indicator */}
      {items.filter(s => s.status === 'live' || s.status === 'upcoming').length > 3 && (
        <div className="flex justify-center mt-3">
          <div className="flex gap-1.5">
            {Array.from({ length: Math.max(items.filter(s => s.status === 'live' || s.status === 'upcoming').length - 2, 1) }).map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                  currentIndex === index
                    ? 'bg-blue-600 w-6'
                    : 'bg-gray-300 w-1.5 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

