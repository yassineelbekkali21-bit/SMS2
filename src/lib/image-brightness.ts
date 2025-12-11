// Utilitaire pour analyser la luminosité d'une image et déterminer le contraste optimal
export function getImageBrightness(imageUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(0.5); // Valeur par défaut
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let brightness = 0;
        
        // Calculer la luminosité moyenne
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Formule de luminosité perceptuelle
          brightness += (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        }
        
        brightness = brightness / (data.length / 4);
        resolve(brightness);
      } catch (error) {
        // En cas d'erreur CORS ou autre
        resolve(0.5);
      }
    };
    
    img.onerror = () => resolve(0.5);
    img.src = imageUrl;
  });
}

// Fonction pour déterminer si le fond est sombre ou clair
export function isDarkBackground(brightness: number): boolean {
  return brightness < 0.5;
}

// Fonction pour obtenir les classes CSS selon la luminosité
export function getContrastClasses(brightness: number): {
  textClass: string;
  shadowClass: string;
} {
  const isDark = isDarkBackground(brightness);
  
  return {
    textClass: isDark ? 'text-white' : 'text-gray-800',
    shadowClass: isDark ? 'drop-shadow-[0_0_4px_rgba(0,0,0,0.6)]' : 'drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]'
  };
}


