
import React, { useMemo } from 'react';
import { 
  Users, Award, ChevronRight, ArrowUpRight, ShieldCheck, Zap
} from 'lucide-react';
import { NavigationState, Rider } from '../types';

const BentoCard = ({ title, value, label, icon: Icon, onClick, className }: any) => (
  <div 
    onClick={onClick}
    className={`apple-card apple-card-hover p-10 cursor-pointer flex flex-col justify-between group ${className}`}
  >
    <div className="flex justify-between items-start">
      <div className="p-4 rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] group-hover:bg-[#0071e3] group-hover:text-white transition-all duration-300">
        <Icon size={24} />
      </div>
      <ArrowUpRight size={20} className="text-[#d2d2d7] group-hover:text-[#0071e3] transition-colors" />
    </div>
    <div className="mt-8 text-left">
      <h3 className="text-[#86868b] text-sm font-semibold uppercase tracking-widest mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-bold tracking-tight text-[#1d1d1f]">{value}</span>
        {label && <span className="text-sm font-medium text-[#86868b]">{label}</span>}
      </div>
    </div>
  </div>
);

interface DashboardProps {
  onNavigate: (view: NavigationState['view']) => void;
  riders: Rider[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, riders }) => {
  const qualifiedCount = useMemo(() => {
    const today = new Date();
    return riders.filter(rider => {
      const joinDate = new Date(rider.joinDate);
      const diffDays = Math.ceil(Math.abs(today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 30;
    }).length;
  }, [riders]);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      <header className="text-left animate-fade-up">
        <p className="text-[#0071e3] font-bold text-sm tracking-widest uppercase mb-3">RiderHub Core</p>
        <h1 className="text-6xl font-bold text-[#1d1d1f] tracking-tight mb-6">更智能的人力管理。</h1>
        <p className="text-2xl text-[#86868b] font-medium leading-relaxed max-w-3xl">
          数字化您的物流运力资产。每一位骑手的生命周期，从招聘到分车，现在都触手可及。
        </p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <BentoCard 
          title="在职人数" 
          value={riders.length} 
          label="活跃" 
          icon={Users} 
          onClick={() => onNavigate('riders')}
          className="md:col-span-1"
        />
        <BentoCard 
          title="留存指标" 
          value={qualifiedCount} 
          label="已达标 (30天)" 
          icon={Award} 
          onClick={() => onNavigate('finance')}
          className="md:col-span-1"
        />
        <div className="apple-card apple-card-hover md:col-span-1 p-10 bg-[#0071e3] text-white flex flex-col justify-between group">
           <div className="flex justify-between items-start">
              <Zap size={32} />
              <ShieldCheck size={20} className="text-white/50" />
           </div>
           <div className="text-left">
              <h3 className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">系统合规性</h3>
              <p className="text-4xl font-bold tracking-tight mb-2">99.8%</p>
              <p className="text-sm font-medium text-white/60">通过 AI 自动背调</p>
           </div>
        </div>
      </div>

      {/* Feature Banner */}
      <div className="apple-card apple-card-hover overflow-hidden grid grid-cols-1 lg:grid-cols-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-16 flex flex-col justify-center text-left">
          <h2 className="text-4xl font-bold text-[#1d1d1f] mb-8 leading-tight tracking-tight">
            全自动入职流水线。<br/>告别繁琐纸质文档。
          </h2>
          <p className="text-[#86868b] text-xl mb-12 leading-relaxed">
            集成身份证扫描与 AI 潜力分析。RiderHub 为您的站点经理节省 70% 的行政处理时间。
          </p>
          <div className="flex gap-5">
            <button 
              onClick={() => onNavigate('recruitment')}
              className="apple-btn-primary px-10 py-4 text-sm flex items-center gap-2"
            >
              启动招聘 <ChevronRight size={18} />
            </button>
            <button 
              onClick={() => onNavigate('devices')}
              className="apple-btn-secondary px-10 py-4 text-sm"
            >
              资产巡检
            </button>
          </div>
        </div>
        <div className="bg-[#f5f5f7] relative p-12 flex items-center justify-center">
            <div className="w-full aspect-[4/3] bg-white rounded-[2.5rem] shadow-2xl p-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
               <div className="flex items-center gap-3 mb-10">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
               </div>
               <div className="space-y-6">
                  <div className="h-2 w-1/3 bg-[#f5f5f7] rounded-full" />
                  <div className="h-2 w-full bg-[#f5f5f7] rounded-full" />
                  <div className="h-2 w-2/3 bg-[#f5f5f7] rounded-full" />
                  <div className="pt-10 flex gap-4">
                     <div className="h-24 flex-1 bg-[#f5f5f7] rounded-2xl" />
                     <div className="h-24 flex-1 bg-[#f5f5f7] rounded-2xl" />
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
