export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string; // Non modifiable - unique
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  academic: {
    university: string;
    faculty: string;
    year: number;
    program: string;
    studentId: string; // Non modifiable
  };
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
}

export class StudentProfileService {
  private static readonly STORAGE_KEY = 'student_profile';

  static getProfile(): StudentProfile | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);
      // Convertir les dates string en Date objects
      profile.createdAt = new Date(profile.createdAt);
      profile.lastLogin = new Date(profile.lastLogin);
      return profile;
    }
    
    return null;
  }

  static saveProfile(profile: StudentProfile): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      // Validation des champs requis
      if (!profile.email || !profile.firstName || !profile.lastName) {
        throw new Error('Champs requis manquants');
      }

      // Validation de l'email
      if (!this.isValidEmail(profile.email)) {
        throw new Error('Format d\'email invalide');
      }

      // Mettre à jour la date de dernière modification
      profile.lastLogin = new Date();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
      console.log('✅ Profil sauvegardé avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du profil:', error);
      return false;
    }
  }

  static updateProfile(updates: Partial<StudentProfile>): boolean {
    const currentProfile = this.getProfile();
    if (!currentProfile) return false;

    // Empêcher la modification de l'email et du studentId
    const { email, academic, ...allowedUpdates } = updates;
    
    const updatedProfile = {
      ...currentProfile,
      ...allowedUpdates,
      academic: {
        ...currentProfile.academic,
        ...(academic ? {
          university: academic.university,
          faculty: academic.faculty,
          year: academic.year,
          program: academic.program
          // studentId reste inchangé
        } : {})
      }
      // email reste inchangé
    };

    return this.saveProfile(updatedProfile);
  }

  static isEmailUnique(email: string, currentUserId?: string): boolean {
    // En production, ceci ferait un appel API pour vérifier l'unicité
    // Pour la démo, on simule la vérification
    const existingEmails = [
      'admin@solvay.edu',
      'test@student.ulb.ac.be',
      'marie.dupont@student.solvay.edu'
    ];
    
    return !existingEmails.includes(email);
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static getDefaultProfile(): StudentProfile {
    return {
      id: '1',
      firstName: 'Yassine',
      lastName: 'Elbekali',
      email: 'yassine.elbekali@student.solvay.edu',
      phone: '+32 478 12 34 56',
      dateOfBirth: '2000-03-15',
      address: {
        street: '42 Avenue Franklin Roosevelt',
        city: 'Bruxelles',
        postalCode: '1050',
        country: 'Belgique'
      },
      academic: {
        university: 'Université Libre de Bruxelles',
        faculty: 'Solvay Brussels School',
        year: 1,
        program: 'Ingénieur de gestion',
        studentId: 'ULB2024001'
      },
      createdAt: new Date('2024-09-01'),
      lastLogin: new Date()
    };
  }

  static initializeProfile(): StudentProfile {
    let profile = this.getProfile();
    
    if (!profile) {
      profile = this.getDefaultProfile();
      this.saveProfile(profile);
    }
    
    return profile;
  }

  static exportProfile(): string {
    const profile = this.getProfile();
    if (!profile) return '';
    
    return JSON.stringify(profile, null, 2);
  }

  static importProfile(profileData: string): boolean {
    try {
      const profile = JSON.parse(profileData);
      
      // Validation des données importées
      if (!profile.email || !profile.firstName || !profile.lastName) {
        throw new Error('Données de profil invalides');
      }
      
      return this.saveProfile(profile);
    } catch (error) {
      console.error('❌ Erreur lors de l\'import du profil:', error);
      return false;
    }
  }

  static deleteProfile(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Profil supprimé');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du profil:', error);
      return false;
    }
  }
}
