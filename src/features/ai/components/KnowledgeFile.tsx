import React from 'react';
import { FileText, Globe, HelpCircle, FileSpreadsheet, CheckCircle2, Trash2, RefreshCw, Layers } from 'lucide-react';
import type { KnowledgeDocument } from '../types';
import { Badge } from '../../../components/ui/Badge';

export interface KnowledgeFileProps {
  doc: KnowledgeDocument;
  onDelete?: () => void;
  onReindex?: () => void;
  isReindexing?: boolean;
}

export const KnowledgeFile: React.FC<KnowledgeFileProps> = ({
  doc,
  onDelete,
  onReindex,
  isReindexing,
}) => {
  const getIcon = () => {
    switch (doc.type) {
      case 'url':
        return <Globe className="w-4 h-4" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4" />;
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#05A222]/40 transition-all shadow-xs">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] dark:bg-[#006736]/20 text-[#006736] dark:text-[#05A222] flex items-center justify-center shrink-0 font-bold">
          {getIcon()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {doc.title}
            </h5>
            <span className="text-[10px] uppercase font-semibold text-[#006736] bg-[#E9F9EE] dark:bg-[#006736]/30 px-1.5 py-0.5 rounded">
              {doc.type}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span>{doc.fileSize || '1 KB'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Layers className="w-3 h-3 text-[#05A222]" />
              {doc.totalChunks || 1} RAG Chunks
            </span>
            {doc.tags && doc.tags.length > 0 && (
              <>
                <span>•</span>
                <span className="text-slate-400 truncate max-w-[150px]">
                  #{doc.tags.join(', #')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant={doc.status === 'INDEXED' ? 'success' : doc.status === 'INDEXING' ? 'warning' : 'danger'}
          size="sm"
        >
          <CheckCircle2 className="w-3 h-3 mr-1 text-[#05A222]" />
          {doc.status}
        </Badge>

        {onReindex && (
          <button
            onClick={onReindex}
            disabled={isReindexing}
            title="Re-index Document Chunks"
            className="p-2 text-slate-400 hover:text-[#006736] hover:bg-[#E9F9EE] rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin text-[#006736]' : ''}`} />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            title="Delete Document"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
