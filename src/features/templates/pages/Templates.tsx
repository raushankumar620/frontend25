import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchBar } from '../../../components/common/SearchBar';
import { Plus, Eye, FileText, CheckCircle2, Clock, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import type { WhatsAppTemplate } from '../types';
import { templatesApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await templatesApi.getTemplates({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        search: query.trim() || undefined,
      });
      setTemplates(data);
    } catch (err: any) {
      console.error('Error fetching templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, query]);

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

  const filtered = templates.filter((t) => {
    const matchesQuery =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      (t.body && t.body.toLowerCase().includes(query.toLowerCase())) ||
      t.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesQuery && matchesCategory;
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

  const columns: Column<WhatsAppTemplate>[] = [
    {
      header: 'Template Name',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#14201C] font-mono text-sm block">
              {t.name}
            </span>
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
        <span className="text-xs font-bold text-[#006736] uppercase px-2.5 py-1 bg-[#E9F9EE] border border-[#C4EBD0] rounded-lg">
          {t.category}
        </span>
      ),
    },
    {
      header: 'Language',
      render: (t) => (
        <span className="font-mono text-xs text-[#5F7069] font-bold">
          {t.language}
        </span>
      ),
    },
    {
      header: 'Meta Status',
      render: (t) => getStatusBadge(t.status),
    },
    {
      header: 'Actions',
      render: (t) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/templates/${t.id}`)}
          leftIcon={<Eye className="w-4 h-4" />}
          className="text-xs font-bold text-[#006736] hover:bg-[#E9F9EE]"
        >
          View & Test
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#05A222]" />
            WhatsApp Message Templates
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1 font-medium">
            Meta-approved HSM message templates for initiating outbound marketing, utility, and OTP auth messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleSync}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
            className="text-xs sm:text-sm font-bold rounded-xl border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE]"
          >
            Sync with Meta
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.CREATE_TEMPLATE)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs sm:text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white"
          >
            Create New Template
          </Button>
        </div>
      </div>

      {/* Sync feedback notification */}
      {syncFeedback && (
        <div className="mb-6 p-4 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{syncFeedback}</span>
          <button onClick={() => setSyncFeedback(null)} className="text-[#05A222] hover:underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="max-w-md w-full">
          <SearchBar value={query} onChange={setQuery} placeholder="Search templates by name, body, category..." />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'MARKETING', 'UTILITY', 'AUTHENTICATION'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#05A222] text-white shadow-xs'
                  : 'bg-white text-[#14201C] border border-[#E2EAE6] hover:bg-[#F6FAF8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Table columns={columns} data={filtered} isLoading={isLoading} />
    </PageContainer>
  );
};
