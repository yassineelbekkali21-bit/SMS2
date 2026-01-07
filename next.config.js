/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Firebase Hosting (export statique)
  // output: 'export', // DÉSACTIVÉ POUR DEV - Réactiver pour build prod
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Optimisations pour production
  compress: false, // Désactivé temporairement pour debug
  poweredByHeader: false,
  
  // Ignorer les erreurs TypeScript pour le déploiement
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  
  // Headers de cache (géré par Firebase Hosting)
  
  experimental: {
    // Explicitly disable features that might cause issues
  },
};

module.exports = nextConfig;
