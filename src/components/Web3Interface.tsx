'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Shield, 
  Award, 
  Users, 
  ExternalLink, 
  Copy, 
  Check,
  Globe,
  Zap,
  Star,
  TrendingUp,
  Lock,
  Unlock,
  ChevronRight
} from 'lucide-react';
import { Web3Utils, DecentralizedProfile, NFTCertificate, StudyDAO, mockStudyDAOs } from '@/lib/web3-integration';

interface Web3InterfaceProps {
  isConnected?: boolean;
  profile?: DecentralizedProfile | null;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

// Composant pour afficher un certificat NFT
const CertificateCard = ({ certificate }: { certificate: NFTCertificate }) => {
  const [copied, setCopied] = useState(false);

  const copyVerificationUrl = () => {
    navigator.clipboard.writeText(certificate.verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Award className="text-white" size={24} />
        </div>
        <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
          Vérifié ✓
        </div>
      </div>
      
      <h3 className="font-bold text-gray-900 mb-2">{certificate.courseName}</h3>
      <p className="text-sm text-gray-600 mb-4">
        Complété le {certificate.completionDate.toLocaleDateString('fr-FR')}
      </p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Token ID:</span>
          <span className="font-mono">{certificate.tokenId}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Contract:</span>
          <span className="font-mono">{Web3Utils.truncateAddress(certificate.contractAddress)}</span>
        </div>
      </div>
      
      <button
        onClick={copyVerificationUrl}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copié !' : 'Lien de vérification'}
      </button>
    </motion.div>
  );
};

// Composant pour afficher un DAO
const DAOCard = ({ dao, onJoin }: { dao: StudyDAO; onJoin: (address: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
        <Users className="text-white" size={24} />
      </div>
      <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
        {dao.governanceToken}
      </div>
    </div>
    
    <h3 className="font-bold text-gray-900 mb-2">{dao.name}</h3>
    <p className="text-sm text-gray-600 mb-4">{dao.description}</p>
    
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="text-center">
        <div className="font-bold text-gray-900">{dao.members}</div>
        <div className="text-xs text-gray-500">Membres</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-gray-900">{dao.proposals}</div>
        <div className="text-xs text-gray-500">Propositions</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-gray-900">{dao.treasury}</div>
        <div className="text-xs text-gray-500">Trésorerie</div>
      </div>
    </div>
    
    <button
      onClick={() => onJoin(dao.address)}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
    >
      <span>Rejoindre</span>
      <ChevronRight size={16} />
    </button>
  </motion.div>
);

export function Web3Interface({ 
  isConnected = false, 
  profile = null, 
  onConnect = () => {}, 
  onDisconnect = () => {} 
}: Web3InterfaceProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'certificates' | 'daos'>('profile');
  const [showConnect, setShowConnect] = useState(false);

  if (!isConnected) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 text-center border border-purple-100"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe size={32} className="text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Entrez dans le Web 3.0
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Connectez votre wallet pour accéder aux certifications NFT, 
            aux DAOs d'apprentissage et à votre profil décentralisé.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/60 rounded-xl p-4">
              <Shield size={24} className="text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Certifications vérifiables</div>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <Users size={24} className="text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">DAOs d'apprentissage</div>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <Award size={24} className="text-emerald-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Réputation on-chain</div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setShowConnect(true);
              setTimeout(() => {
                onConnect();
                setShowConnect(false);
              }, 2000);
            }}
            disabled={showConnect}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-75"
          >
            {showConnect ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Connexion...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet size={20} />
                Connecter le Wallet
              </div>
            )}
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Prend en charge MetaMask, WalletConnect et autres wallets Web3
          </p>
        </motion.div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-6">
      {/* Header du profil Web3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/80 to-blue-600/80 rounded-2xl p-6 text-white mb-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-bold">
                {profile.ens ? profile.ens.charAt(0).toUpperCase() : '👤'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {profile.ens || Web3Utils.truncateAddress(profile.address)}
              </h2>
              <p className="text-white/80 text-sm font-mono">{Web3Utils.truncateAddress(profile.address)}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} />
              <span className="font-bold">{profile.reputation}</span>
            </div>
            <div className="text-white/80 text-xs">Réputation</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.achievements.length}</div>
            <div className="text-white/80 text-sm">Certificats</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.studyGroups.length}</div>
            <div className="text-white/80 text-sm">DAOs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.floor(profile.reputation / 100)}</div>
            <div className="text-white/80 text-sm">Niveau</div>
          </div>
        </div>
      </motion.div>

      {/* Navigation par onglets */}
      <div className="flex items-center gap-2 mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-gray-200">
        {[
          { key: 'profile', label: 'Profil', icon: Users },
          { key: 'certificates', label: 'Certificats', icon: Award },
          { key: 'daos', label: 'DAOs', icon: Globe }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={16} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informations du profil</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Adresse</span>
                  <span className="font-mono text-sm">{Web3Utils.truncateAddress(profile.address)}</span>
                </div>
                
                {profile.ens && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">ENS</span>
                    <span className="font-medium">{profile.ens}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Réputation</span>
                  <span className="font-bold text-purple-600">{profile.reputation}</span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">Niveau</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{Math.floor(profile.reputation / 100)}</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-600 rounded-full"
                        style={{ width: `${(profile.reputation % 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onDisconnect}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
            >
              <Unlock size={16} />
              Déconnecter le wallet
            </button>
          </motion.div>
        )}

        {activeTab === 'certificates' && (
          <motion.div
            key="certificates"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {profile.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.achievements.map((cert, index) => (
                  <CertificateCard key={cert.tokenId} certificate={cert} />
                ))}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-200">
                <Award size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun certificat pour le moment
                </h3>
                <p className="text-gray-600">
                  Terminez des cours pour obtenir vos premiers certificats NFT !
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'daos' && (
          <motion.div
            key="daos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">DAOs recommandés</h3>
              <p className="text-gray-600 text-sm mb-4">
                Rejoignez des communautés d'apprentissage décentralisées
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockStudyDAOs.map((dao, index) => (
                <DAOCard 
                  key={dao.address} 
                  dao={dao} 
                  onJoin={(address) => {
                    console.log(`Rejoindre le DAO: ${address}`);
                    // Ici on implémenterait la logique de rejoindre un DAO
                  }} 
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

