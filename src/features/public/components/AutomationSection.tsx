import React from 'react';
import { 
  Share2, 
  ArrowDown, 
  Clock, 
  Send, 
  CheckCircle2, 
  Zap,
  Split,
  Play
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AutomationSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white border-b border-[#E2EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold uppercase tracking-wider mb-4">
            <Share2 className="w-3.5 h-3.5 text-[#05A222]" />
            Drag & Drop Flow Builder
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight mb-4">
            Automate Complex WhatsApp Journeys Without Writing Code
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069]">
            Connect CRM triggers, conditional branches, delay timers, and rich message templates in an intuitive visual workflow builder.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Flow Canvas Simulation */}
          <div className="lg:col-span-7 bg-[#F6FAF8] border border-[#E2EAE6] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(1,59,35,0.04)] relative overflow-hidden">
            <div className="space-y-4 max-w-md mx-auto relative z-10">
              
              {/* Node 1: Trigger */}
              <div className="bg-white border-2 border-[#05A222] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#05A222] flex items-center justify-center font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#05A222] font-bold uppercase">Trigger Event</div>
                      <div className="text-xs font-bold text-[#14201C]">Shopify Checkout Abandoned</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#E9F9EE] text-[#006736] font-bold px-2 py-0.5 rounded-full border border-[#C4EBD0]">Webhook</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center text-[#8A9993]">
                <ArrowDown className="w-4 h-4 text-[#05A222]" />
              </div>

              {/* Node 2: Delay Timer */}
              <div className="bg-white border border-[#E2EAE6] rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF8E6] text-[#D99A00] flex items-center justify-center font-bold">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#9A6B00] font-bold uppercase">Delay Step</div>
                      <div className="text-xs font-bold text-[#14201C]">Wait 15 Minutes</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#5F7069]">Timer</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center text-[#8A9993]">
                <ArrowDown className="w-4 h-4 text-[#05A222]" />
              </div>

              {/* Node 3: Condition */}
              <div className="bg-white border border-[#E2EAE6] rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#E9F9EE] text-[#006736] flex items-center justify-center font-bold">
                      <Split className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#006736] font-bold uppercase">Branching Condition</div>
                      <div className="text-xs font-bold text-[#14201C]">Cart Total &gt; $50.00 ?</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#05A222] font-bold bg-[#E9F9EE] px-2 py-0.5 rounded-full border border-[#C4EBD0]">YES</span>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center text-[#8A9993]">
                <ArrowDown className="w-4 h-4 text-[#05A222]" />
              </div>

              {/* Node 4: Action */}
              <div className="bg-white border-2 border-[#006736] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center font-bold">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-[#006736] font-bold uppercase">Execute Action</div>
                      <div className="text-xs font-bold text-[#14201C]">Send WhatsApp 10% Discount Template</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#E9F9EE] text-[#006736] font-bold px-2 py-0.5 rounded-full border border-[#C4EBD0]">Automated</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black text-[#14201C] leading-tight">
              Connect Every Marketing & CRM Event to WhatsApp
            </h3>

            <p className="text-[#5F7069] text-xs sm:text-sm leading-relaxed">
              Trigger instant transactional alerts and nurtures based on customer actions. Seamlessly integrates with Shopify, WooCommerce, Stripe, HubSpot, Salesforce, and custom HTTP webhooks.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1F2A26]">A/B split-testing for optimal message conversion</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1F2A26]">Dynamic parameters (e.g. {'{{name}}'}, {'{{order_id}}'}, {'{{tracking_url}}'})</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1F2A26]">Automated opt-out & unsubscribe compliance handling</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(ROUTES.AUTOMATIONS)}
                rightIcon={<Play className="w-4 h-4" />}
                className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
              >
                Test Visual Automation Builder
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
