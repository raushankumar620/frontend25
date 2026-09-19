import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { aiService } from '../../../services/aiService';
import type { AIAgent } from '../types';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp?: string;
  isHandoff?: boolean;
}

export interface AIChatProps {
  selectedAgent?: AIAgent | null;
}

export const AIChat: React.FC<AIChatProps> = ({ selectedAgent }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: selectedAgent
        ? `Hello! I am connected to the "${selectedAgent.name}" persona (${selectedAgent.modelName}). How can I help you today?`
        : 'Hello! I am your configured WhatsApp AI Agent. Ask me anything to test reasoning, RAG context, and human handoff protocols.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    const userMsg: AIChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build history payload
      const historyPayload = messages
        .filter((m) => m.sender !== 'system')
        .map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        }));

      let response;
      if (selectedAgent?._id) {
        response = await aiService.simulateAgent(selectedAgent._id, {
          userMessage: userText,
          messages: historyPayload,
        });
      } else {
        response = await aiService.simulateDefault({
          userMessage: userText,
          messages: historyPayload,
        });
      }

      if (response.handedOff) {
        const handoffMsg: AIChatMessage = {
          id: String(Date.now() + 1),
          sender: 'system',
          text: `🚨 Human Handoff Triggered: ${response.handoffReason || 'Keyword match'}. Conversation escalated to human inbox.`,
          isHandoff: true,
        };
        const aiMsg: AIChatMessage = {
          id: String(Date.now() + 2),
          sender: 'ai',
          text: response.reply,
        };
        setMessages((prev) => [...prev, handoffMsg, aiMsg]);
      } else {
        const aiReply: AIChatMessage = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: response.reply,
        };
        setMessages((prev) => [...prev, aiReply]);
      }
    } catch (err: any) {
      const errorMsg: AIChatMessage = {
        id: String(Date.now() + 1),
        sender: 'system',
        text: `Error connecting to AI simulator: ${err.message || 'Check your backend server'}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: String(Date.now()),
        sender: 'ai',
        text: selectedAgent
          ? `Conversation reset. Ready to test "${selectedAgent.name}".`
          : 'Conversation reset. Ask a question to test live AI simulation.',
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[460px] sm:h-[540px] bg-white border border-[#E2EAE6] rounded-2xl overflow-hidden shadow-xs">
      <div className="p-3 sm:p-3.5 bg-[#F6FAF8] border-b border-[#E2EAE6] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#14201C] min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#05A222]" />
          </div>
          <span className="truncate">Sandbox Live Simulator</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-[#006736] bg-[#E9F9EE] border border-[#C4EBD0] px-2 py-0.5 rounded-md font-mono font-bold">
            {selectedAgent ? selectedAgent.modelName : 'gpt-4o-mini'}
          </span>
          <button
            onClick={handleReset}
            title="Reset sandbox chat"
            className="p-1.5 rounded-lg text-[#5F7069] hover:text-[#14201C] hover:bg-white border border-transparent hover:border-[#E2EAE6] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-[#F6FAF8]/50">
        {messages.map((m) => {
          if (m.sender === 'system') {
            return (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 shadow-2xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{m.text}</span>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[88%] sm:max-w-[85%] text-xs ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-[#006736] text-white'
                    : 'bg-[#E9F9EE] text-[#006736] border border-[#C4EBD0] font-bold'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-[#05A222]" />}
              </div>
              <div
                className={`p-3 rounded-xl leading-relaxed whitespace-pre-wrap shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-[#05A222] text-white rounded-tr-none font-medium'
                    : 'bg-white text-[#14201C] border border-[#E2EAE6] rounded-tl-none font-medium'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#5F7069] italic bg-white p-2.5 rounded-xl border border-[#E2EAE6] w-fit">
            <Bot className="w-3.5 h-3.5 text-[#05A222] animate-spin" />
            <span>AI Agent is retrieving context & reasoning...</span>
          </div>
        )}
      </div>

      <div className="p-2.5 sm:p-3 bg-white border-t border-[#E2EAE6] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={selectedAgent ? `Message ${selectedAgent.name}...` : 'Type a test message (e.g. "I want human agent")...'}
          className="flex-1 bg-[#F6FAF8] border border-[#E2EAE6] rounded-xl px-3 sm:px-3.5 py-2 text-xs text-[#14201C] placeholder-[#8A9993] focus:outline-none focus:border-[#05A222] focus:bg-white transition-colors"
        />
        <Button
          size="sm"
          variant="primary"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-[#05A222] hover:bg-[#006736] text-white font-bold px-3.5 rounded-xl shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
