import { create } from 'zustand';

interface SystemConfig {
  systemName: string;
  logoUrl: string | null;
}

interface SystemStore {
  config: SystemConfig;
  isLoaded: boolean;
  setConfig: (config: SystemConfig) => void;
  setLoaded: (loaded: boolean) => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  config: {
    systemName: 'Lavo System',
    logoUrl: null
  },
  isLoaded: false,
  setConfig: (config) => set({ config }),
  setLoaded: (loaded) => set({ isLoaded: loaded })
}));
