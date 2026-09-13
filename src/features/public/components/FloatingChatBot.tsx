import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  CheckCheck, 
  ArrowRight
} from 'lucide-react';
import { APP_NAME, ROUTES } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionLink?: { label: string; url: string; isInternal?: boolean };
}

const KNOWLEDGE_BASE: { keywords: string[]; answer: string; action?: { label: string; url: string; isInternal?: boolean } }[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'plan', 'charge', 'rate', 'paisa'],
    answer: '💰 WhatsAppMsg offers 3 flexible plans with ZERO Meta API markup:\n\n• Starter: $29/mo (Up to 10k msgs, 2 agents)\n• Pro: $79/mo (Up to 50k msgs, 5 agents, AI Bot)\n• Enterprise: $199/mo (Unlimited msgs, custom AI models, 24/7 dedicated SLA).\n\nYou also get a 14-Day Free Trial with no credit card required!',
    action: { label: 'View Full Pricing', url: ROUTES.PUBLIC_PRICING, isInternal: true }
  },
  {
    keywords: ['meta', 'cloud api', 'direct', 'broker', 'tier 3', 'api'],
    answer: '⚡ We use the Official Direct Meta Cloud API v20.0 with Tier 3 certification. This means:\n\n1. Zero broker middleman markups (pay official Meta rates)\n2. Ultra-low 380ms latency\n3. High-throughput (100,000+ messages/day)\n4. 99.99% delivery guarantee directly from Meta servers.',
    action: { label: 'Explore API Docs', url: ROUTES.DEVELOPERS_DOCS, isInternal: true }
  },
  {
    keywords: ['ai', 'agent', 'bot', 'gpt', 'smart', 'automation', 'training', 'catalog'],
    answer: '🤖 Our Domain-Trained AI Agents connect directly to your product catalog, website, or FAQs. They autonomously answer customer inquiries in 50+ languages, recommend products, and handle 80%+ of routine support with 99.4% intent accuracy.',
    action: { label: 'Test AI Demo', url: ROUTES.REGISTER, isInternal: true }
  },
  {
    keywords: ['broadcast', 'campaign', 'bulk', 'marketing', 'mass', 'limit'],
    answer: '📢 With WhatsAppMsg Broadcasts, you can schedule and send personalized rich campaigns (images, CTA buttons, quick replies) to tens of thousands of opted-in customers in seconds with built-in analytics and opt-out compliance.',
    action: { label: 'Start Free Trial', url: ROUTES.REGISTER, isInternal: true }
  },
  {
    keywords: ['shopify', 'woocommerce', 'crm', 'webhook', 'integrate', 'integration', 'connect'],
    answer: '🛒 WhatsAppMsg integrates with Shopify, WooCommerce, HubSpot, Salesforce, and custom CRMs via 1-click webhooks. Trigger automatic order confirmations, shipping tracking updates, and abandoned cart recovery sequences seamlessly.',
    action: { label: 'View Integrations', url: ROUTES.PUBLIC_SOLUTIONS, isInternal: true }
  },
  {
    keywords: ['team', 'inbox', 'multi agent', 'support', 'agents', 'shared number'],
    answer: '👥 Yes! The Shared Team Inbox lets 10+ human agents share a single verified WhatsApp Business number with intelligent conversation routing, agent tagging, internal private notes, and seamless 1-click AI-to-human handover.',
    action: { label: 'Try Shared Inbox', url: ROUTES.REGISTER, isInternal: true }
  },
  {
    keywords: ['trial', 'free', 'demo', 'test', 'signup', 'register'],
    answer: '🎁 You can start your 14-Day Full Access Free Trial right now! No credit card is required. You get access to all AI features, Meta Cloud API testing, and multi-agent inboxes.',
    action: { label: 'Claim 14-Day Free Trial', url: ROUTES.REGISTER, isInternal: true }
  }
];

const SUGGESTED_QUESTIONS = [
  '💰 What are your pricing plans?',
  '⚡ How does Direct Meta API work?',
  '🤖 How do AI Agents work?',
  '📢 What are the broadcast limits?',
  '🛒 Can I connect Shopify / CRM?',
];

