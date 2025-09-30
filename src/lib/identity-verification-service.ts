export interface IdentityVerificationState {
  status: 'not_required' | 'required' | 'pending' | 'verified' | 'rejected';
  uploadedAt?: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  lessonsCompleted: number;
}

export class IdentityVerificationService {
  private static readonly STORAGE_KEY = 'identity_verification_state';
  private static readonly LESSONS_THRESHOLD = 2; // Déclencher après 2 leçons

  static getState(): IdentityVerificationState {
    if (typeof window === 'undefined') {
      return {
        status: 'not_required',
        lessonsCompleted: 0
      };
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      // Convertir les dates string en Date objects
      if (state.uploadedAt) state.uploadedAt = new Date(state.uploadedAt);
      if (state.verifiedAt) state.verifiedAt = new Date(state.verifiedAt);
      if (state.rejectedAt) state.rejectedAt = new Date(state.rejectedAt);
      return state;
    }

    return {
      status: 'not_required',
      lessonsCompleted: 0
    };
  }

  static saveState(state: IdentityVerificationState): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  static incrementLessonsCompleted(): boolean {
    const state = this.getState();
    state.lessonsCompleted += 1;

    // Vérifier si on doit déclencher la vérification
    const shouldTrigger = state.lessonsCompleted >= this.LESSONS_THRESHOLD && 
                         state.status === 'not_required';

    if (shouldTrigger) {
      state.status = 'required';
    }

    this.saveState(state);
    return shouldTrigger;
  }

  static uploadDocument(file: File): void {
    const state = this.getState();
    state.status = 'pending';
    state.uploadedAt = new Date();
    this.saveState(state);

    // Simuler la validation automatique après 10 secondes (pour le test)
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        this.verifyDocument();
      }, 10000);
    }
  }

  static verifyDocument(): void {
    const state = this.getState();
    state.status = 'verified';
    state.verifiedAt = new Date();
    this.saveState(state);
  }

  static rejectDocument(reason: string): void {
    const state = this.getState();
    state.status = 'rejected';
    state.rejectedAt = new Date();
    state.rejectionReason = reason;
    this.saveState(state);
  }

  static shouldShowVerification(): boolean {
    const state = this.getState();
    return state.status === 'required';
  }

  static getStatusLabel(): string {
    const state = this.getState();
    switch (state.status) {
      case 'not_required':
        return 'Non requise';
      case 'required':
        return 'Requise';
      case 'pending':
        return 'En attente';
      case 'verified':
        return 'Vérifiée';
      case 'rejected':
        return 'Rejetée';
      default:
        return 'Inconnue';
    }
  }

  static getStatusColor(): string {
    const state = this.getState();
    switch (state.status) {
      case 'not_required':
        return 'text-gray-500';
      case 'required':
        return 'text-orange-600';
      case 'pending':
        return 'text-blue-600';
      case 'verified':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  }

  static reset(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Pour les tests - déclencher manuellement
  static triggerVerification(): void {
    const state = this.getState();
    state.status = 'required';
    this.saveState(state);
  }
}
