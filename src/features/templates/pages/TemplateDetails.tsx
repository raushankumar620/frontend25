import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { templatesApi } from '../api';
import type { WhatsAppTemplate } from '../types';
import { Button } from '../../../components/ui/Button';
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
  ShieldCheck,
  Sparkles,
  Wifi,
  ChevronLeft,
  Phone,
  Video,
  CheckCheck,
  Bookmark,
  FileEdit
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
          const initialMap: { [key: string]: string } = {};
          matches.forEach((m: string) => {
            const num = m.replace(/[{}]/g, '');
            initialMap[num] = `[Var ${num}]`;
          });
          setSampleVars(initialMap);
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
      console.error('Failed to delete template', err);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  if (!template) {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-[#05A222] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5F7069] text-sm font-semibold">Loading HSM template specification...</p>
        </div>
      </PageContainer>
    );
  }

  // Generate live preview text with dynamic values
  let previewBody = template.body;
  Object.keys(sampleVars).forEach((key) => {
    previewBody = previewBody.replace(
      new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
      sampleVars[key] || `{{${key}}}`
    );
  });

  const foundVars = Object.keys(sampleVars);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#05A222]" /> Approved by Meta
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Pending Review
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
            <Bookmark className="w-3.5 h-3.5 text-amber-600" /> Draft
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Rejected by Meta
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F6FAF8] text-[#5F7069] border border-[#E2EAE6]">
            {status}
          </span>
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
            className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer"
          >
            Delete
          </Button>

          {template.status === 'DRAFT' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/templates/create?draftId=${template.id}`)}
              leftIcon={<FileEdit className="w-4 h-4" />}
              className="text-xs font-bold bg-[#05A222] hover:bg-[#006736] text-white shadow-xs cursor-pointer"
            >
              Edit & Submit to Meta
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
              leftIcon={<Zap className="w-4 h-4" />}
              className="text-xs font-bold bg-[#05A222] hover:bg-[#006736] text-white shadow-xs cursor-pointer"
            >
              Use in Broadcast Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Details / Payload & Smartphone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Components Payload & Variable Testing */}
        <div className="lg:col-span-7 space-y-6">
          {/* Variable Testing Playground */}
          {foundVars.length > 0 && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-[0_8px_30px_rgba(1,59,35,0.04)] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14201C]">
                <Sparkles className="w-4 h-4 text-[#05A222]" />
                <span>Live Variable Playground ({foundVars.length} Variables)</span>
              </div>
              <p className="text-xs text-[#5F7069]">
                Type values into the inputs below to see dynamic variable replacements live on the iPhone preview screen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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

        {/* Right Column: Ultra-Realistic Modern iPhone Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#05A222]" />
            <span>Official WhatsApp Device Preview</span>
          </div>

          {/* iPhone Chassis (Refined Slim Bezel) */}
          <div className="w-full max-w-[330px] bg-[#1C1C1E] rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)] ring-1 ring-black/40">
            {/* Screen Inner Glass */}
            <div className="bg-[#EFEAE2] rounded-[38px] min-h-[540px] flex flex-col justify-between overflow-hidden relative shadow-inner">
              {/* iOS Top Status Bar & Dynamic Island */}
              <div className="bg-[#008069] text-white pt-2.5 pb-1 px-5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>9:41</span>
                  {/* Dynamic Island */}
                  <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end px-1.5 gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-slate-800" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <Wifi className="w-3 h-3" />
                    <div className="w-4 h-2 border border-white rounded-[3px] p-[1px] flex items-center">
                      <div className="h-full w-full bg-white rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Navigation Bar */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 pb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ChevronLeft className="w-5 h-5 -ml-1 text-white shrink-0" />
                    <div className="w-7 h-7 rounded-full bg-[#05A222] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs ring-1 ring-white/30">
                      W
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate flex items-center gap-1 text-white">
                        <span>Acme Official</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#6AEB31] shrink-0" />
                      </div>
                      <div className="text-[9px] text-[#C4EBD0] leading-none">Official Business Account</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-white/90">
                    <Video className="w-4 h-4" />
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Chat Canvas Body */}
              <div className="p-3 my-auto space-y-2">
                {/* Date Pill */}
                <div className="flex justify-center my-1">
                  <span className="bg-white/80 backdrop-blur-xs text-[#5F7069] text-[9px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs uppercase tracking-wider">
                    Today
                  </span>
                </div>

                {/* WhatsApp Incoming Chat Bubble */}
                <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs space-y-1.5 text-xs text-[#14201C]">
                  {template.header?.text && (
                    <div className="font-bold text-[#008069] text-[11px] border-b border-[#F0F2F5] pb-1">
                      {template.header.text}
                    </div>
                  )}
                  <div className="text-[#1F2A26] whitespace-pre-wrap leading-relaxed font-sans text-xs">
                    {previewBody}
                  </div>
                  {template.footer && (
                    <div className="text-[10px] text-[#8A9993] pt-0.5">
                      {template.footer}
                    </div>
                  )}
                  <div className="text-[9px] text-right text-[#8A9993] font-medium flex items-center justify-end gap-1">
                    <span>12:45 PM</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                  </div>
                </div>

                {/* Interactive Action Buttons Preview */}
                {template.buttons && template.buttons.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {template.buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="bg-white hover:bg-[#F6FAF8] py-2 px-3 text-center text-xs font-bold text-[#00A884] rounded-xl shadow-2xs border border-[#E2EAE6] flex items-center justify-center gap-1.5"
                      >
                        <span>{btn.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* iPhone Home Indicator */}
              <div className="pb-2 pt-1 flex justify-center">
                <div className="w-28 h-1 bg-black/20 rounded-full" />
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
