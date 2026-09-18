import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { APP_NAME } from '../../../utils/constants';
import { SEO } from '../../../seo';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    volume: '50k-250k',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="bg-white text-[#1F2A26]">
      <SEO page="contact" />
      
      {/* Top Header Hero */}
      <section className="relative overflow-hidden w-full border-b border-[#C4EBD0]/70 py-16 sm:py-20 lg:py-24 bg-[#EBF7EE]">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img 
            src="/images/commonheader_bg.png" 
            alt="WhatsAppMSG Contact Us Header" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#C4EBD0] bg-white/80 backdrop-blur-xs text-[#006736] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Mail className="w-3.5 h-3.5 text-[#05A222]" />
            Get In Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#14201C] tracking-tight mb-4 leading-tight">
            Connect with our WhatsApp Enterprise Specialists
          </h1>
          <p className="text-sm sm:text-base text-[#5F7069] leading-relaxed">
            Have questions about custom high-volume pricing, Meta Cloud API onboarding, or bespoke AI workflows? We respond promptly.
          </p>
        </div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Contact Details & Quick Links */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#F6FAF8] border border-[#E2EAE6] p-6 sm:p-8 rounded-3xl space-y-6 shadow-[0_8px_30px_rgba(1,59,35,0.04)]">
              <h2 className="text-xl font-bold text-[#14201C]">Direct Communication Channels</h2>
              
              <div className="space-y-4">
                <a 
                  href="mailto:support@whatsappmsg.com"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#E9F9EE] border border-[#C4EBD0] hover:border-[#05A222] transition-colors group cursor-pointer shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#05A222] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform font-bold shadow-xs">
                    <Mail className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#006736] uppercase tracking-wider">Support Email</div>
                    <div className="text-sm font-semibold text-[#14201C] mt-0.5">support@whatsappmsg.com</div>
                    <div className="text-[11px] text-[#5F7069]">Direct support & enterprise inquiries</div>
                  </div>
                </a>

                <a 
                  href="https://www.instagram.com/wmsgplatform/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E2EAE6] hover:border-[#05A222] transition-colors group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F6FAF8] text-[#05A222] flex items-center justify-center shrink-0 border border-[#E2EAE6] group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#5F7069] uppercase tracking-wider">Official Instagram</div>
                    <div className="text-sm font-semibold text-[#14201C] mt-0.5">@wmsgplatform</div>
                    <div className="text-[11px] text-[#8A9993]">Follow our verified product announcements</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-[#E9F9EE]/60 border border-[#C4EBD0] p-6 rounded-2xl space-y-2 text-xs text-[#5F7069]">
              <div className="flex items-center gap-2 text-[#14201C] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#05A222]" />
                <span>Enterprise SLA Guarantee</span>
              </div>
              <p>Dedicated technical architects assignable for accounts transmitting &gt;500k conversations/month.</p>
            </div>
          </div>

          {/* Right Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E2EAE6] rounded-3xl p-6 sm:p-10 shadow-[0_16px_50px_rgba(1,59,35,0.08)] relative overflow-hidden">
              
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#E9F9EE] text-[#05A222] rounded-full flex items-center justify-center mx-auto border border-[#C4EBD0]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#14201C]">Inquiry Received!</h3>
                  <p className="text-sm text-[#5F7069] max-w-md mx-auto">
                    Thank you for contacting {APP_NAME}. One of our Meta Cloud API enterprise architects has received your details and will reach out shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', company: '', volume: '50k-250k', message: '' });
                    }}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-[#14201C] mb-2">Request Enterprise Consultation</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Your Full Name *"
                        required
                        placeholder="Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <Input
                        label="Work Email *"
                        type="email"
                        required
                        placeholder="sarah@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Phone / WhatsApp *"
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <Input
                        label="Company / Organization *"
                        required
                        placeholder="Acme Corp"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201C] mb-1.5">Expected Monthly WhatsApp Volume</label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full bg-white border border-[#E2EAE6] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1F2A26] focus:outline-hidden focus:border-[#05A222] transition-colors"
                    >
                      <option value="under-10k">Under 10,000 messages / month</option>
                      <option value="10k-50k">10,000 - 50,000 messages / month</option>
                      <option value="50k-250k">50,000 - 250,000 messages / month</option>
                      <option value="250k-1m">250,000 - 1,000,000 messages / month</option>
                      <option value="1m-plus">1,000,000+ messages / month (Custom Dedicated Cluster)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#14201C] mb-1.5">How can we help your business?</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your current WhatsApp setup, pain points, or automation requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-[#E2EAE6] rounded-xl p-3 text-xs sm:text-sm text-[#1F2A26] focus:outline-hidden focus:border-[#05A222] placeholder:text-[#8A9993] transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={loading}
                    className="w-full bg-[#05A222] hover:bg-[#006736] text-white font-bold"
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Enterprise Request
                  </Button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
