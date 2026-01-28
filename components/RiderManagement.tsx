
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Filter, User, ChevronRight, Star, Bike, Activity } from 'lucide-react';
import { Rider, RiderStatus } from '../types';

interface RiderManagementProps {
  riders: Rider[];
  onSelectRider: (id: string) => void;
  onAction: (msg: string) => void;
}

const RiderManagement: React.FC<RiderManagementProps> = ({ riders, onSelectRider, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<'全部' | RiderStatus>('全部');

  const filteredRiders = useMemo(() => {
    return riders.filter(r => {
      const matchesSearch = r.name.includes(searchQuery) || r.contact.includes(searchQuery);
      const matchesStatus = activeStatus === '全部' || r.status === activeStatus;
      return matchesSearch && matchesStatus;
    });
  }, [riders, searchQuery, activeStatus]);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 text-left animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Personnel Archive</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">骑手档案管理</h1>
          <p className="text-slate-500 font-medium mt-1">全周期记录骑手从入职到离职的所有核心数据。</p>
        </div>
      </header>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="搜索姓名、联系方式..." 
            className="w-full pl-16 pr-8 py-5 apple-card shadow-sm border border-slate-100 outline-none text-base focus:ring-4 focus:ring-indigo-600/5 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           {['全部', RiderStatus.ACTIVE, RiderStatus.RESIGNED].map(status => (
             <button
               key={status}
               onClick={() => setActiveStatus(status as any)}
               className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${activeStatus === status ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               {status}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRiders.map(rider => (
          <div 
            key={rider.id}
            onClick={() => onSelectRider(rider.id)}
            className="apple-card p-6 apple-card-hover group cursor-pointer flex flex-col justify-between h-72 border border-slate-100"
          >
            <div className="flex justify-between items-start">
              <img src={rider.avatar} className="w-16 h-16 rounded-2xl bg-slate-50 ring-4 ring-slate-50" alt="" />
              <div className="flex flex-col items-end">
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 ${rider.status === RiderStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {rider.status}
                </div>
                <div className="flex items-center gap-1 text-indigo-600 font-black text-sm">
                   <Star size={14} fill="currentColor" /> {rider.rating.toFixed(1)}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{rider.name}</h3>
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 mt-2">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-indigo-600" /> {rider.station}</span>
                <span className="flex items-center gap-1.5"><Bike size={12} /> {rider.vehicleType.slice(0, 4)}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">入职日期</p>
                <p className="text-xs font-bold text-slate-700">{rider.joinDate}</p>
              </div>
              <button className="p-2 bg-slate-50 text-slate-300 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRiders.length === 0 && (
        <div className="py-32 text-center apple-card border-dashed border-slate-200 bg-slate-50/50">
          <User size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest">未找到匹配的骑手档案</p>
        </div>
      )}
    </div>
  );
};

export default RiderManagement;
