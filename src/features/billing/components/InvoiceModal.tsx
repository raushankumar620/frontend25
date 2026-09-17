import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Invoice } from '../types';

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

// Convert amount in INR to Words (Indian Currency System)
const amountToWords = (amount: number): string => {
  const rounded = Math.floor(amount);
  if (rounded === 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const doubleDigits = [
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTwoDigits = (num: number): string => {
    if (num < 10) return singleDigits[num];
    if (num >= 10 && num < 20) return doubleDigits[num - 10];
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return `${tens[ten]}${unit !== 0 ? ' ' + singleDigits[unit] : ''}`;
  };

  const convertThreeDigits = (num: number): string => {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    let str = '';
    if (hundred > 0) {
      str += `${singleDigits[hundred]} Hundred`;
      if (rest > 0) str += ' ';
    }
    if (rest > 0) {
      str += convertTwoDigits(rest);
    }
    return str;
  };

  let crore = Math.floor(rounded / 10000000);
  let lakh = Math.floor((rounded % 10000000) / 100000);
  let thousand = Math.floor((rounded % 100000) / 1000);
  let rest = rounded % 1000;

  let result = '';
  if (crore > 0) result += `${convertTwoDigits(crore)} Crore `;
  if (lakh > 0) result += `${convertTwoDigits(lakh)} Lakh `;
  if (thousand > 0) result += `${convertTwoDigits(thousand)} Thousand `;
  if (rest > 0) result += convertThreeDigits(rest);

  return `${result.trim()} Rupees Only`;
};

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(invoice.paidAt || invoice.createdAt);
  const formattedDate = invoiceDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Calculate tax breakdown (assuming 18% GST inclusive or net)
  const totalAmount = invoice.amount;
  const taxableAmount = +(totalAmount / 1.18).toFixed(2);
  const totalGst = +(totalAmount - taxableAmount).toFixed(2);
  const cgst = +(totalGst / 2).toFixed(2);
  const sgst = +(totalGst / 2).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#14201C]/70 backdrop-blur-xs animate-in fade-in overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Print Specific CSS for standard A4 Sheet */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm 8mm 10mm;
          }
          html, body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-invoice-container, #printable-invoice-container * {
            visibility: visible;
          }
          #printable-invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-invoice-container"
        className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-6 print:my-0 print:border-none print:shadow-none print:w-full print:max-w-full print:rounded-none"
      >
        {/* Top Control Bar (Screen only, hidden on print) */}
        <div className="p-4 px-6 bg-[#F6FAF8] border-b border-[#E2EAE6] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">
              Official Tax Invoice Receipt (A4 Format)
            </span>
            <span className="text-xs bg-[#E9F9EE] text-[#05A222] font-black px-2 py-0.5 rounded-full border border-[#C4EBD0] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Paid & Verified
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
              className="text-xs font-bold bg-[#006736] hover:bg-[#00522b] text-white rounded-xl shadow-xs cursor-pointer"
            >
              Print / Save A4 PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body (Standard A4 Page Container) */}
        <div className="p-6 sm:p-10 space-y-6 bg-white text-[#14201C] print:p-2 print:space-y-4">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-[#14201C] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <img
                  src="/images/logo.png"
                  alt="WhatsAppMsg Logo"
                  className="h-9 sm:h-10 object-contain"
                />
              </div>
              <div className="text-xs font-bold text-[#14201C]">WhatsAppMsg Technologies Pvt. Ltd.</div>
              <div className="text-[11px] text-[#5F7069] leading-relaxed">
                Official WhatsApp Business Solution Provider (BSP)<br />
                CIN: U72900DL2024PTC123456 | GSTIN: 07AAACW1234F1Z5<br />
                Support: support@whatsappmsg.com | Web: https://whatsappmsg.com
              </div>
            </div>

            <div className="text-left sm:text-right flex flex-col sm:items-end">
              <div className="inline-block px-3 py-1 bg-[#14201C] text-white font-black text-xs uppercase tracking-wider rounded-md mb-2">
                TAX INVOICE / RECEIPT
              </div>
              <div className="text-xs font-semibold text-[#5F7069]">ORIGINAL FOR RECIPIENT</div>
              <div className="text-sm font-mono font-black text-[#006736] mt-1">
                Invoice No: {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-[#5F7069]">
                Date of Issue: <strong>{formattedDate}</strong>
              </div>
            </div>
          </div>

          {/* Billing Meta & Client Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl space-y-1">
              <div className="font-black text-[#5F7069] uppercase tracking-wider text-[10px]">
                Billed To (Customer Details)
              </div>
              <div className="font-bold text-[#14201C] text-sm">Customer Organization Account</div>
              <div className="text-[#5F7069]">WhatsApp Cloud API Client Workspace</div>
              <div className="text-[#5F7069]">Place of Supply: India (Inter-state/Intra-state SaaS)</div>
            </div>

            <div className="p-3.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl space-y-1">
              <div className="font-black text-[#5F7069] uppercase tracking-wider text-[10px]">
                Payment & Transaction Details
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F7069]">Payment Gateway:</span>
                <span className="font-bold text-[#14201C]">Cashfree PG (Instant Checkout)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F7069]">Payment Mode:</span>
                <span className="font-bold text-[#14201C]">UPI / NetBanking / Cards</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F7069]">Payment Status:</span>
                <span className="font-bold text-[#05A222] bg-[#E9F9EE] px-1.5 py-0.2 rounded border border-[#C4EBD0]">
                  SUCCESS / PAID
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#E2EAE6] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14201C] text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Service / Item Description</th>
                  <th className="py-2.5 px-3 text-center">SAC Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Taxable Amt</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6]">
                {invoice.lineItems && invoice.lineItems.length > 0 ? (
                  invoice.lineItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F6FAF8]">
                      <td className="py-3 px-3 text-center text-[#5F7069]">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#14201C]">{item.description}</div>
                        <div className="text-[11px] text-[#5F7069]">
                          WhatsApp Official Cloud Messaging, Broadcaster, Flow Builder & AI Automation
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-[#5F7069]">998313</td>
                      <td className="py-3 px-3 text-center text-[#5F7069]">{item.quantity || 1}</td>
                      <td className="py-3 px-3 text-right text-[#5F7069]">
                        ₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#14201C]">
                        ₹{(item.amount * (item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-[#F6FAF8]">
                    <td className="py-3 px-3 text-center text-[#5F7069]">1</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#14201C]">
                        {invoice.description || 'WhatsApp Business Platform Subscription (Growth Plan)'}
                      </div>
                      <div className="text-[11px] text-[#5F7069]">
                        Full platform access, template broadcasting, cloud webhook triggers & AI agents
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[#5F7069]">998313</td>
                    <td className="py-3 px-3 text-center text-[#5F7069]">1</td>
                    <td className="py-3 px-3 text-right text-[#5F7069]">
                      ₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-[#14201C]">
                      ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Amount in Words & Tax Breakdown Calculation */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            
            {/* Amount in words & digital seal */}
            <div className="sm:col-span-7 p-3.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl space-y-3">
              <div>
                <span className="font-black text-[#5F7069] uppercase tracking-wider text-[10px] block">
                  Amount Chargeable (in words):
                </span>
                <p className="font-bold text-xs text-[#14201C] mt-0.5 italic">
                  {amountToWords(invoice.amount)}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E2EAE6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#05A222]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#006736] uppercase tracking-wide">
                      Digitally Verified by Cashfree
                    </div>
                    <div className="text-[10px] text-[#5F7069]">
                      Payment ID: {invoice.id}
                    </div>
                  </div>
                </div>

                <div className="border border-[#05A222] bg-[#E9F9EE] text-[#006736] font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider transform -rotate-3">
                  ✓ PAID & VERIFIED
                </div>
              </div>
            </div>

            {/* Tax Computation breakdown */}
            <div className="sm:col-span-5 p-3.5 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5F7069]">
                <span>Taxable Value (SAC 998313):</span>
                <span className="font-semibold text-[#14201C]">₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[#5F7069]">
                <span>CGST (9.0%):</span>
                <span className="font-semibold text-[#14201C]">₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[#5F7069]">
                <span>SGST (9.0%):</span>
                <span className="font-semibold text-[#14201C]">₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-[#E2EAE6] pt-1.5 flex justify-between items-center text-sm font-black">
                <span className="text-[#14201C]">Grand Total:</span>
                <span className="text-[#006736] text-base">
                  ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} {invoice.currency || 'INR'}
                </span>
              </div>
            </div>

          </div>

          {/* Terms & Authorized Signatory Footer */}
          <div className="grid grid-cols-2 gap-6 pt-3 border-t border-[#E2EAE6] text-[10px] text-[#5F7069]">
            <div className="space-y-1">
              <div className="font-bold text-[#14201C] uppercase tracking-wider">Terms & Conditions:</div>
              <p>1. This is an official computer generated tax receipt and requires no physical signature.</p>
              <p>2. Subscription fees are activated instantly and valid as per chosen billing period.</p>
              <p>3. For any billing support queries, reach out at support@whatsappmsg.com</p>
            </div>

            <div className="text-right flex flex-col justify-end items-end space-y-1">
              <div className="font-bold text-[#14201C]">For WhatsAppMsg Technologies Pvt. Ltd.</div>
              <div className="h-8 flex items-center justify-end">
                <span className="font-serif italic text-xs text-[#006736] font-bold border-b border-[#5F7069]/40 pb-0.5">
                  Authorized Signatory
                </span>
              </div>
              <div className="text-[9px] text-[#5F7069]">Generated from Cloud Billing System</div>
            </div>
          </div>

        </div>

        {/* Footer Actions (Screen only) */}
        <div className="p-4 px-6 bg-[#F6FAF8] border-t border-[#E2EAE6] flex items-center justify-between print:hidden">
          <div className="text-xs text-[#5F7069]">
            Click <strong>Print / Save A4 PDF</strong> to print directly or download as an A4 PDF document.
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-bold border-[#E2EAE6] text-[#14201C] hover:bg-white rounded-xl cursor-pointer"
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
              className="text-xs font-bold bg-[#006736] hover:bg-[#00522b] text-white rounded-xl shadow-xs cursor-pointer"
            >
              Print A4 Receipt
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

