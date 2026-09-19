import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Server, 
  CheckCircle2, 
  Mail, 
  ArrowLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { ROUTES, APP_NAME } from '../../../utils/constants';
import { SEO } from '../../../seo';

export const SecurityPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('architecture');

  const sections = [
    { id: 'architecture', title: '1. Enterprise Security Overview' },
    { id: 'encryption', title: '2. Cryptography & Encryption Standards' },
    { id: 'meta-cloud', title: '3. Meta WhatsApp Cloud Pipeline' },
    { id: 'webhooks', title: '4. Webhooks & HMAC SHA-256 Verification' },
    { id: 'rbac-isolation', title: '5. Multi-Tenant Data Isolation & RBAC' },
    { id: 'monitoring', title: '6. Penetration Testing & Telemetry' },
    { id: 'ha-dr', title: '7. High Availability (99.99%) & Backups' },
    { id: 'disclosure', title: '8. Vulnerability Disclosure & Bug Bounty' },
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
      <SEO page="security" />

      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-[#C4EBD0]/70 py-14 sm:py-18 bg-[#EBF7EE]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img 
            src="/images/commonheader_bg.png" 
            alt="WhatsAppMSG Security Policy Header" 
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
            <span>Security & Compliance</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-xs border border-[#C4EBD0] text-xs font-bold text-[#006736] mb-4 shadow-2xs">
              <Lock className="w-4 h-4 text-[#05A222]" />
              <span>Bank-Grade Encryption Standards</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14201C] tracking-tight mb-4">
              Security & Compliance
            </h1>
            <p className="text-base sm:text-lg text-[#5F7069] leading-relaxed">
              Discover how {APP_NAME} safeguards enterprise WhatsApp communications with cryptographic isolation, TLS 1.3 delivery pipelines, and direct Meta Cloud API architecture.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8A9993]">
              <span>Compliance Framework: SOC 2 & ISO 27001 Aligned</span>
              <span>•</span>
              <span>Direct Meta Cloud API Integration</span>
              <span>•</span>
              <span>Status: All Systems Operational</span>
            </div>
          </div>

          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#DCE8E2]">
            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center mb-2.5">
                <Lock className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <h4 className="text-sm font-bold text-[#14201C]">TLS 1.3 & AES-256</h4>
              <p className="text-xs text-[#5F7069] mt-0.5">End-to-end cryptographic protection in transit and at rest.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center mb-2.5">
                <Server className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <h4 className="text-sm font-bold text-[#14201C]">99.99% Uptime SLA</h4>
              <p className="text-xs text-[#5F7069] mt-0.5">Automated failovers and geo-redundant message queues.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center mb-2.5">
                <Key className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <h4 className="text-sm font-bold text-[#14201C]">HMAC Webhook Signatures</h4>
              <p className="text-xs text-[#5F7069] mt-0.5">Cryptographically signed callbacks preventing spoofing.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <h4 className="text-sm font-bold text-[#14201C]">Multi-Tenant Isolation</h4>
              <p className="text-xs text-[#5F7069] mt-0.5">Total database separation per enterprise workspace.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Table of Contents - Desktop Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#F8FAF9] p-6 rounded-3xl border border-[#E2EAE6] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#006736] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#05A222]" />
                <span>Security Topics</span>
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
                <p className="text-xs text-[#8A9993]">Security emergency or bug report?</p>
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
            <section id="architecture" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                1. Enterprise Security Overview
              </h2>
              <p>
                At {APP_NAME}, we understand that WhatsApp messages frequently convey sensitive corporate communications, time-critical OTPs, invoice details, and customer PII. Our infrastructure is architected from the ground up to guarantee confidentiality, message integrity, and continuous availability.
              </p>
              <p>
                We do not employ brittle web scrapers or unofficial reverse-engineered WhatsApp protocols. Instead, our platform connects directly to Meta's enterprise Cloud API servers via authenticated developer credentials.
              </p>
            </section>

            {/* Section 2 */}
            <section id="encryption" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                2. Cryptography & Encryption Standards
              </h2>
              <p>All data flows through verified cryptographic standards:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#006736] flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#05A222]" />
                    <span>In-Transit Encryption</span>
                  </div>
                  <p className="text-xs text-[#5F7069]">
                    Enforced TLS 1.3 encryption across all dashboard sessions, REST APIs, and webhook streams. Deprecated ciphers (SSLv3, TLS 1.0, TLS 1.1) are permanently rejected.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#006736] flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#05A222]" />
                    <span>At-Rest Encryption</span>
                  </div>
                  <p className="text-xs text-[#5F7069]">
                    Databases, cache clusters, and message logs are encrypted using AES-256 GCM algorithms with automated annual cryptographic key rotations.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="meta-cloud" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                3. Meta WhatsApp Cloud Pipeline
              </h2>
              <p>
                Directly integrated with the Meta Cloud API, {APP_NAME} enables businesses to scale up to 100,000+ customer conversations per day per phone number with sub-second delivery latency.
              </p>
              <div className="p-4 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#006736]">
                  <CheckCircle2 className="w-4 h-4 text-[#05A222]" />
                  <span>Direct Meta Cloud Integration</span>
                </div>
                <p className="text-xs text-[#4A5D54]">
                  Zero reliance on third-party SMS bridges or unauthorized WhatsApp Web instances. Outbound broadcasts are signed and submitted directly to Meta Graph API v20+ endpoints.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="webhooks" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                4. Webhooks & HMAC SHA-256 Verification
              </h2>
              <p>
                Every webhook event forwarded by {APP_NAME} to your backend server includes an <strong>X-Hub-Signature-256</strong> header computed using your private Webhook Signing Secret.
              </p>
              <p>
                This ensures that your endpoints can cryptographically confirm that the payload was generated by {APP_NAME} and has not been intercepted, replayed, or altered in transit.
              </p>
            </section>

            {/* Section 5 */}
            <section id="rbac-isolation" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                5. Multi-Tenant Data Isolation & RBAC
              </h2>
              <p>
                Our architecture enforces rigorous database-level isolation between enterprise tenants. One organization cannot access, inspect, or query records belonging to another workspace.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#4A5D54]">
                <li><strong>Role-Based Access Control:</strong> Distinct permission sets for Super Admins, Tenant Admins, Support Agents, and Developer API users.</li>
                <li><strong>Scoped API Keys:</strong> Generate granular tokens with specific permissions (e.g. read-only templates, campaign broadcast only, or webhook listener only).</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="monitoring" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                6. Penetration Testing & Telemetry
              </h2>
              <p>
                Our platform undergoes continuous static code analysis, third-party dependency vulnerability scanning, and routine penetration testing by external security auditors.
              </p>
              <p>
                All administrative actions (key generations, template submissions, member additions, and exports) produce tamper-evident audit logs accessible in the Super Admin telemetry console.
              </p>
            </section>

            {/* Section 7 */}
            <section id="ha-dr" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                7. High Availability (99.99%) & Backups
              </h2>
              <p>
                Our message dispatch pipelines feature multi-region active-active clusters with automated exponential backoff retries in case of transient Meta API rate limits.
              </p>
              <p>
                Continuous automated database snapshots are stored in air-gapped, encrypted backup buckets with a Recovery Point Objective (RPO) of under 1 hour and a Recovery Time Objective (RTO) of under 15 minutes.
              </p>
            </section>

            {/* Section 8 */}
            <section id="disclosure" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                8. Vulnerability Disclosure & Bug Bounty
              </h2>
              <p>
                We welcome reports from independent security researchers. If you discover a potential vulnerability in our API, dashboard, or webhook dispatchers, please contact our security team immediately:
              </p>
              <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E2EAE6] space-y-3">
                <div className="text-sm font-bold text-[#14201C]">Responsible Security Disclosure</div>
                <p className="text-xs text-[#5F7069]">
                  Please include a proof-of-concept and do not attempt to access or modify user data. We acknowledge and reward verified security disclosures.
                </p>
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
