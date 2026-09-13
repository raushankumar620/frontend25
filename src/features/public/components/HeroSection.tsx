import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  CheckCheck, 
  Play, 
  Users, 
  Zap 
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ROUTES, APP_NAME } from '../../../utils/constants';
import { useAuthStore } from '../../../store/authStore';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Typewriter effect state
  const rotatingWords = [
    APP_NAME,
    'AI Agents',
    'Broadcasts',
    'Automations',
    'Meta Cloud API',
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(APP_NAME);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    const currentFullWord = rotatingWords[currentWordIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (currentText.length < currentFullWord.length) {
        timer = setTimeout(() => {
          setCurrentText(currentFullWord.slice(0, currentText.length + 1));
        }, 110);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentFullWord.slice(0, currentText.length - 1));
        }, 55);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  // Interactive Chat Simulation
  interface ChatItem {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    time: string;
  }

  const welcomeMsg: ChatItem = {
    id: 'welcome',
    sender: 'bot',
    text: '👋 Hi Alex! Welcome to WhatsAppMSG. How can we help scale your business communication today?',
    time: '10:42 AM',
  };

  const scriptSequence: { sender: 'user' | 'bot'; text: string; time: string; typingDelay: number; readDelay: number }[] = [
    {
      sender: 'user',
      text: 'We need to send 50k WhatsApp order updates & automate support with AI.',
      time: '10:42 AM',
      typingDelay: 1200,
      readDelay: 1500,
    },
    {
      sender: 'bot',
      text: '✅ Perfect! With our Direct Meta Cloud API, you get 100k/day throughput, zero broker markup, and custom AI Agents trained on your catalog.',
      time: '10:43 AM',
      typingDelay: 1600,
      readDelay: 3500,
    },
    {
      sender: 'user',
      text: 'Can 10+ support agents share this same official WhatsApp number?',
      time: '10:43 AM',
      typingDelay: 1300,
      readDelay: 1600,
    },
    {
      sender: 'bot',
      text: '👥 Yes! Shared Team Inbox gives intelligent auto-routing, private notes & 1-click live handover.',
      time: '10:44 AM',
      typingDelay: 1500,
      readDelay: 4000,
    },
  ];

  const [chatMessages, setChatMessages] = useState<ChatItem[]>([welcomeMsg]);
  const [typingSender, setTypingSender] = useState<'bot' | 'user' | null>(null);
  const [inputText, setInputText] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const chatScrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  React.useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, typingSender]);

  // Automated Script Loop (when not in manual user interaction)
  React.useEffect(() => {
    if (isManualMode) return;

    let currentIndex = 0;
    let isCancelled = false;

    const runScriptStep = async () => {
      if (isCancelled || isManualMode) return;

      if (currentIndex >= scriptSequence.length) {
        // Pause then loop
        await new Promise((r) => setTimeout(r, 5000));
        if (isCancelled || isManualMode) return;
        setChatMessages([welcomeMsg]);
        currentIndex = 0;
        await new Promise((r) => setTimeout(r, 1200));
      }

      const item = scriptSequence[currentIndex];
      if (!item || isCancelled || isManualMode) return;

      // Start typing indicator
      setTypingSender(item.sender);
      await new Promise((r) => setTimeout(r, item.typingDelay));
      if (isCancelled || isManualMode) return;

      // Add message
      setTypingSender(null);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-${Math.random()}`,
          sender: item.sender,
          text: item.text,
          time: item.time,
        },
      ]);

      // Read delay before next step
      await new Promise((r) => setTimeout(r, item.readDelay));
      if (isCancelled || isManualMode) return;

      currentIndex++;
      runScriptStep();
    };

    const startTimer = setTimeout(() => {
      runScriptStep();
    }, 1500);

    return () => {
      isCancelled = true;
      clearTimeout(startTimer);
    };
  }, [isManualMode]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsManualMode(true);
    const userText = inputText;
    setInputText('');

    const newMsg: ChatItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setTypingSender('bot');

    setTimeout(() => {
      setTypingSender(null);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: '⚡ Autonomous AI Agent matched intent! Direct Meta Cloud API delivered response in 340ms with 99.8% precision.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#E9F9EE]/60 via-white to-[#F6FAF8] pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#E2EAE6]">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-[#1CD72C]/15 via-[#07CF74]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Meta Cloud Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F9EE] border border-[#C4EBD0] text-[#006736] text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
              <span>Direct Meta Cloud API v20.0 Tier 3 Certified</span>
            </div>

            {/* Headline with Typewriter Animation strictly on bottom row */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#14201C] leading-[1.15]">
              <span className="block">Scale WhatsApp Sales & Support</span>
              <div className="mt-1 sm:mt-2 flex items-center justify-center lg:justify-start flex-nowrap whitespace-nowrap gap-x-2.5 sm:gap-x-3">
                <span className="text-[#14201C] shrink-0">with</span>
                <span className="relative inline-flex items-center text-left bg-linear-to-r from-[#05A222] via-[#039B56] to-[#006736] bg-clip-text text-transparent whitespace-nowrap shrink-0">
                  <span>{currentText}</span>
                  <span className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-[#05A222] ml-1.5 rounded-full animate-pulse align-middle" />
                </span>
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5F7069] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              The modern Enterprise WhatsApp marketing platform. Send broadcast campaigns at scale, automate support with domain-trained AI Agents, and manage shared multi-agent team inboxes with zero broker latency.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(ROUTES.LOGIN);
                  } else {
                    navigate(ROUTES.DASHBOARD);
                  }
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto bg-[#05A222] hover:bg-[#006736] text-white shadow-lg shadow-[#05A222]/25 px-7 py-3.5 font-bold"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started & Login'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.PUBLIC_SOLUTIONS)}
                leftIcon={<Play className="w-4 h-4 text-[#05A222]" />}
                className="w-full sm:w-auto border-[#E2EAE6] bg-white hover:bg-[#F6FAF8] text-[#14201C] font-semibold shadow-xs"
              >
                Explore Solutions
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E2EAE6] max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#14201C]">100k+</div>
                <div className="text-xs text-[#5F7069] font-medium">Messages / Day Tier</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#05A222]">99.99%</div>
                <div className="text-xs text-[#5F7069] font-medium">Delivery Rate SLA</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#14201C]">0%</div>
                <div className="text-xs text-[#5F7069] font-medium">Meta API Markup</div>
              </div>
            </div>
          </div>

          {/* Right Interactive WhatsApp Simulation Box */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white border border-[#E2EAE6] rounded-3xl shadow-[0_16px_50px_rgba(1,59,35,0.12)] overflow-hidden transition-all">
              
              {/* WhatsApp Header */}
              <div className="bg-[#006736] p-4 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 overflow-hidden shadow-xs">
                      <img 
                        src="/images/whatsapplogoshort.png" 
                        alt="WhatsApp" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1CD72C] border-2 border-[#006736] rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm leading-none">WhatsAppMsg AI Co-Pilot</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#1CD72C]" />
                    </div>
                    <span className="text-[11px] text-[#E9F9EE] flex items-center gap-1">
                      {typingSender === 'bot' ? (
                        <span className="text-[#1CD72C] font-semibold animate-pulse">typing...</span>
                      ) : (
                        <span>Official Business Account • Online</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#013B23] text-[#E9F9EE] px-2.5 py-0.5 rounded-full font-mono font-medium border border-white/10">
                    Meta Cloud v20.0
                  </span>
                </div>
              </div>

              {/* Chat Canvas with Auto-Scroll */}
              <div 
                ref={chatScrollRef}
                className="p-4 space-y-3 bg-[#F6FAF8] h-[310px] overflow-y-auto scroll-smooth"
              >
                <div className="text-center">
                  <span className="text-[10px] bg-white border border-[#E2EAE6] text-[#5F7069] px-2.5 py-0.5 rounded-full shadow-2xs font-medium">
                    Today • Live Simulation
                  </span>
                </div>

                {chatMessages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs relative transition-all ${
                          isBot
                            ? 'bg-white text-[#1F2A26] rounded-tl-xs border border-[#E2EAE6]'
                            : 'bg-[#E9F9EE] text-[#006736] rounded-tr-xs border border-[#C4EBD0]'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#8A9993]">
                          <span>{msg.time}</span>
                          {!isBot && <CheckCheck className="w-3.5 h-3.5 text-[#05A222]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Animated Typing Indicator Bubble */}
                {typingSender && (
                  <div className={`flex ${typingSender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`flex items-center gap-1.5 py-2 px-3.5 rounded-2xl text-xs shadow-xs ${
                        typingSender === 'bot'
                          ? 'bg-white border border-[#E2EAE6] rounded-tl-xs'
                          : 'bg-[#E9F9EE] border border-[#C4EBD0] rounded-tr-xs'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 bg-[#05A222] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#05A222] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#05A222] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E2EAE6] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message to test AI Co-Pilot..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3.5 py-2 text-xs text-[#1F2A26] placeholder:text-[#8A9993] focus:outline-hidden focus:border-[#05A222] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-xl bg-[#05A222] hover:bg-[#006736] text-white flex items-center justify-center shadow-sm cursor-pointer transition-colors"
                  aria-label="Send"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Simulation Footer Bar */}
              <div className="bg-[#F6FAF8] px-4 py-2 border-t border-[#E2EAE6] flex items-center justify-between text-[11px] text-[#5F7069]">
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3 text-[#05A222]" />
                  Shared Team Inbox Active
                </span>
                <span className="flex items-center gap-1 font-mono text-[#006736] font-semibold">
                  <Zap className="w-3 h-3 text-[#05A222]" />
                  380ms Latency
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
