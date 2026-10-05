import React, { useState, useEffect } from 'react';
import { Deployment, DeploymentEnv } from '../../types';
import { deploymentService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import {
  Rocket,
  Plus,
  ExternalLink,
  GitBranch,
  GitCommit,
  Clock,
  Triangle,
} from 'lucide-react';

export const DeploymentsPage: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [envFilter, setEnvFilter] = useState<'all' | DeploymentEnv>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branch, setBranch] = useState('main');
  const [env, setEnv] = useState<DeploymentEnv>('Preview');
  const { success } = useToast();

  useEffect(() => {
    deploymentService.list().then(setDeployments);
  }, []);

  const handleTriggerDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDep = await deploymentService.triggerDeploy(branch, env);
    setDeployments((prev) => [newDep, ...prev]);
    setIsModalOpen(false);
    success('Deploy iniciado', `Construindo nova versão para ${branch} em ${env}.`);
  };

  const filtered = deployments.filter((d) => envFilter === 'all' || d.environment === envFilter);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Deployments' }]} />

      <PageHeader
        title="Deployments & Ambientes"
        subtitle="Gerencie versões ativas em produção e deploys efêmeros de preview gerados a partir de pull requests."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Deploy</span>
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {(['all', 'Produção', 'Preview'] as const).map((envItem) => (
          <button
            key={envItem}
            onClick={() => setEnvFilter(envItem)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              envFilter === envItem
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {envItem === 'all' ? 'Todos os ambientes' : envItem}
          </button>
        ))}
      </div>

      {/* Deployments List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.map((dep) => (
          <div key={dep.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shrink-0 mt-0.5">
                <Triangle className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {dep.environment}
                  </span>
                  {dep.version && (
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {dep.version}
                    </span>
                  )}
                  <StatusBadge status={dep.status} size="sm" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                  {dep.commitMessage}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-600">
                    <GitBranch className="w-3.5 h-3.5 text-blue-500" />
                    {dep.branch}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GitCommit className="w-3.5 h-3.5" />
                    {dep.commit}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {dep.duration}
                  </span>
                  <span>•</span>
                  <span>{dep.triggeredAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <a
                href={dep.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
              >
                <span>Acessar URL</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Trigger Deploy */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Disparar Novo Deployment"
      >
        <form onSubmit={handleTriggerDeploy} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ambiente de destino
            </label>
            <select
              value={env}
              onChange={(e) => setEnv(e.target.value as DeploymentEnv)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
            >
              <option value="Preview">Preview</option>
              <option value="Produção">Produção</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Branch de origem
            </label>
            <input
              type="text"
              required
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main, feat/agents-ui..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Iniciar Deploy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
