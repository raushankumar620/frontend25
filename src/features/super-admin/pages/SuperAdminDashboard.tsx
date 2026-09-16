import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Phone,
  MessageSquare,
  Cpu,
  Wallet,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { SystemHealthWidget } from '../components/SystemHealthWidget';
import { PageContainer } from '../../../components/layout/PageContainer';
import type { AdminOverviewResponse, SystemHealth, QueuesResponse } from '../types/admin.types';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [queuesData, setQueuesData] = useState<QueuesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ovData, hlData, qData] = await Promise.all([
        superAdminService.getOverview(),
        superAdminService.getHealth(),
        superAdminService.getQueues(),
      ]);
      setOverview(ovData);
      setHealth(hlData);
      setQueuesData(qData);
    } catch (err) {
      console.error('Failed to load Super Admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = overview?.metrics;

  const kpis = [
    {
      title: 'Total Organizations',
      value: metrics?.tenants.total || 0,
      sub: `${metrics?.tenants.active || 0} Active • ${metrics?.tenants.suspended || 0} Suspended`,
      icon: Building2,
      color: 'bg-[#E9F9EE] text-[#05A222] border border-[#C4EBD0]',
      textColor: 'text-[#14201C]',
    },
    {
      title: 'Connected WABA Numbers',
      value: metrics?.whatsapp.activeNumbers || 0,
      sub: 'Live WhatsApp Senders',
      icon: Phone,
      color: 'bg-[#E9F9EE] text-[#07CF74] border border-[#C4EBD0]',
      textColor: 'text-[#14201C]',
    },
    {
      title: 'Monthly Messages',
      value: metrics?.messaging.monthlyMessages?.toLocaleString() || 0,
      sub: `${metrics?.messaging.totalLifetimeMessages?.toLocaleString() || 0} Lifetime`,
      icon: MessageSquare,
      color: 'bg-[#E9F9EE] text-[#05A222] border border-[#C4EBD0]',
      textColor: 'text-[#14201C]',
    },
    {
      title: 'Monthly AI Tokens',
      value: (metrics?.messaging.monthlyAiTokens || 0).toLocaleString(),
      sub: 'Gemini / OpenAI Inference',
      icon: Cpu,
      color: 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0]',
      textColor: 'text-[#14201C]',
    },
    {
      title: 'Meta Credit Wallets',
      value: `$${(metrics?.finance.totalWalletBalances || 0).toFixed(2)}`,
      sub: 'Total Active Top-up Balances',
      icon: Wallet,
      color: 'bg-[#E9F9EE] text-[#05A222] border border-[#C4EBD0]',
      textColor: 'text-[#14201C]',
    },
  ];

  return (
    <PageContainer className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2EAE6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E9F9EE] to-transparent rounded-full pointer-events-none opacity-70" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#05A222] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#006736]">
              Master Infrastructure Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
            Platform Operations & Cluster Control
          </h2>
          <p className="text-xs sm:text-sm text-[#5F7069]">
            Real-time multi-tenant monitoring, BullMQ worker queues, and system telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => navigate('/super-admin/tenants')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#05A222] hover:bg-[#006736] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            <span>Manage Tenants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/super-admin/queues')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F6FAF8] text-[#006736] text-xs font-bold rounded-xl border border-[#C4EBD0] transition shadow-xs cursor-pointer"
          >
            <span>Queue Telemetry</span>
          </button>
        </div>
      </div>

      {/* System Health Diagnostics Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F7069] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#05A222]" /> Infrastructure Health
          </h3>
          <span className="text-xs font-mono text-[#5F7069]">
            Uptime: <strong className="text-[#006736]">{health?.uptime.formatted || 'Calculating...'}</strong>
          </span>
        </div>
        <SystemHealthWidget health={health} loading={loading} />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white border border-[#E2EAE6] hover:border-[#05A222] transition-all space-y-3 shadow-xs hover:shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#5F7069] font-bold">{kpi.title}</span>
              <div
                className={`w-9 h-9 rounded-lg ${kpi.color} flex items-center justify-center`}
              >
                <kpi.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${kpi.textColor}`}>{kpi.value}</div>
              <div className="text-[11px] text-[#8A9993] mt-0.5">{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Telemetry Split: Plans Distribution & Queue Backlog summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2EAE6] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#05A222]" /> Subscription Tier Breakdown
            </h3>
            <span className="text-xs text-[#5F7069]">Active Organizations</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(metrics?.tenants.planBreakdown || {}).map(([planCode, count]) => {
              const total = metrics?.tenants.total || 1;
              const percent = Math.round((count / total) * 100);
              return (
                <div key={planCode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#14201C]">{planCode}</span>
                    <span className="font-mono text-[#5F7069]">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E2EAE6] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#05A222] to-[#1CD72C]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Queue Backlog */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2EAE6] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#14201C] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#05A222]" /> BullMQ Worker Dispatchers
            </h3>
            <button
              onClick={() => navigate('/super-admin/queues')}
              className="text-xs text-[#05A222] hover:text-[#006736] font-bold hover:underline cursor-pointer"
            >
              Full Monitor &rarr;
            </button>
          </div>

          <div className="divide-y divide-[#E2EAE6] bg-[#F6FAF8] rounded-xl border border-[#E2EAE6] overflow-hidden">
            {(queuesData?.queues || []).slice(0, 4).map((q) => (
              <div key={q.name} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#14201C]">{q.title}</div>
                  <div className="text-[#8A9993] font-mono text-[11px]">{q.name}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#5F7069]">
                    Active: <strong className="text-[#006736]">{q.active}</strong>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      q.status === 'ACTIVE'
                        ? 'bg-[#E9F9EE] text-[#006736] border-[#C4EBD0]'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
