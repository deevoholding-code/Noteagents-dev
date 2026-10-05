import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import {
  User,
  Shield,
  Bell,
  Sliders,
  Sun,
  Key,
  Smartphone,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<'perfil' | 'conta' | 'seguranca' | 'notificacoes' | 'aparencia'>('perfil');
  const [name, setName] = useState(user?.name || 'Lucas Almeida');
  const [email, setEmail] = useState(user?.email || 'lucas.almeida@noteagents.dev');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pipelineAlerts, setPipelineAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Configurações salvas', 'Suas preferências foram sincronizadas com sucesso.');
  };

  const navItems = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'conta', label: 'Conta', icon: Sliders },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'aparencia', label: 'Aparência', icon: Sun },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Configurações' }]} />

      <PageHeader
        title="Configurações da Conta"
        subtitle="Gerencie suas preferências de desenvolvedor, integrações e notificações."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Sub-Nav */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs md:col-span-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Form */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs md:col-span-3">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'perfil' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Dados do Perfil
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome de usuário
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user?.username || 'lucasalmeida'}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail principal
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notificacoes' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Preferências de Alertas
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Notificações de pipelines com falha
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Receba avisos instantâneos quando um runner quebrar
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={pipelineAlerts}
                      onChange={(e) => setPipelineAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Sumário diário por e-mail
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Resumo consolidado de issues e PRs abertos
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'aparencia' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  Aparência Visual
                </h3>
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center gap-3">
                  <Sun className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Tema Claro Corporativo Ativo
                    </span>
                    <span className="text-[11px] text-slate-500">
                      O NoteAgents opera exclusivamente no tema claro oficial de alto contraste.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'conta' || activeTab === 'seguranca') && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                  {activeTab === 'seguranca' ? 'Segurança & Chaves de Acesso' : 'Gerenciamento de Conta'}
                </h3>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600">
                  <p>Configurações de autenticação de dois fatores (2FA) e sessões ativas protegidas por biometria e chaves SSH.</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar alterações</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
