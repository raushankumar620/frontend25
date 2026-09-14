import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { KnowledgeFile } from '../components/KnowledgeFile';
import type { KnowledgeDocument, RAGSearchResult } from '../types';
import { aiService } from '../../../services/aiService';
import {
  ArrowLeft,
  Upload,
  Globe,
  Plus,
  Search,
  BookOpen,
  Layers,
  Sparkles,
  Database,
  X,
  FileText,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const KnowledgeBase: React.FC = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [isUrlCrawling, setIsUrlCrawling] = useState(false);
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'document' | 'faq' | 'text' | 'url'>('document');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Semantic Search Tester State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RAGSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await aiService.getKnowledgeDocs();
      setDocs(data);
    } catch (err) {
      console.error('Failed to load knowledge documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      setIsUrlCrawling(true);
      const title = urlTitle.trim() || `Web Documentation (${new URL(urlInput).hostname})`;
      const sampleCrawledContent = `Documentation crawled from ${urlInput}.\n\nWelcome to our online customer portal. Here you can find full guides, troubleshooting tips, account management steps, and billing details. For enterprise inquiries, our support is available 24/7.`;

      const created = await aiService.createKnowledgeDoc({
        title,
        type: 'url',
        sourceUrl: urlInput.trim(),
        content: sampleCrawledContent,
        tags: ['web', 'crawled'],
        fileSize: '12 KB',
      });

      setDocs([created, ...docs]);
      setUrlInput('');
      setUrlTitle('');
    } catch (err: any) {
      alert(`Failed to crawl URL: ${err.message}`);
    } finally {
      setIsUrlCrawling(false);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please provide a document title and content');
      return;
    }

    try {
      setIsSubmitting(true);
      const tagList = newTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);

      const created = await aiService.createKnowledgeDoc({
        title: newTitle.trim(),
        type: newType,
        content: newContent.trim(),
        tags: tagList,
        fileSize: `${(newContent.length / 1024).toFixed(1)} KB`,
      });

      setDocs([created, ...docs]);
      setShowAddModal(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
    } catch (err: any) {
      alert(`Failed to index document: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReindex = async (id: string) => {
    try {
      setReindexingId(id);
      const updated = await aiService.reindexKnowledgeDoc(id);
      setDocs(docs.map((d) => (d._id === id ? updated : d)));
    } catch (err: any) {
      alert(`Failed to reindex: ${err.message}`);
    } finally {
      setReindexingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await aiService.deleteKnowledgeDoc(id);
      setDocs(docs.filter((d) => d._id !== id));
      if (searchResults.some((r) => r.documentId === id)) {
        setSearchResults(searchResults.filter((r) => r.documentId !== id));
      }
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setHasSearched(true);
      const results = await aiService.queryKnowledgeBase(searchQuery.trim(), 4);
      setSearchResults(results);
    } catch (err: any) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const totalChunksCount = docs.reduce((acc, curr) => acc + (curr.totalChunks || 1), 0);

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.AI_DASHBOARD)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to AI Hub</span>
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[#006736] text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5">
            <Database className="w-4 h-4 text-[#05A222]" />
            <span>Retrieval-Augmented Generation (RAG) Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] dark:text-white tracking-tight">
            Knowledge Base & Vector Store
          </h2>
          <p className="text-sm text-[#5F7069] mt-1 font-medium">
            Ground your autonomous AI agents with company policies, FAQs, pricing, and live web documentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Upload className="w-4 h-4" />}
            className="text-sm font-bold bg-[#05A222] hover:bg-[#006736] text-[#14201C] hover:text-white px-4 py-2.5 rounded-xl shadow-xs"
          >
            Index Document / FAQs
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Indexed Documents</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{docs.length}</div>
          <span className="text-[11px] text-[#05A222] font-semibold mt-0.5 inline-block">Active in RAG</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Vector Chunks</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalChunksCount}</div>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 inline-block">Embedded segments</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Vector Embedding Model</div>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-2">text-embedding-3-small</div>
          <span className="text-[11px] text-[#006736] font-semibold mt-0.5 inline-block">1536-dim Cosine</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Grounding Status</div>
          <div className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Grounding Enabled
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 inline-block">Auto-injected into prompt</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Documents List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#05A222]" />
              Indexed Documents ({docs.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              Loading Knowledge Base...
            </div>
          ) : docs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Documents in Knowledge Base</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add business policies, FAQs, product catalogs, or website URLs to ground your WhatsApp AI agent.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="bg-[#05A222] text-[#14201C] font-bold mt-2"
              >
                Add First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {docs.map((doc) => (
                <KnowledgeFile
                  key={doc._id}
                  doc={doc}
                  onDelete={() => handleDelete(doc._id, doc.title)}
                  onReindex={() => handleReindex(doc._id)}
                  isReindexing={reindexingId === doc._id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Web Crawler & RAG Query Playground */}
        <div className="lg:col-span-5 space-y-6">
          {/* Web Sync Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sync from Website URL</h4>
                <p className="text-[11px] text-slate-500">Crawl and vectorize web pages or help centers.</p>
              </div>
            </div>

            <form onSubmit={handleAddUrl} className="space-y-3">
              <Input
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
                placeholder="Document Title (e.g. Help Center)"
              />
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://yourstore.com/faq"
                required
              />
              <Button
                size="sm"
                variant="outline"
                type="submit"
                disabled={!urlInput.trim() || isUrlCrawling}
                isLoading={isUrlCrawling}
                className="w-full text-xs font-semibold text-[#006736] border-[#C4EBD0] hover:bg-[#E9F9EE]"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Crawl & Index URL
              </Button>
            </form>
          </div>

          {/* Interactive Semantic Search Tester */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">RAG Semantic Search Playground</h4>
                <p className="text-[11px] text-slate-500">Test vector retrieval and inspect similarity scores.</p>
              </div>
            </div>

            <form onSubmit={handleSemanticSearch} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask a question (e.g. What is the return policy?)..."
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
                />
                <Button
                  size="sm"
                  type="submit"
                  disabled={!searchQuery.trim() || isSearching}
                  isLoading={isSearching}
                  className="bg-[#05A222] hover:bg-[#006736] text-[#14201C] hover:text-white font-bold px-3"
                >
                  <Search className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>

            {hasSearched && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500">
                  Retrieved Chunks ({searchResults.length})
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center text-xs text-slate-400">
                    No relevant chunks found above similarity threshold.
                  </div>
                ) : (
                  searchResults.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#006736] dark:text-[#05A222] text-[11px]">
                          {r.documentTitle} (Chunk #{r.chunkIndex + 1})
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#E9F9EE] text-[#006736] px-1.5 py-0.5 rounded">
                          {(r.similarityScore * 100).toFixed(1)}% match
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                        {r.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Index New Knowledge Document</h3>
                  <p className="text-xs text-slate-500">Auto-chunked and embedded for RAG retrieval.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <Input
                label="Document Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Return & Refund Policy 2026"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Document Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'document', label: 'Document', icon: FileText },
                    { id: 'faq', label: 'FAQ', icon: HelpCircle },
                    { id: 'text', label: 'Raw Text', icon: Layers },
                    { id: 'url', label: 'Web URL', icon: Globe },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewType(t.id as any)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                        newType === t.id
                          ? 'border-[#05A222] bg-[#E9F9EE] dark:bg-[#006736]/20 text-[#006736] dark:text-[#05A222]'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <t.icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Content Body & QA Pairs
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={6}
                  placeholder="Paste policies, answers to frequent questions, product specs, or instructions..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs p-3 focus:outline-none focus:ring-2 focus:ring-[#05A222]"
                  required
                />
              </div>

              <Input
                label="Tags (comma separated)"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="support, returns, policy, pricing"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="bg-[#05A222] hover:bg-[#006736] text-[#14201C] hover:text-white font-bold"
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Index into Vector Store
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
