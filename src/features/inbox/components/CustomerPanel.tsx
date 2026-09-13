import React from 'react';
import type { Conversation } from '../../../types/message';
import { Avatar } from '../../../components/ui/Avatar';
import { Phone, Mail, Building, Tag, ShoppingBag, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface CustomerPanelProps {
  conversation: Conversation;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({ conversation }) => {
  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 overflow-y-auto space-y-6">
      {/* Profile summary */}
      <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <Avatar name={conversation.contactName} size="xl" status="online" className="mb-3" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{conversation.contactName}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{conversation.contactPhone}</p>
        <span className="mt-2 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          WhatsApp Opted In
        </span>
      </div>

      {/* Contact Details */}
      <div className="space-y-3 text-xs">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Info</h4>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>{conversation.contactPhone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span>david.miller@apextech.io</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span>ApexTech Solutions</span>
        </div>
      </div>

      {/* CRM Tags */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            Tags
          </h4>
          <button className="text-emerald-500 hover:text-emerald-600 text-[11px] font-medium flex items-center gap-0.5">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {conversation.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Commercial Summary */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
          <ShoppingBag className="w-4 h-4 text-emerald-500" />
          <span>Commercial Attributes</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>Total Orders</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">14 Orders</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Lifetime Value</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">$4,890.00</span>
        </div>
      </div>

      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          Open Full CRM Profile
        </Button>
      </div>
    </div>
  );
};
