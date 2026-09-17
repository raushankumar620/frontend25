import React from 'react';
import type { Conversation } from '../../../types/message';
import { Avatar } from '../../../components/ui/Avatar';
import { Phone, Mail, Building, Tag, ShoppingBag, Plus, ShieldCheck } from 'lucide-react';

export interface CustomerPanelProps {
  conversation: Conversation;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({ conversation }) => {
  return (
    <div className="w-full h-full bg-white border-l border-[#E2EAE6] p-4 overflow-y-auto space-y-5 custom-scrollbar select-none">
      {/* Profile Summary Card */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-[#F0F5F2]">
        <Avatar name={conversation.contactName || conversation.contactPhone} size="xl" status="online" className="mb-2.5 ring-4 ring-[#E9F9EE]" />
        <h3 className="text-sm font-black text-[#14201C] leading-tight">
          {conversation.contactName || conversation.contactPhone}
        </h3>
        <p className="text-xs text-[#5F7069] mt-0.5 font-medium">{conversation.contactPhone}</p>
        <span className="mt-2 text-[10.5px] bg-[#E9F9EE] text-[#006736] font-bold px-2.5 py-0.5 rounded-full border border-[#C4EBD0] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#05A222]" />
          WhatsApp Opted In
        </span>
      </div>

      {/* Contact Details */}
      <div className="space-y-2.5 text-xs">
        <h4 className="text-[11px] font-bold text-[#8A9993] uppercase tracking-wider">Contact Info</h4>
        <div className="flex items-center gap-2.5 text-[#14201C] font-medium p-2 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6]">
          <Phone className="w-3.5 h-3.5 text-[#006736]" />
          <span>{conversation.contactPhone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-[#5F7069] font-medium p-2 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6]">
          <Mail className="w-3.5 h-3.5 text-[#8A9993]" />
          <span className="truncate">customer@contact.whatsapp</span>
        </div>
        <div className="flex items-center gap-2.5 text-[#5F7069] font-medium p-2 bg-[#F6FAF8] rounded-xl border border-[#E2EAE6]">
          <Building className="w-3.5 h-3.5 text-[#8A9993]" />
          <span>Direct WhatsApp Lead</span>
        </div>
      </div>

      {/* CRM Tags */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold text-[#8A9993] uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-[#006736]" />
            Tags
          </h4>
          <button className="text-[#006736] hover:text-[#05A222] text-[11px] font-bold flex items-center gap-0.5 cursor-pointer">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {conversation.tags && conversation.tags.length > 0 ? (
            conversation.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] text-[10.5px] font-bold"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-[#8A9993] italic">No tags assigned</span>
          )}
        </div>
      </div>

      {/* Commercial Summary */}
      <div className="bg-[#F6FAF8] p-3.5 rounded-2xl border border-[#E2EAE6] space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#14201C]">
          <ShoppingBag className="w-4 h-4 text-[#006736]" />
          <span>Live Metadata</span>
        </div>
        <div className="flex justify-between text-xs text-[#5F7069] pt-1 border-t border-[#E2EAE6]">
          <span>Channel</span>
          <span className="font-bold text-[#14201C]">WhatsApp Cloud API</span>
        </div>
        <div className="flex justify-between text-xs text-[#5F7069]">
          <span>Status</span>
          <span className="font-bold text-[#05A222] capitalize">{conversation.status}</span>
        </div>
      </div>
    </div>
  );
};

