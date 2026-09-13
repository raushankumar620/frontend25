import React, { useState } from 'react';
import type { Conversation } from '../../../types/message';
import { ConversationItem } from './ConversationItem';
import { SearchBar } from '../../../components/common/SearchBar';
import { Filter } from 'lucide-react';

export interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');

  const filtered = conversations.filter((c) => {
    const matchesQuery =
      c.contactName.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMessage.content.toLowerCase().includes(query.toLowerCase()) ||
      c.contactPhone.includes(query);

    if (filterTag === 'all') return matchesQuery;
    if (filterTag === 'unread') return matchesQuery && c.unreadCount > 0;
    return matchesQuery && c.tags.includes(filterTag);
  });

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Search and Filters Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Filter conversations..."
        />

        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {['all', 'unread', 'VIP', 'Support', 'Enterprise'].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium shrink-0 transition-colors ${
                filterTag === tag
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
            <p>No conversations matched filter.</p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeId === conv.id}
              onClick={() => onSelect(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
