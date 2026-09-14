import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { templatesApi } from '../api';
import type { WhatsAppTemplate } from '../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Zap,
  Clock,
  AlertCircle,
  Smartphone,
  Trash2,
  Calendar,
  Globe,
  Tag,
  Code,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

export const TemplateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<WhatsAppTemplate | null>(null);
  const [sampleVars, setSampleVars] = useState<{ [key: string]: string }>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (id) {
      templatesApi.getTemplateById(id).then((data) => {
        if (data) {
          setTemplate(data);
          // Pre-populate sample variable defaults
          const matches: string[] = (data.body && data.body.match(/\{\{(\d+)\}\}/g)) || [];
          const initial: { [key: string]: string } = {};
          matches.forEach((m) => {
            const num = m.replace(/[{}]/g, '');
            initial[num] = num === '1' ? 'Alex Johnson' : `Value ${num}`;
          });
          setSampleVars(initial);
        }
      });
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await templatesApi.deleteTemplate(id);
      navigate(ROUTES.TEMPLATES);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  if (!template) {
    return (
      <PageContainer>
        <div className="p-12 text-center text-[#5F7069] font-semibold">Loading template details...</div>
      </PageContainer>
    );
  }

  // Live variable preview replacement
  const previewBody = template.body.replace(/\{\{(\d+)\}\}/g, (_, num) => {
    return sampleVars[num] || `[Variable {{${num}}}]`;
  });

  const foundVars = Array.from(new Set(Array.from(template.body.matchAll(/\{\{(\d+)\}\}/g), (m) => m[1])));

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return (
          <Badge variant="success" size="md">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Approved by Meta
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="warning" size="md">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Under Review (Pending)
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" size="md">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="md">
            {status}
          </Badge>
        );
    }
  };

  return (
    <PageContainer>
      {/* Back button */}
      <button
        onClick={() => navigate(ROUTES.TEMPLATES)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5F7069] hover:text-[#14201C] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Templates</span>
      </button>

      {/* Top Details Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2EAE6] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black font-mono text-[#14201C]">
                {template.name}
              </h2>
              {getStatusBadge(template.status)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F7069] mt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#05A222]" /> Category: <strong className="text-[#14201C] uppercase font-bold">{template.category}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#006736]" /> Language: <strong className="text-[#14201C] font-mono">{template.language}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#07CF74]" /> Created: {new Date(template.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfirmOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
            className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            Delete
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
            leftIcon={<Zap className="w-4 h-4" />}
            className="text-xs font-bold bg-[#05A222] hover:bg-[#006736] text-white shadow-xs"
          >
            Use in Broadcast Campaign
          </Button>
        </div>
      </div>

      {/* Main Grid: Details / Payload & Smartphone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Components Payload & Variable Testing */}
        <div className="lg:col-span-7 space-y-6">
          {/* Variable Testing Playground */}
          {foundVars.length > 0 && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-[#14201C] uppercase tracking-wider">
                <Code className="w-4 h-4 text-[#05A222]" />
                <span>Variable Testing Playground</span>
              </div>
              <p className="text-xs text-[#5F7069] font-medium">
                Replace placeholder variables with test values to see instant live rendering in the smartphone mockup.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {foundVars.map((v) => (
                  <div key={v}>
                    <label className="block text-[11px] font-mono font-bold text-[#14201C] mb-1">
                      Variable &#123;&#123;{v}&#125;&#125;
                    </label>
                    <input
                      type="text"
                      value={sampleVars[v] || ''}
                      onChange={(e) => setSampleVars({ ...sampleVars, [v]: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E2EAE6] bg-[#F6FAF8] text-[#14201C] font-semibold focus:border-[#05A222] focus:bg-white focus:outline-none"
                      placeholder={`Value for {{${v}}}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Payload Structure */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F7069]">
              Template Message Structure
            </h4>

            {template.header?.text && (
              <div>
                <span className="text-[11px] font-bold text-[#5F7069] uppercase block mb-1">Header</span>
                <div className="p-3.5 bg-[#F6FAF8] rounded-xl text-xs font-bold text-[#006736] border border-[#E2EAE6]">
                  {template.header.text}
                </div>
              </div>
            )}

            <div>
              <span className="text-[11px] font-bold text-[#5F7069] uppercase block mb-1">Message Body</span>
              <div className="p-3.5 bg-[#F6FAF8] rounded-xl text-xs text-[#14201C] whitespace-pre-wrap leading-relaxed font-sans border border-[#E2EAE6]">
                {template.body}
              </div>
            </div>

            {template.footer && (
              <div>
                <span className="text-[11px] font-bold text-[#5F7069] uppercase block mb-1">Footer Note</span>
                <div className="p-3 bg-[#F6FAF8] rounded-xl text-xs text-[#5F7069] font-medium border border-[#E2EAE6]">
                  {template.footer}
                </div>
              </div>
            )}

            {template.buttons && template.buttons.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-[#5F7069] uppercase block mb-1.5">Interactive Buttons</span>
                <div className="space-y-2">
                  {template.buttons.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F6FAF8] rounded-xl flex items-center justify-between text-xs font-semibold border border-[#E2EAE6]"
                    >
                      <span className="text-[#14201C] font-bold">{b.text}</span>
                      <span className="text-[10px] uppercase font-bold text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-2.5 py-0.5 rounded-lg">
                        {b.type} {b.url ? `• ${b.url}` : ''} {b.phoneNumber ? `• ${b.phoneNumber}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Realistic WhatsApp Smartphone Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Official WhatsApp Device Preview</span>
          </div>

          {/* Smartphone Chassis */}
          <div className="w-full max-w-[340px] bg-[#14201C] rounded-[44px] p-3.5 shadow-[0_20px_60px_rgba(1,59,35,0.18)] border-4 border-[#1F2A26]">
            {/* Speaker & Notch */}
            <div className="w-24 h-4 bg-[#14201C] mx-auto rounded-b-xl mb-2 flex items-center justify-center">
              <div className="w-10 h-1 bg-[#2D3A35] rounded-full" />
            </div>

            {/* Smartphone Inner Screen */}
            <div className="bg-[#E5DDD5] rounded-[34px] p-3.5 min-h-[460px] flex flex-col justify-between overflow-hidden relative">
              {/* WhatsApp App Bar */}
              <div className="bg-[#006736] text-white py-2 px-3 rounded-2xl flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#05A222] flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs">
                  W
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black truncate flex items-center gap-1">
                    <span>Acme Official Store</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6AEB31] shrink-0" />
                  </div>
                  <div className="text-[10px] text-[#C4EBD0] font-medium">Verified WhatsApp Business</div>
                </div>
              </div>

              {/* Message Bubble Preview */}
              <div className="my-auto py-3 space-y-2">
                <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm space-y-1.5 text-xs text-[#14201C]">
                  {template.header?.text && (
                    <div className="font-bold text-[#006736] border-b border-[#E2EAE6] pb-1">
                      {template.header.text}
                    </div>
                  )}
                  <div className="text-[#1F2A26] whitespace-pre-wrap leading-relaxed font-sans text-xs">
                    {previewBody}
                  </div>
                  {template.footer && (
                    <div className="text-[10px] text-[#8A9993] pt-1 border-t border-[#F6FAF8]">
                      {template.footer}
                    </div>
                  )}
                  <div className="text-[9px] text-right text-[#8A9993] font-medium flex items-center justify-end gap-1">
                    <span>12:45 PM</span>
                    <CheckCircle2 className="w-3 h-3 text-[#05A222]" />
                  </div>
                </div>

                {/* Interactive Action Buttons Preview */}
                {template.buttons && template.buttons.length > 0 && (
                  <div className="space-y-1.5">
                    {template.buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="bg-white py-2 px-3 text-center text-xs font-bold text-[#05A222] rounded-xl shadow-xs border border-[#C4EBD0] flex items-center justify-center gap-1.5"
                      >
                        <span>{btn.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Meta Badge Footer */}
              <div className="bg-white/90 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-[#E2EAE6] text-center text-[10px] text-[#006736] font-bold flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#05A222]" />
                <span>Verified Meta HSM Template</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#E2EAE6] space-y-4">
            <h3 className="text-lg font-black text-[#14201C]">Delete Template</h3>
            <p className="text-xs text-[#5F7069] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#14201C]">{template.name}</strong>? This will remove the template from your platform and submit deletion to Meta.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsConfirmOpen(false)} className="text-[#5F7069]">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Delete Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
