export type UserRole = 'ADMIN_HSEE' | 'AUDITEUR' | 'PILOTE_ACTION';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  department?: string;
  isActive?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export type Domaine =
  | 'Plant'
  | 'Magasin'
  | 'Sanitaires'
  | 'Cantine'
  | 'Chimique'
  | 'Locaux techniques'
  | 'Déchets'
  | 'Transport'
  | 'Infirmerie'
  | 'Recycleurs'
  | 'Incendie';

export const DOMAINES: Domaine[] = [
  'Plant', 'Magasin', 'Sanitaires', 'Cantine', 'Chimique',
  'Locaux techniques', 'Déchets', 'Transport', 'Infirmerie',
  'Recycleurs', 'Incendie',
];

export type InspectionStatus = 'EN_COURS' | 'TERMINEE' | 'VALIDEE' | 'ANNULEE';

export const INSPECTION_STATUS_LABELS: Record<InspectionStatus, string> = {
  EN_COURS: 'En cours',
  TERMINEE: 'Terminée',
  VALIDEE:  'Validée',
  ANNULEE:  'Annulée',
};

export const INSPECTION_STATUS_COLORS: Record<InspectionStatus, 'info' | 'success' | 'warning' | 'default'> = {
  EN_COURS: 'info',
  TERMINEE: 'warning',
  VALIDEE:  'success',
  ANNULEE:  'default',
};

export interface Inspection {
  id:           string;
  domaine:      Domaine;
  site:         string;
  statut:       InspectionStatus;
  datePrevue:   string;
  dateRealise:  string | null;
  latitude:     number | null;
  longitude:    number | null;
  timestamp:    string;
  auditeurId:   string;
  auditeur:     { id: string; firstName: string; lastName: string };
  checklistId:  string | null;
  checklist:    { id: string; titre: string } | null;
  createdAt:    string;
}

export interface CreateInspectionPayload {
  domaine:    Domaine;
  site:       string;
  datePrevue: string;
  latitude?:  number;
  longitude?: number;
}
