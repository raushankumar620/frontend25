import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchBar } from '../../../components/common/SearchBar';
import {
  Plus,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Bookmark,
  FileEdit,
  Trash2,
  LayoutGrid,
  List,
  MoreVertical,
  Globe,
  Tag,
  ShieldCheck,
  Bell,
  ExternalLink,
  CornerDownLeft,
  Phone,
  Copy,
  Check,
  Share2,
  Image as ImageIcon,
  Video as VideoIcon,
} from 'lucide-react';
import type { WhatsAppTemplate } from '../types';
import { templatesApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

const formatLanguage = (langCode?: string) => {
  if (!langCode) return 'English';
  const map: Record<string, string> = {
    en_US: 'English (US)',
    en_GB: 'English (UK)',
    en: 'English',
    hi: 'Hindi',
    es: 'Spanish',
    pt_BR: 'Portuguese (BR)',
    ar: 'Arabic',
    id: 'Indonesian',
    fr: 'French',
    de: 'German',
    ru: 'Russian',
  };
  return map[langCode] || langCode;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
};

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // View mode: 'grid' (Cards) vs 'table' (List)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(() => {
    return (localStorage.getItem('templates_view_mode') as 'grid' | 'table') || 'grid';
  });

  const handleViewModeChange = (mode: 'grid' | 'table') => {
    setViewMode(mode);
    localStorage.setItem('templates_view_mode', mode);
  };

  // Close open action menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await templatesApi.getTemplates({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        search: query.trim() || undefined,
      });
      setTemplates(data);
    } catch (err: any) {
      console.error('Error fetching templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedStatus, query]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await templatesApi.syncTemplates();
      setSyncFeedback(`Successfully synced ${res.syncedCount} templates from Meta WABA!`);
      await fetchTemplates();
    } catch (err: any) {
      setSyncFeedback(err.message || 'Sync failed. Check WABA connection.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  const handleDelete = async (id: string, name: string, isDraft: boolean) => {
    const confirmMsg = isDraft
      ? `Are you sure you want to delete draft template "${name}"?`
      : `Are you sure you want to delete template "${name}"?`;
    if (!window.confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      await templatesApi.deleteTemplate(id);
      setSyncFeedback(`Template "${name}" deleted successfully.`);
      await fetchTemplates();
    } catch (err: any) {
      setSyncFeedback(err.message || 'Failed to delete template.');
    } finally {
      setDeletingId(null);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  const handleCopyBody = (template: WhatsAppTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(template.body);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const draftCount = templates.filter((t) => t.status === 'DRAFT').length;

  const filtered = templates.filter((t) => {
    const matchesQuery =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      (t.body && t.body.toLowerCase().includes(query.toLowerCase())) ||
      t.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Approved
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Pending Meta
          </Badge>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            Draft
          </span>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" size="sm">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {status}
          </Badge>
        );
    }
  };

  const getCardStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
            APPROVED
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
            PENDING
          </span>
        );
      case 'DRAFT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
            DRAFT
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
            REJECTED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getCategoryPill = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'MARKETING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Tag className="w-3 h-3 text-purple-600" />
            Marketing
          </span>
        );
      case 'AUTHENTICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            Authentication
          </span>
        );
      case 'UTILITY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Bell className="w-3 h-3 text-blue-600" />
            Utility
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            <Tag className="w-3 h-3 text-slate-500" />
            {cat}
          </span>
        );
    }
  };

  const getHeaderTypeBadge = (header?: { type?: string; text?: string; mediaUrl?: string }) => {
    if (!header || !header.type || header.type === 'NONE') return null;
    switch (header.type) {
      case 'IMAGE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ImageIcon className="w-3 h-3 text-emerald-600" />
            Image
          </span>
        );
      case 'VIDEO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <VideoIcon className="w-3 h-3 text-purple-600" />
            Video
          </span>
        );
      case 'DOCUMENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <FileText className="w-3 h-3 text-rose-600" />
            Document
          </span>
        );
      default:
        return null;
    }
  };

  const renderButtonPill = (btn: any, idx: number) => {
    const type = btn.type?.toUpperCase() || 'QUICK_REPLY';
    let icon = <CornerDownLeft className="w-3 h-3 text-slate-500 shrink-0" />;

    if (type === 'URL' || btn.url) {
      icon = <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />;
    } else if (type === 'PHONE_NUMBER' || btn.phoneNumber) {
      icon = <Phone className="w-3 h-3 text-slate-500 shrink-0" />;
    } else if (type === 'COPY_CODE' || btn.code) {
      icon = <Copy className="w-3 h-3 text-slate-500 shrink-0" />;
    }

    return (
      <div
        key={idx}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/90 text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors shrink-0"
      >
        {icon}
        <span className="truncate max-w-[130px]">{btn.text || 'Action'}</span>
      </div>
    );
  };

  const columns: Column<WhatsAppTemplate>[] = [
    {
      header: 'Template Name',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            t.status === 'DRAFT' ? 'bg-amber-50 text-amber-600' : 'bg-[#E9F9EE] text-[#05A222]'
          }`}>
            {t.status === 'DRAFT' ? <Bookmark className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#14201C] font-mono text-sm block">
                {t.name}
              </span>
              {t.status === 'DRAFT' && (
                <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                  Draft
                </span>
              )}
            </div>
            <span className="text-xs text-[#5F7069] font-medium truncate max-w-[280px] block">
              {t.body?.slice(0, 60)}{t.body && t.body.length > 60 ? '...' : ''}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (t) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {getCategoryPill(t.category)}
          {getHeaderTypeBadge(t.header)}
        </div>
      ),
    },
    {
      header: 'Language',
      render: (t) => (
        <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          {formatLanguage(t.language)}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (t) => getStatusBadge(t.status),
    },
    {
      header: 'Actions',
      render: (t) => (
        <div className="flex items-center gap-1.5">
          {t.status === 'DRAFT' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/templates/create?draftId=${t.id}`)}
              leftIcon={<FileEdit className="w-3.5 h-3.5 text-[#006736]" />}
              className="text-xs font-bold border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE] cursor-pointer"
            >
              Edit & Submit
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(`/templates/${t.id}`)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
              className="text-xs font-bold text-[#006736] hover:bg-[#E9F9EE] cursor-pointer"
            >
              View & Test
            </Button>
          )}

          <button
            type="button"
            onClick={() => handleDelete(t.id, t.name, t.status === 'DRAFT')}
            disabled={deletingId === t.id}
            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Template"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Sync / Action feedback notification */}
      {syncFeedback && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
          <span>{syncFeedback}</span>
          <button onClick={() => setSyncFeedback(null)} className="text-[#05A222] hover:underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Filter Tabs & Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E2EAE6]">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { key: 'ALL', label: 'All Templates' },
            { key: 'APPROVED', label: 'Approved' },
            { key: 'PENDING', label: 'Pending Meta' },
            { key: 'DRAFT', label: 'Drafts', count: draftCount },
            { key: 'REJECTED', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                selectedStatus === tab.key
                  ? 'bg-[#05A222] text-white shadow-xs'
                  : 'bg-white text-[#5F7069] hover:text-[#14201C] hover:bg-[#F6FAF8] border border-[#E2EAE6]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    selectedStatus === tab.key
                      ? 'bg-white text-[#006736]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons & View Switcher */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          {/* View Mode Switcher (Grid vs Table) */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => handleViewModeChange('grid')}
              title="Grid / Card View"
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#006736] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('table')}
              title="Table / List View"
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#006736] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Table</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
            className="text-xs font-bold rounded-xl border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE] cursor-pointer"
          >
            Sync with Meta
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.CREATE_TEMPLATE)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white cursor-pointer"
          >
            Create New Template
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        <div className="max-w-md w-full">
          <SearchBar value={query} onChange={setQuery} placeholder="Search templates by name, body, category..." />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-[#5F7069] mr-1">Category:</span>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'MARKETING', label: 'Marketing' },
            { key: 'UTILITY', label: 'Utility' },
            { key: 'AUTHENTICATION', label: 'Authentication' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-[#013B23] text-white shadow-xs'
                  : 'bg-white text-[#14201C] border border-[#E2EAE6] hover:bg-[#F6FAF8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <Table columns={columns} data={filtered} isLoading={isLoading} />
      ) : (
        /* Card / Grid View Layout */
        isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 animate-pulse shadow-2xs min-h-[220px]"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1 mr-4">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                  </div>
                  <div className="h-5 bg-slate-200 rounded-full w-16" />
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                  <div className="h-3 bg-slate-100 rounded w-4/6" />
                </div>
                <div className="pt-4 flex gap-2">
                  <div className="h-6 bg-slate-100 rounded-md w-20" />
                  <div className="h-6 bg-slate-100 rounded-md w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2EAE6] p-12 text-center shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#14201C] mb-1">No Templates Found</h3>
            <p className="text-sm text-[#5F7069] max-w-md mx-auto mb-6">
              {query || selectedCategory !== 'ALL' || selectedStatus !== 'ALL'
                ? 'No templates match your current filters and search query.'
                : 'Get started by creating your first WhatsApp HSM message template or draft.'}
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.CREATE_TEMPLATE)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="font-bold bg-[#05A222] hover:bg-[#006736] text-white cursor-pointer"
            >
              Create New Template
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((template) => {
              const isDraft = template.status === 'DRAFT';
              const buttonCount = template.buttons?.length || 0;

              return (
                <div
                  key={template.id}
                  onClick={() => {
                    if (isDraft) {
                      navigate(`/templates/create?draftId=${template.id}`);
                    } else {
                      navigate(`/templates/${template.id}`);
                    }
                  }}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#05A222]/40 transition-all p-5 flex flex-col justify-between relative cursor-pointer min-h-[240px]"
                >
                  <div>
                    {/* Card Top Row: Name, Category, Language + Status + 3-dots Menu */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate font-mono group-hover:text-[#006736] transition-colors">
                          {template.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {getCategoryPill(template.category)}
                          {getHeaderTypeBadge(template.header)}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                            <Globe className="w-3 h-3 text-slate-400" />
                            {formatLanguage(template.language)}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge & 3-Dots Action Menu */}
                      <div className="flex items-center gap-1 shrink-0">
                        {getCardStatusBadge(template.status)}

                        {/* 3-dots Menu Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === template.id ? null : template.id);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Template Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === template.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left"
                            >
                              {isDraft ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    navigate(`/templates/create?draftId=${template.id}`);
                                  }}
                                  className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#E9F9EE] hover:text-[#006736] flex items-center gap-2 cursor-pointer"
                                >
                                  <FileEdit className="w-3.5 h-3.5 text-[#05A222]" />
                                  Edit & Submit
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    navigate(`/templates/${template.id}`);
                                  }}
                                  className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#E9F9EE] hover:text-[#006736] flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#05A222]" />
                                  View & Test Details
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  handleCopyBody(template, e);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                {copiedId === template.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-600">Copied Body!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Copy Body Text</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  navigate(`/campaigns/create?templateId=${template.id}`);
                                }}
                                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                                Use in Campaign
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleDelete(template.id, template.name, isDraft);
                                }}
                                disabled={deletingId === template.id}
                                className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                Delete Template
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Message Body Preview */}
                    <div className="mb-3 text-left">
                      {template.header?.text && (
                        <p className="font-bold text-xs text-slate-900 mb-1 line-clamp-1">
                          {template.header.text}
                        </p>
                      )}
                      <p className="text-xs text-slate-700 font-normal leading-relaxed line-clamp-4 whitespace-pre-wrap">
                        {template.body}
                      </p>
                      {template.footer && (
                        <p className="text-[11px] text-slate-400 italic mt-1.5 truncate">
                          {template.footer}
                        </p>
                      )}
                    </div>

                    {/* Interactive Action Buttons Preview */}
                    {template.buttons && template.buttons.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1.5 mb-3 pt-1">
                        {template.buttons.map((btn, idx) => renderButtonPill(btn, idx))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Creation Date and Button Count */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1">
                    <span>{formatDate(template.createdAt || template.updatedAt)}</span>
                    <span>
                      {buttonCount} {buttonCount === 1 ? 'button' : 'buttons'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </PageContainer>
  );
};
