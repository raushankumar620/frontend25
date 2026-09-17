import React from 'react';
import { 
  BarChart3, 
  CheckCheck, 
  Eye, 
  MousePointerClick, 
  DollarSign, 
  ArrowRight
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';

export const AnalyticsSection: React.FC = () => {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Avg Message Delivery Rate', value: '99.8%', change: '+12% vs SMS', icon: CheckCheck, color: 'text-[#05A222]', bg: 'bg-[#E9F9EE]' },
    { label: 'Broadcast Read Rate', value: '88.4%', change: '4.2x higher than Email', icon: Eye, color: 'text-[#039B56]', bg: 'bg-[#E9F9EE]' },
    { label: 'Interactive CTA Click-Through', value: '36.7%', change: '+24% conversion', icon: MousePointerClick, color: 'text-[#07CF74]', bg: 'bg-[#E9F9EE]' },
    { label: 'Messaging Cost Reduction', value: '62%', change: 'vs legacy SMS aggregators', icon: DollarSign, color: 'text-[#006736]', bg: 'bg-[#E9F9EE]' },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E2EAE6]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold uppercase tracking-wider mb-4">
            <BarChart3 className="w-3.5 h-3.5 text-[#05A222]" />
            Granular Telemetry & BI
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14201C] tracking-tight mb-4">
            Measure Every Click, Read Receipt, and Revenue Dollar
          </h2>
          <p className="text-sm sm:text-base text-[#5F7069]">
            Real-time campaign performance attribution. Track message cost per delivery, agent resolution speed SLA, and customer lifetime value.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-[#F6FAF8] border border-[#E2EAE6] rounded-2xl p-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${m.bg} border border-[#C4EBD0] flex items-center justify-center ${m.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#006736] bg-[#E9F9EE] px-2 py-0.5 rounded-full border border-[#C4EBD0]">
                      {m.change}
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-[#14201C] mb-1">{m.value}</div>
                  <div className="text-xs text-[#5F7069] font-medium">{m.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="text-center">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.ANALYTICS)}
            rightIcon={<ArrowRight className="w-4 h-4 text-[#05A222]" />}
            className="border-[#E2EAE6] text-[#14201C] hover:bg-[#F6FAF8] font-semibold"
          >
            Explore Live BI Dashboard
          </Button>
        </div>

      </div>
    </section>
  );
};
