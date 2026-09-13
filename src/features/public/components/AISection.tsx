import React from 'react';
import { 
  Bot, 
  Sparkles, 
  FileText, 
  Globe2, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AISection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#F6FAF8] border-b border-[#E2EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold uppercase tracking-wider mb-4">
            <Bot className="w-3.5 h-3.5 text-[#05A222]" />
            Autonomous AI Agents
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight mb-4">
            Turn WhatsApp into a 24/7 AI-Powered Sales & Support Concierge
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069]">
            Upload your product catalog, website, or support documentation. Our RAG engine answers complex customer questions accurately in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Cards: Knowledge Base & Configuration */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#05A222] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#14201C] text-base mb-1">Upload Any Knowledge Source</h3>
                  <p className="text-xs text-[#5F7069] leading-relaxed">
                    Sync PDFs, notion docs, spreadsheets, or your live website URL. The AI automatically indexes vectors with zero manual labeling required.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#039B56] shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#14201C] text-base mb-1">45+ Languages Auto-Translation</h3>
                  <p className="text-xs text-[#5F7069] leading-relaxed">
                    Customers can message in Spanish, Hindi, Arabic, German, or Portuguese. The agent understands context and replies natively.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#E9F9EE] border border-[#C4EBD0] flex items-center justify-center text-[#07CF74] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#14201C] text-base mb-1">Human-in-the-Loop Escalation</h3>
                  <p className="text-xs text-[#5F7069] leading-relaxed">
                    Set sentiment and confidence thresholds. If a customer is dissatisfied or asks for a supervisor, the chat seamlessly transfers to human agents.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(ROUTES.AI_DASHBOARD)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
              >
                Configure Your First AI Agent
              </Button>
            </div>
          </div>

          {/* Right Interactive AI Conversation Preview */}
          <div className="lg:col-span-6 bg-white border border-[#E2EAE6] rounded-3xl p-6 sm:p-7 shadow-[0_16px_50px_rgba(1,59,35,0.08)]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2EAE6]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#006736] text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#14201C]">E-Commerce Support Copilot</div>
                  <div className="text-[11px] text-[#006736] font-semibold">Trained on 142 catalog docs</div>
                </div>
              </div>
              <span className="text-[10px] bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] font-bold px-2.5 py-0.5 rounded-full">
                GPT-4o RAG
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="bg-[#F6FAF8] p-3 rounded-xl border border-[#E2EAE6] text-[#1F2A26]">
                <span className="font-bold text-[#14201C] block mb-0.5">Customer:</span>
                "Do you have the Wireless ANC Pro headphones in midnight blue in stock, and what is your return policy?"
              </div>

              <div className="bg-[#E9F9EE] p-3.5 rounded-xl border border-[#C4EBD0] text-[#1F2A26] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#006736]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
                    AI Agent Response (99.8% Confidence)
                  </span>
                  <span className="font-mono text-[#006736]">320ms</span>
                </div>
                <p className="leading-relaxed">
                  "Yes! We currently have <strong>14 units of Midnight Blue</strong> in stock at $149.00. We also provide <strong>30-day hassle-free returns</strong> with prepaid pickup. Would you like me to reserve one with a 10% coupon code?"
                </p>
                <div className="flex gap-2 pt-1">
                  <span className="px-2 py-1 bg-white border border-[#C4EBD0] rounded-lg text-[#006736] font-semibold text-[10px]">
                    👉 Reserve Midnight Blue
                  </span>
                  <span className="px-2 py-1 bg-white border border-[#C4EBD0] rounded-lg text-[#006736] font-semibold text-[10px]">
                    📜 View Return Policy
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2EAE6] flex items-center justify-between text-[11px] text-[#5F7069]">
              <span>Source: Product_Catalog_v4.pdf (Page 12)</span>
              <span className="text-[#006736] font-semibold">Zero Hallucination Guard Active</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
