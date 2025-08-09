import { NextRequest } from 'next/server';
import { Role, CustomerStatus, DeviceStatus } from './enums';

export interface ApiRequest extends NextRequest {
  auth?: {
    id: number;
    role: Role;
    storeId?: number;
  }
}

export interface RouteParams {
  id: string;
}

export interface RouteContext {
  params: RouteParams;
}

export interface KPIData {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
}

export interface TransactionData {
  id: number;
  amount: number;
  type: string;
  date: Date;
  customer: {
    id: number;
    name: string;
  };
}

export interface AccessData {
  id: number;
  deviceId: number;
  customerId: number;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  customer: {
    name: string;
    imageUrl: string;
  };
  device: {
    name: string;
  };
}

export interface CustomerData {
  id: number;
  name: string;
  status: CustomerStatus;
  email?: string | null;
  phone?: string | null;
  imageUrl: string;
  storeId: number;
  store?: {
    name: string;
  };
  devices?: {
    id: number;
    name: string;
    status: DeviceStatus;
  }[];
}

export interface StoreData {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  email?: string | null;
  phone?: string | null;
  imageUrl?: string;
  customers?: CustomerData[];
  devices?: {
    id: number;
    name: string;
    status: DeviceStatus;
  }[];
}
