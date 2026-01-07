
import React, { useState, useMemo } from 'react';
import { X, Bike, Zap, CheckCircle2, Search, ArrowRight, ShieldCheck, MapPin, Info, ArrowLeft, Edit3, Save, ChevronRight, Building2, Globe } from 'lucide-react';
import { Applicant } from '../types';

interface VehicleAssignmentViewProps {
  applicant: Applicant;
  allVehicles: any[];
  onClose: () => void;
  onConfirm: (deviceId: string) => void;
  onUpdateVehicle: (updatedVehicle: any) => void;
}

const VehicleAssignmentView: React.FC<VehicleAssignmentViewProps> = ({ applicant, allVehicles, onClose, onConfirm, onUpdateVehicle }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  // 地理分类状态
  const [activeCity, setActiveCity] = useState<string>(applicant.city);
  const [activeStation, setActiveStation] = useState<string>('全部站点');

  // 解析所有车辆的地理位置分布 (Mock数据解析逻辑)
  const locationStats = useMemo(() => {
    const stats: Record<string, string[]> = {};
    allVehicles.forEach(v => {
      if (v.type !== '电动车') return;
      // 假设从 location 字符串中推断城市和站点
      // 实际生产环境中这应该是字段，这里我们做简单的推断
      const city = v.location.includes('北京') || v.location.includes('朝阳') ? '北京' : '上海';
      const station = v.location.includes('三里屯') ? '三里屯站' : 
                      v.location.includes('静安') ? '静安寺站' : '其他站点';
      
      if (!stats[city]) stats[city] = [];
      if (!stats[city].includes(station)) stats[city].push(station);
    });
    return stats;
  }, [allVehicles]);

  const cities = Object.keys(locationStats);

  const filteredVehicles = allVehicles.filter(v => {
    if (v.type !== '电动车') return false;
    
    // 地理过滤
    const vCity = v.location.includes('北京') || v.location.includes('朝阳') ? '北京' : '上海';
    const vStation = v.location.includes('三里屯') ? '三里屯站' : 
                     v.location.includes('静安') ? '静安寺站' : '其他站点';
    
    const matchesCity = vCity === activeCity;
    const matchesStation = activeStation === '全部站点' || vStation === activeStation;
    
    // 搜索过滤
    const matchesSearch = v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.location.includes(searchQuery) ||
                         (v.rider && v.rider.includes(searchQuery));

    return matchesCity && matchesStation && matchesSearch;
  });

  const handleStartEdit = (e: React.MouseEvent, vehicle: any) => {
    e.stopPropagation();
    setEditingId(vehicle.id);
    setEditForm({ ...vehicle });
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editForm) {
      onUpdateVehicle(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col animate-in fade-in duration-300">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-90 group">
            <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-left">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              入职分车：{applicant.name}
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100">面试已通过</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Step 2: Fleet Allocation & Asset Binding</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-blue-100">
            <Info size={16} className="text-blue-600" />
            <p className="text-xs font-bold text-blue-700">请按城市站点筛选并选择可用车辆。点击左侧列表切换区域。</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all"><X size={24} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex gap-6 p-6">
        
        {/* 地理分类侧边栏 */}
        <div className="w-64 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> 区域车队导航
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cities.map(city => (
              <div key={city} className="space-y-1 text-left">
                <button 
                  onClick={() => { setActiveCity(city); setActiveStation('全部站点'); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-black text-sm ${
                    activeCity === city ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={16} /> {city}
                  </div>
                  <ChevronRight size={14} className={activeCity === city ? 'rotate-90 transition-transform' : ''} />
                </button>
                
                {activeCity === city && (
                  <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={() => setActiveStation('全部站点')}
                      className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeStation === '全部站点' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      全部站点
                    </button>
                    {locationStats[city].map(station => (
                      <button 
                        key={station}
                        onClick={() => setActiveStation(station)}
                        className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          activeStation === station ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {station}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center: Fleet Grid */}
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{activeCity} · {activeStation}</h2>
              <span className="bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded font-black">{filteredVehicles.length} 辆</span>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索车牌、使用者或地点..." 
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {filteredVehicles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-60">
                <div className="p-8 bg-slate-50 rounded-[3rem]">
                  <Bike size={64} />
                </div>
                <p className="font-black">该区域内暂无可用车辆信息</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => {
                  const isOccupied = vehicle.rider && vehicle.rider !== '未分配';
                  const isSelected = selectedId === vehicle.id;
                  const isEditing = editingId === vehicle.id;
                  
                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => !isEditing && !isOccupied && setSelectedId(vehicle.id)}
                      className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group cursor-pointer ${
                        isOccupied && !isEditing
                          ? 'bg-slate-50 border-slate-100 opacity-60' 
                          : isSelected 
                            ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-200 -translate-y-1' 
                            : 'bg-white border-slate-100 hover:border-blue-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`p-3 rounded-2xl ${isSelected ? 'bg-white/20 text-white' : isOccupied ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                          <Bike size={20} />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <button 
                              onClick={handleSaveEdit}
                              className="p-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 active:scale-95 transition-all"
                            >
                              <Save size={14} />
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => handleStartEdit(e, vehicle)}
                              className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-600'}`}
                            >
                              <Edit3 size={14} />
                            </button>
                          )}
                          {isSelected && !isEditing && <CheckCircle2 size={24} className="text-white animate-in zoom-in" />}
                          {isOccupied && !isSelected && !isEditing && <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-200 px-2 py-1 rounded">使用中</span>}
                        </div>
                      </div>

                      <div className="relative z-10 space-y-2">
                        {isEditing ? (
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400">资产编号</label>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-900"
                              value={editForm.code}
                              onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                            />
                          </div>
                        ) : (
                          <p className={`text-xl font-black tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{vehicle.code}</p>
                        )}

                        {isEditing ? (
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400">当前位置</label>
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900"
                              value={editForm.location}
                              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            />
                          </div>
                        ) : (
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            <MapPin size={12} /> {vehicle.location}
                          </div>
                        )}
                      </div>

                      <div className={`mt-6 pt-4 border-t relative z-10 ${isSelected ? 'border-white/10' : 'border-slate-50'}`}>
                         <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>当前使用者</p>
                         {isEditing ? (
                            <input 
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 mt-1"
                              value={editForm.rider}
                              onChange={(e) => setEditForm({ ...editForm, rider: e.target.value })}
                            />
                         ) : (
                            <p className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : isOccupied ? 'text-slate-800' : 'text-green-600'}`}>
                              {isOccupied ? vehicle.rider : '✅ 可供分配'}
                            </p>
                         )}
                      </div>

                      <div className={`absolute -right-6 -bottom-6 opacity-[0.03] transition-transform duration-1000 ${isSelected ? 'scale-150 rotate-12 opacity-[0.08] text-white' : ''}`}>
                        <Bike size={140} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Assignment Summary Panel */}
        <div className="w-80 flex flex-col gap-6 shrink-0 text-left">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-left">入职确认单预览</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-2xl text-white backdrop-blur-md">
                    {applicant.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black">{applicant.name}</p>
                    <p className="text-xs text-slate-400">{applicant.station}</p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-4 text-left">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">拟分配车辆</p>
                    {selectedId ? (
                      <div className="flex items-center gap-2 text-blue-400">
                        <Zap size={16} />
                        <span className="font-black text-lg">{allVehicles.find(v => v.id === selectedId)?.code}</span>
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-slate-600 italic">尚未选择车辆...</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">联系电话</p>
                    <p className="text-sm font-bold">{applicant.contact}</p>
                  </div>
                </div>
              </div>
            </div>
            <Zap className="absolute -right-12 -bottom-12 w-48 h-48 text-white opacity-[0.02]" />
          </div>

          <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">资产绑定说明</h4>
              <ul className="space-y-3">
                <li className="flex gap-2 text-xs text-slate-500">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5" />
                  您可以按城市站点查找车辆。
                </li>
                <li className="flex gap-2 text-xs text-slate-500">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5" />
                  已分配（使用中）的车辆默认不可再次绑定。
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button 
                disabled={!selectedId}
                onClick={() => selectedId && onConfirm(selectedId)}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none"
              >
                确认绑定并完成入职 <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onConfirm('skip')}
                className="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              >
                跳过资产分配
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehicleAssignmentView;
