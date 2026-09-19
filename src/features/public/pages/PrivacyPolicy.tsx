import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  Server, 
  CheckCircle2, 
  Mail, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { ROUTES, APP_NAME } from '../../../utils/constants';
import { SEO } from '../../../seo';

export const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '1. Overview & Scope' },
    { id: 'data-collected', title: '2. Information We Collect' },
    { id: 'meta-cloud', title: '3. Meta WhatsApp Cloud API Processing' },
    { id: 'how-we-use', title: '4. How We Use & Process Data' },
    { id: 'encryption-security', title: '5. Encryption & Data Protection' },
    { id: 'data-retention', title: '6. Retention & Automated Deletion' },
    { id: 'user-rights', title: '7. Your Global Privacy Rights (GDPR/CCPA)' },
    { id: 'cookies', title: '8. Cookies & Session Storage' },
    { id: 'contact', title: '9. Contact Data Protection Officer' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#1F2A26]">
      <SEO page="privacy" />

      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-[#C4EBD0]/70 py-14 sm:py-18 bg-[#EBF7EE]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img 
            src="/images/commonheader_bg.png" 
            alt="WhatsAppMSG Privacy Policy Header" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 text-xs font-semibold text-[#006736] mb-4">
            <Link to={ROUTES.HOME} className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span>Legal Documentation</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-xs border border-[#C4EBD0] text-xs font-bold text-[#006736] mb-4 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#05A222]" />
              <span>Direct Meta Cloud Solution Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14201C] tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-[#5F7069] leading-relaxed">
              At {APP_NAME}, we uphold enterprise-grade confidentiality. This policy outlines how we handle your business credentials, contact lists, and message payloads across the WhatsApp Business Cloud API.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8A9993]">
              <span>Last updated: September 2026</span>
              <span>•</span>
              <span>Effective Date: Immediate</span>
              <span>•</span>
              <span>Version: 2.4 (Enterprise Edition)</span>
            </div>
          </div>

          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#DCE8E2]">
            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center shrink-0">
                <Lock className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14201C]">Zero Data Selling</h4>
                <p className="text-xs text-[#5F7069] mt-0.5">We never sell, broker, or monetize your contact records or conversation content.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center shrink-0">
                <Server className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14201C]">Direct Meta Cloud API</h4>
                <p className="text-xs text-[#5F7069] mt-0.5">Messages pass directly through Meta Cloud API data pipelines without third-party proxies.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center shrink-0">
                <Eye className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14201C]">Global Regulatory Shield</h4>
                <p className="text-xs text-[#5F7069] mt-0.5">Architected to comply with GDPR, CCPA, and India Digital Personal Data Protection Act.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Table of Contents - Sticky Desktop Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#F8FAF9] p-6 rounded-3xl border border-[#E2EAE6] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#006736] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#05A222]" />
                <span>Document Contents</span>
              </div>
              <nav className="space-y-1">
                {sections.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      activeSection === item.id 
                        ? 'bg-[#E9F9EE] text-[#006736] font-bold shadow-2xs' 
                        : 'text-[#5F7069] hover:bg-white hover:text-[#14201C]'
                    }`}
                  >
                    <span>{item.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-[#E2EAE6] space-y-2">
                <p className="text-xs text-[#8A9993]">Questions regarding our data handling?</p>
                <a
                  href="mailto:whatsappmsgofficial@gmail.com"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#006736] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>whatsappmsgofficial@gmail.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Legal Text Body */}
          <main className="lg:col-span-8 space-y-12 text-sm sm:text-base text-[#4A5D54] leading-relaxed">
            
            {/* Section 1 */}
            <section id="overview" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                1. Overview & Scope
              </h2>
              <p>
                This Privacy Policy governs your use of the {APP_NAME} SaaS platform, developer APIs, customer service dashboard, webhook listeners, and automation engines (collectively, the <strong>"Platform"</strong> or <strong>"Services"</strong>). {APP_NAME} operates as an enterprise communication provider enabling businesses to leverage the Meta WhatsApp Business Cloud API.
              </p>
              <p>
                In the context of international data protection laws (such as GDPR Article 4 and CCPA regulations), {APP_NAME} primarily acts as a <strong>Data Processor</strong> (or Service Provider) for the customer message contents and phone numbers processed on your behalf, while acting as a <strong>Data Controller</strong> for your direct account registration, tenant administration, and billing telemetry.
              </p>
            </section>

            {/* Section 2 */}
            <section id="data-collected" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                2. Information We Collect
              </h2>
              <p>
                To provide scalable WhatsApp messaging automation, we collect only the information essential for operating your account and dispatching verified messages:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#4A5D54]">
                <li>
                  <strong>Account & Tenant Credentials:</strong> Business name, enterprise contact email, authorized admin names, billing details, and encrypted authentication tokens.
                </li>
                <li>
                  <strong>Meta Business Credentials:</strong> WhatsApp Business Account ID (WABA ID), Phone Number ID, App ID, and System User Access Tokens provided during Meta Cloud onboarding.
                </li>
                <li>
                  <strong>Message Metadata:</strong> Timestamp of dispatch, recipient phone numbers, delivery status codes (Sent, Delivered, Read, Failed), and error telemetry from Meta endpoints.
                </li>
                <li>
                  <strong>AI & Automation Logs:</strong> Context prompts, uploaded knowledge base documents, and automated responses executed via your designated AI agents.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="meta-cloud" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                3. Meta WhatsApp Cloud API Processing
              </h2>
              <p>
                Unlike legacy WhatsApp scraping tools or unverified gateway proxies, {APP_NAME} integrates exclusively with the <strong>Meta WhatsApp Business Cloud API</strong>. 
              </p>
              <div className="p-4 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#006736]">
                  <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
                  <span>Meta Direct Pipeline Architecture</span>
                </div>
                <p className="text-xs text-[#4A5D54]">
                  Outbound broadcasts, transactional notifications, and incoming replies travel directly between your {APP_NAME} tenant and Meta’s cloud server infrastructure. Your payloads are not routed through third-party intermediaries or unvetted brokers.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="how-we-use" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                4. How We Use & Process Data
              </h2>
              <p>We process collected data solely under legitimate, contractual business purposes:</p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-[#E2EAE6] bg-white">
                  <h4 className="font-bold text-[#14201C] text-sm">Service Delivery & Transmission</h4>
                  <p className="text-xs sm:text-sm text-[#5F7069] mt-1">Executing bulk marketing broadcasts, routing inbound chats to team inbox agents, and triggering webhook callbacks.</p>
                </div>
                <div className="p-4 rounded-xl border border-[#E2EAE6] bg-white">
                  <h4 className="font-bold text-[#14201C] text-sm">Reliability & SLA Enforcement</h4>
                  <p className="text-xs sm:text-sm text-[#5F7069] mt-1">Monitoring message delivery throughput, retry queues, latency, and preventing rate-limit throttling.</p>
                </div>
                <div className="p-4 rounded-xl border border-[#E2EAE6] bg-white">
                  <h4 className="font-bold text-[#14201C] text-sm">Enterprise Security & Fraud Prevention</h4>
                  <p className="text-xs sm:text-sm text-[#5F7069] mt-1">Detecting unauthorized account takeovers, verifying webhook signatures (HMAC SHA-256), and blocking spam abuse.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="encryption-security" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                5. Encryption & Data Protection
              </h2>
              <p>
                Security is foundational to our engineering principles. Every tier of {APP_NAME} uses modern cryptographic standards:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#4A5D54]">
                <li>
                  <strong>Encryption in Transit:</strong> All web requests, API calls, and webhooks enforce modern TLS 1.3 encryption with strict HSTS policies.
                </li>
                <li>
                  <strong>Encryption at Rest:</strong> Database records, authentication secrets, and conversation logs are encrypted using AES-256 GCM.
                </li>
                <li>
                  <strong>Secret Isolation:</strong> Meta system user tokens and private API keys are stored in dedicated hardware-backed Key Management Systems (KMS).
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="data-retention" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                6. Retention & Automated Deletion
              </h2>
              <p>
                We retain message history only as long as necessary to provide live chat continuity, analytics summaries, and regulatory audit compliance.
              </p>
              <p>
                Enterprise tenants can configure automated Data Retention policies (e.g., auto-purge message logs older than 30, 60, or 90 days). Upon account termination, all tenant-associated credentials, webhook secrets, and contact databases are queued for permanent deletion within thirty (30) days.
              </p>
            </section>

            {/* Section 7 */}
            <section id="user-rights" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                7. Your Global Privacy Rights (GDPR/CCPA/DPDP)
              </h2>
              <p>
                Regardless of your enterprise location, you retain the following enforceable rights over your business and customer information:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E2EAE6]">
                  <strong className="text-xs uppercase tracking-wider text-[#006736]">Right to Access & Export</strong>
                  <p className="text-xs text-[#5F7069] mt-1">Export full contact lists and conversation logs in JSON/CSV formats anytime.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E2EAE6]">
                  <strong className="text-xs uppercase tracking-wider text-[#006736]">Right to Erasure (To Be Forgotten)</strong>
                  <p className="text-xs text-[#5F7069] mt-1">Submit deletion requests for individual contacts or complete account wipeouts.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E2EAE6]">
                  <strong className="text-xs uppercase tracking-wider text-[#006736]">Right to Rectification</strong>
                  <p className="text-xs text-[#5F7069] mt-1">Update profile information, webhook endpoints, and business registry records.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-[#E2EAE6]">
                  <strong className="text-xs uppercase tracking-wider text-[#006736]">Opt-Out & Consent Revocation</strong>
                  <p className="text-xs text-[#5F7069] mt-1">Instantly process end-user STOP/UNSUBSCRIBE keywords as required by Meta policy.</p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section id="cookies" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                8. Cookies & Session Storage
              </h2>
              <p>
                Our web dashboard uses strictly necessary cookies and local session storage tokens solely for keeping you authenticated, preserving dashboard preferences, and protecting against Cross-Site Request Forgery (CSRF). We do not deploy third-party advertising cookies inside your authenticated workspace.
              </p>
            </section>

            {/* Section 9 */}
            <section id="contact" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                9. Contact Data Protection Officer
              </h2>
              <p>
                For questions regarding this policy, Data Processing Addendums (DPA), or custom compliance audits, please contact our dedicated Data Protection Officer:
              </p>
              <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E2EAE6] space-y-3">
                <div className="text-sm font-bold text-[#14201C]">WhatsAppMSG Legal & Data Privacy Desk</div>
                <p className="text-xs text-[#5F7069]">Official support channel for compliance and security verifications.</p>
                <div className="flex items-center gap-2 text-sm text-[#006736] font-semibold">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:whatsappmsgofficial@gmail.com" className="hover:underline">
                    whatsappmsgofficial@gmail.com
                  </a>
                </div>
              </div>
            </section>

          </main>

        </div>
      </div>

    </div>
  );
};
