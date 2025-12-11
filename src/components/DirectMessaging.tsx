'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Search, 
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Circle,
  ArrowLeft,
  Plus,
  User,
  Users,
  UserCheck,
  X,
  Image as ImageIcon,
  File
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

interface Conversation {
  contactId: string;
  messages: Message[];
}

const MOCK_CONTACTS: Contact[] = [
  { 
    id: 'sarah-1', 
    name: 'Sarah Martin', 
    avatar: '👩‍🎓', 
    isOnline: true, 
    lastMessage: 'Merci pour le partage !', 
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unreadCount: 2
  },
  { 
    id: 'zak-1', 
    name: 'Zak El Amrani', 
    avatar: '👨‍💼', 
    isOnline: true, 
    lastMessage: 'À quelle heure pour demain ?', 
    lastMessageTime: new Date(Date.now() - 15 * 60000),
    unreadCount: 1
  },
  { 
    id: 'maya-1', 
    name: 'Maya Benali', 
    avatar: '👩‍🔬', 
    isOnline: false, 
    lastMessage: 'Super idée pour le projet !', 
    lastMessageTime: new Date(Date.now() - 120 * 60000),
    unreadCount: 0
  },
  { 
    id: 'leo-1', 
    name: 'Léo Dubois', 
    avatar: '👨‍🎓', 
    isOnline: true, 
    lastMessage: 'Tu as vu le dernier cours ?', 
    lastMessageTime: new Date(Date.now() - 180 * 60000),
    unreadCount: 0
  },
  { 
    id: 'emma-1', 
    name: 'Emma Laurent', 
    avatar: '👩', 
    isOnline: false, 
    lastMessage: 'Je t\'envoie mes notes ce soir', 
    lastMessageTime: new Date(Date.now() - 1440 * 60000),
    unreadCount: 0
  },
];

