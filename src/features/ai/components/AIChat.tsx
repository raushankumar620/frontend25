import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your configured WhatsApp Sales Agent. Ask me anything about our enterprise plans, SLAs, or security.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AIChatMessage = { id: String(Date.now()), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiReply: AIChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: `Based on your indexed documents: Yes! We offer SOC-2 Tier 3 WhatsApp Cloud API compliance with custom dedicated IP routing. Would you like me to generate a tailored quote?`,
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[480px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Agent Sandbox Live Simulator</span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-mono">
          Model: gpt-4o
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 max-w-[85%] text-xs ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-xl leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-100 border border-slate-700'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <Bot className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>AI Agent is retrieving RAG context & reasoning...</span>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-800/60 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Test user message to agent..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <Button size="sm" variant="primary" onClick={handleSend}>
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
