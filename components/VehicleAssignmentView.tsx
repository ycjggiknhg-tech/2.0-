
import React, { useState, useMemo } from 'react';
import { 
  X, Bike, Zap, CheckCircle2, Search, ArrowRight, MapPin, 
  ArrowLeft, Building2, Globe, ShieldCheck, Battery, Tag, User, Box, Filter, AlertCircle,
  LayoutGrid, Layers, MousePointer2, Info
} from 'lucide-react';
import { Applicant, Device } from '../types';

interface VehicleAssignmentViewProps {
  applicant: Applicant;
  allVehicles: Device[];
  onClose: () => void;
  onConfirm: (deviceId: string) => void;
  onUpdateVehicle: (updatedVehicle: Device) => void;
  onUpdateDevices: (updatedDevices: Device[]) => void;
}

const VehicleAssignmentView: React.FC<VehicleAssignmentViewProps> = ({ applicant, allVehicles, onClose, onConfirm }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCity, setShowAllCity] = useState(false);
  const [brandFilter, setBrandFilter] = useState<string>('全部');

  // 获取当前可用品牌列表
  const brands = useMemo(() => {
    const b = new Set(allVehicles.filter(v => v.type === '电动车').map(v => v.brand || '未知'));
    return ['全部', ...Array.from(b)];
  }, [allVehicles]);

  // 优化后的极速搜索逻辑
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter(v => {
      if (v.type !== '电动车' || v.rider !== '未分配') return false;
      
      const matchesStation = v.station === applicant.station;
      const matchesCity = v.city === applicant.city;
      const isLocationMatch = showAllCity ? matchesCity : matchesStation;
      
      const matchesBrand = brandFilter === '全部' || v.brand === brandFilter;
      const matchesSearch = 
        v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (v.vin && v.vin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase());
        
      return isLocationMatch && matchesBrand && matchesSearch;
    });
  }, [allVehicles, applicant, showAllCity, brandFilter, searchQuery]);

  const selectedVehicle = useMemo(() => 
    allVehicles.find(v => v.id === selectedId), 
  [selectedId, allVehicles]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#f5f5f7] flex flex-col animate-in fade-in duration-500 font-sans">
      {/* 顶部超薄导航条 */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex justify-between items-center shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors group">
            <ArrowLeft size={18} className="text-slate-500 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-2" />
          <h1 className="text-sm font-black text-[#1d1d1f] tracking-tight flex items-center gap-2">
            资产指派终端 <span className="text-slate-300">/</span> 
            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{applicant.name}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">系统实时在线</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 左侧：极简应聘者卡片 */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shrink-0 text-left">
          <div className="mb-8">
            <div className="w-16 h-16 bg-[#1d1d1f] text-white rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-lg">
              {applicant.name.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-[#1d1d1f]">{applicant.name}</h2>
            <p className="text-xs text-slate-400 font-medium mb-4">{applicant.contact}</p>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase border border-emerald-100">
              <ShieldCheck size={12} /> 面试已通过
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">指派入职分站</p>
              <div className="flex items-start gap-2 text-sm font-bold text-[#1d1d1f]">
                <Building2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span>{applicant.station}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">经验背调</p>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">{applicant.experience}</p>
            </div>
          </div>
          
          <div className="mt-auto p-4 bg-blue-600 rounded-2xl text-white">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">当前步序</p>
            <p className="text-sm font-bold flex items-center gap-2">
              <Layers size={14} /> 绑定生产资料 (3/4)
            </p>
          </div>
        </aside>

        {/* 中间：全宽资产选择矩阵 */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#fbfbfd]">
          {/* 强化的控制条 */}
          <div className="px-8 py-6 bg-white border-b border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-black text-[#1d1d1f] tracking-tight">
                  {showAllCity ? `全城空闲资产阵列 (${applicant.city})` : `${applicant.station} 库房实存`}
                </h3>
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded">{filteredVehicles.length} 台可用</span>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                   <button 
                    onClick={() => setShowAllCity(false)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!showAllCity ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                   >
                     本站
                   </button>
                   <button 
                    onClick={() => setShowAllCity(true)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${showAllCity ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                   >
                     全城调配
                   </button>
                 </div>

                 <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      placeholder="快速定位编码、库位、VIN码..." 
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-600/10 outline-none transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
              </div>
            </div>

            {/* 品牌快捷过滤 */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <Filter size={14} className="text-slate-300 shrink-0" />
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => setBrandFilter(b)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                    brandFilter === b ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 高密度磁贴网格 */}
          <div className="flex-1 overflow-y-auto p-8 text-left">
            {filteredVehicles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                  <Box size={40} />
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">未找到匹配车辆</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  尝试更改搜索条件或切换到“全城调配”模式查找附近分站的闲置资产。
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {filteredVehicles.map(vehicle => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedId(vehicle.id)}
                    className={`relative p-5 rounded-3xl border-2 transition-all group cursor-pointer h-40 flex flex-col justify-between overflow-hidden ${
                      selectedId === vehicle.id 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-2xl shadow-blue-200 -translate-y-1' 
                        : 'border-white bg-white hover:border-blue-100 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex justify-between items-start relative z-10">
                      <div className={`p-2 rounded-xl ${selectedId === vehicle.id ? 'bg-white/20' : 'bg-slate-50 text-blue-600'}`}>
                        <Zap size={16} />
                      </div>
                      <div className={`text-[10px] font-black px-2 py-0.5 rounded ${selectedId === vehicle.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                        {vehicle.location}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <p className={`text-2xl font-black tracking-tighter mb-0.5 ${selectedId === vehicle.id ? 'text-white' : 'text-[#1d1d1f]'}`}>
                        {vehicle.code.split('-').pop()}
                      </p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${selectedId === vehicle.id ? 'text-white/70' : 'text-slate-400'}`}>
                        {vehicle.brand} · {vehicle.color}
                      </p>
                    </div>

                    {/* 跨站标记 */}
                    {vehicle.station !== applicant.station && (
                       <div className={`absolute bottom-0 right-0 left-0 py-1 text-center text-[8px] font-black uppercase ${selectedId === vehicle.id ? 'bg-white/10 text-white' : 'bg-orange-50 text-orange-600'}`}>
                         调配自: {vehicle.station}
                       </div>
                    )}
                    
                    {/* 装饰背景 */}
                    <Bike size={80} className={`absolute -right-6 -bottom-4 opacity-5 pointer-events-none transition-transform group-hover:scale-125 ${selectedId === vehicle.id ? 'text-white' : 'text-[#1d1d1f]'}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 右侧：紧凑确认区 */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
           <div className="flex-1 p-8 text-left">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">绑定确认</h4>
              
              {selectedVehicle ? (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-600 text-white rounded-xl">
                        <Bike size={20} />
                      </div>
                      <span className="text-lg font-black text-[#1d1d1f]">{selectedVehicle.code}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">品牌型号</span>
                        <span className="font-bold text-[#1d1d1f]">{selectedVehicle.brand}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">车架号</span>
                        <span className="font-bold text-[#1d1d1f] font-mono">{selectedVehicle.vin?.slice(-6)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => onConfirm(selectedVehicle.id)}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      确认交付 <ArrowRight size={18} />
                    </button>
                    <button 
                      onClick={() => onConfirm('skip')}
                      className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-[#1d1d1f]"
                    >
                      跳过资产直接入职
                    </button>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                    <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                      确认后系统将自动生成租赁电子合同，并同步资产库状态。
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <MousePointer2 size={32} strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                    请从左侧阵列中<br/>选择一台空闲车辆
                  </p>
                </div>
              )}
           </div>
        </aside>
      </main>
    </div>
  );
};

export default VehicleAssignmentView;