const MOCK_CONVERSATIONS: Record<string, Message[]> = {
  // Conversations 1 à 1 avec buddies
  'sarah-1': [
    { id: 'm1', senderId: 'sarah-1', content: 'Salut ! Tu as compris l\'exercice 5 ?', timestamp: new Date(Date.now() - 60 * 60000), read: true, type: 'text' },
    { id: 'm2', senderId: 'me', content: 'Oui, je peux t\'expliquer si tu veux', timestamp: new Date(Date.now() - 55 * 60000), read: true, type: 'text' },
    { id: 'm3', senderId: 'sarah-1', content: 'Ce serait génial ! Tu es dispo demain ?', timestamp: new Date(Date.now() - 50 * 60000), read: true, type: 'text' },
    { id: 'm4', senderId: 'me', content: 'Oui, on peut se retrouver à la bibli vers 14h', timestamp: new Date(Date.now() - 45 * 60000), read: true, type: 'text' },
    { id: 'm5', senderId: 'sarah-1', content: 'Parfait ! Je t\'ai envoyé le document', timestamp: new Date(Date.now() - 10 * 60000), read: false, type: 'text' },
    { id: 'm6', senderId: 'sarah-1', content: 'Merci pour le partage !', timestamp: new Date(Date.now() - 5 * 60000), read: false, type: 'text' },
  ],
  'zak-1': [
    { id: 'm1', senderId: 'zak-1', content: 'Hey ! On fait toujours la session de révision ?', timestamp: new Date(Date.now() - 30 * 60000), read: true, type: 'text' },
    { id: 'm2', senderId: 'me', content: 'Bien sûr ! Je réserve la salle', timestamp: new Date(Date.now() - 25 * 60000), read: true, type: 'text' },
    { id: 'm3', senderId: 'zak-1', content: 'À quelle heure pour demain ?', timestamp: new Date(Date.now() - 15 * 60000), read: false, type: 'text' },
  ],
  // Conversations de groupe - Cercles
  'circle-solvay': [
    { id: 'm1', senderId: 'marie-s', content: 'Bonjour à tous ! Qui est dispo pour une session de révision ce weekend ?', timestamp: new Date(Date.now() - 120 * 60000), read: true, type: 'text' },
    { id: 'm2', senderId: 'thomas-d', content: 'Moi je suis partant ! Samedi matin ça vous va ?', timestamp: new Date(Date.now() - 115 * 60000), read: true, type: 'text' },
    { id: 'm3', senderId: 'me', content: 'Ça marche pour moi aussi 👍', timestamp: new Date(Date.now() - 110 * 60000), read: true, type: 'text' },
    { id: 'm4', senderId: 'emma-l', content: 'Super ! On se retrouve à la bibli centrale ?', timestamp: new Date(Date.now() - 105 * 60000), read: true, type: 'text' },
    { id: 'm5', senderId: 'marie-s', content: 'Parfait ! J\'ai réservé la salle 204', timestamp: new Date(Date.now() - 30 * 60000), read: false, type: 'text' },
    { id: 'm6', senderId: 'lucas-m', content: 'Super idée pour la session ! Je serai là', timestamp: new Date(Date.now() - 25 * 60000), read: false, type: 'text' },
  ],
  'circle-math': [
    { id: 'm1', senderId: 'thomas-d', content: 'Quelqu\'un peut m\'expliquer la méthode de Newton ?', timestamp: new Date(Date.now() - 90 * 60000), read: true, type: 'text' },
    { id: 'm2', senderId: 'sarah-m', content: 'Oui ! C\'est une méthode itérative pour trouver les racines', timestamp: new Date(Date.now() - 85 * 60000), read: true, type: 'text' },
    { id: 'm3', senderId: 'me', content: 'Je peux partager mes notes si ça aide', timestamp: new Date(Date.now() - 80 * 60000), read: true, type: 'text' },
    { id: 'm4', senderId: 'thomas-d', content: 'Ce serait génial, merci !', timestamp: new Date(Date.now() - 75 * 60000), read: true, type: 'text' },
    { id: 'm5', senderId: 'alex-k', content: 'J\'ai aussi un bon tuto vidéo à partager', timestamp: new Date(Date.now() - 70 * 60000), read: true, type: 'text' },
    { id: 'm6', senderId: 'thomas-d', content: 'J\'ai trouvé une solution ! Merci à tous 🎉', timestamp: new Date(Date.now() - 60 * 60000), read: false, type: 'text' },
  ],
  'circle-belgium': [
    { id: 'm1', senderId: 'alex-k', content: 'Salut à tous ! Qui organise le meetup de ce mois ?', timestamp: new Date(Date.now() - 240 * 60000), read: true, type: 'text' },
    { id: 'm2', senderId: 'marie-s', content: 'Je peux m\'en occuper ! Que diriez-vous du 15 ?', timestamp: new Date(Date.now() - 230 * 60000), read: true, type: 'text' },
    { id: 'm3', senderId: 'me', content: 'Ça me va parfaitement !', timestamp: new Date(Date.now() - 225 * 60000), read: true, type: 'text' },
    { id: 'm4', senderId: 'sophie-b', content: '👍 Je confirme ma présence', timestamp: new Date(Date.now() - 220 * 60000), read: true, type: 'text' },
    { id: 'm5', senderId: 'alex-k', content: 'Qui vient au meetup ? On est déjà 15 inscrits !', timestamp: new Date(Date.now() - 180 * 60000), read: true, type: 'text' },
  ],
};

type ContactCategory = 'all' | 'buddies' | 'circles' | 'groups';

interface ContactWithCategory extends Contact {
  category: 'buddy' | 'circle' | 'group';
  circleId?: string;
  circleName?: string;
  isGroupChat?: boolean;
  memberCount?: number;
  activeMembers?: number;
}

interface DirectMessagingProps {
  defaultContactId?: string;
}

