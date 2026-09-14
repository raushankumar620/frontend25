import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Download, FileText, CheckCircle2, Clock } from 'lucide-react';
import type { Invoice } from '../types';
import { billingService } from '../../../services/billingService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    billingService.getInvoices().then((data) => {
      setInvoices(data);
      setIsLoading(false);
    });
  }, []);

  const handleDownload = (inv: Invoice) => {
    // Generate simulated PDF invoice download
    const invoiceContent = `=========================================
WHATSAPPMSG BUSINESS PLATFORM INVOICE
=========================================
Invoice Number: ${inv.invoiceNumber}
Date: ${new Date(inv.paidAt || inv.createdAt).toLocaleDateString()}
Status: ${inv.status}
Billing Reason: ${inv.billingReason}
Description: ${inv.description || 'Subscription & Meta Credits'}

Amount: $${inv.amount.toFixed(2)} ${inv.currency}
=========================================
Thank you for building with WhatsAppMsg!
=========================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.BILLING)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Billing Overview</span>
      </button>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[#14201C]">Invoice & Billing History</h2>
          <p className="text-sm text-[#5F7069] mt-1 font-medium">
            Download past monthly subscription charges and Meta Cloud API credit invoices.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E2EAE6] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-[#5F7069]">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#5F7069]">No invoices found for your organization.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2EAE6] text-xs font-bold text-[#5F7069] uppercase tracking-wider bg-[#F6FAF8]">
                  <th className="py-3.5 pl-6">Invoice #</th>
                  <th className="py-3.5">Description</th>
                  <th className="py-3.5">Date</th>
                  <th className="py-3.5">Amount</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6]/60">
                {invoices.map((inv) => {
                  const isPaid = inv.status === 'PAID';
                  return (
                    <tr key={inv.id || inv.invoiceNumber} className="hover:bg-[#F6FAF8] transition-colors">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-2 font-mono font-bold text-xs sm:text-sm text-[#14201C]">
                          <FileText className="w-4 h-4 text-[#05A222]" />
                          <span>{inv.invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 font-medium text-xs sm:text-sm text-[#14201C]">
                        {inv.description || inv.billingReason}
                      </td>
                      <td className="py-4 text-xs text-[#5F7069]">
                        {new Date(inv.paidAt || inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 font-black text-xs sm:text-sm text-[#14201C]">
                        ${inv.amount.toFixed(2)} {inv.currency}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isPaid
                              ? 'bg-[#E9F9EE] text-[#05A222] border border-[#C4EBD0]'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-6">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(inv)}
                          leftIcon={<Download className="w-3.5 h-3.5 text-[#006736]" />}
                          className="text-xs font-bold text-[#006736] hover:bg-[#E9F9EE] rounded-lg cursor-pointer"
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
