import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Invoice } from '../types';

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Modal Top Actions (Hidden when printing) */}
        <div className="p-4 px-6 bg-[#F6FAF8] border-b border-[#E2EAE6] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">
              Official Tax Invoice Receipt
            </span>
            <span className="text-xs bg-[#E9F9EE] text-[#05A222] font-black px-2 py-0.5 rounded-full border border-[#C4EBD0]">
              Verified
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              className="text-xs font-bold border-[#E2EAE6] text-[#14201C] hover:bg-white rounded-xl"
            >
              Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 sm:p-10 space-y-8 bg-white">
          {/* Header with WhatsAppMsg Official Logo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#E2EAE6] pb-8">
            <div>
              <img
                src="/images/logo.png"
                alt="WhatsAppMsg"
                className="h-9 sm:h-11 object-contain mb-2"
              />
              <p className="text-xs text-[#5F7069] font-semibold">
                Official WhatsApp Business Solution Platform
              </p>
              <p className="text-[11px] text-[#5F7069]">
                https://whatsappmsg.com • support@whatsappmsg.com
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#05A222]" />
                <span>{invoice.status}</span>
              </div>
              <div className="text-xl font-mono font-black text-[#14201C] tracking-tight">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-[#5F7069] mt-0.5">
                Date: {new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Invoice Summary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl space-y-1">
              <span className="font-bold text-[#5F7069] uppercase tracking-wider text-[10px]">
                Billed To
              </span>
              <div className="font-bold text-[#14201C] text-sm">Customer Organization</div>
              <div className="text-[#5F7069]">WhatsApp Cloud API Client Account</div>
              <div className="text-[#5F7069]">Payment Method: Credit Card / Stripe</div>
            </div>

            <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl space-y-1">
              <span className="font-bold text-[#5F7069] uppercase tracking-wider text-[10px]">
                Invoice Details
              </span>
              <div className="flex justify-between">
                <span className="text-[#5F7069]">Billing Category:</span>
                <strong className="text-[#14201C]">{invoice.billingReason}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F7069]">Currency:</span>
                <strong className="text-[#14201C]">{invoice.currency} (USD)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F7069]">Payment Status:</span>
                <strong className="text-[#05A222]">Completed & Verified</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#E2EAE6] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F6FAF8] border-b border-[#E2EAE6] font-bold text-[#5F7069] uppercase tracking-wider">
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6]/60">
                {invoice.lineItems && invoice.lineItems.length > 0 ? (
                  invoice.lineItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3.5 px-4 font-bold text-[#14201C]">{item.description}</td>
                      <td className="py-3.5 px-4 text-center text-[#5F7069]">{item.quantity || 1}</td>
                      <td className="py-3.5 px-4 text-right text-[#5F7069]">
                        ${item.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-[#14201C]">
                        ${(item.amount * (item.quantity || 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-[#14201C]">
                      {invoice.description || 'WhatsApp Business Platform Subscription & Credits'}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#5F7069]">1</td>
                    <td className="py-3.5 px-4 text-right text-[#5F7069]">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#14201C]">
                      ${invoice.amount.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Grand Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E2EAE6]">
            <div className="flex items-center gap-2 text-xs text-[#5F7069]">
              <ShieldCheck className="w-4 h-4 text-[#05A222]" />
              <span>Official digital invoice issued by WhatsAppMsg Platform</span>
            </div>

            <div className="space-y-1.5 text-right">
              <div className="text-xs text-[#5F7069]">
                Subtotal: <span className="font-bold text-[#14201C]">${invoice.amount.toFixed(2)}</span>
              </div>
              <div className="text-xs text-[#5F7069]">
                Tax / VAT (0%): <span className="font-bold text-[#14201C]">$0.00</span>
              </div>
              <div className="text-base sm:text-lg font-black text-[#14201C]">
                Total Paid: <span className="text-[#006736]">${invoice.amount.toFixed(2)} {invoice.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-[#F6FAF8] border-t border-[#E2EAE6] flex items-center justify-end gap-3 print:hidden">
          <Button variant="primary" size="md" onClick={onClose} className="text-xs font-bold rounded-xl">
            Close Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};
