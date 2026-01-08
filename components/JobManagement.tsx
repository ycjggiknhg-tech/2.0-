
import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, Edit2, Search, X, UserPlus, 
  Users, TrendingUp, ShieldCheck, Briefcase, 
  MapPin, User, ChevronRight, Filter, Building2,
  Crown, UserCheck, LayoutGrid, List, Phone, 
  Mail, Calendar, ChevronDown, MoreVertical,
  Target, Info, MessageSquare, ExternalLink, AlertTriangle
} from 'lucide-react';
import { Staff, StaffRole } from '../types';

interface StaffManagementProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  onAction: (msg: string) => void;
}

const JobManagement: React.FC<StaffManagementProps> = ({ staff, setStaff, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string>('全部城市');
  const [activeGroup, setActiveGroup] = useState<string>('全部团队');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '',
    gender: '男',
    age: 25,
    role: StaffRole.OPERATIONS,
    city: '北京',
    station: '',
    group: '',
    leader: '',
    status: '在职',
    dailyPerformance: 0,
    contact: '',
    email: ''
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
                           s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.group.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesGroup && matchesSearch;
    });
  }, [staff, activeCity, activeGroup, searchQuery]);

  const stats = useMemo(() => {
    if (filteredStaff.length === 0) return { avgPerf: 0, total: 0 };
    const sum = filteredStaff.reduce((acc, curr) => acc + curr.dailyPerformance, 0);
    return {
      avgPerf: (sum / filteredStaff.length).toFixed(1),
      total: filteredStaff.length
    };
  }, [filteredStaff]);

  const toggleExpand = (id: string) => {
    setExpandedStaffId(expandedStaffId === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staffMember: Staff = {
      ...newStaff as Staff,
      id: 'S' + Math.random().toString(36).substr(2, 9),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStaff.name || 'default'}`,
      employeeId: 'E' + (staff.length + 101),
      joinDate: new Date().toISOString().split('T')[0],
      dailyPerformance: Math.floor(Math.random() * 40) + 60,
    };
    setStaff(prev => [staffMember, ...prev]);
    setIsModalOpen(false);
    onAction(`✅ 员工 ${staffMember.name} 档案已建立`);
  };

  /**
   * 核心删除函数：实现真实的档案移除
   * 使用函数式更新确保并发安全，并强制阻断冒泡
   */
  const handleDeleteStaff = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation(); // 关键：防止触发父级 tr 或 div 的点击事件
    
    // 调起原生确认框，确保交互同步
    const isConfirmed = window.confirm(`警告：您正在移除【${name}】的员工档案。\n\n该操作将永久删除其绩效数据、联络记录及入职历史，是否继续？`);
    
    if (isConfirmed) {
      setStaff(prev => {
        const newList = prev.filter(s => s.id !== id);
        return newList;
      });
      // 如果当前正处于展开状态，则关闭详情
      if (expandedStaffId === id) {
        setExpandedStaffId(null);
      }
      onAction(`🗑️ 员工 ${name} 的档案已从系统中永久移除`);
    }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500 bg-slate-50/50 min-h-full">
      {/* 头部区域 */}
      <div className="flex justify-between items-end mb-8">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">人资团队管理</h1>
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm">Enterprise HR</span>
          </div>
          <p className="text-slate-500 text-sm">按城市与团队层级管理内部员工，实时监控出单效能及组长汇报线。</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white rounded-2xl p-1 border border-slate-200 shadow-sm">
            <button 
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs font-bold ${viewMode === 'table' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={14} /> 表格
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs font-bold ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={14} /> 网格
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-blue-200"
          >
            <UserPlus size={18} />
            录入新成员
          </button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* 侧边导航 */}
        <div className="w-56 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col shrink-0 sticky top-8 z-20">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">业务分布城市</h3>
          </div>
          <div className="p-3 space-y-1">
            {cities.map(city => (
              <button 
                key={city}
                onClick={() => { setActiveCity(city); setActiveGroup('全部团队'); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                  activeCity === city ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 text-left">
                  <MapPin size={16} className={activeCity === city ? 'text-blue-400' : 'text-slate-300'} />
                  {city}
                </div>
                {activeCity === city && <ChevronRight size={14} className="opacity-50" />}
              </button>
            ))}
          </div>
        </div>

        {/* 主体区域 */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* 筛选条 */}
          <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 sticky top-8 z-30">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl text-slate-400">
              <Building2 size={16} />
              <span className="text-xs font-black uppercase tracking-widest">所属团队</span>
            </div>
            <div className="flex-1 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {groupsInCity.map(group => (
                <button
                  key={group}
                  onClick={() => setActiveGroup(group)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                    activeGroup === group 
                      ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' 
                      : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索姓名或工号..." 
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-xs outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white px-6 py-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm text-left">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">当前展示人数</p>
                <p className="text-2xl font-black text-slate-900">{stats.total} <span className="text-xs font-normal">成员</span></p>
              </div>
            </div>
            <div className="bg-white px-6 py-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm text-left">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><TrendingUp size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">平均出单效能</p>
                <p className="text-2xl font-black text-slate-900">{stats.avgPerf}%</p>
              </div>
            </div>
            <div className="bg-white px-6 py-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm text-left">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><UserCheck size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">在职健康度</p>
                <p className="text-2xl font-black text-slate-900">100%</p>
              </div>
            </div>
          </div>

          {/* 列表内容 */}
          <div className="w-full">
            {viewMode === 'table' ? (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      <th className="px-8 py-5">基本信息</th>
                      <th className="px-8 py-5">业务归属</th>
                      <th className="px-8 py-5">出单效能</th>
                      <th className="px-8 py-5 text-right pr-12">管理决策</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStaff.length > 0 ? filteredStaff.map((person) => {
                      const isExpanded = expandedStaffId === person.id;
                      const isLeader = person.role === StaffRole.STATION_MANAGER || person.role === StaffRole.AREA_MANAGER;
                      
                      return (
                        <React.Fragment key={person.id}>
                          <tr 
                            onClick={() => toggleExpand(person.id)}
                            className={`hover:bg-slate-50/80 cursor-pointer transition-all group ${isExpanded ? 'bg-blue-50/40 ring-2 ring-inset ring-blue-500/10' : ''}`}
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="relative shrink-0">
                                  <img src={person.avatar} className="w-12 h-12 rounded-2xl bg-slate-100 object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                  {isLeader && (
                                    <div className="absolute -top-1.5 -right-1.5 p-1 bg-amber-500 rounded-full text-white ring-2 ring-white">
                                      <Crown size={8} />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 text-left">
                                  <p className="font-black text-slate-900 flex items-center gap-1.5 group-hover:text-blue-600 transition-colors">
                                    {person.name}
                                    <ChevronDown size={14} className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-180 text-blue-500' : ''}`} />
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{person.role} · {person.employeeId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-left">
                              <div className="space-y-1">
                                <p className="text-xs font-black text-slate-700 flex items-center gap-1.5 truncate"><Building2 size={12} className="text-blue-500" /> {person.group}</p>
                                <p className="text-[10px] font-bold text-slate-400">负责人: {person.leader}</p>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="w-32">
                                <div className="flex justify-between text-[10px] font-black mb-1.5">
                                  <span className={person.dailyPerformance > 80 ? 'text-green-500' : person.dailyPerformance > 60 ? 'text-blue-500' : 'text-orange-500'}>
                                    {person.dailyPerformance}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                  <div 
                                    className={`h-full transition-all duration-1000 ${person.dailyPerformance > 80 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : person.dailyPerformance > 60 ? 'bg-blue-500' : 'bg-orange-500'}`} 
                                    style={{ width: `${person.dailyPerformance}%` }} 
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right pr-12">
                              {/* 表格行内快速删除按钮 - 确保可见且可点击 */}
                              <div className="flex justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                <button 
                                  type="button"
                                  onClick={(e) => handleDeleteStaff(e, person.id, person.name)} 
                                  title="立即移除档案"
                                  className="p-3 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-100 hover:border-red-200 shadow-sm transition-all active:scale-90 relative z-10"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          
                          {/* 详情面板 */}
                          {isExpanded && (
                            <tr className="bg-slate-50/50 animate-in slide-in-from-top-2 duration-300">
                              <td colSpan={4} className="px-8 py-8 border-l-4 border-blue-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                  <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> 核心背景</h4>
                                    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-3">
                                      <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">年龄 / 性别</span>
                                        <span className="text-slate-900">{person.age}岁 · {person.gender}</span>
                                      </div>
                                      <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">入职日期</span>
                                        <span className="text-slate-900">{person.joinDate}</span>
                                      </div>
                                      <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">所在城市</span>
                                        <span className="text-blue-600">{person.city}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Phone size={14}/> 联系通道</h4>
                                    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-3">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><Phone size={14}/></div>
                                        <div>
                                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">电话</p>
                                          <p className="text-xs font-black text-slate-900">{person.contact}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 text-slate-400 rounded-xl"><Mail size={14}/></div>
                                        <div>
                                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">邮箱</p>
                                          <p className="text-xs font-black text-slate-900 truncate max-w-[120px]">{person.email}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={14}/> 档案管理</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                      <button onClick={(e) => { e.stopPropagation(); onAction('通话系统连接中...'); }} className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-md">
                                        <Phone size={14}/> 拨号
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); onAction('已发起即时通讯...'); }} className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                                        <MessageSquare size={14}/> 消息
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); onAction('生成员工报告...'); }} className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                                        <Target size={14}/> 报告
                                      </button>
                                      {/* 详情页内的显眼删除按钮 */}
                                      <button 
                                        type="button"
                                        onClick={(e) => handleDeleteStaff(e, person.id, person.name)} 
                                        className="flex items-center justify-center gap-2 py-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 shadow-sm"
                                      >
                                        <Trash2 size={14}/> 移除档案
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }) : (
                      <tr>
                        <td colSpan={4} className="px-8 py-24 text-center text-slate-400 bg-slate-50/20">
                          <div className="flex flex-col items-center gap-4">
                            <Search size={48} className="opacity-10" />
                            <p className="font-bold text-sm">未找到符合条件的员工档案</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* 网格视图 */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
                {filteredStaff.map((person) => {
                  const isExpanded = expandedStaffId === person.id;
                  const isLeader = person.role === StaffRole.STATION_MANAGER || person.role === StaffRole.AREA_MANAGER;

                  return (
                    <div 
                      key={person.id}
                      onClick={() => toggleExpand(person.id)}
                      className={`bg-white rounded-[2.5rem] border-2 transition-all cursor-pointer group text-left relative overflow-hidden flex flex-col ${
                        isExpanded ? 'border-blue-600 shadow-2xl shadow-blue-100 ring-8 ring-blue-50/50' : 'border-slate-100 hover:border-blue-300 hover:shadow-lg'
                      }`}
                    >
                      {/* 网格卡片右上角快捷删除 - 增加层级和热区 */}
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteStaff(e, person.id, person.name)}
                        className="absolute top-4 right-4 p-3 bg-slate-50 text-slate-300 hover:bg-red-500 hover:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all z-30 shadow-lg border border-slate-100 hover:border-red-600"
                        title="快速移除档案"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="p-8 flex-1">
                        <div className="flex justify-between items-start mb-6">
                          <div className="relative shrink-0">
                            <img src={person.avatar} className="w-20 h-20 rounded-[1.75rem] bg-slate-100 shadow-md ring-4 ring-slate-50 group-hover:scale-105 transition-transform" />
                            {isLeader && (
                              <div className="absolute -top-2 -right-2 p-1.5 bg-amber-500 rounded-full text-white ring-4 ring-white shadow-lg">
                                <Crown size={12} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border ${
                              person.status === '在职' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                            }`}>
                              {person.status}
                            </span>
                            <div className="text-right">
                              <p className="text-2xl font-black text-slate-900 leading-none">{person.dailyPerformance}%</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">出单效能</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 mb-6 min-w-0">
                          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors truncate">
                            {person.name}
                            {isLeader && <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider shrink-0">Leader</span>}
                          </h3>
                          <p className="text-xs text-slate-400 font-bold flex items-center gap-2 truncate"><MapPin size={12}/> {person.city} · {person.group}</p>
                        </div>

                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
                          <div 
                            className={`h-full transition-all duration-1000 ${person.dailyPerformance > 80 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${person.dailyPerformance}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em]">{isExpanded ? '收起详情' : '展开核心档案'}</p>
                          <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {/* 网格详情展开内容 */}
                      {isExpanded && (
                        <div className="px-8 pb-8 space-y-6 animate-in slide-in-from-bottom-2 duration-300 bg-slate-50/30">
                          <div className="h-px bg-slate-100" />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                              <p className="text-[8px] text-slate-400 font-black uppercase mb-1">员工 ID</p>
                              <p className="text-[10px] font-black text-slate-800">{person.employeeId}</p>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                              <p className="text-[8px] text-slate-400 font-black uppercase mb-1">入职年限</p>
                              <p className="text-[10px] font-black text-slate-800">{person.joinDate}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <button onClick={(e) => { e.stopPropagation(); onAction('建立音视频连接...'); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"><Phone size={14}/> 建立即时通话</button>
                            <button 
                              type="button"
                              onClick={(e) => handleDeleteStaff(e, person.id, person.name)} 
                              className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              <Trash2 size={14}/> 永久移除此记录
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-28" />

      {/* 录入员工模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-left">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200"><UserPlus size={24} /></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">录入新员工档案</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-0.5 tracking-widest">Enterprise Personnel Onboarding</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-thin">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">真实姓名</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">性别</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800 appearance-none" value={newStaff.gender} onChange={e => setNewStaff({...newStaff, gender: e.target.value as any})}>
                    <option value="男">男 (Male)</option>
                    <option value="女">女 (Female)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">年龄 (Age)</label>
                  <input required type="number" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newStaff.age} onChange={e => setNewStaff({...newStaff, age: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">常驻城市</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800 appearance-none" value={newStaff.city} onChange={e => setNewStaff({...newStaff, city: e.target.value})}>
                    {cities.filter(c => c !== '全部城市').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">业务职务</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800 appearance-none" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as any})}>
                    {Object.values(StaffRole).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">联络电话</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newStaff.contact} onChange={e => setNewStaff({...newStaff, contact: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">所属团队</label>
                  <input required placeholder="例如: 华北运营中心" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newStaff.group} onChange={e => setNewStaff({...newStaff, group: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">汇报对象 (Leader)</label>
                  <input required placeholder="例如: 王站长" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800" value={newStaff.leader} onChange={e => setNewStaff({...newStaff, leader: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4">
                提交录入信息 <TrendingUp size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
