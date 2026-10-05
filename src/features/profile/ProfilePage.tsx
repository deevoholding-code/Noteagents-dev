import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Modal } from '../../components/ui/Modal';
import {
  User,
  MapPin,
  Building,
  Calendar,
  Github,
  Edit3,
  GitPullRequest,
  AlertCircle,
  Award,
  Sparkles,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { success } = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(user?.name || 'Lucas Almeida');
  const [bio, setBio] = useState(
    user?.bio ||
      'Desenvolvedor apaixonado por open source, TypeScript e sistemas de agentes inteligentes. Contribuindo ativamente na plataforma NoteAgents.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditOpen(false);
    success('Perfil atualizado', 'Suas informações públicas foram salvas.');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Perfil' }]} />

      {/* Profile Card Header matching Screen 24 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt=""
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {name}
                </h1>
                <p className="text-sm font-semibold text-blue-600">
                  {user?.role || 'Community Developer'}
                </p>
              </div>

              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar perfil</span>
              </button>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              {bio}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {user?.location || 'São Paulo, Brasil'}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {user?.company || 'NoteAgents Community'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Membro desde {user?.joinedDate || 'Janeiro de 2024'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges & Recognitions */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Conquistas & Badges</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-blue-900">Early Contributor</p>
              <span className="text-[10px] text-blue-600">Top 50 mantenedores</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs">
            <GitPullRequest className="w-5 h-5 text-purple-600 shrink-0" />
            <div>
              <p className="font-bold text-purple-900">PR Master</p>
              <span className="text-[10px] text-purple-600">+10 PRs mesclados</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900">Bug Hunter</p>
              <span className="text-[10px] text-emerald-600">Triagem ágil de issues</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-amber-900">Code Reviewer</p>
              <span className="text-[10px] text-amber-600">Qualidade exemplar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Editar Informações do Perfil"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome de exibição
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Biografia
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
