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
  Code
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
            initial[num] = `Value ${num}`;
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
        <div className="p-12 text-center text-slate-400 font-medium">Loading template details...</div>
      </PageContainer>
    );
  }

  // Live variable preview replacement
  const previewBody = template.body.replace(/\{\{(\d+)\}\}/g, (_, num) => {
    return sampleVars[num] || `[Variable {{${num}}}]`;
  });

  const foundVars = Array.from(new Set(Array.from(template.body.matchAll(/\{\{(\d+)\}\}/g), (m) => m[1])));

  const getStatusBadge = (status: string) => {
    switch (status) {
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
      <button
        onClick={() => navigate(ROUTES.TEMPLATES)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Templates</span>
      </button>

      {/* Top Details Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {template.name}
              </h2>
              {getStatusBadge(template.status)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-500" /> Category: <strong className="text-slate-700 dark:text-slate-200 uppercase">{template.category}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" /> Language: <strong className="text-slate-700 dark:text-slate-200 font-mono">{template.language}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-500" /> Created: {new Date(template.createdAt).toLocaleDateString()}
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
            className="text-xs font-semibold text-rose-600 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            Delete
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
            leftIcon={<Zap className="w-4 h-4" />}
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Use in Campaign
          </Button>
        </div>
      </div>

      {/* Main Grid: Details / Payload & Smartphone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Components Payload & Variable Testing */}
        <div className="lg:col-span-7 space-y-6">
          {/* Variable Testing Playground */}
          {foundVars.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Code className="w-4 h-4 text-emerald-500" />
                Variable Testing Playground
              </div>
              <p className="text-xs text-slate-500">
                Replace placeholder variables with test data to see live substitutions in the preview.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {foundVars.map((v) => (
                  <div key={v}>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Variable &#123;&#123;{v}&#125;&#125;
                    </label>
                    <input
                      type="text"
                      value={sampleVars[v] || ''}
                      onChange={(e) => setSampleVars({ ...sampleVars, [v]: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                      placeholder={`Value for {{${v}}}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Payload Structure */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Template Message Structure
            </h4>

            {template.header?.text && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Header</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100">
                  {template.header.text}
                </div>
              </div>
            )}

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Body Text</span>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-mono">
                {template.body}
              </div>
            </div>

            {template.footer && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Footer</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs text-slate-500 dark:text-slate-400">
                  {template.footer}
                </div>
              </div>
            )}

            {template.buttons && template.buttons.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">Action Buttons</span>
                <div className="space-y-2">
                  {template.buttons.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl flex items-center justify-between text-xs font-semibold"
                    >
                      <span className="text-slate-900 dark:text-slate-100">{b.text}</span>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                        {b.type} {b.url ? `• ${b.url}` : ''} {b.phoneNumber ? `• ${b.phoneNumber}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Phone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-6">
          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            Meta WhatsApp Rendering Preview
          </div>

          <div className="w-full max-w-[340px] bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-700">
            {/* Phone Screen */}
            <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-[30px] p-4 min-h-[440px] flex flex-col justify-between text-slate-900 dark:text-slate-100">
              {/* Top Chat Bar */}
              <div className="bg-white/80 dark:bg-[#202c33]/90 backdrop-blur-xs py-2 px-3 rounded-xl flex items-center gap-2 mb-3 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  W
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Business</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Official Business Account</div>
                </div>
              </div>

              {/* Message bubble & buttons */}
              <div>
                <div className="bg-white dark:bg-[#202c33] rounded-2xl rounded-tl-xs p-3.5 shadow-md space-y-2 text-xs">
                  {template.header?.text && (
                    <div className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1.5">
                      {template.header.text}
                    </div>
                  )}
                  <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {previewBody}
                  </div>
                  {template.footer && (
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-50 dark:border-slate-800/60">
                      {template.footer}
                    </div>
                  )}
                  <div className="text-[9px] text-right text-slate-400 font-medium">12:30 PM</div>
                </div>

                {/* Interactive Action Buttons Preview */}
                {template.buttons && template.buttons.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {template.buttons.map((btn, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-[#202c33] py-2 text-center text-xs font-bold text-[#00a884] rounded-xl shadow-xs border border-emerald-50 dark:border-emerald-950"
                      >
                        {btn.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 text-[10px] text-center text-slate-400 font-medium">
                Verified Meta HSM Template
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Template</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete <strong className="text-slate-800 dark:text-slate-200">{template.name}</strong>? This will remove the template from your platform and mark it as deleted.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white"
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
