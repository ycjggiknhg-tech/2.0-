
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Search, X, UserPlus, 
  Users, TrendingUp, ShieldCheck, Briefcase, 
  MapPin, User, ChevronRight, Filter, Building2,
  Crown, UserCheck, LayoutGrid, List, Phone, 
  Mail, Calendar, ChevronDown, MoreVertical,
  Target, Info, MessageSquare, ExternalLink, AlertTriangle, Check, Save, Grab,
  Settings2, Map as MapIcon, Building
} from 'lucide-react';
import { Staff, StaffRole, Station } from '../types';

interface StaffManagementProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  stations: Station[];
  setStations: React.Dispatch<React.SetStateAction<Station[]>>;
  onAction: (msg: string) => void;
}

const JobManagement: React.FC<StaffManagementProps> = ({ staff, setStaff, stations, setStations, onAction }) => {
  const [activeTab, setActiveTab] = useState<'staff' | 'stations'>('staff');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string>('全部城市');
  const [activeGroup, setActiveGroup] = useState<string>('全部团队');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // 站点管理状态
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [deletingStationId, setDeletingStationId] = useState<string | null>(null); // 二次确认
  const [stationForm, setStationForm] = useState({ name: '', city: '北京' });

  // 成员表单状态
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '', gender: '男', age: 25, role: StaffRole.STAFF, city: '北京', station: '', group: '', leader: '', status: '在职', dailyPerformance: 0, contact: '', email: ''
  });

  const cities = useMemo(() => ['全部城市', ...Array.from(new Set(staff.map(s => s.city)))], [staff]);
  
  const groupsInCity = useMemo(() => {
    const filtered = activeCity === '全部城市' ? staff : staff.filter(s => s.city === activeCity);
    return ['全部团队', ...Array.from(new Set(filtered.map(s => s.group)))];
  }, [staff, activeCity]);

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchesCity = activeCity === '全部城市' || s.city === activeCity;
      const matchesGroup = activeGroup === '全部团队' || s.group === activeGroup;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesGroup && matchesSearch;
    });
  }, [staff, activeCity, activeGroup, searchQuery]);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staffMember: Staff = {
      ...newStaff as Staff,
      id: 'S' + Math.random().toString(36).substr(2, 9),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStaff.name}`,
      employeeId: 'E' + (staff.length + 101),
      joinDate: new Date().toISOString().split('T')[0],
      dailyPerformance: Math.floor(Math.random() * 40) + 60,
    };
    setStaff(prev => [staffMember, ...prev]);
    setIsModalOpen(false);
    onAction(`✅ 员工 ${staffMember.name} 档案已建立`);
  };

  const handleDeleteStaff = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`确认永久删除 ${name} 的员工档案吗？`)) {
      setStaff(prev => prev.filter(s => s.id !== id));
      onAction(`🗑️ 员工档案已移除`);
    }
  };

  // 站点管理逻辑
  const handleOpenStationModal = (station?: Station) => {
    if (station) {
      setEditingStation(station);
      setStationForm({ name: station.name, city: station.city });
    } else {
      setEditingStation(null);
      setStationForm({ name: '', city: '北京' });
    }
    setIsStationModalOpen(true);
  };

  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStation) {
      setStations(prev => prev.map(s => s.id === editingStation.id ? { ...s, ...stationForm } : s));
      onAction('✅ 站点信息已更新');
    } else {
      const newStation: Station = {
        id: 'st' + Date.now(),
        ...stationForm
      };
      setStations(prev => [...prev, newStation]);
      onAction('✅ 新站点已创建');
    }
    setIsStationModalOpen(false);
  };

  const handleToggleDeleteStation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingStationId === id) {
      setStations(prev => prev.filter(s => s.id !== id));
      setDeletingStationId(null);
      onAction('🗑️ 站点已成功移除');
    } else {
      setDeletingStationId(id);
      onAction('❓ 请再次点击删除图标确认');
      // 3秒后自动取消确认状态
      setTimeout(() => setDeletingStationId(null), 3000);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#f5f5f7]/50">
      <div className="p-10 pb-6 shrink-0">
        <div className="flex justify-between items-end mb-10">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-[#1d1d1f] tracking-tight mb-2">人资与组织架构</h1>
            <div className="flex items-center gap-6 mt-4">
               <button 
                onClick={() => setActiveTab('staff')}
                className={`flex items-center gap-2 text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'staff' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-[#86868b]'}`}
               >
                 <Users size={18} /> 成员档案
               </button>
               <button 
                onClick={() => setActiveTab('stations')}
                className={`flex items-center gap-2 text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'stations' ? 'border-[#0071e3] text-[#0071e3]' : 'border-transparent text-[#86868b]'}`}
               >
                 <MapIcon size={18} /> 站点配置
               </button>
            </div>
          </div>
          
          <div className="flex gap-4">
             {activeTab === 'staff' ? (
               <>
                 <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-200/50">
                   <button onClick={() => setViewMode('table')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-[#1d1d1f] text-white' : 'text-[#86868b]'}`}><List size={18} /></button>
                   <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#1d1d1f] text-white' : 'text-[#86868b]'}`}><LayoutGrid size={18} /></button>
                 </div>
                 <button onClick={() => setIsModalOpen(true)} className="apple-btn-primary px-8 py-3 flex items-center gap-2 shadow-xl shadow-[#0071e3]/20"><Plus size={18} /> 录入成员</button>
               </>
             ) : (
               <button onClick={() => handleOpenStationModal()} className="apple-btn-primary px-8 py-3 flex items-center gap-2 shadow-xl shadow-[#0071e3]/20"><Plus size={18} /> 新增站点</button>
             )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-10 pb-10 flex gap-8 items-start">
        {activeTab === 'staff' ? (
          <>
            <div className="w-64 apple-card p-4 shrink-0 sticky top-0 z-20">
              <h4 className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest px-4 mb-4">城市分部</h4>
              <div className="space-y-1">
                {cities.map(city => (
                  <button 
                    key={city}
                    onClick={() => setActiveCity(city)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeCity === city ? 'bg-[#1d1d1f] text-white' : 'text-[#86868b] hover:bg-[#f5f5f7]'}`}
                  >
                    <span className="truncate">{city}</span>
                    <ChevronRight size={14} className={activeCity === city ? 'text-white/40' : 'text-slate-300'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <div className="apple-card p-3 flex items-center gap-4 sticky top-0 z-30 shadow-md">
                <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-none">
                  {groupsInCity.map(group => (
                    <button
                      key={group}
                      onClick={() => setActiveGroup(group)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeGroup === group ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'text-[#86868b] hover:bg-[#f5f5f7]'}`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d2d2d7]" size={16} />
                  <input 
                    placeholder="搜索姓名或工号..." 
                    className="w-full pl-11 pr-4 py-2.5 bg-[#f5f5f7] rounded-xl outline-none text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-up">
                  {filteredStaff.map(person => (
                    <div key={person.id} className="apple-card p-6 text-left relative overflow-hidden flex flex-col hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <img src={person.avatar} className="w-12 h-12 rounded-2xl bg-[#f5f5f7]" />
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#1d1d1f]">{person.dailyPerformance}%</p>
                          <p className="text-[8px] font-bold text-[#86868b] uppercase tracking-tighter">Performance</p>
                        </div>
                      </div>
                      <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#1d1d1f] truncate">{person.name}</h3>
                        <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{person.role}</p>
                      </div>
                      <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50">
                        <button onClick={(e) => handleDeleteStaff(e, person.id, person.name)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        <button className="flex-1 py-2 bg-slate-100 text-[#1d1d1f] rounded-xl text-[10px] font-black uppercase tracking-widest">详情</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="apple-card overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#f5f5f7]/50 border-b border-slate-100">
                      <tr className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">
                        <th className="px-8 py-5">基本信息</th>
                        <th className="px-8 py-5">业务归属</th>
                        <th className="px-8 py-5 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {filteredStaff.map(person => (
                         <tr key={person.id} className="hover:bg-[#f5f5f7]/30 transition-colors">
                            <td className="px-8 py-5 flex items-center gap-4">
                               <img src={person.avatar} className="w-9 h-9 rounded-xl" />
                               <div>
                                  <p className="font-bold text-sm text-[#1d1d1f]">{person.name}</p>
                                  <p className="text-[10px] text-[#86868b] font-bold uppercase">{person.employeeId}</p>
                               </div>
                            </td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-600">{person.group} · {person.city}</td>
                            <td className="px-8 py-5 text-right">
                               <button onClick={(e) => handleDeleteStaff(e, person.id, person.name)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Station Management Content */
          <div className="flex-1 flex flex-col gap-8 max-w-5xl mx-auto w-full text-left">
            <header className="mb-4">
               <h2 className="text-2xl font-black text-[#1d1d1f]">全城配送站点配置</h2>
               <p className="text-slate-400 text-sm font-medium">维护真实的配送站点，供招聘流程中精准指派。</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
               {stations.map(st => {
                 const isDeleting = deletingStationId === st.id;
                 return (
                   <div key={st.id} className={`apple-card p-8 border transition-all flex flex-col justify-between group h-48 ${isDeleting ? 'border-red-500 bg-red-50/20' : 'border-slate-100 bg-white hover:shadow-2xl'}`}>
                      <div className="flex justify-between items-start">
                         <div className={`p-4 rounded-2xl transition-all ${isDeleting ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-[#0071e3] group-hover:bg-[#0071e3] group-hover:text-white'}`}>
                            <Building size={24} />
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleOpenStationModal(st)} className="p-2 text-slate-400 hover:text-[#0071e3] transition-colors"><Edit2 size={20} /></button>
                            <button 
                              onClick={(e) => handleToggleDeleteStation(st.id, e)} 
                              className={`p-2 transition-all ${isDeleting ? 'text-red-600 scale-125' : 'text-slate-400 hover:text-red-500'}`}
                            >
                              <Trash2 size={20} />
                            </button>
                         </div>
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-[#1d1d1f] mb-1">{st.name}</h3>
                         <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <MapPin size={12} /> {st.city}分部
                         </div>
                         {isDeleting && <p className="text-red-600 text-[10px] font-black uppercase mt-2">再次点击确认删除</p>}
                      </div>
                   </div>
                 );
               })}
               
               {stations.length === 0 && (
                 <div className="col-span-full py-32 text-center apple-card bg-slate-50 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest mb-4">暂未配置配送站点</p>
                    <button onClick={() => handleOpenStationModal()} className="apple-btn-primary px-8 py-3">立即创建站点</button>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

      {/* 站点编辑 Modal */}
      {isStationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-fade-up">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#f5f5f7]/50">
               <h2 className="text-xl font-bold text-[#1d1d1f]">{editingStation ? '修改站点信息' : '创建新站点'}</h2>
               <button onClick={() => setIsStationModalOpen(false)} className="p-2 text-slate-400 hover:bg-white rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveStation} className="p-8 space-y-6">
               <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">站点显示名称</label>
                  <input 
                    required 
                    autoFocus
                    placeholder="例如：朝阳大悦城站" 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#0071e3] rounded-2xl outline-none font-bold text-sm transition-all" 
                    value={stationForm.name} 
                    onChange={e => setStationForm({...stationForm, name: e.target.value})} 
                  />
               </div>
               <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属行政城市</label>
                  <input 
                    required 
                    placeholder="北京 / 上海 / 深圳" 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#0071e3] rounded-2xl outline-none font-bold text-sm transition-all" 
                    value={stationForm.city} 
                    onChange={e => setStationForm({...stationForm, city: e.target.value})} 
                  />
               </div>
               <div className="pt-4">
                  <button type="submit" className="apple-btn-primary w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
                     <Save size={18} /> {editingStation ? '保存变更' : '确认创建站点'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* 员工录入 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-fade-up">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#f5f5f7]/50">
              <h2 className="text-xl font-bold text-[#1d1d1f]">录入员工档案</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddStaff} className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest px-1">真实姓名</label>
                    <input required className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl outline-none font-bold text-sm" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest px-1">业务职务</label>
                    <select className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl outline-none font-bold text-sm" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as any})}>
                      {Object.values(StaffRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest px-1">归属城市</label>
                  <input required className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl outline-none font-bold text-sm" value={newStaff.city} onChange={e => setNewStaff({...newStaff, city: e.target.value})} />
               </div>
               <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest px-1">团队名称</label>
                  <input required className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl outline-none font-bold text-sm" value={newStaff.group} onChange={e => setNewStaff({...newStaff, group: e.target.value})} />
               </div>
               <button type="submit" className="apple-btn-primary w-full py-4 text-sm mt-4 uppercase tracking-widest">确认录入系统</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
