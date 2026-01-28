
import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, Edit2, Search, X, Users, 
  MapPin, User, ChevronRight, LayoutGrid, List, Phone, 
  Save, Building, Building2, Briefcase, TrendingUp, AlertTriangle
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [stationForm, setStationForm] = useState({ name: '', city: '北京' });

  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '', gender: '男', age: 25, role: StaffRole.STAFF, city: '北京', station: '总部', group: '运营组', leader: '王主管', status: '在职', dailyPerformance: 95, contact: '', email: ''
  });

  const cities = useMemo(() => ['全部城市', ...Array.from(new Set(staff.map(s => s.city)))], [staff]);
  
  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchesCity = activeCity === '全部城市' || s.city === activeCity;
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [staff, activeCity, searchQuery]);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staffMember: Staff = {
      ...newStaff as Staff,
      id: 'S' + Date.now(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStaff.name}`,
      employeeId: 'E' + (staff.length + 1001),
      joinDate: new Date().toISOString().split('T')[0],
      dailyPerformance: Math.floor(Math.random() * 10) + 90,
    };
    setStaff([staffMember, ...staff]);
    setIsModalOpen(false);
    onAction(`✅ 员工 ${staffMember.name} 录入成功`);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (window.confirm(`确定要移除员工 ${name} 的档案吗？`)) {
      setStaff(staff.filter(s => s.id !== id));
      onAction('🗑️ 员工档案已注销');
    }
  };

  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStation) {
      setStations(stations.map(s => s.id === editingStation.id ? { ...s, ...stationForm } : s));
      onAction('✅ 站点更新成功');
    } else {
      const newStation: Station = { id: 'st' + Date.now(), ...stationForm };
      setStations([...stations, newStation]);
      onAction('✅ 新站点创建成功');
    }
    setIsStationModalOpen(false);
  };

  const handleOpenStationModal = (st?: Station) => {
    if (st) {
      setEditingStation(st);
      setStationForm({ name: st.name, city: st.city });
    } else {
      setEditingStation(null);
      setStationForm({ name: '', city: '北京' });
    }
    setIsStationModalOpen(true);
  };

  const handleDeleteStation = (id: string) => {
    if (window.confirm('删除站点可能会影响已关联的骑手和资产，确定继续吗？')) {
      setStations(stations.filter(s => s.id !== id));
      onAction('🗑️ 站点已成功移除');
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#f8fafc]">
      <div className="p-10 pb-6 shrink-0">
        <header className="flex justify-between items-end mb-10">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Organizational Structure</div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">组织与人资架构</h1>
            <div className="flex items-center gap-6 mt-6">
               <button onClick={() => setActiveTab('staff')} className={`flex items-center gap-2 text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'staff' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}><Users size={18} /> 职能成员</button>
               <button onClick={() => setActiveTab('stations')} className={`flex items-center gap-2 text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'stations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}><Building2 size={18} /> 配送站点</button>
            </div>
          </div>
          <div className="flex gap-4">
             {activeTab === 'staff' ? (
                <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"><Plus size={18} /> 录入新成员</button>
             ) : (
                <button onClick={() => handleOpenStationModal()} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"><Plus size={18} /> 创建新站点</button>
             )}
          </div>
        </header>
      </div>

      <div className="flex-1 overflow-auto px-10 pb-10 flex gap-8 items-start">
        {activeTab === 'staff' ? (
          <>
            <div className="w-64 apple-card p-4 shrink-0 sticky top-0 text-left">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">城市中心</h4>
              <div className="space-y-1">
                {cities.map(city => (
                  <button key={city} onClick={() => setActiveCity(city)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs ${activeCity === city ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {city} <ChevronRight size={14} className={activeCity === city ? 'text-white/40' : 'text-slate-200'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-8 text-left">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={20} />
                <input type="text" placeholder="搜索成员、工号或职务..." className="w-full pl-16 pr-8 py-5 apple-card shadow-sm border border-slate-100 outline-none text-base focus:ring-4 focus:ring-indigo-600/5 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStaff.map(person => (
                  <div key={person.id} className="apple-card p-6 flex flex-col justify-between group border border-slate-100 apple-card-hover">
                    <div className="flex justify-between items-start mb-6">
                       <img src={person.avatar} className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner" alt="" />
                       <div className="text-right">
                          <p className={`text-lg font-black tracking-tighter ${person.dailyPerformance > 95 ? 'text-emerald-500' : 'text-indigo-600'}`}>{person.dailyPerformance}%</p>
                          <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Perf Score</p>
                       </div>
                    </div>
                    <div>
                       <h3 className="text-base font-bold text-slate-900">{person.name}</h3>
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1 mb-4">{person.role} · {person.city}</p>
                       <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Building size={12} /> {person.group}</div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Phone size={12} /> {person.contact}</div>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50 flex gap-2">
                       <button onClick={() => handleDeleteStaff(person.id, person.name)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                       <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">档案详情</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 space-y-8 max-w-5xl mx-auto w-full text-left">
             <header className="mb-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">末端配送站点布局</h2>
                <p className="text-slate-400 text-sm font-medium">配置真实的物理站点，它是招聘分配和资产存放的核心维度。</p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-5">
                {stations.map(st => (
                   <div key={st.id} className="apple-card p-8 border border-slate-100 flex flex-col justify-between group h-48 hover:shadow-2xl hover:border-indigo-100 transition-all">
                      <div className="flex justify-between items-start">
                         <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Building2 size={24} /></div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleOpenStationModal(st)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 size={18}/></button>
                            <button onClick={() => handleDeleteStation(st.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                         </div>
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-slate-900">{st.name}</h3>
                         <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1"><MapPin size={12} className="text-indigo-600" /> {st.city}分部</div>
                      </div>
                   </div>
                ))}
                <button onClick={() => handleOpenStationModal()} className="apple-card border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-8 text-slate-300 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all h-48">
                   <Plus size={32} className="mb-2" />
                   <span className="text-xs font-black uppercase tracking-widest">新增配置站点</span>
                </button>
             </div>
          </div>
        )}
      </div>

      {/* 成员录入 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900">录入职能员工</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full"><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddStaff} className="p-8 space-y-6 text-left">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">真实姓名</label>
                    <input required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-600/10" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">业务职级</label>
                    <select className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as any})}>
                      {Object.values(StaffRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属城市</label>
                    <input required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" value={newStaff.city} onChange={e => setNewStaff({...newStaff, city: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">业务组/分部</label>
                    <input required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" value={newStaff.group} onChange={e => setNewStaff({...newStaff, group: e.target.value})} />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">手机联系方式</label>
                  <input required className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" value={newStaff.contact} onChange={e => setNewStaff({...newStaff, contact: e.target.value})} />
               </div>
               <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all">
                  确认并建立档案 <ChevronRight size={18} />
               </button>
            </form>
          </div>
        </div>
      )}

      {/* 站点编辑 Modal */}
      {isStationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-xl font-black text-slate-900">{editingStation ? '修改站点信息' : '创建新配送站'}</h2>
               <button onClick={() => setIsStationModalOpen(false)} className="p-2 hover:bg-white rounded-full"><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveStation} className="p-8 space-y-6 text-left">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">站点显示名称</label>
                  <input required placeholder="如：朝阳三里屯站" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm transition-all" value={stationForm.name} onChange={e => setStationForm({...stationForm, name: e.target.value})} />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属行政城市</label>
                  <input required placeholder="如：北京" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm transition-all" value={stationForm.city} onChange={e => setStationForm({...stationForm, city: e.target.value})} />
               </div>
               <div className="pt-4">
                  <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                     <Save size={18} /> {editingStation ? '保存站点变更' : '立即部署站点'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
