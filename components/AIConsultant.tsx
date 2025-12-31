
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAIConsultant } from '../services/gemini';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: '您好！我是您的 AI 运营顾问。今天我可以如何协助您优化骑手车队或招聘策略？' }
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
      setMessages(prev => [...prev, { role: 'ai', content: '抱歉，我在处理您的请求时遇到了点问题。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            AI 运营专家
            <Sparkles className="text-blue-600" size={24} />
          </h1>
          <p className="text-slate-500">实时战略指导与车队优化建议。</p>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[600px]">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600 shadow-sm'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-4 rounded-2xl text-left ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                  <Bot size={20} />
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-2">
                  <Loader2 className="animate-spin text-blue-600" size={18} />
                  <span className="text-sm text-slate-400 font-medium italic">思考中...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative flex items-center gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="咨询有关招聘策略、骑手流失或排班优化的问题..."
              className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm pr-16"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-3 flex gap-2 justify-center">
             <button onClick={() => setInput('如何降低西部区域的骑手流失率？')} className="text-xs text-slate-400 hover:text-blue-500 hover:bg-blue-50 px-2 py-1 rounded transition-colors">降低流失</button>
             <button onClick={() => setInput('帮我草拟一份针对高单量区域的骑手招募文案。')} className="text-xs text-slate-400 hover:text-blue-500 hover:bg-blue-50 px-2 py-1 rounded transition-colors">撰写招募令</button>
             <button onClick={() => setInput('管理骑手车队时最核心的 3 个 KPI 是什么？')} className="text-xs text-slate-400 hover:text-blue-500 hover:bg-blue-50 px-2 py-1 rounded transition-colors">KPI 洞察</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
