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

  // Calculate tax breakdown (assuming 18% GST inclusive)
  const totalAmount = invoice.amount;
  const taxableAmount = +(totalAmount / 1.18).toFixed(2);
  const totalGst = +(totalAmount - taxableAmount).toFixed(2);
  const cgst = +(totalGst / 2).toFixed(2);
  const sgst = +(totalGst / 2).toFixed(2);

  return (
    <>
      {/* ========================================================
          1. ON-SCREEN MODAL POPUP (Identical to previous UI)
         ======================================================== */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14201C]/60 backdrop-blur-xs animate-in fade-in overflow-y-auto print:hidden">
        <div className="bg-white border border-[#E2EAE6] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
          
          {/* Modal Header */}
          <div className="p-4 px-6 bg-[#F6FAF8] border-b border-[#E2EAE6] flex items-center justify-between">
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
                className="text-xs font-bold border-[#E2EAE6] text-[#14201C] hover:bg-white rounded-xl cursor-pointer"
              >
                Print / Save A4 PDF
              </Button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-[#5F7069] hover:text-[#14201C] hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-8 sm:p-10 space-y-6 bg-white">
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
                  Date: {formattedDate}
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
                <div className="text-[#5F7069]">Payment Gateway: Cashfree PG (UPI / Cards / NetBanking)</div>
              </div>

              <div className="p-4 bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl space-y-1">
                <span className="font-bold text-[#5F7069] uppercase tracking-wider text-[10px]">
                  Invoice Details
                </span>
                <div className="flex justify-between">
                  <span className="text-[#5F7069]">Billing Category:</span>
                  <strong className="text-[#14201C]">{invoice.billingReason || 'Subscription'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5F7069]">Currency:</span>
                  <strong className="text-[#14201C]">{invoice.currency || 'INR'}</strong>
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
                          ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-[#14201C]">
                          ₹{(item.amount * (item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                        ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-[#14201C]">
                        ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                  Subtotal: <span className="font-bold text-[#14201C]">₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="text-xs text-[#5F7069]">
                  Tax / GST (Included): <span className="font-bold text-[#14201C]">₹0.00</span>
                </div>
                <div className="text-base sm:lg font-black text-[#14201C]">
                  Total Paid: <span className="text-[#006736]">₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} {invoice.currency || 'INR'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 px-6 bg-[#F6FAF8] border-t border-[#E2EAE6] flex items-center justify-end gap-3">
            <Button variant="primary" size="md" onClick={onClose} className="text-xs font-bold rounded-xl cursor-pointer">
              Close Receipt
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. DEDICATED A4 PRINT SHEET (Rendered only on window.print)
         ======================================================== */}
      <div id="print-a4-document" className="hidden print:block font-sans text-[#14201C] bg-white">
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 12mm 10mm 12mm;
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
            #print-a4-document, #print-a4-document * {
              visibility: visible;
            }
            #print-a4-document {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }
          }
        `}</style>

        <div className="p-4 space-y-5 border border-[#E2EAE6] rounded-xl">
          
          {/* A4 Header Section */}
          <div className="flex justify-between items-start gap-4 border-b-2 border-[#14201C] pb-4">
            <div>
              <img
                src="/images/logo.png"
                alt="WhatsAppMsg Logo"
                className="h-10 object-contain mb-1.5"
              />
              <div className="text-xs font-bold text-[#14201C]">WhatsAppMsg Technologies Pvt. Ltd.</div>
              <div className="text-[11px] text-[#5F7069] leading-relaxed">
                Official WhatsApp Business Solution Provider (BSP)<br />
                CIN: U72900DL2024PTC123456 | GSTIN: 07AAACW1234F1Z5<br />
                Support: support@whatsappmsg.com | Web: https://whatsappmsg.com
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="inline-block px-3 py-1 bg-[#14201C] text-white font-black text-xs uppercase tracking-wider rounded-md mb-1.5">
                TAX INVOICE / RECEIPT
              </div>
              <div className="text-[11px] font-semibold text-[#5F7069]">ORIGINAL FOR RECIPIENT</div>
              <div className="text-sm font-mono font-black text-[#006736] mt-0.5">
                Invoice No: {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-[#5F7069]">
                Date of Issue: <strong>{formattedDate}</strong>
              </div>
            </div>
          </div>

          {/* A4 Client Info & Payment Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-lg space-y-1">
              <div className="font-black text-[#5F7069] uppercase tracking-wider text-[10px]">
                Billed To (Customer Details)
              </div>
              <div className="font-bold text-[#14201C]">Customer Organization Account</div>
              <div className="text-[#5F7069]">WhatsApp Cloud API Client Workspace</div>
              <div className="text-[#5F7069]">Place of Supply: India (Inter-state/Intra-state SaaS)</div>
            </div>

            <div className="p-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-lg space-y-1">
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

          {/* A4 Itemized Table */}
          <div className="border border-[#E2EAE6] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#14201C] text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3 w-10 text-center">#</th>
                  <th className="py-2 px-3">Service / Item Description</th>
                  <th className="py-2 px-3 text-center">SAC Code</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Taxable Amt</th>
                  <th className="py-2 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAE6]">
                {invoice.lineItems && invoice.lineItems.length > 0 ? (
                  invoice.lineItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 text-center text-[#5F7069]">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#14201C]">{item.description}</div>
                        <div className="text-[10px] text-[#5F7069]">
                          WhatsApp Official Cloud Messaging, Broadcaster, Flow Builder & AI Automation
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-[#5F7069]">998313</td>
                      <td className="py-2.5 px-3 text-center text-[#5F7069]">{item.quantity || 1}</td>
                      <td className="py-2.5 px-3 text-right text-[#5F7069]">
                        ₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-[#14201C]">
                        ₹{(item.amount * (item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2.5 px-3 text-center text-[#5F7069]">1</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#14201C]">
                        {invoice.description || 'WhatsApp Business Platform Subscription (Growth Plan)'}
                      </div>
                      <div className="text-[10px] text-[#5F7069]">
                        Full platform access, template broadcasting, cloud webhook triggers & AI agents
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[#5F7069]">998313</td>
                    <td className="py-2.5 px-3 text-center text-[#5F7069]">1</td>
                    <td className="py-2.5 px-3 text-right text-[#5F7069]">
                      ₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-[#14201C]">
                      ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* A4 Calculations & In-Words */}
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-7 p-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-lg space-y-2">
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
                  <ShieldCheck className="w-5 h-5 text-[#05A222]" />
                  <div>
                    <div className="text-[10px] font-black text-[#006736] uppercase">
                      Digitally Verified by Cashfree
                    </div>
                    <div className="text-[9px] text-[#5F7069]">
                      Payment ID: {invoice.id}
                    </div>
                  </div>
                </div>

                <div className="border border-[#05A222] bg-[#E9F9EE] text-[#006736] font-black text-[10px] px-2 py-0.5 rounded uppercase">
                  ✓ PAID & VERIFIED
                </div>
              </div>
            </div>

            <div className="col-span-5 p-3 bg-[#F6FAF8] border border-[#E2EAE6] rounded-lg space-y-1 text-xs">
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
              <div className="border-t border-[#E2EAE6] pt-1 flex justify-between items-center text-sm font-black">
                <span className="text-[#14201C]">Grand Total:</span>
                <span className="text-[#006736]">
                  ₹{invoice.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} {invoice.currency || 'INR'}
                </span>
              </div>
            </div>
          </div>

          {/* A4 Footer Terms & Signature */}
          <div className="grid grid-cols-2 gap-6 pt-2 border-t border-[#E2EAE6] text-[9px] text-[#5F7069]">
            <div className="space-y-0.5">
              <div className="font-bold text-[#14201C] uppercase tracking-wider">Terms & Conditions:</div>
              <p>1. Computer generated tax receipt; requires no physical signature.</p>
              <p>2. Subscription fees are activated instantly and valid as per chosen period.</p>
              <p>3. For support queries, contact support@whatsappmsg.com</p>
            </div>

            <div className="text-right flex flex-col justify-end items-end space-y-0.5">
              <div className="font-bold text-[#14201C]">For WhatsAppMsg Technologies Pvt. Ltd.</div>
              <div className="h-6 flex items-center justify-end">
                <span className="font-serif italic text-[11px] text-[#006736] font-bold border-b border-[#5F7069]/40 pb-0.5">
                  Authorized Signatory
                </span>
              </div>
              <div className="text-[8px] text-[#5F7069]">Generated from Cloud Billing System</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

