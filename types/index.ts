export enum Role {
  ADMIN = 'ADMIN',
  LOJISTA = 'LOJISTA',
  TECNICO = 'TECNICO'
}

export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  NEW = 'NEW',
  VIP = 'VIP',
  WARNING = 'WARNING',
  BLOCKED = 'BLOCKED'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  storeId?: number;
}

export interface Store {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  imageUrl?: string;
  phone?: string;
  email?: string;
}

export interface Customer {
  id: number;
  name: string;
  status: CustomerStatus;
  imageUrl: string;
  phone?: string | null;
  email?: string | null;
  storeId: number;
}

export interface Device {
  id: number;
  name: string;
  status: DeviceStatus;
  lastAccess?: Date;
  customerId: number;
}

export interface Access {
  id: number;
  deviceId: number;
  customerId: number;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}
