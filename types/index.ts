export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'LOJISTA' | 'TECNICO';
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
  status: 'ACTIVE' | 'NEW' | 'VIP' | 'WARNING' | 'BLOCKED';
  imageUrl: string;
  phone?: string | null;
  email?: string | null;
  storeId: number;
}

export interface Device {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
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
