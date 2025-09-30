import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Bell, 
  Settings, 
  Check, 
  X,
  Heart,
  Phone,
  Mail,
  Smartphone,
  Clock,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { BuddySystem, PlannerNotification } from '@/types/index';

interface BuddySystemProps {
  buddy?: BuddySystem;
  onAddBuddy?: (buddy: Omit<BuddySystem, 'id' | 'userId'>) => void;
  onUpdateBuddy?: (buddy: BuddySystem) => void;
  onRemoveBuddy?: () => void;
  onSendNotification?: (type: 'missed-session' | 'progress-update', sessionName?: string) => void;
}

export function BuddySystemComponent({ 
  buddy, 
  onAddBuddy, 
  onUpdateBuddy, 
  onRemoveBuddy,
  onSendNotification 
}: BuddySystemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [formData, setFormData] = useState({
    buddyName: '',
    buddyContact: '',
    contactMethod: 'whatsapp' as 'email' | 'sms' | 'whatsapp',
    alertFrequency: 'immediate' as 'immediate' | 'daily' | 'weekly'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.buddyName && formData.buddyContact) {
      onAddBuddy?.({
        ...formData,
        isActive: true
      });
      setFormData({
        buddyName: '',
        buddyContact: '',
        contactMethod: 'whatsapp',
        alertFrequency: 'immediate'
      });
      setShowAddForm(false);
    }
  };

  const handleToggleActive = () => {
    if (buddy && onUpdateBuddy) {
      onUpdateBuddy({
        ...buddy,
        isActive: !buddy.isActive
      });
    }
  };

  // Pas de buddy configuré - Version minimaliste
  if (!buddy) {
    return (
      <div className="border border-gray-200 bg-white">
        <div className="p-4">
          <div className="text-center">
            <div className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={20} />
            </div>
            
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Désigne quelqu'un qui recevra des alertes si tu rates tes sessions d'étude.
            </p>

            <motion.button
              onClick={() => setShowAddForm(true)}
              whileHover={{ x: 2 }}
              className="w-full py-2 border border-gray-300 text-black text-sm font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Ajouter un buddy
            </motion.button>
          </div>

          {/* Formulaire d'ajout minimaliste */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={formData.buddyName}
                      onChange={(e) => setFormData({ ...formData, buddyName: e.target.value })}
                      placeholder="Nom (ex: Maman, Tom...)"
                      className="w-full p-2 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.buddyContact}
                      onChange={(e) => setFormData({ ...formData, buddyContact: e.target.value })}
                      placeholder={
                        formData.contactMethod === 'email' ? 'email@example.com' :
                        '+33 6 12 34 56 78'
                      }
                      className="w-full p-2 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.contactMethod}
                      onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                    </select>

                    <select
                      value={formData.alertFrequency}
                      onChange={(e) => setFormData({ ...formData, alertFrequency: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 text-sm focus:border-black focus:outline-none transition-colors"
                    >
                      <option value="immediate">Immédiate</option>
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <motion.button
                      type="submit"
                      whileHover={{ x: 1 }}
                      className="flex-1 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Confirmer
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      whileHover={{ x: 1 }}
                      className="flex-1 py-2 border border-gray-300 text-black text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Buddy configuré - Version minimaliste
  const contactIcon = {
    whatsapp: MessageCircle,
    sms: Smartphone,
    email: Mail
  }[buddy.contactMethod];

  const ContactIcon = contactIcon;

  return (
    <div className="border border-gray-200 bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              buddy.isActive ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <ContactIcon className={buddy.isActive ? 'text-green-600' : 'text-gray-400'} size={14} />
            </div>
            <div>
              <h4 className="font-medium text-black text-sm">
                {buddy.buddyName}
              </h4>
              <p className="text-xs text-gray-600">
                {buddy.isActive ? 'Actif' : 'Inactif'} • {buddy.alertFrequency}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Contact et actions minimalistes */}
        <div className="text-xs text-gray-600 mb-3">
          {buddy.buddyContact}
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={handleToggleActive}
            whileHover={{ x: 1 }}
            className={`flex-1 py-2 text-xs font-medium transition-all ${
              buddy.isActive 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {buddy.isActive ? 'Désactiver' : 'Activer'}
          </motion.button>

          <motion.button
            onClick={() => onSendNotification?.('progress-update')}
            whileHover={{ x: 1 }}
            className="flex-1 py-2 border border-gray-300 text-black text-xs font-medium hover:bg-gray-50 transition-colors"
            disabled={!buddy.isActive}
          >
            Test
          </motion.button>
        </div>

        {/* Settings Panel minimaliste */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex gap-2">
                <motion.button
                  onClick={onRemoveBuddy}
                  whileHover={{ x: 1 }}
                  className="flex-1 py-2 bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </motion.button>
                <motion.button
                  onClick={() => setShowSettings(false)}
                  whileHover={{ x: 1 }}
                  className="flex-1 py-2 border border-gray-300 text-black text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
