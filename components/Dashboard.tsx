
import React, { useMemo } from 'react';
import { 
  Users, Award, ChevronRight, ArrowUpRight, ClipboardList, Zap, ShieldCheck, 
  TrendingUp, BarChart3, MapPin, MessageCircle, MoreHorizontal, Activity, Layers
} from 'lucide-react';
import { NavigationState, Rider, Applicant } from '../types';

const MetricCard = ({ title, value, label, icon: Icon, onClick, trend, colorClass = "text-indigo-600" }: any) => (
  <div 
    onClick={onClick}
    className="apple-card p-6 apple-card-hover cursor-pointer group h-44 flex flex-col justify-between border border-slate-100"
  >
    <div className="flex justify-between items-start">
      <div className={`p-3 bg-slate-50 rounded-2xl ${colorClass} group-hover:bg-indigo-600 group-hover:text-white transition-all border border-transparent group-hover:border-slate-100 shadow-sm`}>
        <Icon size={22} />
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={10} /> {trend}%
        </span>
      )}
    </div>
    <div className="text-left">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
        <span className="text-xs font-bold text-slate-400">{label}</span>
      </div>
    </div>
  </div>
);

interface DashboardProps {
  onNavigate: (view: NavigationState['view']) => void;
  riders: Rider[];
  applicants: Applicant[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, riders, applicants }) => {
  const stats = useMemo(() => {
    const today = new Date();
    const qualified = riders.filter(r => {
      const join = new Date(r.joinDate);
      return Math.ceil(Math.abs(today.getTime() - join.getTime()) / (1000 * 60 * 60 * 24)) >= 30;
    }).length;
    return {
      total: riders.length,
      qualified,
      pending: applicants.filter(a => a.status === '待处理').length
    };
  }, [riders, applicants]);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 text-left animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Operations Management
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">运营概览</h1>
          <p className="text-slate-500 font-medium mt-1">全局数字化视野，实时监控招聘流水线与运力负载。</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => onNavigate('finance')} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[12px] font-bold hover:bg-slate-50 transition-all shadow-sm">对账结算</button>
           <button onClick={() => onNavigate('recruitment')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[12px] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">招聘增补</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="在职骑手" value={stats.total} label="当前车队规模" icon={Users} trend={4.2} onClick={() => onNavigate('riders')} />
        <MetricCard title="留存达标" value={stats.qualified} label="已过30天观察期" icon={ShieldCheck} trend={12} colorClass="text-emerald-600" onClick={() => onNavigate('finance')} />
        <MetricCard title="面试池" value={stats.pending} label="待评估申请" icon={ClipboardList} onClick={() => onNavigate('recruitment')} />
        <MetricCard title="资产负荷" value={stats.total} label="在线载具" icon={Zap} colorClass="text-indigo-600" onClick={() => onNavigate('devices')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 apple-card p-10 flex flex-col border border-slate-100">
            <div className="flex justify-between items-center mb-10">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-indigo-600"><MapPin size={20} /></div>
                  <div><h3 className="text-lg font-bold text-slate-900 tracking-tight">各分站运力热图</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fleet Distribution Matrix</p></div>
               </div>
               <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><MoreHorizontal size={20}/></button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
               {[
                 { name: '朝阳三里屯站', cap: '94%', count: 42, color: 'bg-emerald-500' },
                 { name: '静安寺站', cap: '62%', count: 28, color: 'bg-indigo-600' },
                 { name: '南山科技园站', cap: '88%', count: 56, color: 'bg-indigo-600' },
                 { name: '武林广场站', cap: '32%', count: 14, color: 'bg-indigo-400' }
               ].map((site, i) => (
                 <div key={i} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div><p className="text-sm font-bold text-slate-900">{site.name}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{site.count} Units Active</p></div>
                      <div className="p-1.5 rounded-lg text-slate-200 group-hover:text-indigo-600 transition-colors"><Activity size={16} /></div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between text-xs font-black text-slate-700"><span className="text-slate-400 uppercase tracking-tighter">Utilization</span><span>{site.cap}</span></div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${site.color} opacity-90 rounded-full transition-all duration-1000`} style={{ width: site.cap }} />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex-1 flex flex-col justify-between shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-[0.05] rotate-12 scale-150"><MessageCircle size={180} /></div>
               <div className="relative z-10">
                  <div className="p-3 bg-white/10 rounded-2xl w-fit mb-8 backdrop-blur-md"><Layers size={24} className="text-indigo-400" /></div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-indigo-400">AI Intelligence</h3>
                  <p className="text-2xl font-bold leading-tight tracking-tight">RiderHub AI 已就绪。<br/>随时为您分析运营策略。</p>
               </div>
               <button onClick={() => onNavigate('ai-consultant')} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[12px] font-bold uppercase tracking-[0.2em] transition-all mt-10 relative z-10 shadow-xl shadow-indigo-900/40 active:scale-95">对话 AI 专家</button>
            </div>
            
            <div className="apple-card p-10 border border-slate-100 flex flex-col justify-between">
               <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2"><BarChart3 size={14} className="text-indigo-600" /> Financial Report</h3>
                  <div className="space-y-6">
                     <div className="flex justify-between items-end"><span className="text-xs font-bold text-slate-500">本月待结算</span><span className="text-2xl font-black text-slate-900 tracking-tighter">¥142,000</span></div>
                     <div className="h-px bg-slate-50" />
                     <div className="flex justify-between items-end"><span className="text-xs font-bold text-slate-500">本月已支出</span><span className="text-2xl font-black text-emerald-600 tracking-tighter">¥28,400</span></div>
                  </div>
               </div>
               <button onClick={() => onNavigate('finance')} className="mt-8 text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">前往对账中心 <ChevronRight size={14} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
