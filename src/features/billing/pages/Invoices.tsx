import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Table, type Column } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ArrowLeft, Download, FileText, CheckCircle2 } from 'lucide-react';
import type { Invoice } from '../types';
import { billingApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatDate';

export const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    billingApi.getInvoices().then((data) => {
      setInvoices(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice Number',
      render: (inv) => (
        <div className="flex items-center gap-2 font-mono font-bold text-slate-900 dark:text-white">
          <FileText className="w-4 h-4 text-emerald-500" />
          <span>{inv.invoiceNumber}</span>
        </div>
      ),
    },
    {
      header: 'Billing Date',
      render: (inv) => <span className="text-slate-500">{formatDate(inv.date)}</span>,
    },
    {
      header: 'Amount Paid',
      render: (inv) => <span className="font-bold text-slate-800 dark:text-slate-100">${inv.amount}.00 USD</span>,
    },
    {
      header: 'Status',
      render: (inv) => (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {inv.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Action',
      render: () => (
        <Button size="sm" variant="ghost" leftIcon={<Download className="w-3.5 h-3.5" />}>
          Download PDF
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.BILLING)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Billing</span>
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Invoice History</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Download past monthly subscription and Meta Cloud API credit invoices.
        </p>
      </div>

      <Table columns={columns} data={invoices} isLoading={isLoading} />
    </PageContainer>
  );
};
