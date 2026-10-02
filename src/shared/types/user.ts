export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  roles: Role[];
  active: boolean;
}

/** GET /users/{username} — perfil público (sem e-mail) */
export interface PublicProfile {
  username: string;
  name: string;
  /** ISO-8601 em UTC */
  memberSince: string;
  reviewsCount: number;
  helpfulReceived: number;
  /** Média das notas que a pessoa deu; null sem avaliações */
  averageNoteGiven: number | null;
}

/** GET/PATCH /user/me/preferences */
export interface UserPreferences {
  emailNotifications: boolean;
}
