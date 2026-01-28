
import React, { useState, useEffect } from 'react';
import { 
  Activity, Map as MapIcon, ShieldAlert, Cpu, 
  ChevronRight, ArrowLeft, Users, Zap, Bell, 
  Maximize2, Radio, Target
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  LineChart, Line, Tooltip as RechartsTooltip 
} from 'recharts';

/**
 * 指挥中心专用 Vertex Logo
 */
const VertexLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 32L24 8H32L16 32H8Z" fill="white" />
    <path d="M16 32L32 8" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
    <circle cx="32" cy="8" r="4" fill="white" />
  </svg>
);

const mockLiveData = [
  { time: '10:00', orders: 400, capacity: 420 },
  { time: '10:05', orders: 450, capacity: 430 },
  { time: '10:10', orders: 520, capacity: 450 },
  { time: '10:15', orders: 610, capacity: 580 },
  { time: '10:20', orders: 590, capacity: 600 },
  { time: '10:25', orders: 700, capacity: 680 },
];

interface CommandCenterProps {
  onClose: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#0F172A] text-slate-100 flex flex-col font-sans overflow-hidden animate-in fade-in duration-700 text-left">
      {/* Header */}
      <header className="h-24 border-b border-white/10 flex items-center justify-between px-12 bg-slate-900/50 backdrop-blur-3xl">
        <div className="flex items-center gap-10">
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-6">
            <div className="drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <VertexLogo size={52} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
                Vertex <span className="text-indigo-400">Live</span>
              </h1>
              <div className="flex items-center gap-2 mt-2 opacity-60">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Real-time Telemetry</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12 text-left">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">System Clock</p>
            <p className="text-3xl font-black tabular-nums text-white tracking-tighter">{currentTime.toLocaleTimeString()}</p>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                Live Link
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Uptime 100%</span>
            </div>
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-white transition-all">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 p-10 grid grid-cols-12 gap-8 overflow-hidden bg-[radial-gradient(circle_at_top_right,#1E293B,transparent)]">
        {/* 指标面板 */}
        <div className="col-span-3 space-y-8">
          <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Capacity State</h3>
            <div className="space-y-6">
              <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                <p className="text-[9px] text-slate-400 font-black mb-1 uppercase tracking-widest">Active Operatives</p>
                <p className="text-5xl font-black text-white tracking-tighter">1,204</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                  <p className="text-[9px] text-slate-400 font-black mb-1 uppercase tracking-widest">In Transit</p>
                  <p className="text-2xl font-black text-emerald-400">852</p>
                </div>
                <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                  <p className="text-[9px] text-slate-400 font-black mb-1 uppercase tracking-widest">Available</p>
                  <p className="text-2xl font-black text-indigo-400">352</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 动态可视化占位 */}
        <div className="col-span-9 bg-slate-900 border border-white/5 rounded-[3.5rem] relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449156001935-d2863fb72690?q=80&w=2000')] opacity-[0.05] grayscale invert bg-cover bg-center transition-transform duration-[60s] group-hover:scale-110" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
               <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Target size={40} className="text-indigo-400" />
               </div>
               <h2 className="text-2xl font-bold text-white tracking-tight">全城网格监控已开启</h2>
               <p className="text-slate-500 text-sm mt-2">正在接收来自 12 个核心分站的实时遥测数据</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-16 bg-slate-900 border-t border-white/5 flex items-center overflow-hidden">
        <div className="flex items-center gap-32 px-12 whitespace-nowrap animate-marquee">
          <span className="flex items-center gap-6 text-[11px] font-black uppercase text-white bg-indigo-600 px-10 py-3 rounded-full">
            <Activity size={18} className="animate-pulse" /> Global System State: Stable
          </span>
          {[
            '#BJ_STATION_ALPHA deployed 14 new couriers',
            'Network average latency baseline: 11.4ms',
            'Throughput exceeded daily forecast by 12.4%',
            'Regional saturation forecast: +14.2% Growth'
          ].map((text, i) => (
            <span key={i} className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.5em] italic">{text}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 80s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CommandCenter;
