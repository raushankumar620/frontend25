import React, { useState } from 'react';
import { 
  Bot, 
  Share2, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  Send, 
  Layers, 
  Key, 
  ArrowRight,
  Database,
  Lock,
  Headphones,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { CTASection } from '../components/CTASection';
import { SEO } from '../../../seo';
import { useAuthStore } from '../../../store/authStore';

export const Features: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'api' | 'ai' | 'automation' | 'inbox' | 'analytics' | 'security'>('api');

  const deepDives = {
    api: {
      badge: 'Meta Cloud API Engine',
      title: 'Native Meta Cloud API Tier 3 Direct Integration',
      description: 'Zero third-party broker latency. Transmit over 100,000 marketing, transactional, and utility messages per day with official Meta green tick compliance.',
      points: [
        'Direct Meta Graph API v20.0 with 99.99% uptime guarantee',
        'Official Green Tick badge assistance and phone number verification',
        'Interactive List, Quick-Reply, Call-To-Action, and Flow messages',
        'Automatic 24h messaging window detection and session recovery',
      ],
      code: `// Send Meta Cloud API Template Message with WhatsAppMSG
const response = await whatsAppMsg.messages.sendTemplate({
  to: "+91 98765 43210",
  template: "order_confirmation_v2",
  language: "en_US",
  components: [
    { type: "header", parameters: [{ type: "text", text: "Order #8921" }] },
    { type: "body", parameters: [{ type: "text", text: "$149.00" }] }
  ]
});`,
    },
    ai: {
      badge: 'Autonomous AI Co-Pilot',
      title: 'Domain-Trained AI Agents Powered by LLM RAG',
      description: 'Train AI on your company documentation, FAQs, catalogs, and policies. It automates 80%+ of Tier-1 support tickets and qualifies sales leads 24/7.',
      points: [
        'Custom Knowledge Base upload (PDF, DOCX, Notion, Website URLs)',
        'Automatic human escalation when sentiment turns negative or complex',
        'Multi-lingual real-time auto-translation in 45+ languages',
        'Configurable agent personality, temperature, and strict guardrails',
      ],
      code: `// Autonomous AI Response Agent Trigger
whatsAppMsg.ai.registerAgent({
  agentId: "agent_ecommerce_v4",
  ragSources: ["catalog.pdf", "shipping_policy.docx"],
  temperature: 0.2,
  humanEscalationThreshold: 0.85
});`,
    },
    automation: {
      badge: 'Visual Workflow Engine',
      title: 'Drag-and-Drop Conditional Conversational Journeys',
      description: 'Build sophisticated marketing funnels, cart abandonment recovery sequences, and CRM sync automations with zero code.',
      points: [
        'Multi-step branching logic with custom delay timers',
        'Real-time webhook triggers (Shopify, Stripe, WooCommerce, HubSpot)',
        'Dynamic variables injection and contact tagging',
        'Automated opt-out & unsubscribe compliance handling',
      ],
      code: `// Trigger Automated Journey on Shopify Event
whatsAppMsg.automations.trigger({
  event: "shopify.checkout.abandoned",
  flowId: "cart_recovery_sequence_v2",
  payload: { customerPhone: "+919876543210", cartTotal: 129.00 }
});`,
    },
    inbox: {
      badge: 'Team Collaboration Hub',
      title: 'Multi-Agent Shared Inbox with Collision Detection',
      description: 'Centralize all customer conversations across multiple numbers in one unified interface. Distribute chats, leave internal notes, and track agent response SLAs.',
      points: [
        'Smart round-robin, skill-based, and manual chat assignment',
        'Collision guard preventing multiple agents typing simultaneously',
        'Private internal notes visible only to teammates',
        'Custom canned responses with keyboard shortcuts (/pricing, /return)',
      ],
      code: `// Internal Team Inbox Event Webhook
whatsAppMsg.inbox.onMessageAssigned(({ chatId, agentId }) => {
  console.log(\`Conversation \${chatId} transferred to Agent \${agentId}\`);
});`,
    },
    analytics: {
      badge: 'Real-Time Telemetry',
      title: 'Granular Campaign & Agent Performance Analytics',
      description: 'Get deep visibility into delivery rates, read receipts, CTA button conversion attribution, and agent resolution velocity.',
      points: [
        'Per-message cost tracking with 0% broker markup visibility',
        'A/B split testing metrics for broadcast optimization',
        'Average first response time and CSAT ratings by agent',
        'Automated daily and weekly CSV/PDF executive reports',
      ],
      code: `// Fetch Live Campaign Analytics
const metrics = await whatsAppMsg.analytics.getCampaignMetrics({
  campaignId: "spring_flash_sale_v3"
});
console.log(\`Delivered: \${metrics.deliveryRate}%, Reads: \${metrics.readRate}%\`);`,
    },
    security: {
      badge: 'Enterprise Trust & Compliance',
      title: 'Bank-Grade Infrastructure with Strict Data Sovereignty',
      description: 'Compliant with GDPR, SOC 2 Type II, and HIPAA regulations. Your customer data is encrypted in transit and at rest with guaranteed regional data residency.',
      points: [
        'End-to-end TLS 1.3 encryption and AES-256 storage',
        'Granular Role-Based Access Control (RBAC) and SAML SSO',
        'Immutable audit logs for compliance auditing',
        'Multi-region high-availability cluster with 99.99% uptime SLA',
      ],
      code: `// Verify Webhook Signature Integrity
const isValid = whatsAppMsg.security.verifySignature({
  rawBody: request.body,
  signatureHeader: request.headers["x-hub-signature-256"],
  appSecret: process.env.WHATSAPPMSG_APP_SECRET
});`,
    },
  };

  const navTabs = [
    { id: 'api', label: 'Meta Cloud API', icon: Send },
    { id: 'ai', label: 'Autonomous AI', icon: Bot },
    { id: 'automation', label: 'Visual Flows', icon: Share2 },
    { id: 'inbox', label: 'Team Inbox', icon: Headphones },
    { id: 'analytics', label: 'Analytics & BI', icon: BarChart3 },
    { id: 'security', label: 'Security & RBAC', icon: ShieldCheck },
  ];

  const current = deepDives[activeTab];

  return (
    <div className="bg-white py-16 sm:py-24 text-[#1F2A26]">
      <SEO page="features" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#05A222]" />
            Complete Feature Deep Dive
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#14201C] tracking-tight mb-4 leading-tight">
            Enterprise Architecture Built for WhatsApp Scale
          </h1>
          <p className="text-sm sm:text-base text-[#5F7069]">
            Explore the developer APIs, AI engine, visual builders, and collaboration tools powering high-growth brands globally.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-[#05A222] text-white border-[#05A222] shadow-md shadow-[#05A222]/20'
                    : 'bg-[#F6FAF8] text-[#5F7069] border-[#E2EAE6] hover:bg-white hover:text-[#14201C]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#05A222]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Panel */}
        <div className="bg-[#F6FAF8] border border-[#E2EAE6] rounded-3xl p-6 sm:p-10 lg:p-12 mb-24 relative overflow-hidden shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F9EE] text-[#006736] text-xs font-bold border border-[#C4EBD0]">
                {current.badge}
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14201C]">
                {current.title}
              </h2>
              
              <p className="text-[#5F7069] text-sm sm:text-base leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                {current.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#05A222] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#1F2A26]">{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(ROUTES.LOGIN);
                    } else {
                      navigate(ROUTES.DASHBOARD);
                    }
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-[#05A222] hover:bg-[#006736] text-white font-bold"
                >
                  Test This Feature Live
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate(ROUTES.PUBLIC_CONTACT)}
                  className="border-[#E2EAE6] text-[#14201C] hover:bg-white font-semibold"
                >
                  Book Technical Demo
                </Button>
              </div>
            </div>

            {/* Right Interactive Code Snippet */}
            <div className="lg:col-span-5 bg-[#14201C] border border-[#2B3A34] rounded-2xl p-5 font-mono text-xs shadow-xl overflow-x-auto text-[#1CD72C]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2B3A34] text-[#E2EAE6]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#D64545]" />
                  <div className="w-3 h-3 rounded-full bg-[#D99A00]" />
                  <div className="w-3 h-3 rounded-full bg-[#05A222]" />
                </div>
                <span className="text-[10px] text-[#E2EAE6]">whatsappmsg-sdk.ts</span>
              </div>
              <pre className="text-white/90 whitespace-pre-wrap leading-relaxed">
                <code>{current.code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Feature Grid Breakdown */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#14201C] mb-2">Everything included in the Platform</h3>
            <p className="text-[#5F7069] text-xs sm:text-sm">Built without compromises for scale, security, and velocity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] transition-all">
              <Database className="w-8 h-8 text-[#05A222] mb-4" />
              <h4 className="font-bold text-[#14201C] text-base mb-2">Smart Contact CRM</h4>
              <p className="text-xs text-[#5F7069] leading-relaxed">Custom attributes, dynamic segments, CSV imports, and purchase history tracking directly in the conversation pane.</p>
            </div>

            <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] transition-all">
              <Key className="w-8 h-8 text-[#039B56] mb-4" />
              <h4 className="font-bold text-[#14201C] text-base mb-2">API Keys & Webhooks</h4>
              <p className="text-xs text-[#5F7069] leading-relaxed">Scoped API keys, sub-second webhook delivery, automatic retries with exponential backoff, and live event inspection.</p>
            </div>

            <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] transition-all">
              <Layers className="w-8 h-8 text-[#07CF74] mb-4" />
              <h4 className="font-bold text-[#14201C] text-base mb-2">Template Approval Hub</h4>
              <p className="text-xs text-[#5F7069] leading-relaxed">Direct synchronization with Meta Business Manager. Submit, edit, and get WhatsApp message templates approved within minutes.</p>
            </div>

            <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] transition-all">
              <Lock className="w-8 h-8 text-[#006736] mb-4" />
              <h4 className="font-bold text-[#14201C] text-base mb-2">Audit Logs & Compliance</h4>
              <p className="text-xs text-[#5F7069] leading-relaxed">Complete activity trail tracking logins, exports, message transmissions, and configuration changes for enterprise compliance.</p>
            </div>

            <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] transition-all">
              <TrendingUp className="w-8 h-8 text-[#05A222] mb-4" />
              <h4 className="font-bold text-[#14201C] text-base mb-2">A/B Broadcast Testing</h4>
              <p className="text-xs text-[#5F7069] leading-relaxed">Split-test copy, images, and CTA buttons before rolling out broadcasts to your entire 100,000+ customer contact list.</p>
            </div>

            <div className="bg-white border border-[#E2EAE6] p-6 rounded-2xl shadow-[0_8px_30px_rgba(1,59,35,0.04)] hover:border-[#05A222]/50 hover:shadow-[0_12px_36px_rgba(1,59,35,0.08)] transition-all">
              <ShieldCheck className="w-8 h-8 text-[#039B56] mb-4" />
              <h4 className="font-bold text-[#14201C] text-base mb-2">Anti-Ban Protection</h4>
              <p className="text-xs text-[#5F7069] leading-relaxed">Intelligent throttling algorithms, spam prevention guards, and automated opt-out handling to keep your Meta quality rating high.</p>
            </div>
          </div>
        </div>

      </div>

      <CTASection />
    </div>
  );
};
