import React, { useState, useEffect } from 'react';
import { Discussion } from '../../types';
import { discussionService } from '../../services';
import { useToast } from '../../providers/ToastProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Modal } from '../../components/ui/Modal';
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  CheckCircle2,
  Search,
  Tag,
} from 'lucide-react';

export const DiscussionsPage: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Discussion['category']>('Arquitetura');

  const { success } = useToast();

  useEffect(() => {
    discussionService.list().then(setDiscussions);
  }, []);

  const handleLike = async (id: string) => {
    const updated = await discussionService.like(id);
    setDiscussions((prev) => prev.map((d) => (d.id === id ? updated : d)));
    success('Voto computado', 'Você curtiu esta discussão técnica.');
  };

  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = await discussionService.create({
      title: newTitle,
      content: newContent,
      category: newCategory,
    });

    setDiscussions((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');
    success('Discussão criada', 'Seu tópico foi aberto na comunidade.');
  };

  const categories = [
    'all',
    'Arquitetura',
    'Frontend',
    'Backend',
    'IA',
    'MCP',
    'DevOps',
    'Segurança',
    'Documentação',
  ];

  const filtered = discussions.filter((d) => {
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Discussões Técnicas' }]} />

      <PageHeader
        title="Discussões da Comunidade"
        subtitle="Espaço colaborativo para troca de experiências sobre arquitetura de agentes, MCP, infraestrutura e frontend."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nova discussão</span>
          </button>
        }
      />

      {/* Category filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat === 'all' ? 'Todas as categorias' : cat}
          </button>
        ))}
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-blue-300 transition-all"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {item.category}
                </span>
                {item.isSolved && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolvido
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium">
                  {item.lastActivity}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer mb-1.5">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3">
                {item.content}
              </p>

              <div className="flex items-center gap-2">
                <img
                  src={item.author.avatar}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-slate-700">
                  {item.author.name}
                </span>
              </div>
            </div>

            {/* Interaction buttons */}
            <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <button
                onClick={() => handleLike(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                <span>{item.likesCount}</span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-600">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.repliesCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Discussao */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Nova Discussão"
      >
        <form onSubmit={handleCreateDiscussion} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Qual o padrão recomendado para streaming de logs?"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Categoria
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Discussion['category'])}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
            >
              <option value="Arquitetura">Arquitetura</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="IA">IA</option>
              <option value="MCP">MCP</option>
              <option value="DevOps">DevOps</option>
              <option value="Segurança">Segurança</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Conteúdo
            </label>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Detalhe o contexto técnico e suas dúvidas..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden"
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
              Publicar Discussão
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
