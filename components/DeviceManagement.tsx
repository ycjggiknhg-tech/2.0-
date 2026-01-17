
import React, { useState, useMemo } from 'react';
import { 
  Search, Battery, MapPin, Zap, MoreHorizontal, Plus, 
  Globe, Building2, Trash2, Edit2, Hash, User, ShieldCheck, 
  X, Save, AlertTriangle, Hammer, Trash, CheckCircle2, PackagePlus, ArrowRight
} from 'lucide-react';
import { Device, Station } from '../types';

interface DeviceManagementProps {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  stations: Station[];
  onAction: (msg: string) => void;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ devices, setDevices, stations, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string>('全部城市');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionsId, setActiveActionsId] = useState<string | null>(null);

  // 录入表单状态
  const [form, setForm] = useState<Partial<Device>>({
    type: '电动车',
    code: '',
    brand: '九号',
    color: '极地白',
    city: '北京',
    station: stations[0]?.name || '', // 默认选择第一个标准站点
    location: 'A-01'
  });

  const cities = useMemo(() => ['全部城市', ...Array.from(new Set(devices.map(d => d.city)))], [devices]);

  const filteredDevices = devices.filter(d => {
    const matchesCity = activeCity === '全部城市' || d.city === activeCity;
    const matchesSearch = d.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (d.rider && d.rider.includes(searchQuery)) ||
                          (d.brand && d.brand.includes(searchQuery));
    return matchesCity && matchesSearch;
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code?.trim()) {
      onAction('⚠️ 请填写资产唯一编码');
      return;
    }

    const newDevice: Device = {
      id: 'D' + Date.now(),
      type: form.type as any,
      code: form.code.trim().toUpperCase(),
      brand: form.brand || '通用型',
      color: form.color || '默认色',
      status: '正常',
      rider: '未分配',
      lastSync: '刚刚',
      city: form.city || '北京',
      station: form.station || '默认站点',
      location: form.location || '待定区',
      vin: 'VIN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    setDevices(prev => [newDevice, ...prev]);
    setIsModalOpen(false);
    setForm({ 
      type: '电动车', 
      code: '', 
      brand: '九号', 
      color: '极地白', 
      city: '北京', 
      station: stations[0]?.name || '', 
      location: 'A-01' 
    });
    onAction(`✅ 资产 ${newDevice.code} 已录入系统并同步云端`);
  };

  const handleUpdateStatus = (id: string, status: Device['status'], e: React.MouseEvent) => {
    e.stopPropagation();
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status, lastSync: '刚刚' } : d));
    setActiveActionsId(null);
    onAction(`🛠️ 资产状态已变更为: ${status}`);
  };

  const handleDeleteDevice = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要将资产 ${code} 报废并从系统中注销吗？该操作不可撤销。`)) {
      setDevices(prev => prev.filter(d => d.id !== id));
      setActiveActionsId(null);
      onAction(`🗑️ 资产 ${code} 已完成报废注销流程`);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12 animate-fade-up text-left relative h-full">
      <header className="flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Fleet & Asset Operations
          </div>
          <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight">资产实物管理</h1>
          <p className="text-[#86868b] font-medium mt-1">管理电动车、电池等核心生产资料，确保运力正常运转。</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="apple-btn-primary px-10 py-4 flex items-center gap-3 shadow-2xl shadow-[#0071e3]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={20} /> 入库新资产
        </button>
      </header>

      <div className="flex gap-10 items-start">
        {/* 左侧分部切换 */}
        <div className="w-56 shrink-0 space-y-2 sticky top-0">
          <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-widest px-4 mb-4">区域分部</h4>
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-sm transition-all font-bold group ${activeCity === city ? 'bg-[#1d1d1f] text-white shadow-xl' : 'text-[#86868b] hover:bg-white hover:text-[#1d1d1f]'}`}
            >
              <Globe size={16} className={activeCity === city ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-400'} />
              {city}
            </button>
          ))}
        </div>

        {/* 主列表区域 */}
        <div className="flex-1 space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#0071e3] transition-colors" size={20} />
            <input 
              placeholder="搜索资产代码、品牌、库位或绑定骑手..." 
              className="w-full pl-14 pr-6 py-5 apple-card shadow-sm border border-slate-200/50 outline-none focus:ring-4 focus:ring-[#0071e3]/5 transition-all text-base font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="apple-card overflow-hidden shadow-sm border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f5f5f7]/60 border-b border-slate-100">
                <tr className="text-[10px] font-black uppercase text-[#86868b] tracking-widest">
                  <th className="px-8 py-5">资产识别与型号</th>
                  <th className="px-8 py-5">当前健康度</th>
                  <th className="px-8 py-5">物理归属</th>
                  <th className="px-8 py-5">持有骑手</th>
                  <th className="px-8 py-5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDevices.map((device, idx) => (
                  <tr key={device.id} className="hover:bg-[#f5f5f7]/30 transition-colors group relative" style={{ animationDelay: `${idx * 0.03}s` }}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl transition-all ${device.type === '电动车' ? 'bg-blue-50 text-[#0071e3]' : 'bg-orange-50 text-orange-600'}`}>
                          {device.type === '电动车' ? <Zap size={22} /> : <Battery size={22} />}
                        </div>
                        <div>
                          <p className="font-black text-[#1d1d1f] text-base tracking-tight">{device.code}</p>
                          <p className="text-[10px] text-[#86868b] font-black uppercase mt-0.5 tracking-wider">{device.brand} · {device.color}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                        device.status === '正常' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        device.status === '维修中' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${device.status === '正常' ? 'bg-emerald-500' : 'bg-current animate-pulse'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{device.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-[#1d1d1f]">{device.station}</p>
                       <div className="flex items-center gap-1 text-[10px] text-[#86868b] font-black uppercase tracking-widest mt-1">
                         <MapPin size={10} /> {device.city} · {device.location}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      {device.rider === '未分配' ? (
                        <span className="text-xs font-bold text-slate-300 italic flex items-center gap-1.5">
                          <User size={14} /> 待指派
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[10px] text-[#0071e3] border border-blue-100">
                            {device.rider.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-[#1d1d1f]">{device.rider}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right relative">
                       <button 
                        onClick={() => setActiveActionsId(activeActionsId === device.id ? null : device.id)}
                        className="p-2.5 text-[#d2d2d7] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-all active:scale-90"
                       >
                         <MoreHorizontal size={20} />
                       </button>

                       {/* 行快捷操作菜单 */}
                       {activeActionsId === device.id && (
                         <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveActionsId(null)} />
                          <div className="absolute right-8 top-16 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 animate-in zoom-in-95 duration-200">
                            <button 
                              onClick={(e) => handleUpdateStatus(device.id, '正常', e)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold transition-all"
                            >
                              <CheckCircle2 size={16} /> 标记为健康
                            </button>
                            <button 
                              onClick={(e) => handleUpdateStatus(device.id, '维修中', e)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 text-amber-600 text-xs font-bold transition-all"
                            >
                              <Hammer size={16} /> 申请维修
                            </button>
                            <div className="h-px bg-slate-50 my-1" />
                            <button 
                              onClick={(e) => handleDeleteDevice(device.id, device.code, e)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-xs font-bold transition-all"
                            >
                              <Trash size={16} /> 资产报废
                            </button>
                          </div>
                         </>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDevices.length === 0 && (
              <div className="py-24 text-center">
                <AlertTriangle className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold mb-4">该区域下暂未发现匹配的资产记录</p>
                <button onClick={() => setIsModalOpen(true)} className="text-[#0071e3] font-black text-[10px] uppercase tracking-widest hover:underline">点击入库资产</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 资产入库模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_20px_70px_rgba(0,0,0,0.3)] overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#f5f5f7]/50">
               <div>
                  <h2 className="text-xl font-bold text-[#1d1d1f]">新资产登记入库</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Physical Asset Registration</p>
               </div>
               <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 text-slate-400 hover:bg-white rounded-full transition-all active:scale-75"
               >
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleAddDevice} className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">资产类型</label>
                    <div className="flex p-1 bg-slate-50 rounded-xl">
                       <button 
                        type="button" 
                        onClick={() => setForm({...form, type: '电动车'})}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${form.type === '电动车' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                       >
                         <Zap size={14} /> 载具
                       </button>
                       <button 
                        type="button" 
                        onClick={() => setForm({...form, type: '换电电池'})}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${form.type === '换电电池' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
                       >
                         <Battery size={14} /> 电池
                       </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">资产唯一编码</label>
                    <input 
                      required 
                      autoFocus
                      placeholder="如: EV-X801" 
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-sm transition-all" 
                      value={form.code} 
                      onChange={e => setForm({...form, code: e.target.value})} 
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">品牌厂商</label>
                    <input 
                      placeholder="九号 / 雅迪 / 小牛" 
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-sm" 
                      value={form.brand} 
                      onChange={e => setForm({...form, brand: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">车身颜色</label>
                    <input 
                      placeholder="极地白 / 磨砂黑" 
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-sm" 
                      value={form.color} 
                      onChange={e => setForm({...form, color: e.target.value})} 
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属分部城市</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-sm"
                      value={form.city}
                      onChange={e => {
                        const newCity = e.target.value;
                        // 切换城市时，联动更新站点下拉列表的第一个有效值
                        const cityStations = stations.filter(s => s.city === newCity);
                        setForm({...form, city: newCity, station: cityStations[0]?.name || ''});
                      }}
                    >
                      <option value="北京">北京</option>
                      <option value="上海">上海</option>
                      <option value="广州">广州</option>
                      <option value="深圳">深圳</option>
                      <option value="杭州">杭州</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">存放具体站点 (下拉选择)</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-sm"
                      value={form.station}
                      onChange={e => setForm({...form, station: e.target.value})}
                    >
                      {stations.filter(s => s.city === form.city).map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                      {stations.filter(s => s.city === form.city).length === 0 && (
                        <option value="">暂无站点，请先配置</option>
                      )}
                    </select>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">库位编号</label>
                  <input 
                    placeholder="如: A-区-102" 
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-sm" 
                    value={form.location} 
                    onChange={e => setForm({...form, location: e.target.value})} 
                  />
               </div>

               <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-4 bg-[#0071e3] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0071e3]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <PackagePlus size={18} /> 确认入库资产
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
