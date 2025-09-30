'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Users,
  Settings,
  HelpCircle,
  Search,
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  Globe,
  Zap,
  Command
} from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  href?: string;
  onClick?: () => void;
  badge?: number;
  shortcut?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EnhancedNavigationProps {
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  user: {
    name: string;
    avatar?: string;
    isWeb3Connected?: boolean;
  };
  onNavigate: (path: string) => void;
  onWeb3Toggle?: () => void;
}

// Animation variants pour les transitions fluides
const navigationVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30 
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 }
  }
};

const breadcrumbVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }
  }
};

export function EnhancedNavigation({
  currentPath,
  breadcrumbs,
  user,
  onNavigate,
  onWeb3Toggle
}: EnhancedNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { announceLiveRegion, reducedMotion } = useAccessibility();

  // Navigation items avec badges et raccourcis
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: Home,
      href: '/dashboard',
      shortcut: '⌘ D'
    },
    {
      id: 'courses',
      label: 'Mes cours',
      icon: BookOpen,
      href: '/courses',
      badge: 3,
      shortcut: '⌘ C'
    },
    {
      id: 'community',
      label: 'Communauté',
      icon: Users,
      href: '/community',
      badge: 12,
      shortcut: '⌘ U'
    },
    {
      id: 'web3',
      label: 'Web 3.0',
      icon: Globe,
      onClick: onWeb3Toggle,
      shortcut: '⌘ W'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      href: '/settings',
      shortcut: '⌘ ,'
    }
  ];

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'd':
            event.preventDefault();
            onNavigate('/dashboard');
            announceLiveRegion('Navigation vers le tableau de bord');
            break;
          case 'c':
            event.preventDefault();
            onNavigate('/courses');
            announceLiveRegion('Navigation vers mes cours');
            break;
          case 'u':
            event.preventDefault();
            onNavigate('/community');
            announceLiveRegion('Navigation vers la communauté');
            break;
          case 'w':
            event.preventDefault();
            onWeb3Toggle?.();
            announceLiveRegion('Basculement Web 3.0');
            break;
          case 'k':
            event.preventDefault();
            setShowSearch(true);
            announceLiveRegion('Ouverture de la recherche');
            break;
        }
      }
      
      if (event.key === 'Escape') {
        setShowSearch(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, onWeb3Toggle, announceLiveRegion]);

  const transitionProps = reducedMotion 
    ? {} 
    : {
        initial: "hidden",
        animate: "visible",
        exit: "exit",
        variants: navigationVariants
      };

  return (
    <>
      {/* Sidebar principale */}
      <motion.nav
        {...transitionProps}
        className={`
          fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 z-40
          transition-all duration-300 ease-out
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header avec toggle */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Zap className="text-white" size={16} />
                  </div>
                  <span className="font-bold text-gray-900">Science Made Simple</span>
                </motion.div>
              )}
              
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isCollapsed ? 'Développer la navigation' : 'Réduire la navigation'}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              const IconComponent = item.icon;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (item.href) onNavigate(item.href);
                    if (item.onClick) item.onClick();
                  }}
                  whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
                  whileTap={!reducedMotion ? { scale: 0.98 } : undefined}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="relative">
                    <IconComponent size={20} />
                    {item.badge && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </div>
                    )}
                  </div>
                  
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 flex items-center justify-between"
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-xs opacity-60 font-mono">
                          {item.shortcut}
                        </span>
                      )}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* User section */}
          <div className="p-4 border-t border-gray-100">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-100
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      {user.isWeb3Connected && (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Web3 connecté
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </button>

              {/* User menu dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`
                      absolute bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-200 min-w-48
                      ${isCollapsed ? 'left-16' : 'left-0 right-0'}
                    `}
                  >
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <User size={16} />
                        <span>Mon profil</span>
                      </button>
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                        <span>{darkMode ? 'Mode clair' : 'Mode sombre'}</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <HelpCircle size={16} />
                        <span>Aide</span>
                      </button>
                      <hr className="my-2" />
                      <button className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={16} />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Breadcrumb bar */}
      <motion.div
        {...breadcrumbVariants}
        className={`
          fixed top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-30
          transition-all duration-300
          ${isCollapsed ? 'left-16' : 'left-64'} right-0
        `}
      >
        <div className="flex items-center justify-between p-4">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight size={14} className="text-gray-400 mx-2" />
                  )}
                  {crumb.href || crumb.onClick ? (
                    <button
                      onClick={() => {
                        if (crumb.href) onNavigate(crumb.href);
                        if (crumb.onClick) crumb.onClick();
                      }}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Search size={16} />
              <span className="text-sm">Rechercher</span>
              <span className="text-xs opacity-60">⌘K</span>
            </button>

            <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Search size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher des cours, des questions, des utilisateurs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-lg placeholder-gray-400 bg-transparent border-none outline-none"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Command size={14} />
                    <span>K</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {searchQuery ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 mb-3">
                      Résultats pour "{searchQuery}"
                    </div>
                    {/* Ici on afficherait les résultats de recherche */}
                    <div className="text-center py-8 text-gray-500">
                      Fonctionnalité de recherche à implémenter
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500">Recherches populaires</div>
                    <div className="space-y-2">
                      {['Analyse mathématique', 'Physique quantique', 'Chimie organique'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="block w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

