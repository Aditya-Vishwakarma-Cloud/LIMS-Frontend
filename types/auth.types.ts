export type RoleName =
  | 'ROLE_SUPER_ADMIN'
  | 'ROLE_ADMIN'
  | 'ROLE_LAB_MANAGER'
  | 'ROLE_QUALITY_ENGINEER'
  | 'ROLE_TECHNICIAN'
  | 'ROLE_CLIENT_VIEWER'
  | 'ROLE_RECEPTION';

export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'PENDING';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  roles: RoleName[];
  status: AccountStatus;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserResponse;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
