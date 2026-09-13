import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { KnowledgeFile } from '../components/KnowledgeFile';
import type { KnowledgeDocument } from '../types';
import { aiApi } from '../api';
import { ArrowLeft, Upload, Globe, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const KnowledgeBase: React.FC = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    aiApi.getKnowledgeDocs().then(setDocs);
  }, []);

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const newDoc: KnowledgeDocument = {
      id: 'doc_' + Date.now(),
      name: urlInput.trim(),
      type: 'url',
      size: 'Web Crawl',
      chunksCount: 45,
      status: 'indexed',
      updatedAt: new Date().toISOString(),
    };
    setDocs([newDoc, ...docs]);
    setUrlInput('');
  };

  const handleDelete = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.AI_DASHBOARD)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AI Hub</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Knowledge Base (RAG)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload PDFs, FAQs, pricing spreadsheets, and web documentation for instant AI grounding.
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Upload className="w-3.5 h-3.5" />}>
          Upload Document (PDF / DOCX)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document list */}
        <div className="lg:col-span-8 space-y-3">
          {docs.map((doc) => (
            <KnowledgeFile key={doc.id} doc={doc} onDelete={() => handleDelete(doc.id)} />
          ))}
        </div>

        {/* Web Scraper / Crawler */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sync from Website URL</h4>
          </div>
          <p className="text-xs text-slate-500">
            Automatically scrape and vectorize your help center, FAQs, or landing pages.
          </p>

          <form onSubmit={handleAddUrl} className="space-y-3">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://acme.com/help"
            />
            <Button size="sm" variant="outline" type="submit" className="w-full" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Crawl & Index URL
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};
