import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { useNotifications } from '@/lib/notification-service';
import { Notification, NotificationCategory } from '@/types';

interface NotificationWidgetProps {
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationWidget({ onNotificationClick }: NotificationWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');
  const widgetRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  // Fermer le panneau en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Filtrer les notifications par catégorie
  const filteredNotifications = selectedCategory === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === selectedCategory);

  // Gérer le clic sur une notification
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    } else if (notification.actionUrl) {
      // Navigation par défaut si aucun handler custom
      window.location.href = notification.actionUrl;
    }
  };

  // Configuration des catégories
  const categories = [
    { key: 'all' as const, label: 'Toutes', icon: '📋' },
    { key: NotificationCategory.COURSES, label: 'Cours', icon: '📚' },
    { key: NotificationCategory.PLANNING, label: 'Planning', icon: '📅' },
    { key: NotificationCategory.PROGRESS, label: 'Progrès', icon: '🎓' },
    { key: NotificationCategory.COMMUNITY, label: 'Communauté', icon: '👥' },
    { key: NotificationCategory.WALLET, label: 'Portefeuille', icon: '💳' },
    { key: NotificationCategory.ACHIEVEMENTS, label: 'Succès', icon: '🏆' }
  ];

  // Obtenir la couleur selon la priorité
  const getPriorityColor = (priority: 'low' | 'normal' | 'high') => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'normal': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Obtenir l'icône de la catégorie
  const getCategoryIcon = (category: NotificationCategory) => {
    const categoryConfig = categories.find(c => c.key === category);
    return categoryConfig?.icon || '🔔';
  };

  // Formater la date relative
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  };

  return (
    <div className="relative" ref={widgetRef}>
      {/* Bouton notification avec badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group"
        title={`${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`}
      >
        <Bell 
          size={18} 
          className={`transition-colors ${unreadCount > 0 ? 'text-blue-600' : 'text-gray-600'} group-hover:text-gray-900`} 
        />
        
        {/* Badge de compteur */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Panneau de notifications */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-[600px] flex flex-col"
          >
            {/* Header du panneau */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      title="Marquer tout comme lu"
                    >
                      <CheckCheck size={14} />
                      Tout lire
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Filtres par catégorie */}
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {categories.map((category) => {
                  const count = category.key === 'all' 
                    ? notifications.length 
                    : notifications.filter(n => n.category === category.key).length;
                    
                  return (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        selectedCategory === category.key
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.label}
                      {count > 0 && (
                        <span className="ml-1 bg-gray-300 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bell size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucune notification</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedCategory === 'all' 
                      ? 'Tu es à jour !' 
                      : `Aucune notification dans "${categories.find(c => c.key === selectedCategory)?.label}"`
                    }
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 mb-2 rounded-xl border-l-4 cursor-pointer transition-all hover:shadow-md ${
                        notification.isRead
                          ? 'bg-white border-l-gray-200'
                          : `${getPriorityColor(notification.priority)} border-l-4`
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Icône de la notification */}
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">
                              {notification.icon || getCategoryIcon(notification.category)}
                            </span>
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm font-medium truncate ${
                                notification.isRead ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className={`text-xs mt-1 ${
                              notification.isRead ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {getRelativeTime(notification.createdAt)}
                              </span>
                              {notification.actionUrl && (
                                <ExternalLink size={12} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
                              title="Marquer comme lu"
                            >
                              <Check size={12} className="text-gray-400" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
                            title="Supprimer"
                          >
                            <X size={12} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec actions */}
            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''}</span>
                  <button
                    onClick={() => {
                      filteredNotifications.forEach(n => removeNotification(n.id));
                    }}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Tout effacer
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}






