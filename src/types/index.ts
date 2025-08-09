export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADM' | 'LOJISTA' | 'TECNICO';
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'ADM' | 'LOJISTA' | 'TECNICO';
}

export interface RecoverData {
  email: string;
}

export interface ResetData {
  token: string;
  password: string;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export interface KPI {
  label: string;
  value: number;
  icon: string;
  color: string;
}

export interface DashboardData {
  kpis: KPI[];
  labels: string[];
  series: number[];
  stores: Array<{ id: number; name: string }>;
  topClientes: Array<{
    customerId: number;
    name: string;
    imageUrl: string;
    accessCount: number;
  }>;
  horariosPico: Array<{
    createdAt: string;
    _count: number;
  }>;
  avgConfianca: number;
  error?: string;
}
