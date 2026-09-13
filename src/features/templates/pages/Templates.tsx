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
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#05A222] shrink-0" />
          <span className="font-bold text-[#14201C] font-mono text-sm">{t.name}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (t) => (
        <span className="text-xs sm:text-sm font-bold text-[#5F7069] uppercase">
          {t.category}
        </span>
      ),
    },
    {
      header: 'Language',
      render: (t) => <span className="font-mono text-sm text-[#5F7069] font-medium">{t.language}</span>,
    },
    {
      header: 'Meta Status',
      render: (t) => (
        <Badge
          variant={t.status === 'APPROVED' ? 'success' : t.status === 'PENDING' ? 'warning' : 'danger'}
          size="sm"
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
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
          leftIcon={<Eye className="w-4 h-4" />}
          className="text-sm font-semibold text-[#006736] hover:bg-[#F6FAF8]"
        >
          View & Test
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">
            WhatsApp Message Templates
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Meta-approved HSM message templates for initiating outbound marketing, utility, and auth messages.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.CREATE_TEMPLATE)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-sm font-bold px-4.5 py-2.5 rounded-xl shadow-sm"
        >
          Create New Template
        </Button>
      </div>

      <div className="mb-6 max-w-md">
        <SearchBar value={query} onChange={setQuery} placeholder="Search templates by name, body, category..." />
      </div>

      <Table columns={columns} data={filtered} isLoading={isLoading} />
    </PageContainer>
  );
};
