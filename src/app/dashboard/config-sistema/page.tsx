'use client';

import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSystemStore } from '@/lib/system-store';

export default function ConfigSistemaPage() {
  const { config, setConfig } = useSystemStore();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/system/config')
      .then((r) => r.json())
      .then((cfg) => {
        setConfig({
          systemName: cfg.systemName || 'Lavo System',
          logoUrl: cfg.logoUrl || null
        });
      })
      .catch(() => {});
  }, [setConfig]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null); setSaving(true);
    const res = await fetch('/api/system/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    setSaving(false);
    setMsg(res.ok ? 'Configurações salvas.' : 'Falha ao salvar.');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurações do Sistema
          </h1>
          <p className="text-gray-600">
            Gerencie as configurações gerais do sistema.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_15px_rgb(0,0,0,0.03)] p-6">
          <form onSubmit={submit} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Sistema
              </label>
              <input 
                type="text"
                value={config.systemName} 
                onChange={(e) => setConfig({ ...config, systemName: e.target.value })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input 
                type="text"
                value={config.logoUrl || ''} 
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value || null })} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="https://exemplo.com/logo.png"
              />
              {config.logoUrl && (
                <div className="mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">Preview do Logo:</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.logoUrl} alt="Preview do logo" className="w-32 h-32 object-contain rounded-lg bg-white p-2" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              {msg && (
                <span className={`text-sm ${msg.includes('Falha') ? 'text-red-600' : 'text-green-600'}`}>
                  {msg}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}



