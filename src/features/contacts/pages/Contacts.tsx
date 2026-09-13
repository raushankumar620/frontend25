import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import { SearchBar } from '../../../components/common/SearchBar';
import { Plus, Download, Upload, Eye } from 'lucide-react';
import type { Contact } from '../types';
import { contactsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../../utils/formatDate';

export const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    contactsApi.getContacts().then((data) => {
      setContacts(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      (c.email && c.email.toLowerCase().includes(query.toLowerCase()))
  );

  const columns: Column<Contact>[] = [
    {
      header: 'Contact',
      render: (c) => (
        <div className="flex items-center gap-3">
          <Avatar name={c.name} size="sm" />
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{c.name}</div>
            <div className="text-[11px] text-slate-400">{c.email || 'No email registered'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'WhatsApp Number',
      render: (c) => <span className="font-mono text-slate-600 dark:text-slate-300">{c.phone}</span>,
    },
    {
      header: 'Tags',
      render: (c) => (
        <div className="flex gap-1 flex-wrap">
          {c.tags.map((t, idx) => (
            <Badge key={idx} variant="neutral" size="sm">
              {t}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Orders & LTV',
      render: (c) => (
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-200">
            ${c.totalSpent?.toLocaleString() ?? 0}
          </div>
          <div className="text-[10px] text-slate-400">{c.totalOrders ?? 0} orders</div>
        </div>
      ),
    },
    {
      header: 'Last Active',
      render: (c) => <span className="text-slate-400">{formatDateTime(c.lastActive)}</span>,
    },
    {
      header: 'Action',
      render: (c) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/contacts/${c.id}`)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Contacts & Audience</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your customer database, segmentation tags, and WhatsApp opt-ins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Upload className="w-3.5 h-3.5" />}>
            Import CSV
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Export
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add Contact
          </Button>
        </div>
      </div>

      <div className="mb-4 max-w-sm">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name, phone or email..." />
      </div>

      <Table columns={columns} data={filtered} isLoading={isLoading} />
    </PageContainer>
  );
};
