import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { templateService } from '../../../services/templateService';
import { ROUTES } from '../../../utils/constants';

interface TemplateRow {
  id: string;
  name: string;
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
  sent: number;
  delivered: number;
  readRate: string;
}

export const TemplatePerformance: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await templateService.getTemplates().catch(() => []);
        if (Array.isArray(res) && res.length > 0) {
          const rows: TemplateRow[] = res.slice(0, 5).map((t: any, idx: number) => {
            const sent = t.stats?.sent || t.metrics?.sentCount || 0;
            const delivered = t.stats?.delivered || t.metrics?.deliveredCount || 0;
            const read = t.stats?.read || t.metrics?.readCount || 0;
            const readPct = sent > 0 ? `${Math.round((read / sent) * 100)}%` : '0%';

            return {
              id: t.id || t._id || String(idx),
              name: t.name ? t.name.replace(/_/g, ' ') : 'Template',
              category: (t.category || 'UTILITY').toUpperCase() as any,
              sent,
              delivered,
              readRate: readPct,
            };
          });
          setTemplates(rows);
        } else {
          setTemplates([]);
        }
      } catch {
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="bg-white border border-[#E2EAE6] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-[#14201C] tracking-tight">
            Template Performance
          </h2>
          <p className="text-xs text-[#5F7069] mt-0.5">
            Top performing templates by delivery rate.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.TEMPLATES)}
          className="text-xs font-bold text-[#14201C] hover:text-[#05A222] bg-[#F6FAF8] hover:bg-[#E9F9EE] px-3 py-1.5 rounded-xl border border-[#E2EAE6] hover:border-[#C4EBD0] transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2EAE6] text-[11px] font-semibold text-[#8A9993]">
              <th className="pb-2.5 font-bold">Template Name</th>
              <th className="pb-2.5 font-bold">Category</th>
              <th className="pb-2.5 font-bold">Sent</th>
              <th className="pb-2.5 font-bold">Delivered</th>
              <th className="pb-2.5 font-bold">Read Rate</th>
              <th className="pb-2.5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F6FAF8]">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3">
                      <div className="h-4 bg-slate-100 rounded w-28" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-slate-100 rounded w-16" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-slate-100 rounded w-12" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-slate-100 rounded w-12" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-slate-100 rounded w-10" />
                    </td>
                    <td className="py-3"></td>
                  </tr>
                ))
              : templates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center">
                      <p className="text-xs font-bold text-[#14201C]">No templates synced yet</p>
                      <p className="text-[11px] text-[#5F7069] mt-0.5">Approved Meta message templates and analytics will appear here.</p>
                    </td>
                  </tr>
                ) : (
                  templates.map((tmpl) => {
                  const readNum = parseInt(tmpl.readRate, 10);
                  const isHigh = readNum >= 65;
                  return (
                    <tr
                      key={tmpl.id}
                      className="hover:bg-[#F6FAF8] transition-colors cursor-pointer group text-xs"
                      onClick={() => navigate(ROUTES.TEMPLATES)}
                    >
                      <td className="py-3 font-bold text-[#14201C] group-hover:text-[#006736] transition-colors">
                        {tmpl.name}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            tmpl.category === 'MARKETING'
                              ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]'
                              : 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                          }`}
                        >
                          {tmpl.category.toLowerCase()}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-[#5F7069]">
                        {tmpl.sent.toLocaleString()}
                      </td>
                      <td className="py-3 font-semibold text-[#5F7069]">
                        {tmpl.delivered.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-bold ${
                            isHigh ? 'text-[#05A222]' : 'text-[#5F7069]'
                          }`}
                        >
                          {tmpl.readRate}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          className="p-1 rounded-lg text-[#8A9993] hover:text-[#14201C] hover:bg-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTES.TEMPLATES);
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
