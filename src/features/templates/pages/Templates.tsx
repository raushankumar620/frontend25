import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchBar } from '../../../components/common/SearchBar';
import { Plus, Eye, FileText, CheckCircle2 } from 'lucide-react';
import type { WhatsAppTemplate } from '../types';
import { templatesApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    templatesApi.getTemplates().then((data) => {
      setTemplates(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.body.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  const columns: Column<WhatsAppTemplate>[] = [
    {
      header: 'Template Name',
      render: (t) => (
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-bold text-slate-900 dark:text-white font-mono text-xs">{t.name}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (t) => (
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase">
          {t.category}
        </span>
      ),
    },
    {
      header: 'Language',
      render: (t) => <span className="font-mono text-slate-500">{t.language}</span>,
    },
    {
      header: 'Meta Status',
      render: (t) => (
        <Badge
          variant={t.status === 'APPROVED' ? 'success' : t.status === 'PENDING' ? 'warning' : 'danger'}
          size="sm"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {t.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (t) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/templates/${t.id}`)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View & Test
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            WhatsApp Message Templates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Meta-approved HSM message templates for initiating outbound marketing, utility, and auth messages.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.CREATE_TEMPLATE)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Create New Template
        </Button>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder="Search templates..." />
      </div>

      <Table columns={columns} data={filtered} isLoading={isLoading} />
    </PageContainer>
  );
};