const MOCK_CONTACTS_WITH_CATEGORIES: ContactWithCategory[] = [
  // Buddies - conversations 1 à 1
  { 
    ...MOCK_CONTACTS[0],
    category: 'buddy',
    isGroupChat: false,
  },
  { 
    ...MOCK_CONTACTS[1],
    category: 'buddy',
    isGroupChat: false,
  },
  { 
    ...MOCK_CONTACTS[4],
    category: 'buddy',
    isGroupChat: false,
  },
  // Cercles - conversations de groupe
  { 
    id: 'circle-solvay',
    name: 'Club Solvay Brussels',
    avatar: '🏛️',
    isOnline: true,
    lastMessage: 'Marie: Super idée pour la session !',
    lastMessageTime: new Date(Date.now() - 25 * 60000),
    unreadCount: 3,
    category: 'circle',
    circleId: 'solvay-brussels',
    circleName: 'Club Solvay Brussels',
    isGroupChat: true,
    memberCount: 234,
    activeMembers: 12,
  },
  { 
    id: 'circle-math',
    name: 'Analyse Mathématique',
    avatar: '📊',
    isOnline: true,
    lastMessage: 'Thomas: J\'ai trouvé une solution !',
    lastMessageTime: new Date(Date.now() - 60 * 60000),
    unreadCount: 1,
    category: 'circle',
    circleId: 'math-analysis',
    circleName: 'Analyse Mathématique',
    isGroupChat: true,
    memberCount: 87,
    activeMembers: 8,
  },
  { 
    id: 'circle-belgium',
    name: 'Étudiants Belges',
    avatar: '🇧🇪',
    isOnline: true,
    lastMessage: 'Alex: Qui vient au meetup ?',
    lastMessageTime: new Date(Date.now() - 180 * 60000),
    unreadCount: 0,
    category: 'circle',
    circleId: 'belgium-students',
    circleName: 'Étudiants Belges',
    isGroupChat: true,
    memberCount: 523,
    activeMembers: 45,
  },
];

