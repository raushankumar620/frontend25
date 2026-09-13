import React, { useState } from 'react';
import type { InternalNote as InternalNoteType } from '../../../types/message';
import { formatTime } from '../../../utils/formatDate';
import { Lock, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface InternalNoteProps {
  notes: InternalNoteType[];
  onAddNote: (content: string) => void;
}

export const InternalNote: React.FC<InternalNoteProps> = ({ notes, onAddNote }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddNote(content.trim());
    setContent('');
  };

  return (
    <div className="bg-amber-50/60 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-900/40 p-3 space-y-2 text-xs">
      <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-semibold text-[11px]">
        <Lock className="w-3 h-3" />
        <span>Internal Team Notes (Invisible to Contact)</span>
      </div>

      {notes.map((note) => (
        <div key={note.id} className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-amber-200/80 dark:border-amber-900/60 text-slate-700 dark:text-slate-200">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="font-semibold text-slate-600 dark:text-slate-300">{note.authorName}</span>
            <span>{formatTime(note.createdAt)}</span>
          </div>
          <p>{note.content}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add an internal note for teammates..."
          className="flex-1 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <Button size="sm" variant="secondary" type="submit" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Save Note
        </Button>
      </form>
    </div>
  );
};
