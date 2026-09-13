import React from 'react';
import { 
  Lock, 
  ArrowRight,
  Headphones,
  UserCheck
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export const InboxSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-20 bg-[#F6FAF8] border-b border-[#E2EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold uppercase tracking-wider mb-4">
            <Headphones className="w-3.5 h-3.5 text-[#05A222]" />
            Shared Multi-Agent Team Inbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight mb-4">
            One WhatsApp Number. Hundreds of Collaborative Agents.
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069]">
            Eliminate communication chaos. Distribute conversations automatically, tag VIP clients, leave private internal notes, and never drop a lead.
          </p>
        </div>

        {/* Inbox Interface Mockup */}
        <div className="bg-white border border-[#E2EAE6] rounded-3xl shadow-[0_16px_50px_rgba(1,59,35,0.08)] overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
            
            {/* Conversations Column */}
            <div className="md:col-span-4 border-r border-[#E2EAE6] bg-[#F6FAF8] p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2EAE6]">
                <span className="text-xs font-bold text-[#14201C]">Active Inquiries (18)</span>
                <span className="text-[10px] bg-[#E9F9EE] text-[#006736] font-bold px-2 py-0.5 rounded-full border border-[#C4EBD0]">Live</span>
              </div>

              {/* Chat Item 1 (Active) */}
              <div className="bg-white border-2 border-[#05A222] rounded-2xl p-3 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#14201C]">David Miller</span>
                  <span className="text-[10px] text-[#8A9993]">2m ago</span>
                </div>
                <p className="text-[11px] text-[#5F7069] truncate">Looking to upgrade our team to Enterprise 100k tier...</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] bg-[#FFF8E6] text-[#9A6B00] border border-[#FFE299] font-bold px-1.5 py-0.5 rounded">
                    🔥 VIP Deal
                  </span>
                  <span className="text-[9px] text-[#8A9993]">Assigned: Sarah</span>
                </div>
              </div>

              {/* Chat Item 2 */}
              <div className="bg-white border border-[#E2EAE6] rounded-2xl p-3 shadow-2xs space-y-1 opacity-70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#14201C]">Elena Rostova</span>
                  <span className="text-[10px] text-[#8A9993]">8m ago</span>
                </div>
                <p className="text-[11px] text-[#5F7069] truncate">Can we connect our Shopify store with webhooks?</p>
                <span className="text-[9px] bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] font-bold px-1.5 py-0.5 rounded">
                  Support
                </span>
              </div>
            </div>

            {/* Active Chat Column */}
            <div className="md:col-span-8 p-5 flex flex-col justify-between bg-white">
              <div>
                {/* Chat Topbar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE6]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E9F9EE] text-[#006736] font-bold flex items-center justify-center text-xs border border-[#C4EBD0]">
                      DM
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#14201C]">David Miller (VP Sales @ Apex)</div>
                      <div className="text-[10px] text-[#8A9993]">+1 (555) 928-1092 • Online</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#F6FAF8] text-[#5F7069] px-2.5 py-0.5 rounded-full font-medium border border-[#E2EAE6]">
                      Agent: Sarah C.
                    </span>
                  </div>
                </div>

                {/* Messages & Notes */}
                <div className="py-4 space-y-3 font-sans text-xs">
                  <div className="bg-[#F6FAF8] p-3 rounded-xl max-w-sm text-[#1F2A26] border border-[#E2EAE6]">
                    "Hi, we need to transition 80 sales agents to WhatsAppMSG with Meta Cloud API Tier 3."
                  </div>

                  {/* Internal Private Note */}
                  <div className="bg-[#FFF8E6] border border-[#FFE299] p-3 rounded-xl max-w-md text-[#9A6B00] flex items-start gap-2 shadow-2xs">
                    <Lock className="w-4 h-4 text-[#D99A00] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] text-[#9A6B00] block uppercase">Internal Note (Visible to team only)</span>
                      <span>Customer has $20k/yr budget. Fast-track custom SLA proposal.</span>
                    </div>
                  </div>

                  <div className="bg-[#E9F9EE] p-3 rounded-xl max-w-sm ml-auto text-[#006736] border border-[#C4EBD0] shadow-2xs">
                    "Hello David! Absolutely, I have prepared a tailored enterprise rollout package for your 80 seats. Sending the proposal now."
                  </div>
                </div>
              </div>

              {/* Chat Quick Action Bar */}
              <div className="pt-3 border-t border-[#E2EAE6] flex items-center justify-between text-xs text-[#8A9993]">
                <span className="text-[11px]">Type / for canned responses (/pricing, /demo, /refund)</span>
                <span className="text-[#05A222] font-bold text-[11px] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Collision Guard Active
                </span>
              </div>
            </div>

          </div>
        </div>

        <div className="text-center">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (!isAuthenticated) {
                navigate(ROUTES.LOGIN);
              } else {
                navigate(ROUTES.INBOX);
              }
            }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
          >
            Launch Shared Inbox Demo
          </Button>
        </div>

      </div>
    </section>
  );
};
