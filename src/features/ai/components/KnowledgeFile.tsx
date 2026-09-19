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
    <div className="flex items-center justify-between p-3.5 sm:p-4 bg-white border border-[#E2EAE6] rounded-2xl hover:border-[#05A222] transition-all shadow-xs gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center shrink-0 font-bold">
          {getIcon()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="text-xs sm:text-sm font-bold text-[#14201C] truncate max-w-[200px] sm:max-w-[320px]">
              {doc.title}
            </h5>
            <span className="text-[10px] uppercase font-bold text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-1.5 py-0.5 rounded">
              {doc.type}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] text-[#5F7069] mt-0.5">
            <span>{doc.fileSize || '1 KB'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-[#14201C]">
              <Layers className="w-3 h-3 text-[#05A222]" />
              {doc.totalChunks || 1} RAG Chunks
            </span>
            {doc.tags && doc.tags.length > 0 && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-[#8A9993] truncate max-w-[120px] sm:max-w-[180px] hidden sm:inline">
                  #{doc.tags.join(', #')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
            className="p-1.5 sm:p-2 text-[#5F7069] hover:text-[#006736] hover:bg-[#E9F9EE] rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin text-[#006736]' : ''}`} />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            title="Delete Document"
            className="p-1.5 sm:p-2 text-[#8A9993] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
