
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, Bike, Zap, CheckCircle2, Search, ArrowRight, MapPin, 
  Info, ArrowLeft, Edit3, Save, Building2, Globe, Edit2, 
  Check, Hash, Lock, ShieldCheck, Battery, Activity, Tag, Paintbrush,
  User, ShieldAlert, Fingerprint, Box
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
  
  const locationStats = useMemo(() => {
    const stats: Record<string, string[]> = {};
    allVehicles.forEach(v => {
      if (v.type !== '电动车') return;
      const city = v.city || '其他城市';
      const station = v.station || '默认站点';
      if (!stats[city]) stats[city] = [];
      if (!stats[city].includes(station)) stats[city].push(station);
    });
    return stats;
  }, [allVehicles]);

  const cities = Object.keys(locationStats);

  const [activeCity, setActiveCity] = useState<string>(() => {
    return cities.includes(applicant.city) ? applicant.city : (cities[0] || '北京');
  });
  const [activeStation, setActiveStation] = useState<string>('全部站点');

  const filteredVehicles = allVehicles.filter(v => {
    if (v.type !== '电动车') return false;
    const matchesCity = v.city === activeCity;
    const matchesStation = activeStation === '全部站点' || v.station === activeStation;
    const matchesSearch = 
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (v.vin && v.vin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.brand && v.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesStation && matchesSearch;
  });

  const selectedVehicle = useMemo(() => 
    allVehicles.find(v => v.id === selectedId), 
  [selectedId, allVehicles]);

  const handleSelect = (vehicle: Device) => {
    const isOccupied = vehicle.rider && vehicle.rider !== '未分配';
    if (!isOccupied) {
      setSelectedId(vehicle.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8fafc] flex flex-col animate-in fade-in duration-300">
      <header className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center shrink-0 shadow-sm text-left">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-90 group border border-slate-100">
            <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-left">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              资产绑定终端
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">站点：{applicant.station}</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-60">Physical Asset Mapping Terminal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-emerald-50 px-4 py-2 rounded-xl items-center gap-3 border border-emerald-100">
            <ShieldCheck size={16} className="text-emerald-600" />
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">请核对物理车牌与系统大架号</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all"><X size={24} /></button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex gap-6 p-6">
        {/* 左侧：区域选择 */}
        <div className="w-72 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0 text-left">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> 资产地理分布
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cities.map(city => (
              <div key={city} className="space-y-1">
                <button onClick={() => { setActiveCity(city); setActiveStation('全部站点'); }} className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl transition-all font-black text-xs text-left truncate ${activeCity === city ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Building2 size={16} className="shrink-0" /> <span className="truncate">{city}</span>
                </button>
                {activeCity === city && (
                  <div className="pl-4 space-y-1 mt-2 animate-in slide-in-from-top-2">
                    <button onClick={() => setActiveStation('全部站点')} className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeStation === '全部站点' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}>全部站点</button>
                    {locationStats[city].map(station => (
                      <button key={station} onClick={() => setActiveStation(station)} className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-black transition-all truncate ${activeStation === station ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}>
                        {station}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 中间：资产列表 */}
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{activeCity} · {activeStation}</h2>
              <span className="bg-slate-200 text-slate-500 text-[9px] px-2 py-0.5 rounded-lg font-black">{filteredVehicles.filter(v => v.rider === '未分配').length} 待选</span>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input type="text" placeholder="搜索大架号、编号、品牌..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filteredVehicles.map(vehicle => {
                const isOccupied = vehicle.rider && vehicle.rider !== '未分配';
                const isSelected = selectedId === vehicle.id;
                
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => handleSelect(vehicle)}
                    className={`p-5 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                      isOccupied ? 'bg-slate-50 border-slate-100 opacity-60 grayscale cursor-not-allowed' :
                      isSelected ? 'bg-white border-blue-600 shadow-xl shadow-blue-50 -translate-y-1.5' :
                      'bg-white border-white hover:border-blue-100 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                        <Bike size={18} />
                      </div>
                      {isSelected && <CheckCircle2 size={20} className="text-blue-600 animate-in zoom-in" />}
                    </div>

                    <div className="relative z-10 space-y-1">
                      <p className={`text-lg font-black tracking-tight ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>{vehicle.code}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                          {vehicle.brand} · {vehicle.color}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[9px] font-black text-slate-400"># {vehicle.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧：详情面板 - 核心修复点：增加了 overflow-y-auto 确保不被遮挡 */}
        <div className="w-[440px] flex flex-col gap-6 shrink-0 text-left overflow-y-auto pr-2 scrollbar-thin">
          {/* 骑手概览卡片 */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm shrink-0">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">目标绑定骑手</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-blue-100">{applicant.name.charAt(0)}</div>
              <div>
                <p className="text-lg font-black text-slate-900 tracking-tight">{applicant.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-md border border-blue-100">待入职分配</span>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{applicant.station}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 资产全量信息卡片 */}
          <div className={`rounded-[2.5rem] p-8 transition-all duration-500 relative overflow-hidden flex flex-col min-h-[500px] border-2 ${
            selectedVehicle 
              ? 'bg-white border-blue-600 shadow-[0_30px_60px_rgba(37,99,235,0.08)]' 
              : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-400 justify-center items-center text-center'
          }`}>
            {selectedVehicle ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative z-10 h-full">
                <header className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <Fingerprint size={14} className="text-blue-500" />
                       <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">资产识别档案</p>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedVehicle.code}</h3>
                    <div className="flex gap-2">
                       <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded uppercase tracking-widest">内部编号: {selectedVehicle.location}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <Bike size={32} className="text-blue-600" />
                  </div>
                </header>

                {/* 核心字段展示 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      <Tag size={12} className="text-blue-400" /> 品牌型号
                    </div>
                    <p className="text-sm font-black text-slate-900">{selectedVehicle.brand}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      <Paintbrush size={12} className="text-blue-400" /> 外观颜色
                    </div>
                    <p className="text-sm font-black text-slate-900">{selectedVehicle.color}</p>
                  </div>
                </div>

                {/* 车架号 VIN 重点展示 */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">车辆大架号 (VIN IDENTIFIER)</p>
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded uppercase border border-emerald-100">可绑定</span>
                   </div>
                   <div className="bg-slate-900 text-blue-400 px-5 py-4 rounded-2xl font-mono text-base font-bold tracking-[0.05em] shadow-inner flex justify-between items-center group overflow-hidden">
                      <span className="truncate">{selectedVehicle.vin}</span>
                      <ShieldAlert size={18} className="text-blue-500/50 shrink-0 ml-4" />
                   </div>
                </div>

                {/* 状态与 IoT 信息 */}
                <div className="bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100 space-y-4">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest">资产绑定逻辑状态</h4>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                         <User size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">当前持有状态</p>
                         <p className="text-xs font-black text-blue-700">
                            {selectedVehicle.rider === '未分配' ? '库房待机 · 未绑定骑手' : selectedVehicle.rider}
                         </p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-blue-100">
                         <Battery size={12} className="text-emerald-500" />
                         <span className="text-[10px] font-black text-emerald-600">92%</span>
                      </div>
                   </div>
                   <p className="text-[10px] text-blue-500/70 font-bold bg-white/60 p-2.5 rounded-xl text-center italic leading-relaxed">
                      核对无误后点击下方按钮，系统将自动建立此车辆与骑手 {applicant.name} 的数字绑定关系。
                   </p>
                </div>

                {/* 装饰图层 */}
                <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-50 rounded-full blur-[80px] opacity-30 pointer-events-none" />
              </div>
            ) : (
              <div className="space-y-4 max-w-[240px]">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Box size={40} className="text-slate-300" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 leading-relaxed">
                  请从中间列表中<br/>选中一辆“待分配”资产
                </p>
              </div>
            )}
          </div>

          {/* 操作中心 */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm shrink-0 mb-4">
            <div className="space-y-3">
              <button 
                disabled={!selectedId} 
                onClick={() => selectedId && onConfirm(selectedId)} 
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
              >
                完成档案绑定并入职 <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => onConfirm('skip')} 
                className="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                跳过车辆绑定 (稍后补录)
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest mt-4">确认即代表该员工已领取实物资产</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehicleAssignmentView;
