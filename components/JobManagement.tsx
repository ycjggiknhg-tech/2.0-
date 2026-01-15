
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Search, X, UserPlus, 
  Users, TrendingUp, ShieldCheck, Briefcase, 
  MapPin, User, ChevronRight, Filter, Building2,
  Crown, UserCheck, LayoutGrid, List, Phone, 
  Mail, Calendar, ChevronDown, MoreVertical,
  Target, Info, MessageSquare, ExternalLink, AlertTriangle, Check, Save, Grab
} from 'lucide-react';
import { Staff, StaffRole } from '../types';

interface StaffManagementProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  onAction: (msg: string) => void;
}

interface RenameState {
  oldValue: string;
  currentValue: string;
}

const JobManagement: React.FC<StaffManagementProps> = ({ staff, setStaff, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState<string>('全部城市');
  const [activeGroup, setActiveGroup] = useState<string>('全部团队');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // 默认改为网格方便查看
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  // 拖拽平移逻辑
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, a, .cursor-pointer')) return;
    
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollLeft(scrollRef.current.scrollLeft);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const y = e.pageY - scrollRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walkX;
    scrollRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 城市重命名状态
  const [cityRename, setCityRename] = useState<RenameState | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // 个体员工城市编辑状态
  const [editingStaffCityId, setEditingStaffCityId] = useState<string | null>(null);
  const [tempStaffCity, setTempStaffCity] = useState('');

  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '',
    gender: '男',
    age: 25,
    role: StaffRole.STAFF,
    city: '北京',
    station: '',
    group: '',
    leader: '',
    status: '在职',
    dailyPerformance: 0,
    contact: '',
    email: ''
  });

  useEffect(() => {
    if (cityRename && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [cityRename]);

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

  const handleDeleteStaff = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isConfirmed = window.confirm(`警告：您正在移除【${name}】的员工档案。\n\n该操作将永久删除其绩效数据、联络记录及入职历史，是否继续？`);
    if (isConfirmed) {
      setStaff(prev => prev.filter(s => s.id !== id));
      if (expandedStaffId === id) setExpandedStaffId(null);
      onAction(`🗑️ 员工 ${name} 的档案已从系统中永久移除`);
    }
  };

  const handleCommitCityRename = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!cityRename) return;
    const { oldValue, currentValue } = cityRename;
    const trimmed = currentValue.trim();
    if (!trimmed || trimmed === oldValue) {
      setCityRename(null);
      return;
    }

    setStaff(prev => prev.map(s => s.city === oldValue ? { ...s, city: trimmed } : s));
    if (activeCity === oldValue) setActiveCity(trimmed);
    setCityRename(null);
    onAction(`✅ 城市信息已从 ${oldValue} 更新为 ${trimmed}`);
  };

  const handleUpdateStaffCity = (personId: string) => {
    const trimmed = tempStaffCity.trim();
    if (!trimmed) {
      setEditingStaffCityId(null);
      return;
    }
    setStaff(prev => prev.map(s => s.id === personId ? { ...s, city: trimmed } : s));
    setEditingStaffCityId(null);
    onAction(`✅ 已手动更新员工所属城市为：${trimmed}`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/50">
      <div className="p-8 pb-4 shrink-0">
        <div className="flex justify-between items-end mb-8">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">人资团队管理</h1>
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm">Enterprise HR</span>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-slate-500 text-sm">管理全量职能员工档案。</p>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-200/50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Grab size={12} /> 按住左键平移浏览
              </div>
            </div>
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
              录入成员
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex-1 overflow-auto p-8 pt-0 flex gap-6 items-start select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div className="w-60 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col shrink-0 sticky top-0 z-20">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">业务城市分部</h3>
          </div>
          <div className="p-2 space-y-1">
            {cities.map(city => {
              const isRenaming = cityRename?.oldValue === city;
              return (
                <div key={city} className="relative group">
                  {isRenaming ? (
                    <div className="flex items-center gap-1 p-1 bg-blue-50 border-2 border-blue-500 rounded-xl shadow-xl animate-in zoom-in-95">
                      <input 
                        ref={renameInputRef}
                        className="bg-transparent border-none outline-none w-full px-2 py-1.5 text-xs font-black text-blue-700"
                        value={cityRename.currentValue}
                        onChange={e => setCityRename({...cityRename, currentValue: e.target.value})}
                        onKeyDown={e => e.key === 'Enter' && handleCommitCityRename(e as any)}
                        autoFocus
                      />
                      <button onClick={handleCommitCityRename as any} className="p-1 bg-blue-600 text-white rounded-lg">
                        <Check size={12} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { setActiveCity(city); setActiveGroup('全部团队'); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-bold text-xs ${
                        activeCity === city ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-left truncate">
                        <MapPin size={14} className={activeCity === city ? 'text-blue-400' : 'text-slate-300'} />
                        <span className="truncate">{city}</span>
                      </div>
                      {city !== '全部城市' && (
                        <div 
                          onClick={(e) => { e.stopPropagation(); setCityRename({ oldValue: city, currentValue: city }); }}
                          className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all ${activeCity === city ? 'hover:bg-white/10 text-white/40' : 'hover:bg-blue-50 text-slate-300'}`}
                        >
                          <Edit2 size={10} />
                        </div>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5 min-w-[1000px]">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 sticky top-0 z-30">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-slate-400">
              <Building2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">团队筛选</span>
            </div>
            <div className="flex-1 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {groupsInCity.map(group => (
                <button
                  key={group}
                  onClick={() => setActiveGroup(group)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap transition-all border ${
                    activeGroup === group 
                      ? 'bg-blue-50 text-blue-600 border-blue-100' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索姓名或工号..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100 font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm text-left">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Users size={16} /></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">列表成员</p>
                <p className="text-xl font-black text-slate-900">{stats.total}</p>
              </div>
            </div>
            <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm text-left">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><TrendingUp size={16} /></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">平均效能</p>
                <p className="text-xl font-black text-slate-900">{stats.avgPerf}%</p>
              </div>
            </div>
            <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm text-left">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><UserCheck size={16} /></div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">出勤健康</p>
                <p className="text-xl font-black text-slate-900">100%</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {viewMode === 'table' ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col text-left">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                      <th className="px-6 py-4">基本信息</th>
                      <th className="px-6 py-4">业务归属</th>
                      <th className="px-6 py-4">出单效能</th>
                      <th className="px-6 py-4 text-right pr-8">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStaff.length > 0 ? filteredStaff.map((person) => {
                      const isExpanded = expandedStaffId === person.id;
                      const isLeader = person.role === StaffRole.TEAM_LEADER || person.role === StaffRole.MANAGER;
                      
                      return (
                        <React.Fragment key={person.id}>
                          <tr 
                            onClick={() => toggleExpand(person.id)}
                            className={`hover:bg-slate-50/80 cursor-pointer transition-all group ${isExpanded ? 'bg-blue-50/40 ring-1 ring-inset ring-blue-500/20' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                  <img src={person.avatar} className="w-10 h-10 rounded-xl bg-slate-100 object-cover shadow-sm" />
                                  {isLeader && <div className="absolute -top-1 -right-1 p-0.5 bg-amber-500 rounded-full text-white border border-white"><Crown size={6} /></div>}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-black text-slate-800 text-xs flex items-center gap-1">
                                    {person.name}
                                    <ChevronDown size={12} className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase">{person.role} · {person.employeeId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-[11px] font-black text-slate-600 truncate">{person.group}</p>
                              <p className="text-[9px] font-bold text-slate-400 truncate">{person.city} · {person.leader}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-24">
                                <div className="flex justify-between text-[9px] font-black mb-1">
                                  <span className={person.dailyPerformance > 80 ? 'text-green-500' : 'text-blue-500'}>{person.dailyPerformance}%</span>
                                </div>
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full transition-all ${person.dailyPerformance > 80 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${person.dailyPerformance}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right pr-8">
                              <button onClick={(e) => handleDeleteStaff(e, person.id, person.name)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={14}/></button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-slate-50/50">
                              <td colSpan={4} className="px-6 py-6 border-l-2 border-blue-500">
                                <div className="grid grid-cols-3 gap-6">
                                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">核心档案</h4>
                                    <p className="text-[11px] font-bold text-slate-600 flex justify-between"><span>年龄/性别:</span> <span>{person.age} / {person.gender}</span></p>
                                    <div className="text-[11px] font-bold text-slate-600 flex justify-between items-center group/city">
                                      <span>所在城市:</span>
                                      {editingStaffCityId === person.id ? (
                                        <div className="flex items-center gap-1">
                                          <input autoFocus className="bg-blue-50 border border-blue-200 px-1 py-0.5 rounded text-[10px] w-16" value={tempStaffCity} onChange={e => setTempStaffCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUpdateStaffCity(person.id)} />
                                          <button onClick={() => handleUpdateStaffCity(person.id)} className="text-green-600"><Check size={10}/></button>
                                        </div>
                                      ) : (
                                        <span onClick={() => { setEditingStaffCityId(person.id); setTempStaffCity(person.city); }} className="text-blue-600 flex items-center gap-1 cursor-pointer">{person.city} <Edit2 size={8}/></span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">联系通道</h4>
                                    <p className="text-[11px] font-bold text-slate-600 flex justify-between"><span>手机:</span> <span>{person.contact}</span></p>
                                    <p className="text-[11px] font-bold text-slate-600 truncate flex justify-between"><span>邮箱:</span> <span>{person.email}</span></p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); onAction('已发起呼叫'); }} className="py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase">拨号</button>
                                    <button onClick={(e) => { e.stopPropagation(); onAction('消息窗口已开启'); }} className="py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase">消息</button>
                                    <button onClick={(e) => { e.stopPropagation(); onAction('报告生成中'); }} className="py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase">报告</button>
                                    <button onClick={(e) => handleDeleteStaff(e, person.id, person.name)} className="py-2 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase">移除</button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }) : <tr><td colSpan={4} className="py-20 text-center text-slate-300 font-bold text-sm">暂无匹配员工记录</td></tr>}
                  </tbody>
                </table>
              </div>
            ) : (
              /* 网格视图 - 核心改进: 增加每行显示的卡片数量，缩小卡片尺寸 */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-in zoom-in-95 duration-300">
                {filteredStaff.map((person) => {
                  const isExpanded = expandedStaffId === person.id;
                  const isLeader = person.role === StaffRole.TEAM_LEADER || person.role === StaffRole.MANAGER;

                  return (
                    <div 
                      key={person.id}
                      onClick={() => toggleExpand(person.id)}
                      className={`bg-white rounded-2xl border transition-all cursor-pointer group text-left relative flex flex-col ${
                        isExpanded ? 'border-blue-500 ring-4 ring-blue-50 shadow-xl' : 'border-slate-100 hover:border-blue-200 hover:shadow-md'
                      }`}
                    >
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteStaff(e, person.id, person.name)}
                        className="absolute top-2 right-2 p-1.5 bg-slate-50 text-slate-300 hover:bg-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all z-30"
                      >
                        <Trash2 size={12} />
                      </button>

                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div className="relative shrink-0">
                            <img src={person.avatar} className="w-12 h-12 rounded-xl bg-slate-50 shadow-sm border border-slate-100" />
                            {isLeader && <div className="absolute -top-1 -right-1 p-0.5 bg-amber-500 rounded-full text-white border border-white"><Crown size={8} /></div>}
                          </div>
                          <div className="text-right">
                             <p className="text-base font-black text-slate-900 leading-none">{person.dailyPerformance}%</p>
                             <p className="text-[8px] text-slate-400 font-black uppercase mt-0.5">效能</p>
                          </div>
                        </div>

                        <div className="space-y-0.5 mb-3 min-w-0">
                          <h3 className="text-sm font-black text-slate-800 truncate group-hover:text-blue-600 transition-colors">{person.name}</h3>
                          <p className="text-[9px] text-slate-400 font-bold truncate flex items-center gap-1 uppercase tracking-tight"><Building2 size={8}/> {person.group}</p>
                          <p className="text-[9px] text-slate-400 font-bold truncate flex items-center gap-1 uppercase tracking-tight"><MapPin size={8}/> {person.city}</p>
                        </div>

                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden mb-3">
                          <div className={`h-full transition-all duration-700 ${person.dailyPerformance > 80 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${person.dailyPerformance}%` }} />
                        </div>

                        <div className="flex justify-between items-center text-slate-300 group-hover:text-blue-500 transition-colors">
                          <span className="text-[8px] font-black uppercase tracking-widest">{isExpanded ? '收起详情' : '详细档案'}</span>
                          <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 bg-slate-50/50 rounded-b-2xl border-t border-slate-100 animate-in slide-in-from-top-1">
                          <div className="grid grid-cols-2 gap-2 pt-3">
                            <div className="bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm text-center">
                              <p className="text-[7px] text-slate-400 font-black uppercase mb-0.5">员工工号</p>
                              <p className="text-[9px] font-black text-slate-800">{person.employeeId}</p>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm text-center">
                              <p className="text-[7px] text-slate-400 font-black uppercase mb-0.5">所在城市</p>
                              <p className="text-[9px] font-black text-slate-800">{person.city}</p>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <button onClick={(e) => { e.stopPropagation(); onAction('通话连接中...'); }} className="w-full py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-1.5 hover:bg-black active:scale-95 transition-all"><Phone size={10}/> 语音连线</button>
                            <button onClick={(e) => { e.stopPropagation(); onAction('消息发起成功'); }} className="w-full py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-1.5 hover:bg-blue-700 active:scale-95 transition-all"><MessageSquare size={10}/> 即时消息</button>
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

      <div className="h-4 shrink-0" />

      {/* 录入员工模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-left">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg"><UserPlus size={20} /></div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">录入员工档案</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">HR Onboarding</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">真实姓名</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">性别</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm" value={newStaff.gender} onChange={e => setNewStaff({...newStaff, gender: e.target.value as any})}>
                    <option value="男">男 (M)</option>
                    <option value="女">女 (F)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">年龄 (Age)</label>
                  <input required type="number" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm" value={newStaff.age} onChange={e => setNewStaff({...newStaff, age: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">所在城市</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm" value={newStaff.city} onChange={e => setNewStaff({...newStaff, city: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">业务职务</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as any})}>
                    {Object.values(StaffRole).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">联系方式</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm" value={newStaff.contact} onChange={e => setNewStaff({...newStaff, contact: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">所属团队 (Department)</label>
                <input required placeholder="例如: 华北运营管理中心" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none font-bold text-sm" value={newStaff.group} onChange={e => setNewStaff({...newStaff, group: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all mt-4">
                确认录入系统
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
