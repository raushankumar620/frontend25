import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Mail, 
  ArrowLeft,
  ChevronRight,
  Scale
} from 'lucide-react';
import { ROUTES, APP_NAME } from '../../../utils/constants';
import { SEO } from '../../../seo';

export const TermsOfService: React.FC = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: '1. Acceptance & Master Agreement' },
    { id: 'eligibility', title: '2. Eligibility & Account Security' },
    { id: 'meta-compliance', title: '3. Meta WhatsApp Business Compliance' },
    { id: 'opt-in', title: '4. Mandatory Customer Opt-In & Spam Rules' },
    { id: 'billing', title: '5. Subscriptions & Meta Conversation Fees' },
    { id: 'acceptable-use', title: '6. Acceptable Use & Prohibited Goods' },
    { id: 'ip-rights', title: '7. Intellectual Property & Licenses' },
    { id: 'sla-support', title: '8. Service Availability & Enterprise SLA' },
    { id: 'liability', title: '9. Limitation of Liability & Indemnity' },
    { id: 'termination', title: '10. Suspension, Termination & Law' },
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
      <SEO page="terms" />

      {/* Header Banner */}
      <div className="bg-linear-to-b from-[#E9F9EE] via-[#F6FAF8] to-white border-b border-[#E2EAE6] py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 text-xs font-semibold text-[#006736] mb-4">
            <Link to={ROUTES.HOME} className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span>Legal Documentation</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C4EBD0] text-xs font-bold text-[#006736] mb-4 shadow-2xs">
              <Scale className="w-4 h-4 text-[#05A222]" />
              <span>Enterprise Terms of Service</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14201C] tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-[#5F7069] leading-relaxed">
              These terms constitute a legally binding agreement between your enterprise and {APP_NAME} for accessing our WhatsApp Cloud API infrastructure, automation engines, and generative AI features.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8A9993]">
              <span>Last updated: September 2026</span>
              <span>•</span>
              <span>Effective Date: Immediate upon signup</span>
              <span>•</span>
              <span>Version: 3.1</span>
            </div>
          </div>

          {/* Quick Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#DCE8E2]">
            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14201C]">Meta Policy Adherence</h4>
                <p className="text-xs text-[#5F7069] mt-0.5">Strict compliance with official Meta WhatsApp Business Messaging guidelines.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14201C]">Zero Tolerance for Spam</h4>
                <p className="text-xs text-[#5F7069] mt-0.5">Unsolicited messaging and scraper bots result in immediate suspension.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2EAE6] shadow-2xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E9F9EE] text-[#006736] flex items-center justify-center shrink-0">
                <FileCheck className="w-4.5 h-4.5 text-[#05A222]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#14201C]">99.99% Uptime Guarantee</h4>
                <p className="text-xs text-[#5F7069] mt-0.5">Reliable transactional message dispatch with automated exponential retries.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Table of Contents - Desktop Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#F8FAF9] p-6 rounded-3xl border border-[#E2EAE6] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#006736] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#05A222]" />
                <span>Agreement Sections</span>
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
                <p className="text-xs text-[#8A9993]">Questions or contract inquiries?</p>
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
            <section id="acceptance" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                1. Acceptance & Master Agreement
              </h2>
              <p>
                By registering an account, connecting a WhatsApp Business Account (WABA), calling our REST APIs, or utilizing the {APP_NAME} dashboard, you affirm that you possess the corporate authority to bind your organization to these Terms of Service.
              </p>
              <p>
                If you do not agree with any provision herein, you must immediately terminate account access and discontinue use of all {APP_NAME} developer endpoints and user interfaces.
              </p>
            </section>

            {/* Section 2 */}
            <section id="eligibility" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                2. Eligibility & Account Security
              </h2>
              <p>
                {APP_NAME} is strictly an enterprise business-to-business (B2B) platform. Individual consumer accounts or minors under 18 years of age are not permitted to register.
              </p>
              <p>
                You are solely responsible for maintaining the confidentiality of your API keys, webhook signing secrets, and admin authentication passwords. Any actions taken through your credentials are authenticated as authorized actions of your organization.
              </p>
            </section>

            {/* Section 3 */}
            <section id="meta-compliance" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                3. Meta WhatsApp Business Compliance
              </h2>
              <p>
                As an enterprise solution built on top of official Meta Cloud APIs, all users of {APP_NAME} must strictly abide by:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#4A5D54]">
                <li><strong>Meta WhatsApp Business Terms of Service:</strong> Guidelines on account verification and business profile transparency.</li>
                <li><strong>Meta WhatsApp Business Messaging Policy:</strong> Rules regarding message templates, conversation categories (Utility, Authentication, Marketing, Service), and quality ratings.</li>
              </ul>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Notice on Account Quality Ratings</span>
                </div>
                <p>
                  If your phone number quality rating falls to RED or Meta flags your WABA for policy violations, Meta may restrict your message throughput. {APP_NAME} is not liable for restrictions imposed directly by Meta Platforms, Inc.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="opt-in" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                4. Mandatory Customer Opt-In & Spam Rules
              </h2>
              <p>
                You represent and warrant that you have obtained verifiable, affirmative <strong>Opt-In Consent</strong> from every customer before initiating outbound template notifications via WhatsApp.
              </p>
              <div className="p-4 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] space-y-2">
                <h4 className="font-bold text-[#006736] text-sm">Required Opt-In Standards</h4>
                <ul className="list-disc pl-5 text-xs text-[#4A5D54] space-y-1">
                  <li>Explicit disclosure that the customer is consenting to receive WhatsApp messages from your brand.</li>
                  <li>Clear communication of the types of messages (order updates, verification codes, or promotional offers).</li>
                  <li>An easy, automated mechanism for customers to revoke consent (e.g. replying "STOP" or "UNSUBSCRIBE").</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="billing" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                5. Subscriptions & Meta Conversation Fees
              </h2>
              <p>
                {APP_NAME} operates on a recurring software subscription model alongside direct Meta Cloud conversation charges:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#4A5D54]">
                <li>
                  <strong>Software Subscription:</strong> Billed monthly or annually in advance based on your chosen plan tier (Starter, Growth, Scale, or Enterprise).
                </li>
                <li>
                  <strong>Meta Conversation Rates:</strong> WhatsApp Business API conversation charges (marketing, utility, authentication, service) are calculated per Meta's country-specific rate card. Depending on your configuration, these are either billed directly to your Meta Credit Line or prepaid through your {APP_NAME} balance.
                </li>
                <li>
                  <strong>Refunds:</strong> Subscription fees are non-refundable once the billing cycle commences. Unused broadcast credits can be reviewed upon request.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="acceptable-use" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                6. Acceptable Use & Prohibited Goods
              </h2>
              <p>
                You agree never to transmit, promote, or orchestrate campaigns related to prohibited categories defined under Meta Commerce Policy, including:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#4A5D54] pt-2">
                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E2EAE6]">
                  🚫 Illegal drugs, prescription pharmaceuticals, or tobacco
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E2EAE6]">
                  🚫 Weapons, ammunition, or explosives
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E2EAE6]">
                  🚫 Adult content, escort services, or non-consensual imagery
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E2EAE6]">
                  🚫 Multi-level marketing schemes or deceptive financial offers
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section id="ip-rights" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                7. Intellectual Property & Licenses
              </h2>
              <p>
                {APP_NAME}, its user interface, custom algorithms, AI orchestration engine, and developer documentation are the proprietary intellectual property of {APP_NAME}.
              </p>
              <p>
                You retain complete, exclusive ownership of your business data, contact databases, custom templates, and customer message contents. By using {APP_NAME}, you grant us a worldwide, non-exclusive license solely to process and route your data for the purpose of fulfilling messaging services.
              </p>
            </section>

            {/* Section 8 */}
            <section id="sla-support" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                8. Service Availability & Enterprise SLA
              </h2>
              <p>
                We commit to maintaining a target <strong>99.99% system availability SLA</strong> for our core API endpoints, webhook receivers, and message routing queues.
              </p>
              <p>
                Scheduled maintenance windows are announced with at least 48 hours notice and typically executed during off-peak hours with automated traffic redirection.
              </p>
            </section>

            {/* Section 9 */}
            <section id="liability" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                9. Limitation of Liability & Indemnity
              </h2>
              <p>
                To the maximum extent permitted by applicable law, {APP_NAME} shall not be held liable for indirect, incidental, punitive, or consequential damages resulting from downtime of Meta’s underlying global network, customer network failure, or account bans triggered by user policy violations.
              </p>
              <p>
                You agree to indemnify and hold harmless {APP_NAME} against any claims, fines, or legal expenses arising from your failure to obtain proper customer consent or violation of anti-spam laws.
              </p>
            </section>

            {/* Section 10 */}
            <section id="termination" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#14201C] tracking-tight">
                10. Suspension, Termination & Law
              </h2>
              <p>
                Either party may terminate your account at any time via dashboard settings. We reserve the immediate right to suspend or terminate accounts involved in malicious phishing, massive unverified spam broadcasts, or deliberate security breaches.
              </p>
              <p>
                These Terms are governed by and construed in accordance with standard commercial enterprise laws.
              </p>
              <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2EAE6] flex items-center justify-between gap-4">
                <div className="text-xs text-[#5F7069]">
                  Have questions about our enterprise terms or custom master service agreements?
                </div>
                <a
                  href="mailto:whatsappmsgofficial@gmail.com"
                  className="px-4 py-2 rounded-xl bg-[#006736] hover:bg-[#05A222] text-white text-xs font-bold transition-colors shrink-0"
                >
                  Contact Legal Desk
                </a>
              </div>
            </section>

          </main>

        </div>
      </div>

    </div>
  );
};
