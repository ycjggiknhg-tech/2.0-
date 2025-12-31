
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
    <div className="fixed inset-0 z-[200] bg-slate-950 text-slate-100 flex flex-col font-mono overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <header className="h-20 border-b border-slate-800 flex items-center justify-between px-10 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">RiderHub Live</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none">实时指挥调度中心</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase">系统时间</p>
            <p className="text-xl font-bold tabular-nums">{currentTime.toLocaleTimeString()}</p>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="flex items-center gap-2 text-xs font-bold text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                网络同步正常
              </span>
              <span className="text-[10px] text-slate-500">延迟: 14ms</span>
            </div>
            <button className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Column: Real-time Stats */}
        <div className="col-span-3 space-y-6 flex flex-col">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users size={14} className="text-blue-500" /> 全城运力状态
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-left">
                <p className="text-[10px] text-slate-400 font-bold mb-1">活跃骑手</p>
                <p className="text-2xl font-black text-blue-400">1,204</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-left">
                <p className="text-[10px] text-slate-400 font-bold mb-1">正在配送</p>
                <p className="text-2xl font-black text-green-400">852</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex-1 flex flex-col">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Radio size={14} className="text-orange-500" /> 实时警报流
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {[
                { id: 'AL-01', type: '超时预警', msg: '骑手 张伟 订单 #9021 超出预估 15min', time: '12s ago', level: 'high' },
                { id: 'AL-02', type: '低电预警', msg: '设备 BAT-X02 电量 5%，位置: 静安', time: '45s ago', level: 'mid' },
                { id: 'AL-03', type: '聚集预警', msg: '朝阳大悦城站点 30+ 骑手聚集，单量积压', time: '1min ago', level: 'low' },
                { id: 'AL-04', type: '路径偏离', msg: '骑手 王强 未按规定路线配送', time: '3min ago', level: 'mid' },
              ].map(alert => (
                <div key={alert.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-left hover:border-slate-700 transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      alert.level === 'high' ? 'bg-red-500/20 text-red-400' :
                      alert.level === 'mid' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-[10px] text-slate-600 font-bold">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Live Map Simulation */}
        <div className="col-span-6 bg-slate-900/30 border border-slate-800 rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=2000')] opacity-10 grayscale brightness-50 contrast-125 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-110" />
          
          {/* Map Overlay UI */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Visual simulation of dots/routes */}
            <div className="relative w-full h-full">
               {[...Array(12)].map((_, i) => (
                 <div key={i} className="absolute animate-pulse" style={{
                   left: `${Math.random() * 80 + 10}%`,
                   top: `${Math.random() * 80 + 10}%`
                 }}>
                   <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#2563eb]" />
                 </div>
               ))}
               <div className="absolute top-1/4 left-1/3 p-4 bg-slate-950/80 backdrop-blur-md border border-blue-500/50 rounded-2xl shadow-2xl">
                 <div className="flex items-center gap-2 mb-2">
                   <Target className="text-blue-500" size={16} />
                   <span className="text-xs font-black">朝阳商圈实时负载</span>
                 </div>
                 <div className="space-y-1">
                   <div className="flex justify-between text-[10px] text-slate-400"><span>在岗运力</span><span>142人</span></div>
                   <div className="flex justify-between text-[10px] text-slate-400"><span>待配送单</span><span>358单</span></div>
                   <div className="h-1 w-32 bg-slate-800 rounded-full mt-2 overflow-hidden">
                     <div className="h-full w-4/5 bg-blue-500" />
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
            <div className="p-4 bg-slate-950/60 backdrop-blur border border-slate-800 rounded-2xl">
              <h4 className="text-[10px] font-black text-slate-500 mb-2 uppercase">全城热力指数</h4>
              <div className="flex gap-1 h-8 items-end">
                {[4,6,3,8,9,4,2,6,7,5].map((h, i) => (
                  <div key={i} className="w-2 bg-blue-500/50 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
               <button className="pointer-events-auto p-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"><Zap size={20} /></button>
               <button className="pointer-events-auto p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all border border-slate-700"><MapIcon size={20} /></button>
            </div>
          </div>
        </div>

        {/* Right Column: Performance Analysis */}
        <div className="col-span-3 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">实时订单/吞吐量</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLiveData}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="capacity" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4">
              <div className="text-left">
                <p className="text-[10px] text-slate-500 uppercase">当前需量</p>
                <p className="text-lg font-bold text-blue-400">700 单/h</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase">最大供给</p>
                <p className="text-lg font-bold text-green-400">680 单/h</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">节点计算资源</h3>
            <div className="space-y-4">
              {[
                { label: '核心调度集群', val: 78, status: 'ok' },
                { label: '边缘计算单元', val: 42, status: 'ok' },
                { label: 'AI 路径优化器', val: 91, status: 'heavy' },
              ].map((node, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">{node.label}</span>
                    <span className={node.status === 'heavy' ? 'text-orange-400' : 'text-blue-400'}>{node.val}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${node.status === 'heavy' ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${node.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-125 duration-700">
               <Cpu size={120} />
            </div>
            <h3 className="text-xs font-black text-blue-100 uppercase tracking-widest mb-1">系统全自动化指数</h3>
            <p className="text-3xl font-black text-white">94.2%</p>
            <p className="text-[10px] text-blue-100 mt-2">AI 智能接管中，人工介入比例: 5.8%</p>
          </div>
        </div>
      </main>

      {/* Footer Ticker */}
      <footer className="h-10 bg-blue-600 border-t border-blue-500 flex items-center overflow-hidden">
        <div className="flex items-center gap-10 px-10 whitespace-nowrap animate-marquee">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase text-white">
            <Bell size={12} /> 实时动态:
          </span>
          {[
            '#静安站点 录入新骑手 1名',
            '全城平均配送时效 28.4min',
            '今日累计配送单量突破 45,000',
            '异常天气预警：局部阵雨，请通知骑手注意安全',
            '浦东分部 完成周度运力达标 100%'
          ].map((text, i) => (
            <span key={i} className="text-[10px] font-bold text-blue-50">{text}</span>
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
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CommandCenter;