export function DirectMessaging({ defaultContactId }: DirectMessagingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    defaultContactId ? MOCK_CONTACTS.find(c => c.id === defaultContactId) || null : null
  );
  const [conversations, setConversations] = useState<Record<string, Message[]>>(MOCK_CONVERSATIONS);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showContactsList, setShowContactsList] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ContactCategory>('all');

  useEffect(() => {
    scrollToBottom();
  }, [selectedContact, conversations]);

  useEffect(() => {
    // Sur mobile, masquer la liste quand on sélectionne un contact
    if (selectedContact && window.innerWidth < 768) {
      setShowContactsList(false);
    }
  }, [selectedContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredContacts = MOCK_CONTACTS_WITH_CATEGORIES.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'buddies' && contact.category === 'buddy') ||
      (activeCategory === 'circles' && contact.category === 'circle') ||
      (activeCategory === 'groups' && contact.category === 'group');
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = {
    all: MOCK_CONTACTS_WITH_CATEGORIES.length,
    buddies: MOCK_CONTACTS_WITH_CATEGORIES.filter(c => c.category === 'buddy').length,
    circles: MOCK_CONTACTS_WITH_CATEGORIES.filter(c => c.category === 'circle').length,
    groups: MOCK_CONTACTS_WITH_CATEGORIES.filter(c => c.category === 'group').length,
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const formatFullTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: `m${Date.now()}`,
        senderId: 'me',
        content: newMessage,
        timestamp: new Date(),
        read: true,
        type: 'text'
      };

      setConversations(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), message]
      }));

      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToList = () => {
    setShowContactsList(true);
    setSelectedContact(null);
  };

  const currentMessages = selectedContact ? (conversations[selectedContact.id] || []) : [];
  
  // Mapping des IDs d'utilisateurs vers leurs noms pour les groupes
  const getUserName = (userId: string) => {
    const userNames: Record<string, string> = {
      'marie-s': 'Marie',
      'thomas-d': 'Thomas',
      'emma-l': 'Emma',
      'lucas-m': 'Lucas',
      'sarah-m': 'Sarah',
      'alex-k': 'Alex',
      'sophie-b': 'Sophie',
      'me': 'Moi',
    };
    return userNames[userId] || userId;
  };

  const isGroupChat = (selectedContact as ContactWithCategory)?.isGroupChat || false;

  return (
    <div className="h-full bg-gray-50 flex pt-4">
      {/* Liste des contacts */}
      <div className={`${showContactsList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-96 bg-white border-r border-gray-200`}>
        {/* Header */}
        <div className="p-4 pt-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="text-blue-600" size={24} />
            Messages
          </h2>
          
          {/* Catégories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'all' as ContactCategory, label: 'Tous', icon: Users },
              { id: 'buddies' as ContactCategory, label: 'Buddies', icon: UserCheck },
              { id: 'circles' as ContactCategory, label: 'Cercles', icon: Users },
            ].map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="whitespace-nowrap">{cat.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <motion.button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedContact?.id === contact.id ? 'bg-blue-50' : ''
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="relative">
                <div className="text-3xl">{contact.avatar}</div>
                {contact.isGroupChat && contact.activeMembers ? (
                  <div className="absolute -bottom-0.5 -right-0.5 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full border-2 border-white font-medium">
                    {contact.activeMembers}
                  </div>
                ) : contact.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-gray-900 truncate">{contact.name}</span>
                    {contact.isGroupChat && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex-shrink-0">
                        Groupe
                      </span>
                    )}
                    {contact.category === 'buddy' && !contact.isGroupChat && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex-shrink-0">
                        Buddy
                      </span>
                    )}
                  </div>
                  {contact.lastMessageTime && (
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatMessageTime(contact.lastMessageTime)}
                    </span>
                  )}
                </div>
                {contact.isGroupChat && contact.memberCount && (
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Users size={12} />
                    {contact.memberCount} membres · {contact.activeMembers} en ligne
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">{contact.lastMessage || 'Nouvelle conversation'}</p>
                  {contact.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className={`${!showContactsList || selectedContact ? 'flex' : 'hidden'} md:flex flex-col flex-1`}>
        {selectedContact ? (
          <>
            {/* Header de conversation */}
            <div className="bg-white border-b border-gray-200 p-4 pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToList}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="relative">
                  <div className="text-3xl">{selectedContact.avatar}</div>
                  {(selectedContact as ContactWithCategory).isGroupChat && (selectedContact as ContactWithCategory).activeMembers ? (
                    <div className="absolute -bottom-0.5 -right-0.5 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full border-2 border-white font-medium">
                      {(selectedContact as ContactWithCategory).activeMembers}
                    </div>
                  ) : selectedContact.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                    {(selectedContact as ContactWithCategory).isGroupChat && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                        Groupe
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {(selectedContact as ContactWithCategory).isGroupChat ? (
                      <>
                        <Users size={14} />
                        {(selectedContact as ContactWithCategory).memberCount} membres · {(selectedContact as ContactWithCategory).activeMembers} en ligne
                      </>
                    ) : (
                      selectedContact.isOnline ? 'En ligne' : 'Hors ligne'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(selectedContact as ContactWithCategory).isGroupChat ? (
                  <>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Voir les membres"
                    >
                      <Users size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video size={20} className="text-gray-600" />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video size={20} className="text-gray-600" />
                    </button>
                  </>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((message, index) => {
                const isMe = message.senderId === 'me';
                const showTime = index === 0 || 
                  currentMessages[index - 1].timestamp.getTime() - message.timestamp.getTime() > 5 * 60000;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {showTime && (
                        <span className="text-xs text-gray-400 mb-1 px-2">
                          {formatFullTime(message.timestamp)}
                        </span>
                      )}
                      <div>
                        {!isMe && isGroupChat && (
                          <span className="text-xs font-medium text-gray-600 mb-1 px-2 block">
                            {getUserName(message.senderId)}
                          </span>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMe
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                      </div>
                      {isMe && (
                        <div className="flex items-center gap-1 mt-1 px-2">
                          {message.read ? (
                            <CheckCheck size={14} className="text-blue-600" />
                          ) : (
                            <Check size={14} className="text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon size={20} className="text-gray-600" />
                </button>
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écris un message..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={1}
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sélectionne une conversation
              </h3>
              <p className="text-gray-600">
                Choisis un contact pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

