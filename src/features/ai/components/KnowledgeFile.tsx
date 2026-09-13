import React from 'react';
import { FileText, Globe, CheckCircle2, Trash2 } from 'lucide-react';
import type { KnowledgeDocument } from '../types';
import { Badge } from '../../../components/ui/Badge';

export interface KnowledgeFileProps {
  doc: KnowledgeDocument;
  onDelete?: () => void;
}

export const KnowledgeFile: React.FC<KnowledgeFileProps> = ({ doc, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center shrink-0">
          {doc.type === 'url' ? <Globe className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.name}</h5>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
            <span>{doc.size}</span>
            <span>•</span>
            <span>{doc.chunksCount} RAG Chunks</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          INDEXED
        </Badge>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
