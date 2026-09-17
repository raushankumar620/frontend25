import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import { SearchBar } from '../../../components/common/SearchBar';
import { Modal } from '../../../components/ui/Modal';
import { Plus, Download, Upload, Eye, Tag, Check, AlertCircle, Loader2 } from 'lucide-react';
import type { Contact } from '../types';
import { contactsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../../utils/formatDate';

export const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagSummaries, setTagSummaries] = useState<{ tag: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Add Contact Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Import State
  const [csvText, setCsvText] = useState('');
  const [importTag, setImportTag] = useState('Imported');
  const [importStats, setImportStats] = useState<any>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await contactsApi.getContacts();
      setContacts(data);
      const tags = await contactsApi.getTagsSummary();
      setTagSummaries(tags);
    } catch (err) {
      console.warn('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!phone.trim()) {
      setFormError('Phone number is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await contactsApi.createContact({
        phoneNumber: phone.trim(),
        name: name.trim(),
        email: email.trim() || undefined,
        tags,
      });

      setFormSuccess('Contact created successfully!');
      setName('');
      setPhone('');
      setEmail('');
      setTagsInput('');
      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess('');
        fetchContacts();
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setImportStats(null);

    if (!csvText.trim()) {
      setFormError('Please enter contact phone numbers or CSV data');
      return;
    }

    setIsSubmitting(true);
    try {
      const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
      const parsedContacts = lines.map((line) => {
        const parts = line.split(',').map((p) => p.trim());
        return {
          phoneNumber: parts[0],
          name: parts[1] || '',
          email: parts[2] || '',
          tags: parts[3] ? parts[3].split(';') : [],
        };
      });

      const stats = await contactsApi.bulkImport(
        parsedContacts,
        'update',
        importTag ? [importTag] : []
      );
      setImportStats(stats);
      fetchContacts();
    } catch (err: any) {
      setFormError(err.message || 'Bulk import failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const allContacts = await contactsApi.exportContacts();
      const headers = ['Phone Number', 'Name', 'Email', 'Tags', 'Opt-In Status', 'Created At'];
      const rows = allContacts.map((c: any) => [
        `"${c.phoneNumber || c.phone}"`,
        `"${c.name || ''}"`,
        `"${c.email || ''}"`,
        `"${(c.tags || []).join(';')}"`,
        `"${c.optInStatus || 'OPTED_IN'}"`,
        `"${new Date(c.createdAt).toISOString()}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const filtered = contacts.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      (c.email && c.email.toLowerCase().includes(query.toLowerCase()));

    const matchesTag = !selectedTag || c.tags.includes(selectedTag);
    return matchesQuery && matchesTag;
  });

  const columns: Column<Contact>[] = [
    {
      header: 'Contact',
      render: (c) => (
        <div className="flex items-center gap-3.5">
          <Avatar name={c.name} size="md" />
          <div>
            <div className="font-bold text-[#14201C] text-sm sm:text-base">{c.name || 'Unnamed Contact'}</div>
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
      header: 'Consent / Status',
      render: (c) => (
        <Badge variant={c.status === 'active' ? 'success' : 'danger'} size="sm">
          {c.status === 'active' ? 'OPTED IN' : 'OPTED OUT'}
        </Badge>
      ),
    },
    {
      header: 'Tags',
      render: (c) => (
        <div className="flex gap-1.5 flex-wrap">
          {c.tags.length > 0 ? (
            c.tags.map((t, idx) => (
              <Badge key={idx} variant="neutral" size="sm">
                {t}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-slate-400">No tags</span>
          )}
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
          360° View
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Unified Search, Tag Filters & Action Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="max-w-md w-full">
            <SearchBar value={query} onChange={setQuery} placeholder="Search by name, phone or email..." />
          </div>

          {tagSummaries.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedTag === null
                    ? 'bg-[#006736] text-white shadow-xs'
                    : 'bg-white text-[#5F7069] border border-[#E2EAE6] hover:bg-[#F6FAF8]'
                }`}
              >
                All ({contacts.length})
              </button>
              {tagSummaries.map((ts) => (
                <button
                  key={ts.tag}
                  onClick={() => setSelectedTag(ts.tag === selectedTag ? null : ts.tag)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    selectedTag === ts.tag
                      ? 'bg-[#006736] text-white shadow-xs'
                      : 'bg-white text-[#5F7069] border border-[#E2EAE6] hover:bg-[#F6FAF8]'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {ts.tag} ({ts.count})
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="text-xs font-bold rounded-xl border-[#C4EBD0] text-[#006736] hover:bg-[#E9F9EE] cursor-pointer"
          >
            Import CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs font-bold rounded-xl border-[#E2EAE6] text-[#14201C] hover:bg-[#F6FAF8] cursor-pointer"
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs bg-[#05A222] hover:bg-[#006736] text-white cursor-pointer"
          >
            Add Contact
          </Button>
        </div>
      </div>

      <Table columns={columns} data={filtered} isLoading={isLoading} />

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Contact"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          {formSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              WhatsApp Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+15551234567 or 919876543210"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#006736]"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Include country code (e.g. +1, +91, +44)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006736]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006736]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Audience Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="VIP, Lead, Enterprise, Webinar-2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006736]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Import CSV Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportStats(null);
        }}
        title="Import Contacts (CSV or Paste)"
      >
        <form onSubmit={handleBulkImport} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {importStats && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Import Completed Successfully!
              </p>
              <p>Total Processed: <strong>{importStats.total}</strong></p>
              <p>Created: <strong>{importStats.created}</strong> | Updated: <strong>{importStats.updated}</strong> | Skipped: <strong>{importStats.skipped}</strong></p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              CSV Format: Phone, Name, Email, Tags (semicolon-separated)
            </label>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="+15551234567, Alice Smith, alice@sample.com, VIP;Lead&#10;+919876543210, Rahul Verma, rahul@tech.io, Growth"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#006736]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Apply Default Tag to Imported Contacts</label>
            <input
              type="text"
              value={importTag}
              onChange={(e) => setImportTag(e.target.value)}
              placeholder="e.g. CSV-Import-March"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006736]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsImportModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </span>
              ) : (
                'Start Import'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
};
