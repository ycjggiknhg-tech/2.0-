
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Battery, MapPin, Shield, Zap, 
  MoreHorizontal, Plus, X, ArrowRight, PackagePlus,
  Globe, Building2, ChevronRight, Edit3, Trash2, Save,
  Lock, History, AlertTriangle, RotateCcw, Edit2, Check, Hash, User
} from 'lucide-react';
import { Device } from '../types';

interface DeviceManagementProps {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  onAction: (msg: string) => void;
}

interface RenameState {
  type: 'city' | 'station';
  oldValue: string;
  currentValue: string;
  cityContext?: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ devices, setDevices, onAction }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    type: '电动车',
    code: '',
    vin: '',
    brand: '',
    color: '',
    city: '北京',
    station: '默认站点',
    location: '',
    status: '正常'
  });
  
  const [renameState, setRenameState] = useState<RenameState | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  
  const [lastDeletedDevice, setLastDeletedDevice] = useState<Device | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string>('全部城市');
  const [activeStation, setActiveStation] = useState<string>('全部站点');
  
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  useEffect(() => {
    if (showUndoToast) {
      undoTimerRef.current = setTimeout(() => {
        setShowUndoToast(false);
        setLastDeletedDevice(null);
      }, 6000);
    }
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, [showUndoToast]);

  useEffect(() => {
    if (renameState && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renameState]);

  const locationStats = useMemo(() => {
    const stats: Record<string, string[]> = {};
    devices.forEach(v => {
      const city = v.city || '未知区域';
      const station = v.station || '其他站点';
      if (!stats[city]) stats[city] = [];
      if (!stats[city].includes(station)) stats[city].push(station);
    });
    return stats;
  }, [devices]);

  const citiesList = Object.keys(locationStats);

  const filteredDevices = devices.filter(d => {
    const matchesCity = activeCity === '全部城市' || d.city === activeCity;
    const matchesStation = activeStation === '全部站点' || d.station === activeStation;
    const matchesSearch = 
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (d.vin && d.vin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.brand && d.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.rider && d.rider.includes(searchQuery));

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

    const updatedDevices = devices.map(d => {
      if (type === 'city' && d.city === oldValue) {
        return { ...d, city: trimmedNew };
      }
      if (type === 'station' && d.city === cityContext && d.station === oldValue) {
        return { ...d, station: trimmedNew };
      }
      return d;
    });

    setDevices(updatedDevices);
    if (type === 'city' && activeCity === oldValue) setActiveCity(trimmedNew);
    if (type === 'station' && activeStation === oldValue) setActiveStation(trimmedNew);
    setRenameState(null);
    onAction(`✅ 区域已重命名为: ${trimmedNew}`);
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.code || !newDevice.location || !newDevice.city || !newDevice.station) {
      onAction('⚠️ 请填写完整的资产信息');
      return;
    }
    const device: Device = {
      id: 'D' + Date.now(),
      type: newDevice.type as '电动车' | '换电电池',
      code: newDevice.code!,
      vin: newDevice.vin!,
      brand: newDevice.brand || '未知品牌',
      color: newDevice.color || '默认色',
      city: newDevice.city!,
      station: newDevice.station!,
      status: '正常',
      batteryLevel: newDevice.type === '换电电池' ? 100 : undefined,
      rider: '未分配',
      lastSync: '刚刚',
      location: newDevice.location!
    };
    setDevices(prev => [device, ...prev]);
    setIsAddModalOpen(false);
    setNewDevice({ type: '电动车', code: '', vin: '', brand: '', color: '', city: '北京', station: '默认站点', location: '', status: '正常' });
    onAction(`✅ 设备 ${device.code} 已成功入库`);
  };

  const handleEditClick = (e: React.MouseEvent, device: Device) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingDevice({ ...device });
    setIsEditModalOpen(true);
    setActiveActionMenuId(null);
  };

  const handleUpdateDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;
    setDevices(prev => prev.map(d => d.id === editingDevice.id ? editingDevice : d));
    setIsEditModalOpen(false);
    onAction(`✅ 设备 ${editingDevice.code} 信息已更新`);
  };

  const initiateDelete = (e: React.MouseEvent, device: Device) => {
    e.preventDefault();
    e.stopPropagation();
    setDeviceToDelete(device);
    setActiveActionMenuId(null);
  };

  const confirmDelete = () => {
    if (deviceToDelete) {
      const target = { ...deviceToDelete };
      setLastDeletedDevice(target);
      setDevices(prev => prev.filter(d => d.id !== target.id));
      setShowUndoToast(true);
      setDeviceToDelete(null);
      onAction(`🗑️ 资产 ${target.code} 已移除`);
    }
  };

  const handleUndoDelete = () => {
    if (lastDeletedDevice) {
      setDevices(prev => [lastDeletedDevice, ...prev]);
      onAction(`🔄 已撤回删除：${lastDeletedDevice.code}`);
      setLastDeletedDevice(null);
      setShowUndoToast(false);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center mb-8 text-left">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900">资产与设备管理</h1>
          <p className="text-slate-500">实时监控车辆品牌、大架号、编号及绑定骑手信息。</p>
        </div>
        <button 
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} />
          入库新设备
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-left">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">在线资产</p>
          <p className="text-2xl font-black text-slate-900">{devices.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">异常预警</p>
          <p className="text-2xl font-black text-orange-500">{devices.filter(d => d.status !== '正常').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">库存可用</p>
          <p className="text-2xl font-black text-blue-500">{devices.filter(d => d.rider === '未分配').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">资产估值</p>
          <p className="text-2xl font-black text-slate-900">¥{(devices.length * 0.45).toFixed(1)}W</p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* 感应式导航侧边栏 */}
        <div className="w-72 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left">
              <Globe size={14} /> 区域车队导航
            </h3>
          </div>
          <div className="p-3 space-y-1 overflow-y-auto max-h-[600px]">
            <button 
              onClick={() => { setActiveCity('全部城市'); setActiveStation('全部站点'); }}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-left ${
                activeCity === '全部城市' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Globe size={16} /> 全部城市
            </button>

            {citiesList.map(city => {
              const isRenamingCity = renameState?.type === 'city' && renameState?.oldValue === city;
              const isExpanded = (activeCity === city || (hoveredCity === city && !renameState));

              return (
                <div 
                  key={city} 
                  className="space-y-1 text-left"
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <div className="flex items-stretch gap-1 group">
                    <div className="flex-1 min-w-0">
                      {isRenamingCity ? (
                        <div 
                          onMouseDown={e => e.stopPropagation()} 
                          onClick={e => e.stopPropagation()} 
                          className="flex items-center bg-white border-2 border-blue-600 rounded-2xl overflow-hidden px-2 py-1.5 shadow-xl shadow-blue-100 animate-in zoom-in-95"
                        >
                          <input 
                            ref={renameInputRef}
                            className="bg-transparent border-none outline-none w-full text-sm font-black text-blue-700 placeholder-blue-300"
                            value={renameState.currentValue}
                            onChange={e => setRenameState({ ...renameState, currentValue: e.target.value })}
                            onKeyDown={e => {
                              if (e.key === 'Enter') commitRename();
                              if (e.key === 'Escape') setRenameState(null);
                            }}
                            autoComplete="off"
                            spellCheck={false}
                          />
                          <button onClick={commitRename} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Check size={16}/></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setActiveCity(city); setActiveStation('全部站点'); }}
                          className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-left truncate ${
                            activeCity === city ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Building2 size={16} className={`shrink-0 ${activeCity === city ? 'text-blue-400' : 'text-slate-400'}`} /> 
                          <span className="truncate">{city}</span>
                        </button>
                      )}
                    </div>
                    {!isRenamingCity && (
                      <button 
                        onClick={(e) => { 
                          e.preventDefault();
                          e.stopPropagation(); 
                          setRenameState({ type: 'city', oldValue: city, currentValue: city }); 
                        }}
                        className={`w-10 shrink-0 flex items-center justify-center rounded-2xl transition-all border border-transparent ${
                          activeCity === city 
                            ? 'text-blue-400 bg-white/5 hover:bg-white/20 hover:text-white border-white/10' 
                            : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100'
                        }`}
                        title="重命名城市"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="pl-4 py-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => setActiveStation('全部站点')} 
                        className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold ${activeStation === '全部站点' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        全部站点
                      </button>
                      {locationStats[city]?.map(st => {
                        const isRenamingStation = renameState?.type === 'station' && renameState?.oldValue === st && renameState?.cityContext === city;
                        return (
                          <div key={st} className="flex items-stretch gap-1 group/item">
                            <div className="flex-1 min-w-0">
                              {isRenamingStation ? (
                                <div 
                                  onMouseDown={e => e.stopPropagation()} 
                                  onClick={e => e.stopPropagation()} 
                                  className="flex items-center bg-white border-2 border-blue-400 rounded-xl px-2 py-1 shadow-lg shadow-blue-50"
                                >
                                  <input 
                                    ref={renameInputRef}
                                    className="bg-transparent border-none outline-none w-full text-xs font-bold text-blue-600"
                                    value={renameState.currentValue}
                                    onChange={e => setRenameState({ ...renameState, currentValue: e.target.value })}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') commitRename();
                                      if (e.key === 'Escape') setRenameState(null);
                                    }}
                                    autoComplete="off"
                                    spellCheck={false}
                                  />
                                  <button onClick={commitRename} className="p-0.5 text-blue-500"><Check size={14}/></button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setActiveCity(city); 
                                    setActiveStation(st);
                                  }} 
                                  className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold truncate ${activeStation === st ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                  {st}
                                </button>
                              )}
                            </div>
                            {!isRenamingStation && (
                              <button 
                                onClick={(e) => { 
                                  e.preventDefault();
                                  e.stopPropagation(); 
                                  setRenameState({ type: 'station', oldValue: st, currentValue: st, cityContext: city }); 
                                }}
                                className="w-8 shrink-0 flex items-center justify-center rounded-lg text-slate-300 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover/item:opacity-100 transition-all"
                              >
                                <Edit2 size={12} />
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

        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
            <div className="relative flex-1 text-left">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="搜索代码、大架号、品牌、编号、骑手..." 
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto text-left">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="px-8 py-5">资产识别 (代码/品牌)</th>
                  <th className="px-8 py-5">车辆大架号 (VIN)</th>
                  <th className="px-8 py-5">实时状态</th>
                  <th className="px-8 py-5">归属区域</th>
                  <th className="px-8 py-5">绑定骑手</th>
                  <th className="px-8 py-5">车辆编号 (内部)</th>
                  <th className="px-8 py-5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${device.type === '电动车' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {device.type === '电动车' ? <Zap size={20} /> : <Battery size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{device.code}</p>
                          <div className="flex items-center gap-1.5">
                             <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">{device.brand}</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                             <span className="text-[10px] text-slate-400 font-bold">{device.color}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-[11px] font-bold text-slate-600 tracking-tight">
                      {device.vin || '无大架号'}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase border ${
                        device.status === '正常' ? 'bg-green-50 text-green-600 border-green-100' :
                        'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <div>
                         <p className="text-xs font-bold text-slate-800">{device.city}</p>
                         <p className="text-[9px] text-slate-400 uppercase font-black">{device.station}</p>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <User size={14} className={device.rider === '未分配' ? 'text-slate-300' : 'text-blue-500'} />
                        <p className={`text-sm font-bold ${device.rider === '未分配' ? 'text-slate-300 italic' : 'text-slate-800'}`}>{device.rider}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold">{device.lastSync}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Hash size={14} className="text-slate-400" /> {device.location}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveActionMenuId(activeActionMenuId === device.id ? null : device.id); }}
                        className={`p-2 rounded-lg transition-all ${activeActionMenuId === device.id ? 'bg-slate-900 text-white' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      
                      {activeActionMenuId === device.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveActionMenuId(null)} />
                          <div className="absolute right-8 mt-1 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                            <button onClick={(e) => handleEditClick(e, device)} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors">
                              <Edit3 size={16} /> 修正车辆详情
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onAction('锁车指令已发送'); setActiveActionMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                              <Lock size={16} /> 远程紧急锁车
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onAction('轨迹回放加载中'); setActiveActionMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                              <History size={16} /> 查看历史路径
                            </button>
                            <div className="h-px bg-slate-50 my-1" />
                            <button onClick={(e) => initiateDelete(e, device)} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95">
                              <Trash2 size={16} /> 移除资产记录
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deviceToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-sm shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">确认移除该资产？</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              您正在从资产库中移除 <span className="font-bold text-slate-900">{deviceToDelete.code}</span>。<br/>
              操作后您可以点击屏幕下方的“撤回”按钮进行恢复。
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeviceToDelete(null)} className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95">取消</button>
              <button onClick={confirmDelete} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 shadow-xl shadow-red-200 transition-all active:scale-95">确认移除</button>
            </div>
          </div>
        </div>
      )}

      {showUndoToast && lastDeletedDevice && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] w-full max-w-sm animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800 relative overflow-hidden">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={18} /></div>
              <div>
                <p className="text-xs font-bold">资产已移除：{lastDeletedDevice.code}</p>
                <p className="text-[10px] text-slate-400">点击右侧撤回进行恢复</p>
              </div>
            </div>
            <button 
              onClick={handleUndoDelete}
              className="px-4 py-2 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-400 hover:text-white transition-all active:scale-95"
            >
              <RotateCcw size={14} /> 撤回操作
            </button>
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-[undoProgress_6s_linear]" />
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-left">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200"><PackagePlus size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">新资产入库</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Asset Inventory Registration</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddDevice} className="p-8 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">设备类型</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                  <button type="button" onClick={() => setNewDevice({ ...newDevice, type: '电动车' })} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newDevice.type === '电动车' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>智能电动车</button>
                  <button type="button" onClick={() => setNewDevice({ ...newDevice, type: '换电电池' })} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newDevice.type === '换电电池' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>智能换电电池</button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属城市</label>
                  <input required type="text" placeholder="例: 北京" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.city} onChange={e => setNewDevice({ ...newDevice, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属站点</label>
                  <input required type="text" placeholder="例: 三里屯站" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.station} onChange={e => setNewDevice({ ...newDevice, station: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">车辆品牌</label>
                  <input type="text" placeholder="例: 雅迪 / 九号" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.brand} onChange={e => setNewDevice({ ...newDevice, brand: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">车辆颜色</label>
                  <input type="text" placeholder="例: 珍珠白" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.color} onChange={e => setNewDevice({ ...newDevice, color: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">资产代码</label>
                  <input required type="text" placeholder="例: EV-8822" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.code} onChange={e => setNewDevice({ ...newDevice, code: e.target.value.toUpperCase() })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">车辆编号 (内部编号)</label>
                  <input required type="text" placeholder="例: 001-A" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.location} onChange={e => setNewDevice({ ...newDevice, location: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">大架号 (VIN)</label>
                <input type="text" placeholder="例: VIN987654" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.vin} onChange={e => setNewDevice({ ...newDevice, vin: e.target.value.toUpperCase() })} />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all active:scale-95">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">确认入库上线 <ArrowRight size={18} className="inline ml-1" /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingDevice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-left">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200"><Edit3 size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">资产详情维护</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Asset Maintenance</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleUpdateDevice} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">品牌</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800" value={editingDevice.brand} onChange={e => setEditingDevice({ ...editingDevice, brand: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">颜色</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800" value={editingDevice.color} onChange={e => setEditingDevice({ ...editingDevice, color: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">资产代码</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800" value={editingDevice.code} onChange={e => setEditingDevice({ ...editingDevice, code: e.target.value.toUpperCase() })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">车辆编号</label>
                  <input required type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800" value={editingDevice.location} onChange={e => setEditingDevice({ ...editingDevice, location: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">大架号 (VIN)</label>
                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800" value={editingDevice.vin} onChange={e => setEditingDevice({ ...editingDevice, vin: e.target.value.toUpperCase() })} />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all active:scale-95">放弃变更</button>
                <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">同步系统记录 <Save size={18} /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes undoProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default DeviceManagement;
