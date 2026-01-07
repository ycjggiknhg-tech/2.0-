import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Filter, Battery, MapPin, Shield, Zap, 
  MoreHorizontal, Plus, X, ArrowRight, PackagePlus,
  Globe, Building2, ChevronRight, Edit3, Trash2, Save,
  Lock, History, AlertTriangle, RotateCcw
} from 'lucide-react';

interface Device {
  id: string;
  type: '电动车' | '换电电池';
  code: string;
  status: '正常' | '维修中' | '低电量' | '异常';
  batteryLevel?: number;
  rider: string;
  lastSync: string;
  location: string;
}

interface DeviceManagementProps {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  onAction: (msg: string) => void;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ devices, setDevices, onAction }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  
  // 撤回功能相关状态
  const [lastDeletedDevice, setLastDeletedDevice] = useState<Device | null>(null);
  const [showUndoToast, setShowUndoToast] = useState(false);
  // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to resolve cross-environment TypeScript namespace errors.
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string>('全部城市');
  const [activeStation, setActiveStation] = useState<string>('全部站点');

  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    type: '电动车',
    code: '',
    location: '',
    status: '正常'
  });

  // 自动清理撤回缓冲区
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

  const locationStats = useMemo(() => {
    const stats: Record<string, string[]> = {};
    devices.forEach(v => {
      const city = v.location.includes('北京') || v.location.includes('朝阳') ? '北京' : '上海';
      const station = v.location.includes('三里屯') ? '三里屯站' : 
                      v.location.includes('静安') ? '静安寺站' : '其他站点';
      
      if (!stats[city]) stats[city] = [];
      if (!stats[city].includes(station)) stats[city].push(station);
    });
    return stats;
  }, [devices]);

  const cities = ['全部城市', ...Object.keys(locationStats)];

  const filteredDevices = devices.filter(d => {
    const vCity = d.location.includes('北京') || d.location.includes('朝阳') ? '北京' : '上海';
    const vStation = d.location.includes('三里屯') ? '三里屯站' : 
                     d.location.includes('静安') ? '静安寺站' : '其他站点';
    
    const matchesCity = activeCity === '全部城市' || vCity === activeCity;
    const matchesStation = activeStation === '全部站点' || vStation === activeStation;
    const matchesSearch = d.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         d.location.includes(searchQuery) ||
                         (d.rider && d.rider.includes(searchQuery));

    return matchesCity && matchesStation && matchesSearch;
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.code || !newDevice.location) {
      onAction('⚠️ 请填写完整的设备编号和存放位置');
      return;
    }
    const device: Device = {
      id: 'D' + Date.now(),
      type: newDevice.type as '电动车' | '换电电池',
      code: newDevice.code!,
      status: '正常',
      batteryLevel: newDevice.type === '换电电池' ? 100 : undefined,
      rider: '未分配',
      lastSync: '刚刚',
      location: newDevice.location!
    };
    setDevices(prev => [device, ...prev]);
    setIsAddModalOpen(false);
    setNewDevice({ type: '电动车', code: '', location: '', status: '正常' });
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
      // 存入缓冲区
      setLastDeletedDevice(target);
      // 从状态中移除
      setDevices(prev => prev.filter(d => d.id !== target.id));
      // 开启撤回 Toast
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

  const handleGenericAction = (e: React.MouseEvent, msg: string) => {
    e.preventDefault();
    e.stopPropagation();
    onAction(msg);
    setActiveActionMenuId(null);
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center mb-8 text-left">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900">资产与设备管理</h1>
          <p className="text-slate-500">实时监控车辆轨迹、电池电量及硬件健康状况。</p>
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
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">在线设备</p>
          <p className="text-2xl font-black text-slate-900">{devices.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">异常预警</p>
          <p className="text-2xl font-black text-orange-500">{devices.filter(d => d.status !== '正常').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">在库待分配</p>
          <p className="text-2xl font-black text-blue-500">{devices.filter(d => d.rider === '未分配').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">资产估值</p>
          <p className="text-2xl font-black text-slate-900">¥{(devices.length * 0.45).toFixed(1)}W</p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* 左侧区域导航 */}
        <div className="w-64 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-left">
              <Globe size={14} /> 区域分布
            </h3>
          </div>
          <div className="p-3 space-y-1">
            {cities.map(city => (
              <div key={city} className="space-y-1 text-left">
                <button 
                  type="button"
                  onClick={() => { setActiveCity(city); setActiveStation('全部站点'); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                    activeCity === city ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {city === '全部城市' ? <Globe size={16} /> : <Building2 size={16} />}
                    {city}
                  </div>
                  {city !== '全部城市' && <ChevronRight size={14} className={activeCity === city ? 'rotate-90 transition-transform' : ''} />}
                </button>
                {activeCity === city && city !== '全部城市' && (
                  <div className="pl-4 py-1 space-y-1 animate-in slide-in-from-top-2">
                    <button type="button" onClick={() => setActiveStation('全部站点')} className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold ${activeStation === '全部站点' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>全部站点</button>
                    {locationStats[city]?.map(st => (
                      <button key={st} type="button" onClick={() => setActiveStation(st)} className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold ${activeStation === st ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>{st}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 资产表格 */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
            <div className="relative flex-1 text-left">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="搜索资产编号、使用者姓名或详细位置..." 
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <th className="px-8 py-5">设备信息</th>
                  <th className="px-8 py-5">状态</th>
                  <th className="px-8 py-5">电量/健康</th>
                  <th className="px-8 py-5">使用者</th>
                  <th className="px-8 py-5">当前位置</th>
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
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{device.type}</p>
                        </div>
                      </div>
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
                      {device.batteryLevel !== undefined ? (
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>{device.batteryLevel}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all" style={{ width: `${device.batteryLevel}%` }} />
                          </div>
                        </div>
                      ) : <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Shield size={14} /> 优</span>}
                    </td>
                    <td className="px-8 py-5">
                      <p className={`text-sm font-bold ${device.rider === '未分配' ? 'text-slate-300 italic' : 'text-slate-800'}`}>{device.rider}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{device.lastSync}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <MapPin size={14} className="text-slate-400" /> {device.location}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right relative">
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveActionMenuId(activeActionMenuId === device.id ? null : device.id); }}
                        className={`p-2 rounded-lg transition-all ${activeActionMenuId === device.id ? 'bg-slate-900 text-white' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      
                      {activeActionMenuId === device.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveActionMenuId(null); }} />
                          <div className="absolute right-8 mt-1 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-1.5 space-y-0.5 text-left animate-in fade-in zoom-in-95 duration-100">
                            <button type="button" onClick={(e) => handleEditClick(e, device)} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors">
                              <Edit3 size={16} /> 修改基本信息
                            </button>
                            <button type="button" onClick={(e) => handleGenericAction(e, '锁车指令已发送')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                              <Lock size={16} /> 远程紧急锁车
                            </button>
                            <button type="button" onClick={(e) => handleGenericAction(e, '轨迹回放加载中')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                              <History size={16} /> 查看行驶轨迹
                            </button>
                            <div className="h-px bg-slate-50 my-1" />
                            <button type="button" onClick={(e) => initiateDelete(e, device)} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95">
                              <Trash2 size={16} /> 彻底删除设备
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

      {/* 删除确认模态框 */}
      {deviceToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">确认删除设备？</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              您正在从资产库中移除 <span className="font-bold text-slate-900">{deviceToDelete.code}</span>。<br/>
              操作后您可以点击屏幕下方的“撤回”按钮进行恢复。
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeviceToDelete(null)} className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95">取消</button>
              <button type="button" onClick={confirmDelete} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 shadow-xl shadow-red-200 transition-all active:scale-95">确认移除</button>
            </div>
          </div>
        </div>
      )}

      {/* 撤回 Undo Toast */}
      {showUndoToast && lastDeletedDevice && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] w-full max-w-sm animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                <Trash2 size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold">资产已移除：{lastDeletedDevice.code}</p>
                <p className="text-[10px] text-slate-400">数据已暂存，稍后将正式清除</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={handleUndoDelete}
              className="px-4 py-2 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-400 hover:text-white transition-all active:scale-95"
            >
              <RotateCcw size={14} /> 撤回操作
            </button>
            {/* 倒计时进度条 */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-[undoProgress_6s_linear]" />
          </div>
        </div>
      )}

      {/* 入库模态框 */}
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
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddDevice} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">设备类型</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                  <button type="button" onClick={() => setNewDevice({ ...newDevice, type: '电动车' })} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newDevice.type === '电动车' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>智能电动车</button>
                  <button type="button" onClick={() => setNewDevice({ ...newDevice, type: '换电电池' })} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newDevice.type === '换电电池' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>智能换电电池</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">资产编号</label>
                <input required type="text" placeholder="例如: EV-A8822" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.code} onChange={e => setNewDevice({ ...newDevice, code: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">初始存放位置</label>
                <input required type="text" placeholder="例如: 北京三里屯站仓库" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newDevice.location} onChange={e => setNewDevice({ ...newDevice, location: e.target.value })} />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all active:scale-95">取消</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">确认入库并上线 <ArrowRight size={18} className="inline ml-1" /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 修改信息模态框 */}
      {isEditModalOpen && editingDevice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-left">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200"><Edit3 size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">编辑设备信息</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">Asset Information Update</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleUpdateDevice} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">资产编号 (只读)</label>
                <input readOnly type="text" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-slate-500 font-black cursor-not-allowed" value={editingDevice.code} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">当前状态</label>
                  <select className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800 appearance-none" value={editingDevice.status} onChange={e => setEditingDevice({ ...editingDevice, status: e.target.value as any })}>
                    <option value="正常">正常工作</option>
                    <option value="维修中">故障报修</option>
                    <option value="低电量">电量不足</option>
                    <option value="异常">硬件异常</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">当前使用者</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800" value={editingDevice.rider} onChange={e => setEditingDevice({ ...editingDevice, rider: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">存放/行驶位置</label>
                <input required type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-800" value={editingDevice.location} onChange={e => setEditingDevice({ ...editingDevice, location: e.target.value })} />
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all active:scale-95">放弃更改</button>
                <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">保存变更记录 <Save size={18} /></button>
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