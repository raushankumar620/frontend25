import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { templatesApi } from '../api';
import type { WhatsAppTemplate } from '../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ArrowLeft, FileText, CheckCircle2, Zap } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

export const TemplateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<WhatsAppTemplate | null>(null);

  useEffect(() => {
    if (id) {
      templatesApi.getTemplateById(id).then((data) => {
        if (data) setTemplate(data);
      });
    }
  }, [id]);

  if (!template) {
    return (
      <PageContainer>
        <div className="p-8 text-center text-slate-400">Loading template details...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button
        onClick={() => navigate(ROUTES.TEMPLATES)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Templates</span>
      </button>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold font-mono text-slate-900 dark:text-white">{template.name}</h2>
              <Badge variant="success" size="sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {template.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Category: <strong className="text-slate-300">{template.category}</strong> • Language: {template.language}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.CREATE_CAMPAIGN)}
          leftIcon={<Zap className="w-3.5 h-3.5" />}
        >
          Use in Broadcast Campaign
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Template Payload Preview</h4>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-2 text-xs text-slate-800 dark:text-slate-100">
          {template.header?.text && <div className="font-bold">{template.header.text}</div>}
          <div className="whitespace-pre-wrap">{template.body}</div>
          {template.footer && <div className="text-slate-400 text-[11px]">{template.footer}</div>}
        </div>

        {template.buttons && template.buttons.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <div className="text-xs font-semibold text-slate-400">Buttons:</div>
            <div className="flex flex-wrap gap-2">
              {template.buttons.map((b, idx) => (
                <div key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-emerald-500">
                  {b.text} ({b.type})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
