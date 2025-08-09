import { Access, Customer } from '~/types';
import { PrismaTransaction } from './types';

export interface KPIParams {
  storeId?: string;
  timeRange?: string;
}

export interface KPIAccess extends Access {
  device: {
    name: string;
  };
  customer: {
    name: string;
    imageUrl: string;
  };
}

export interface KPICustomer extends Customer {
  totalAccess: number;
  lastAccess?: Date;
  accessRate: number;
}

export interface KPIResponse {
  kpis: {
    title: string;
    value: string | number;
    change?: number;
    icon: string;
  }[];
  recentAccess: KPIAccess[];
  topCustomers: KPICustomer[];
}
