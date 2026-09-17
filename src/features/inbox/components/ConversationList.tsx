import React, { useState } from 'react';
import type { Conversation } from '../../../types/message';
import { ConversationItem } from './ConversationItem';
import { SearchBar } from '../../../components/common/SearchBar';
import { MessagesSquare, Search } from 'lucide-react';

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
    const name = c.contactName || '';
    const content = c.lastMessage?.content || '';
    const phone = c.contactPhone || '';

    const matchesQuery =
      name.toLowerCase().includes(query.toLowerCase()) ||
      content.toLowerCase().includes(query.toLowerCase()) ||
      phone.includes(query);

    if (filterTag === 'all') return matchesQuery;
    if (filterTag === 'unread') return matchesQuery && c.unreadCount > 0;
    return matchesQuery && (c.tags || []).includes(filterTag);
  });

  const unreadTotal = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-[#E2EAE6] select-none">
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-[#F0F5F2] space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessagesSquare className="w-5 h-5 text-[#006736]" />
            <h2 className="text-base font-black text-[#14201C] tracking-tight">Chats</h2>
          </div>
          {unreadTotal > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]">
              {unreadTotal} Unread
            </span>
          )}
        </div>

        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by name, phone or message..."
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs pt-0.5">
          {['all', 'unread', 'VIP', 'Support', 'Enterprise'].map((tag) => {
            const isSelected = filterTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-lg capitalize font-bold text-[11px] shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#006736] text-white shadow-2xs'
                    : 'bg-[#F6FAF8] text-[#5F7069] hover:bg-[#E9F9EE] hover:text-[#006736] border border-[#E2EAE6]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[#8A9993] text-xs flex flex-col items-center justify-center h-48">
            <Search className="w-8 h-8 mx-auto mb-2 text-[#C4EBD0]" />
            <p className="font-bold text-[#14201C] text-sm">No conversations found</p>
            <p className="text-[#8A9993] mt-0.5">Try searching with a different name or number</p>
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

