
import React, { useMemo } from 'react';
import { 
  Users, Award, Package, TrendingUp, ChevronRight
} from 'lucide-react';
import { NavigationState, Rider } from '../types';

const StatCard = ({ title, value, change, icon: Icon, color, onClick, subValue }: any) => {
  const colorMap: any = {
    blue: "from-blue-500 to-indigo-500 shadow-blue-100 text-blue-600 bg-blue-50",
    indigo: "from-indigo-500 to-violet-500 shadow-indigo-100 text-indigo-600 bg-indigo-50",
    purple: "from-purple-500 to-fuchsia-500 shadow-purple-100 text-purple-600 bg-purple-50",
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div 
      onClick={onClick}
      className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(59,130,246,0.05)] transition-all active:scale-[0.98] group text-left relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3.5 rounded-2xl ${style.split(' ').slice(3).join(' ')} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {change && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${change.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
        {subValue && <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter opacity-70">{subValue}</span>}
      </div>
      
      {/* 背景装饰球 */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 blur-2xl ${style.split(' ').slice(3).join(' ')}`} />
    </div>
  );
};

interface DashboardProps {
  onNavigate: (view: NavigationState['view']) => void;
  riders: Rider[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, riders }) => {
  const qualifiedCount = useMemo(() => {
    const today = new Date();
    return riders.filter(rider => {
      const joinDate = new Date(rider.joinDate);
      const diffTime = Math.abs(today.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 30;
    }).length;
  }, [riders]);

  const totalDeliveries = useMemo(() => {
    return riders.reduce((acc, curr) => acc + (curr.deliveries || 0), 0);
  }, [riders]);

  const estimatedBonus = qualifiedCount * 3000;

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="mb-12 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <TrendingUp size={12} /> 实时运营分析
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">站点管理概览</h1>
        <p className="text-slate-400 font-medium">查看核心指标快照，管理您的骑手运力团队。</p>
      </header>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard 
          title="在职骑手人数" 
          value={riders.length.toLocaleString()} 
          change="+12.5%" 
          icon={Users} 
          color="blue" 
          onClick={() => onNavigate('riders')} 
        />
        <StatCard 
          title="全量配送总单量" 
          value={totalDeliveries.toLocaleString()} 
          change="+18.4%" 
          icon={Package} 
          color="indigo" 
          onClick={() => onNavigate('riders')} 
        />
        <StatCard 
          title="骑手留存达标" 
          value={qualifiedCount} 
          subValue={`预计返点: ¥${(estimatedBonus/10000).toFixed(1)}W`} 
          icon={Award} 
          color="purple" 
          onClick={() => onNavigate('riders')} 
        />
      </div>

      {/* 底部功能性引导 - 使用非常柔和的马卡龙渐变 */}
      <div className="bg-gradient-to-br from-[#f8faff] to-[#eef2ff] rounded-[3rem] p-16 flex flex-col items-start justify-center text-left relative overflow-hidden border border-white shadow-[0_20px_50px_rgba(59,130,246,0.03)]">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-4xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
            全链路数字化<br/>骑手资产管理
          </h3>
          <p className="text-slate-500 text-xl mb-10 leading-relaxed max-w-lg">
            从面试评审、背景调查到车辆资产动态绑定。RiderHub 致力于通过 AI 驱动的技术栈，降低您的运营损耗，提升人均出单效能。
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('recruitment')}
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/20 flex items-center gap-2"
            >
              处理面试申请 <ChevronRight size={18} />
            </button>
            <button 
              onClick={() => onNavigate('riders')}
              className="px-10 py-5 bg-white text-slate-600 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
            >
              查看在职档案
            </button>
          </div>
        </div>
        
        {/* 装饰性背景 */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-white rounded-full blur-[80px] opacity-60" />
        <div className="absolute left-[60%] top-[40%] w-[300px] h-[300px] bg-indigo-100 rounded-full blur-[100px] opacity-40" />
      </div>
    </div>
  );
};

export default Dashboard;
