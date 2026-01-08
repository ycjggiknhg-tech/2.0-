
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Bike, Zap, CheckCircle2, Search, ArrowRight, MapPin, Info, ArrowLeft, Edit3, Save, Building2, Globe, Edit2, Check } from 'lucide-react';
import { Applicant } from '../types';

interface VehicleAssignmentViewProps {
  applicant: Applicant;
  allVehicles: any[];
  onClose: () => void;
  onConfirm: (deviceId: string) => void;
  onUpdateVehicle: (updatedVehicle: any) => void;
  onUpdateDevices: (updatedDevices: any[]) => void;
}

interface RenameState {
  type: 'city' | 'station';
  oldValue: string;
  currentValue: string;
  cityContext?: string;
}

const VehicleAssignmentView: React.FC<VehicleAssignmentViewProps> = ({ applicant, allVehicles, onClose, onConfirm, onUpdateVehicle, onUpdateDevices }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  
  const [renameState, setRenameState] = useState<RenameState | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const locationStats = useMemo(() => {
    const stats: Record<string, string[]> = {};
    allVehicles.forEach(v => {
      if (v.type !== '电动车') return;
      const parts = (v.location || '').trim().split(/\s+/);
      const city = parts[0] || '未知城市';
      const station = parts[1] || '其他站点';
      
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

  useEffect(() => {
    if (renameState && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renameState]);

  const filteredVehicles = allVehicles.filter(v => {
    if (v.type !== '电动车') return false;
    
    const parts = (v.location || '').trim().split(/\s+/);
    const vCity = parts[0] || '未知城市';
    const vStation = parts[1] || '其他站点';
    
    const matchesCity = vCity === activeCity;
    const matchesStation = activeStation === '全部站点' || vStation === activeStation;
    
    const matchesSearch = v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.location.includes(searchQuery) ||
                         (v.rider && v.rider.includes(searchQuery));

    return matchesCity && matchesStation && matchesSearch;
  });

  const commitRename = () => {
    if (!renameState) return;
    const { type, oldValue, currentValue, cityContext } = renameState;
    const trimmedNew = currentValue.trim();

    if (!trimmedNew || trimmedNew === oldValue) {
      setRenameState(null);
      return;
    }

    const updates: any[] = [];
    allVehicles.forEach(v => {
      const parts = (v.location || '').trim().split(/\s+/);
      if (type === 'city' && parts[0] === oldValue) {
        parts[0] = trimmedNew;
        updates.push({ ...v, location: parts.join(' ') });
      } else if (type === 'station' && parts[0] === cityContext && (parts[1] === oldValue || (!parts[1] && oldValue === '其他站点'))) {
        parts[1] = trimmedNew;
        updates.push({ ...v, location: parts.join(' ') });
      }
    });

    if (updates.length > 0) {
      onUpdateDevices(updates);
      if (type === 'city' && activeCity === oldValue) setActiveCity(trimmedNew);
      if (type === 'station' && activeStation === oldValue) setActiveStation(trimmedNew);
    }
    setRenameState(null);
  };

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
      <header className="bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center shrink-0 shadow-sm text-left">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all active:scale-90 group">
            <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-left">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              入职分车：{applicant.name}
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100">结论符合</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Asset Distribution Control Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-blue-100">
            <Info size={16} className="text-blue-600" />
            <p className="text-xs font-bold text-blue-700">重命名后回车保存。修改地理位置不会改变物理归属。</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-all"><X size={24} /></button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex gap-6 p-6">
        <div className="w-80 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0 text-left">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> 区域车队导航
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cities.map(city => {
              const isRenamingCity = renameState?.type === 'city' && renameState?.oldValue === city;
              
              return (
                <div key={city} className="space-y-1">
                  <div className="flex items-stretch gap-1 group">
                    <div className="flex-1 min-w-0">
                      {isRenamingCity ? (
                        <div 
                          onMouseDown={e => e.stopPropagation()} 
                          onClick={e => e.stopPropagation()} 
                          className="flex items-center bg-white border-2 border-blue-600 rounded-2xl overflow-hidden px-2 py-2 shadow-lg shadow-blue-100 animate-in zoom-in-95"
                        >
                          <input
                            ref={renameInputRef}
                            className="bg-transparent border-none outline-none w-full text-sm font-black text-blue-700 placeholder-blue-300"
                            value={renameState.currentValue}
                            onChange={(e) => setRenameState({ ...renameState, currentValue: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitRename();
                              if (e.key === 'Escape') setRenameState(null);
                            }}
                            autoComplete="off"
                            spellCheck={false}
                          />
                          <button onClick={commitRename} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Check size={14} /></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setActiveCity(city); setActiveStation('全部站点'); }}
                          className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl transition-all font-black text-sm text-left truncate ${
                            activeCity === city ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Building2 size={16} className="shrink-0" /> <span className="truncate">{city}</span>
                        </button>
                      )}
                    </div>
                    {!isRenamingCity && (
                      <button 
                        title="修改城市名称"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setRenameState({ type: 'city', oldValue: city, currentValue: city });
                        }}
                        className={`w-12 shrink-0 flex items-center justify-center rounded-2xl transition-all z-[60] ${
                          activeCity === city 
                            ? 'text-white/40 hover:text-white hover:bg-white/10' 
                            : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </div>
                  
                  {activeCity === city && (
                    <div className="pl-4 space-y-1 mt-2 animate-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => setActiveStation('全部站点')}
                        className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all mb-1 ${
                          activeStation === '全部站点' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        全部站点
                      </button>
                      {locationStats[city].map(station => {
                        const isRenamingStation = renameState?.type === 'station' && renameState?.oldValue === station && renameState?.cityContext === city;
                        
                        return (
                          <div key={station} className="flex items-stretch gap-1 group/item">
                            <div className="flex-1 min-w-0">
                              {isRenamingStation ? (
                                <div 
                                  onMouseDown={e => e.stopPropagation()} 
                                  onClick={e => e.stopPropagation()} 
                                  className="flex items-center bg-white border-2 border-blue-400 rounded-xl overflow-hidden px-2 py-1.5 shadow-md shadow-blue-50 animate-in zoom-in-95"
                                >
                                  <input
                                    ref={renameInputRef}
                                    className="bg-transparent border-none outline-none w-full text-xs font-bold text-blue-600"
                                    value={renameState.currentValue}
                                    onChange={(e) => setRenameState({ ...renameState, currentValue: e.target.value })}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') commitRename();
                                      if (e.key === 'Escape') setRenameState(null);
                                    }}
                                    autoComplete="off"
                                    spellCheck={false}
                                  />
                                  <button onClick={commitRename} className="p-0.5 text-blue-500 hover:bg-blue-50 rounded"><Check size={12} /></button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setActiveStation(station)}
                                  className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all truncate ${
                                    activeStation === station ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'
                                  }`}
                                >
                                  {station}
                                </button>
                              )}
                            </div>
                            {!isRenamingStation && (
                              <button 
                                title="修改站点名称"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setRenameState({ type: 'station', oldValue: station, currentValue: station, cityContext: city });
                                }}
                                className="w-10 shrink-0 flex items-center justify-center rounded-xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover/item:opacity-100 transition-all z-[60]"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{activeCity} · {activeStation}</h2>
              <span className="bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded font-black">{filteredVehicles.length} 辆可用</span>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索车牌、使用者..." 
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
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
                      isEditing ? 'border-orange-400 bg-orange-50/30 ring-4 ring-orange-100' :
                      isOccupied ? 'bg-slate-50 border-slate-100 opacity-60' :
                      isSelected ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-200 -translate-y-1' :
                      'bg-white border-slate-100 hover:border-blue-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`p-3 rounded-2xl ${isSelected ? 'bg-white/20 text-white' : isEditing ? 'bg-orange-100 text-orange-600' : isOccupied ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                        <Bike size={20} />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <button onClick={handleSaveEdit} className="p-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 active:scale-95 transition-all"><Save size={16} /></button>
                        ) : (
                          <button onClick={(e) => handleStartEdit(e, vehicle)} className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-600'}`}><Edit3 size={16} /></button>
                        )}
                        {isSelected && !isEditing && <CheckCircle2 size={24} className="text-white animate-in zoom-in" />}
                      </div>
                    </div>

                    <div className="relative z-10 space-y-2">
                      {isEditing ? (
                        <div className="space-y-1" onClick={e => e.stopPropagation()}>
                          <label className="text-[8px] font-black text-slate-400 uppercase">修改编号</label>
                          <input autoFocus className="w-full bg-white border-2 border-orange-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:border-orange-400 outline-none" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })} />
                        </div>
                      ) : (
                        <p className={`text-xl font-black tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{vehicle.code}</p>
                      )}

                      {isEditing ? (
                        <div className="space-y-1 mt-2" onClick={e => e.stopPropagation()}>
                          <label className="text-[8px] font-black text-slate-400 uppercase">具体位置</label>
                          <input className="w-full bg-white border-2 border-orange-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-orange-400 outline-none" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                        </div>
                      ) : (
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}><MapPin size={12} /> {vehicle.location}</div>
                      )}
                    </div>

                    <div className={`mt-6 pt-4 border-t relative z-10 ${isSelected ? 'border-white/10' : 'border-slate-50'}`}>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>当前状态</p>
                       <p className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : isOccupied ? 'text-slate-800' : 'text-green-600'}`}>
                         {isOccupied ? `使用中: ${vehicle.rider}` : isEditing ? '保存中...' : '✅ 待绑定'}
                       </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-80 flex flex-col gap-6 shrink-0 text-left">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 relative z-10">绑定确认预览</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-2xl text-white backdrop-blur-md">{applicant.name.charAt(0)}</div>
                <div>
                  <p className="text-lg font-black">{applicant.name}</p>
                  <p className="text-xs text-slate-400">{applicant.station}</p>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">拟分配车辆</p>
                {selectedId ? (
                  <div className="flex items-center gap-2 text-blue-400 animate-in slide-in-from-left-2"><Zap size={16} /><span className="font-black text-lg">{allVehicles.find(v => v.id === selectedId)?.code}</span></div>
                ) : (
                  <p className="text-sm font-bold text-slate-600 italic">尚未选择车辆...</p>
                )}
              </div>
            </div>
            <Zap className="absolute -right-12 -bottom-12 w-48 h-48 text-white opacity-[0.02]" />
          </div>

          <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="text-left space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">操作指引</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                1. 点击区域名称旁边的编辑图标进行实时重命名。<br/>
                2. 在车辆列表中点选可用资产。<br/>
                3. 完成绑定后，数据将同步至骑手档案。
              </p>
            </div>
            <div className="space-y-4">
              <button disabled={!selectedId || !!editingId} onClick={() => selectedId && onConfirm(selectedId)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none">确认绑定入职 <ArrowRight size={20} /></button>
              <button onClick={() => onConfirm('skip')} className="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">跳过车辆分配</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehicleAssignmentView;
