
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Mail, Phone, MapPin, Bike, 
  Zap, Calendar, Award, Clock, ShieldCheck, DollarSign, ChevronRight,
  TrendingUp, Search, History, ChevronDown, CalendarCheck, Package, Activity, Star
} from 'lucide-react';
import { Rider, RiderStatus } from '../types';

interface RiderDetailProps {
  rider: Rider;
  onBack: () => void;
  onAction: (msg: string) => void;
  onUpdateRider: (rider: Rider) => void;
}

const InfoBlock = ({ label, value, subValue, icon: Icon }: any) => (
  <div className="text-left flex gap-4">
    {Icon && <div className="p-3 bg-slate-50 rounded-xl text-indigo-600 h-fit mt-1"><Icon size={18} /></div>}
    <div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-base font-bold text-slate-900">{value}</p>
      {subValue && <p className="text-xs text-slate-400 mt-1 font-medium">{subValue}</p>}
    </div>
  </div>
);

const RiderDetail: React.FC<RiderDetailProps> = ({ rider, onBack, onAction, onUpdateRider }) => {
  const [tempDate, setTempDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  const selectedRecord = useMemo(() => {
    if (!filterDate) return null;
    return rider.activityHistory.find(a => a.date === filterDate);
  }, [rider.activityHistory, filterDate]);

  const stats = useMemo(() => {
    const totalEarnings = rider.activityHistory.reduce((acc, curr) => acc + curr.earnings, 0);
    const avgEarnings = rider.activityHistory.length > 0 ? Math.round(totalEarnings / rider.activityHistory.length) : 0;
    return { totalEarnings, avgEarnings };
  }, [rider]);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 text-left">
      <header className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm group transition-all">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 返回档案列表
        </button>
        <div className="flex gap-4">
          <button onClick={() => onAction('报表已生成')} className="px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all">导出月度汇总</button>
          <button onClick={() => onAction('状态变更中...')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">管理状态</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="apple-card p-10 flex flex-col items-center text-center border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 scale-150 text-indigo-900">
               <Bike size={180} />
            </div>
            <img src={rider.avatar} className="w-32 h-32 rounded-[2.5rem] bg-slate-50 mb-8 ring-8 ring-slate-50 relative z-10" alt="" />
            <div className="relative z-10">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">{rider.name}</h2>
               <div className="flex items-center justify-center gap-2 text-indigo-600 font-black text-sm mt-2">
                 <Star size={14} fill="currentColor" /> {rider.rating.toFixed(1)} <span className="text-slate-300 mx-1">|</span> <span className="text-slate-400 uppercase tracking-widest text-[10px]">Star Rider</span>
               </div>
            </div>

            <div className="w-full space-y-8 pt-12 mt-12 border-t border-slate-50 relative z-10">
              <InfoBlock label="在职站点" value={rider.station} icon={MapPin} />
              <InfoBlock label="绑定手机" value={rider.contact} icon={Phone} />
              <InfoBlock label="当前车型" value={rider.vehicleType} icon={Bike} />
              <InfoBlock label="入职时间" value={rider.joinDate} icon={Calendar} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="apple-card p-8 bg-indigo-600 text-white shadow-xl shadow-indigo-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">历史累计总收益</p>
              <h3 className="text-4xl font-black tracking-tighter">¥{stats.totalEarnings.toLocaleString()}</h3>
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-indigo-100">
                 <Activity size={14} /> 累计配送完单 {Math.floor(stats.totalEarnings / 8)}
              </div>
            </div>
            <div className="apple-card p-8 bg-white border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">日均配送收益</p>
              <h3 className="text-4xl font-black tracking-tighter text-slate-900">¥{stats.avgEarnings}</h3>
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-500">
                 <TrendingUp size={14} /> 效率超过 84% 的骑手
              </div>
            </div>
          </div>

          <div className="apple-card p-10 bg-white border border-slate-100">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <History size={20} className="text-indigo-600" /> 单兵履约详单回溯
                  </h3>
                  <p className="text-slate-400 text-xs font-medium mt-1">精准调取任意日期的履约收益明细。</p>
                </div>
                <div className="flex gap-2">
                   <input 
                     type="date" 
                     className="bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold outline-none border border-slate-100 focus:border-indigo-600 transition-all"
                     value={tempDate}
                     onChange={e => setTempDate(e.target.value)}
                   />
                   <button 
                     onClick={() => { setFilterDate(tempDate); onAction(`📍 正在调取 ${tempDate} 详单...`); }}
                     className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                   >
                     调取
                   </button>
                </div>
             </div>

             {selectedRecord ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex items-center justify-between">
                      <div><p className="text-[10px] font-black text-indigo-600 uppercase mb-1">当日收益</p><p className="text-4xl font-black text-indigo-900 tracking-tighter">¥{selectedRecord.earnings}</p></div>
                      <DollarSign className="text-indigo-200" size={48} />
                   </div>
                   <div className="p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 flex items-center justify-between">
                      <div><p className="text-[10px] font-black text-emerald-600 uppercase mb-1">估算单量</p><p className="text-4xl font-black text-emerald-900 tracking-tighter">{Math.floor(selectedRecord.earnings / 8)} 单</p></div>
                      <Package className="text-emerald-200" size={48} />
                   </div>
                </div>
             ) : (
                <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                   <History size={32} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-xs font-bold text-slate-400">请在上方选择日期并点击“调取”进行数据分析</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDetail;
