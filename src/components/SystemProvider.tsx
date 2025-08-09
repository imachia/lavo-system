'use client';

import { useSystemStore } from "@/lib/system-store";
import { useEffect } from "react";

export default function SystemProvider({ children }: { children: React.ReactNode }) {
  const { setConfig, isLoaded, setLoaded } = useSystemStore();

  useEffect(() => {
    if (!isLoaded) {
      fetch('/api/system/config')
        .then((r) => r.json())
        .then((cfg) => {
          if (cfg) {
            setConfig({
              systemName: cfg.systemName || 'Lavo System',
              logoUrl: cfg.logoUrl || null
            });
            setLoaded(true);
          }
        })
        .catch(() => {
          setLoaded(true);
        });
    }
  }, [isLoaded, setConfig, setLoaded]);

  return <>{children}</>;
}
