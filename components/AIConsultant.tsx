
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { chatWithAIConsultant } from '../services/gemini';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: '您好！我是您的 RiderHub AI 运营专家。今天我可以如何协助您优化车队效率或招聘策略？' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      const response = await chatWithAIConsultant(history as any, userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: '抱歉，我在处理您的请求时遇到了点问题，请稍后重试。' }]);
    } finally {
      setLoading(false);
    }
  };

  const SuggestionChip = ({ text }: { text: string }) => (
    <button 
      onClick={() => setInput(text)}
      className="px-5 py-2.5 bg-white border border-slate-200/60 rounded-full text-xs font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#d2d2d7] transition-all whitespace-nowrap"
    >
      {text}
    </button>
  );

  return (
    <div className="p-10 h-full flex flex-col animate-fade-up max-w-5xl mx-auto">
      <header className="mb-10 text-left flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight flex items-center gap-3">
            AI 专家顾问 <Sparkles className="text-[#0071e3]" size={28} />
          </h1>
          <p className="text-[#86868b] font-medium mt-1">基于 Gemini 3 Pro 的智能物流运力决策支持。</p>
        </div>
      </header>

      <div className="apple-card flex-1 flex flex-col overflow-hidden border border-slate-200/40 relative bg-white">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-10 bg-[#f5f5f7]/30"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-slate-100 ${
                  msg.role === 'user' ? 'bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/20' : 'bg-white text-[#0071e3] shadow-sm'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={`p-5 rounded-2xl text-left text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#0071e3] text-white' 
                    : 'bg-white border border-slate-100 text-[#1d1d1f]'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-up">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[#0071e3] shadow-sm">
                  <Bot size={18} />
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-3">
                  <Loader2 className="animate-spin text-[#0071e3]" size={16} />
                  <span className="text-sm text-[#86868b] font-semibold italic">正在深度分析...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border-t border-slate-100">
          <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-none">
            <SuggestionChip text="如何降低核心区域的骑手流失率？" />
            <SuggestionChip text="帮我撰写一份吸引人的骑手招募令。" />
            <SuggestionChip text="车队资产巡检的最佳频率建议。" />
          </div>
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入您的问题..."
              className="w-full pl-6 pr-16 py-4 rounded-2xl bg-[#f5f5f7] border-none outline-none focus:ring-4 focus:ring-[#0071e3]/5 transition-all text-sm font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-[#0071e3] text-white rounded-xl disabled:opacity-30 transition-all shadow-md shadow-[#0071e3]/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