export const FloatingChatBot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `👋 Hi there! I'm the ${APP_NAME} AI Assistant. Ask me anything about our WhatsApp Meta Cloud API, AI Agents, Broadcasts, or Pricing plans!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      const lower = text.toLowerCase();
      let matched = KNOWLEDGE_BASE.find((k) =>
        k.keywords.some((word) => lower.includes(word))
      );

      let replyText = '';
      let actionLink = undefined;

      if (matched) {
        replyText = matched.answer;
        actionLink = matched.action;
      } else {
        replyText = `⚡ Great question! ${APP_NAME} is built directly on Meta's official Cloud API for lightning-fast delivery, domain-trained AI customer support, and multi-agent inboxes.\n\nWould you like to start a 14-day free trial or talk to our solutions team?`;
        actionLink = { label: 'Start 14-Day Free Trial', url: ROUTES.REGISTER, isInternal: true };
      }

      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink,
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 900);
  };

  const handleActionClick = (action: { label: string; url: string; isInternal?: boolean }) => {
    if (action.isInternal) {
      navigate(action.url);
      setIsOpen(false);
    } else {
      window.open(action.url, '_blank');
    }
  };

  return (
    <div className="fixed bottom-10 sm:bottom-12 right-6 sm:right-8 z-50 flex flex-col items-end font-sans">
      
      {/* Interactive Chat Window Popup */}
      {isOpen && (
        <div className="mb-3 w-[360px] sm:w-[400px] max-w-[calc(100vw-2.5rem)] h-[540px] max-h-[calc(100vh-6.5rem)] bg-white border border-[#E2EAE6] rounded-3xl shadow-[0_20px_60px_rgba(1,59,35,0.22)] flex flex-col overflow-hidden animate-fadeIn transition-all">
          
          {/* Header */}
          <div className="bg-linear-to-r from-[#013B23] via-[#006736] to-[#013B23] text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/15 p-0.5 border border-white/30 flex items-center justify-center overflow-hidden">
                  <img src="/bot.png" alt="Bot Mascot" className="w-full h-full object-contain" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1CD72C] border-2 border-[#006736] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm leading-tight text-white">{APP_NAME} AI Bot</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1CD72C]" />
                </div>
                <span className="text-[11px] text-[#E9F9EE] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#1CD72C]" />
                  Official Meta Cloud Assistant
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Canvas */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F6FAF8]">
            <div className="text-center">
              <span className="text-[10px] bg-white border border-[#E2EAE6] text-[#5F7069] px-3 py-1 rounded-full shadow-2xs font-semibold">
                Direct Meta AI Live Support
              </span>
            </div>

            {/* Messages */}
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
                  <div className={`max-w-[88%] space-y-2`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                        isBot
                          ? 'bg-white text-[#14201C] rounded-tl-xs border border-[#E2EAE6]'
                          : 'bg-[#006736] text-white rounded-tr-xs shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      
                      {/* Action Link Button if present */}
                      {msg.actionLink && (
                        <div className="pt-2 border-t border-[#E2EAE6] mt-2">
                          <button
                            onClick={() => handleActionClick(msg.actionLink!)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#05A222] hover:text-[#006736] hover:underline cursor-pointer"
                          >
                            <span>{msg.actionLink.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isBot ? 'text-[#8A9993]' : 'text-[#E9F9EE]'}`}>
                        <span>{msg.time}</span>
                        {!isBot && <CheckCheck className="w-3 h-3 text-[#1CD72C]" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#E2EAE6] rounded-2xl rounded-tl-xs px-3.5 py-2 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#05A222] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#05A222] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#05A222] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Suggested Question Chips (when only 1 or 2 messages) */}
            {messages.length <= 2 && !isTyping && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] font-bold text-[#5F7069] uppercase tracking-wider block px-1">
                  Suggested Questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q.replace(/^[^\w\s]+/, '').trim())}
                      className="text-left text-[11px] bg-white hover:bg-[#E9F9EE] text-[#006736] font-medium px-2.5 py-1.5 rounded-xl border border-[#C4EBD0] shadow-2xs hover:border-[#05A222] transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E2EAE6] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about WhatsAppMsg, pricing, API..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3.5 py-2.5 text-xs text-[#14201C] placeholder:text-[#8A9993] focus:outline-hidden focus:border-[#05A222] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-[#05A222] hover:bg-[#006736] disabled:opacity-40 disabled:hover:bg-[#05A222] text-white flex items-center justify-center shadow-sm cursor-pointer transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="bg-[#F6FAF8] px-3 py-1.5 border-t border-[#E2EAE6] text-center text-[10px] text-[#5F7069]">
            Powered by Official Direct Meta Cloud API v20.0
          </div>

        </div>
      )}

      {/* Floating Trigger Row on the Right */}
      <div className="flex items-center gap-3">
        
        {/* Welcome Callout Speech Bubble (to the left of the button) */}
        {!isOpen && showCallout && (
          <div className="relative bg-white border border-[#E2EAE6] rounded-2xl px-3.5 py-2 shadow-[0_10px_25px_rgba(1,59,35,0.15)] flex items-center gap-2 animate-bounce-subtle">
            <div className="flex items-center gap-1.5 text-xs text-[#14201C] font-semibold">
              <span className="text-sm">👋</span>
              <span>Need help? Ask AI Bot!</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCallout(false);
              }}
              className="text-[#8A9993] hover:text-[#14201C] cursor-pointer ml-1 p-0.5"
              aria-label="Dismiss callout"
            >
              <X className="w-3 h-3" />
            </button>
            
            {/* Speech Bubble Arrow pointing right to the bot */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-[#E2EAE6] rotate-45" />
          </div>
        )}

        {/* Main Floating Bot Mascot Button - Compact & Sleek */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowCallout(false);
          }}
          className="relative group w-13 h-13 sm:w-15 sm:h-15 bg-transparent border-0 p-0 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center focus:outline-hidden"
          aria-label="Toggle AI Support Bot"
        >
          {/* Mascot Image with natural drop shadow */}
          <img
            src="/bot.png"
            alt="WhatsAppMsg AI Bot"
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:-rotate-3"
          />

          {/* Online Glowing Dot */}
          <span className="absolute top-0 right-0 z-20 w-3.5 h-3.5 bg-[#1CD72C] border-2 border-white rounded-full shadow-md flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
          </span>
        </button>

      </div>

    </div>
  );
};
