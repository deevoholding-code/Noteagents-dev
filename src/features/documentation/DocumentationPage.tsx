import React, { useState, useEffect } from 'react';
import { DocCategory, DocSection } from '../../types';
import { docService } from '../../services';
import { PageHeader } from '../../components/layout/PageHeader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { CodeBlock } from '../../components/ui/CodeBlock';
import { BookOpen, ChevronRight, Search, FileText, ExternalLink } from 'lucide-react';

export const DocumentationPage: React.FC = () => {
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [selectedSection, setSelectedSection] = useState<DocSection | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    docService.getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0 && cats[0].sections.length > 0) {
        setSelectedSection(cats[0].sections[0]);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Documentação' }]} />

      <PageHeader
        title="Documentação Técnica do NoteAgents"
        subtitle="Guias de integração de agentes de IA, especificação MCP, SDKs e pipelines de observabilidade."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Docs Navigation Menu */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-4 md:col-span-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar guias..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id}>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2">
                  {cat.title}
                </span>
                <div className="mt-1 space-y-0.5">
                  {cat.sections.map((sec) => {
                    const isSelected = selectedSection?.id === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setSelectedSection(sec)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{sec.title}</span>
                        {isSelected && <ChevronRight className="w-3 h-3 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Viewer */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs md:col-span-3 space-y-6">
          {selectedSection ? (
            <>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {selectedSection.title}
                </h2>
                <span className="text-xs text-slate-400 font-mono mt-1 block">
                  Slug: /{selectedSection.slug}
                </span>
              </div>

              <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedSection.content}
              </div>

              {selectedSection.codeSnippet && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Exemplo de Código ({selectedSection.codeSnippet.language})
                  </h4>
                  <CodeBlock
                    code={selectedSection.codeSnippet.code}
                    language={selectedSection.codeSnippet.language}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400">Selecione uma seção para visualizar.</p>
          )}
        </div>
      </div>
    </div>
  );
};
