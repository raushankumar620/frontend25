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
        <div className="flex items-center gap-3.5">
          <Avatar name={c.name} size="md" />
          <div>
            <div className="font-bold text-[#14201C] text-sm sm:text-base">{c.name}</div>
            <div className="text-xs text-[#5F7069] mt-0.5">{c.email || 'No email registered'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'WhatsApp Number',
      render: (c) => <span className="font-mono text-sm font-semibold text-[#1F2A26]">{c.phone}</span>,
    },
    {
      header: 'Tags',
      render: (c) => (
        <div className="flex gap-1.5 flex-wrap">
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
          <div className="font-extrabold text-[#14201C] text-sm">
            ${c.totalSpent?.toLocaleString() ?? 0}
          </div>
          <div className="text-xs text-[#5F7069] font-medium">{c.totalOrders ?? 0} orders</div>
        </div>
      ),
    },
    {
      header: 'Last Active',
      render: (c) => <span className="text-xs sm:text-sm text-[#5F7069] font-medium">{formatDateTime(c.lastActive)}</span>,
    },
    {
      header: 'Action',
      render: (c) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/contacts/${c.id}`)}
          leftIcon={<Eye className="w-4 h-4" />}
          className="text-sm font-semibold text-[#006736] hover:bg-[#F6FAF8]"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#14201C] tracking-tight">Contacts & Audience</h2>
          <p className="text-sm sm:text-base text-[#5F7069] mt-1.5 font-medium">
            Manage your customer database, segmentation tags, and WhatsApp opt-ins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" leftIcon={<Upload className="w-4 h-4" />} className="text-sm font-semibold rounded-xl">
            Import CSV
          </Button>
          <Button variant="outline" size="md" leftIcon={<Download className="w-4 h-4" />} className="text-sm font-semibold rounded-xl">
            Export
          </Button>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} className="text-sm font-bold rounded-xl shadow-sm">
            Add Contact
          </Button>
        </div>
      </div>

      <div className="mb-6 max-w-md">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by name, phone or email..." />
      </div>

      <Table columns={columns} data={filtered} isLoading={isLoading} />
    </PageContainer>
  );
};
